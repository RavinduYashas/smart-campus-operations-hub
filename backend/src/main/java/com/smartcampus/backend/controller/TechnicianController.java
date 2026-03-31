package com.smartcampus.backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/technician")
@PreAuthorize("hasRole('TECHNICIAN')")
public class TechnicianController {

    @GetMapping("/tickets")
    public String getTechnicianTickets() {
        return "List of open support tickets for the technician.";
    }

    @GetMapping("/ticket-history")
    public String getTicketHistory() {
        return "Complete history of tickets resolved by the technician.";
    }
}
