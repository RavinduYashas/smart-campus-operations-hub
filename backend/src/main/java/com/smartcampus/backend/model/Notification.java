package com.smartcampus.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    private String id;
    private String userId;
    private String targetRole; // e.g., "ADMIN", "TECHNICIAN", "MANAGER"
    private String message;
    private String title;
    private String priority; // e.g., "URGENT", "NORMAL", "LOW"
    private String category; // e.g., "MAINTENANCE", "BOOKING", "SECURITY"
    private NotificationType type;
    private boolean isRead;
    private LocalDateTime createdAt;

    public enum NotificationType {
        BOOKING_APPROVED, BOOKING_REJECTED, TICKET_STATUS, COMMENT
    }
}
