package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.LoginRequest;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Login attempt for email: " + loginRequest.getEmail());
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        
        if (userOptional.isEmpty()) {
            System.out.println("Login failed: User not found with email " + loginRequest.getEmail());
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), userOptional.get().getPassword())) {
            System.out.println("Login failed: Password mismatch for email " + loginRequest.getEmail());
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        User user = userOptional.get();
        System.out.println("Login success for email: " + loginRequest.getEmail() + " with role: " + user.getRole());
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        String email = authentication.getName();
        Optional<User> user = userRepository.findByEmail(email);

        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).build());
    }
}
