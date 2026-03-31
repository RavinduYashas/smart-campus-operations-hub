package com.smartcampus.backend.config;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // We are guaranteed the user exists at this point due to CustomOAuth2UserService
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found after OAuth execution"));
        String role = user.getRole().name();

        String token = jwtUtil.generateToken(email, role);

        // Redirect back to React frontend with URL parameter containing the JWT
        // In this case, defaulting to the Vite default port 5173
        String redirectUrl = "http://localhost:5173/?token=" + token;
        
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
