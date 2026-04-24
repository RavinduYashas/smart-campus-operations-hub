package com.smartcampus.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class TicketDTO {
    // For Creation
    private String title;
    private String category;
    private String location;
    private String description;
    private String priority; // Can be submitted by admin logic or defaulted
    private List<String> attachments;
    
    // For Technician Updates
    private String status;
    private String assignedToEmail;
    
    // For Comments
    private String updateText;
}
