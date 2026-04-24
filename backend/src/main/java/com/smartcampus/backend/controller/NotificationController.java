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
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("USER");
        
        return ResponseEntity.ok(notificationRepository.findByUserIdOrTargetRoleOrderByCreatedAtDesc(email, role));
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
