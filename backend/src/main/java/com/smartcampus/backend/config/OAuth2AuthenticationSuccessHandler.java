package com.smartcampus.backend.config;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;

import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Handles the post-OAuth2-authentication redirect.
 * On success  → generates a JWT and redirects to the React frontend with the token.
 * On failure  → Spring Security will invoke the configured failure handler
 *               (see SecurityConfig) which redirects to /unauthorized.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        log.info("OAuth2 login successful for: {}", email);

        // User is guaranteed to exist here – CustomOAuth2UserService already persisted them
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found after OAuth2 execution for: " + email));

        String role  = user.getRole().name();
        String token = jwtUtil.generateToken(email, role);

        // Redirect back to the React frontend /login route where TokenHandler intercepts it
        String redirectUrl = "http://localhost:5173/login?token=" + token;
        log.info("Redirecting authenticated user '{}' (role={}) to frontend", email, role);

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
