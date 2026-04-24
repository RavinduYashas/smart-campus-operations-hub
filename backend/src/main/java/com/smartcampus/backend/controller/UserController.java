package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/by-role")
    public List<User> getUsersByRole(@RequestParam User.Role role) {
        return userRepository.findByRole(role);
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TECHNICIAN')")
    public String getUserDashboard() {
        return "Welcome to the base user dashboard!";
    }

    @GetMapping("/profile-settings")
    public String getProfileSettings() {
        return "Profile settings accessible to all authenticated users.";
    }
}
