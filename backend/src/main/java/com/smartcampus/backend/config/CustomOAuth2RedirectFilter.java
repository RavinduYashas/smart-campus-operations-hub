package com.smartcampus.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Intercepts the custom Google OAuth2 callback URL configured in Google Cloud Console
 * and internally rewrites it to Spring Security's default processing endpoint.
 * This completely avoids the "redirect_uri_mismatch" error without needing the user
 * to modify anything in Google Cloud Console.
 */
@Component
public class CustomOAuth2RedirectFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if ("/api/auth/google/callback".equals(request.getRequestURI())) {
            // Wrap the request to make downstream Spring Security filters think it's the default URI
            HttpServletRequestWrapper wrapper = new HttpServletRequestWrapper(request) {
                @Override
                public String getRequestURI() {
                    return "/login/oauth2/code/google";
                }
                @Override
                public String getServletPath() {
                    return "/login/oauth2/code/google";
                }
            };
            filterChain.doFilter(wrapper, response);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
