package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.LoginRequest;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Handles authentication-related REST endpoints.
 *
 * POST /api/auth/login  → Manual email/password login with SLIIT domain enforcement.
 * GET  /api/auth/me     → Returns the currently authenticated user's profile.
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    /** Allowed email domain suffixes – must match CustomOAuth2UserService */
    private static final List<String> ALLOWED_DOMAINS = List.of("@my.sliit.lk", "@sliit.lk");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // ── POST /api/auth/login ─────────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        log.info("Login attempt for email: {}", email);

        // ── 1. Enforce SLIIT domain restriction ──────────────────────────────
        if (!isAllowedDomain(email)) {
            log.warn("Login rejected – email domain not allowed: {}", email);
            Map<String, String> errorBody = new HashMap<>();
            errorBody.put("error", "unauthorized_domain");
            errorBody.put("message", "Access denied: only @my.sliit.lk and @sliit.lk accounts are permitted.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody);
        }

        // ── 2. Validate credentials ───────────────────────────────────────────
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            log.warn("Login failed – user not found: {}", email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "invalid_credentials", "message", "Invalid email or password."));
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            log.warn("Login failed – password mismatch for: {}", email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "invalid_credentials", "message", "Invalid email or password."));
        }

        // ── 3. Issue JWT ──────────────────────────────────────────────────────
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        log.info("Login success for: {} (role={})", email, user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (!isAllowedDomain(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "unauthorized_domain", "message", "SLIIT domain required."));
        }
        
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "conflict", "message", "User already exists."));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(java.time.LocalDateTime.now());
        return ResponseEntity.ok(userRepository.save(user));
    }

    // ── GET /api/auth/me ─────────────────────────────────────────────────────

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "unauthenticated", "message", "Not authenticated."));
        }

        String email = authentication.getName();
        Optional<User> user = userRepository.findByEmail(email);

        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    /**
     * Returns true if the email ends with one of the allowed SLIIT domains.
     * Case-insensitive.
     */
    private boolean isAllowedDomain(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        String lowerEmail = email.toLowerCase();
        return ALLOWED_DOMAINS.stream().anyMatch(lowerEmail::endsWith);
    }
}
