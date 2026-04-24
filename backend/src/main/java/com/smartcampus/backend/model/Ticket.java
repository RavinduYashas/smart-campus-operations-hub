package com.smartcampus.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    @Id
    private String id;
    
    // Custom formatted ID like "INC-2026-081"
    private String ticketId;
    
    private String title;
    private String category;
    private String priority;
    private String status; // Open, Assigned, In Progress, Resolved, Closed
    private String description;
    private String location;
    
    private String reporterEmail;
    private String reporterRole;
    private String assignedToEmail;
    
    private LocalDateTime createdAt;
    
    private List<String> attachments = new ArrayList<>();
    private List<TicketUpdate> updates = new ArrayList<>();
}
