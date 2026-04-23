package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.TicketDTO;
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // Student: Create Ticket
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody TicketDTO dto, @AuthenticationPrincipal String email) {
        System.out.println("API Call: createTicket by " + email);
        if (email == null) email = "guest@my.sliit.lk"; // Changed fallback to avoid role confusion
        return ResponseEntity.ok(ticketService.createTicket(dto, email));
    }

    // Student: Get My Tickets
    @GetMapping("/my-tickets")
    public ResponseEntity<List<Ticket>> getMyTickets(@AuthenticationPrincipal String email) {
        if (email == null) email = "student@my.sliit.lk";
        return ResponseEntity.ok(ticketService.getTicketsByReporter(email));
    }

    // Technician: Get Assigned Tickets
    @GetMapping("/assigned")
    public ResponseEntity<List<Ticket>> getAssignedTickets(@AuthenticationPrincipal String email) {
        if (email == null) email = "tech@my.sliit.lk";
        return ResponseEntity.ok(ticketService.getTicketsByAssignee(email));
    }

    // Technician: Get Available Tickets
    @GetMapping("/available")
    public ResponseEntity<List<Ticket>> getAvailableTickets() {
        return ResponseEntity.ok(ticketService.getAvailableTickets());
    }

    // Admin: Get All Tickets
    @GetMapping("/all")
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // Shared: Update Ticket (Status, Priority, Tech Updates)
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable String id, @RequestBody TicketDTO dto, @AuthenticationPrincipal String email) {
        if (email == null) email = "system@my.sliit.lk";
        Ticket updated = ticketService.updateTicket(id, dto, email);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    // Student/Admin: Delete Ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}
