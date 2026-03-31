package com.smartcampus.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

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
