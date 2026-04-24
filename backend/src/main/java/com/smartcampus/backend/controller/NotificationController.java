package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping("/my-alerts")
    public ResponseEntity<List<Notification>> getMyAlerts(@AuthenticationPrincipal String email) {
        if (email == null) email = "student@my.sliit.lk";
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(email));
    }
}
