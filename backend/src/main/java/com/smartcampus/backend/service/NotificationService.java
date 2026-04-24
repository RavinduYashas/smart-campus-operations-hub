package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification createNotification(String userId, String title, String message, String priority, String category, Notification.NotificationType type) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setPriority(priority != null ? priority : "NORMAL");
        notification.setCategory(category != null ? category : "GENERAL");
        notification.setType(type);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public Notification createRoleNotification(String targetRole, String title, String message, String priority, String category, Notification.NotificationType type) {
        Notification notification = new Notification();
        notification.setTargetRole(targetRole);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setPriority(priority != null ? priority : "NORMAL");
        notification.setCategory(category != null ? category : "GENERAL");
        notification.setType(type);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }
}
