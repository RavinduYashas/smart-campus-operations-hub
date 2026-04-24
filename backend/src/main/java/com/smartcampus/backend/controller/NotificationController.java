package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping("/my-alerts")
    public ResponseEntity<List<Notification>> getMyAlerts(org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        
        // Get all roles
        List<String> roles = authentication.getAuthorities().stream()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .collect(java.util.stream.Collectors.toList());
        
        // Prioritize ADMIN if present
        String roleToSearch = roles.contains("ADMIN") ? "ADMIN" : (roles.isEmpty() ? "USER" : roles.get(0));
        
        System.out.println("DEBUG: Fetching alerts for User: " + email + " | Detected Roles: " + roles + " | Searching for Role: " + roleToSearch);
        
        return ResponseEntity.ok(notificationRepository.findByUserIdOrTargetRoleOrderByCreatedAtDesc(email, roleToSearch));
    }

    @GetMapping("/debug-all")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationRepository.findAll());
    }

    @PostMapping("/{id}/toggle-read")
    public ResponseEntity<Void> toggleRead(@PathVariable String id) {
        notificationRepository.findById(id).ifPresent(notif -> {
            notif.setRead(!notif.isRead());
            notificationRepository.save(notif);
        });
        return ResponseEntity.ok().build();
    }
}
