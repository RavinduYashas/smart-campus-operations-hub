package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.repository.resource.ResourceRepository;
import com.smartcampus.backend.model.resource.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final ResourceRepository resourceRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public String getAdminDashboard() {
        return "Welcome Admin! Access granted to the protected dashboard.";
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @org.springframework.web.bind.annotation.PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public org.springframework.http.ResponseEntity<?> createUser(@org.springframework.web.bind.annotation.RequestBody User user) {
        try {
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("error", "Email already exists"));
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setCreatedAt(java.time.LocalDateTime.now());
            return org.springframework.http.ResponseEntity.ok(userRepository.save(user));
        } catch (Exception e) {
            e.printStackTrace();
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Map.of("error", "Server Error: " + e.getMessage()));
        }
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public org.springframework.http.ResponseEntity<Void> deleteUser(@org.springframework.web.bind.annotation.PathVariable String id) {
        userRepository.deleteById(id);
        return org.springframework.http.ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TECHNICIAN')")
    public java.util.Map<String, Object> getStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("lectureHalls", resourceRepository.countByType(Resource.ResourceType.LECTURE_HALL));
        stats.put("openTickets", ticketRepository.countByStatus("Open"));
        stats.put("activeResources", resourceRepository.count());
        return stats;
    }
}
