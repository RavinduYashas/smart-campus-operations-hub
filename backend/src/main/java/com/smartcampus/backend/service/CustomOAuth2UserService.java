package com.smartcampus.backend.service;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Custom OAuth2 user service that:
 *  1. Validates that the authenticated email belongs to an allowed SLIIT domain.
 *  2. Creates a new User document in MongoDB on first login.
 *  3. Assigns the USER role by default.
 *
 * Allowed domains: @my.sliit.lk, @sliit.lk
 */
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final List<String> ALLOWED_DOMAINS = List.of("@my.sliit.lk", "@sliit.lk");

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // ── 1. Extract Google profile attributes ─────────────────────────────
        String email      = oAuth2User.getAttribute("email");
        String name       = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub"); // Google's unique UID

        // ── 2. Enforce SLIIT domain restriction ──────────────────────────────
        if (!isAllowedDomain(email)) {
            OAuth2Error error = new OAuth2Error(
                    "unauthorized_domain",
                    "Access denied: only @my.sliit.lk and @sliit.lk email addresses are allowed. Rejected: " + email,
                    null
            );
            throw new OAuth2AuthenticationException(error, error.getDescription());
        }

        // ── 3. Upsert the user – create on first login, skip if already exists ─
        userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setProviderId(providerId);
            newUser.setRole(User.Role.USER);         // Default role: USER
            newUser.setCreatedAt(LocalDateTime.now());
            return userRepository.save(newUser);
        });

        // Return the original OAuth2User so Spring Security can build its Authentication object
        return oAuth2User;
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    /**
     * Returns true if the given email ends with one of the allowed SLIIT domains.
     * Case-insensitive comparison.
     */
    private boolean isAllowedDomain(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        String lowerEmail = email.toLowerCase();
        return ALLOWED_DOMAINS.stream().anyMatch(lowerEmail::endsWith);
    }
}
