package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.TicketDTO;
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.TicketUpdate;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.model.Notification.NotificationType;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public Ticket createTicket(TicketDTO dto, String userEmail) {
        Ticket ticket = new Ticket();
        
        // Generate short human-readable ID
        ticket.setTicketId("INC-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        ticket.setTitle(dto.getTitle());
        ticket.setCategory(dto.getCategory());
        ticket.setLocation(dto.getLocation());
        ticket.setDescription(dto.getDescription());
        ticket.setPriority(dto.getPriority() != null ? dto.getPriority() : "Medium"); // Default priority
        ticket.setStatus("Open");
        ticket.setReporterEmail(userEmail);
        ticket.setAssignedToEmail("Unassigned");
        ticket.setCreatedAt(LocalDateTime.now());
        
        if(dto.getAttachments() != null) {
            ticket.setAttachments(dto.getAttachments());
        }

        // Set reporter role for filtering
        Optional<User> reporterOpt = userRepository.findByEmail(userEmail);
        if (reporterOpt.isPresent()) {
            ticket.setReporterRole(reporterOpt.get().getRole().name());
        } else if (userEmail.contains("tech")) {
            ticket.setReporterRole("TECHNICIAN");
        } else {
            ticket.setReporterRole("USER"); 
        }

        Ticket savedTicket = ticketRepository.save(ticket);
        System.out.println("Ticket created: " + savedTicket.getTicketId() + " by " + userEmail + " (Role: " + ticket.getReporterRole() + ")");

        // Always notify the reporter themselves
        notificationService.createNotification(userEmail, "You have successfully reported: " + savedTicket.getTitle(), NotificationType.TICKET_STATUS);

        // Cross-role notifications
        if (reporterOpt.isPresent()) {
            User reporter = reporterOpt.get();
            if (reporter.getRole() == User.Role.USER) {
                // Notify all Technicians
                notificationService.createRoleNotification("TECHNICIAN", 
                    "New student incident: " + ticket.getTitle() + " at " + ticket.getLocation(), 
                    NotificationType.TICKET_STATUS);
                
                // Notify all Managers
                notificationService.createRoleNotification("MANAGER", 
                    "Resource incident reported: " + ticket.getTitle(), 
                    NotificationType.TICKET_STATUS);
            } else if (reporter.getRole() == User.Role.TECHNICIAN) {
                // Notify all Students (USER role)
                notificationService.createRoleNotification("USER", 
                    "Campus Maintenance Update: " + ticket.getTitle(), 
                    NotificationType.TICKET_STATUS);
            }
        } else {
            // Fallback for unknown reporters
            notificationService.createRoleNotification("TECHNICIAN", 
                "Guest incident reported: " + ticket.getTitle(), 
                NotificationType.TICKET_STATUS);
        }

        return savedTicket;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Ticket> getTicketsByReporter(String email) {
        return ticketRepository.findByReporterEmailOrderByCreatedAtDesc(email);
    }

    public List<Ticket> getTicketsByAssignee(String email) {
        return ticketRepository.findByAssignedToEmailOrderByCreatedAtDesc(email);
    }

    public List<Ticket> getAvailableTickets() {
        // Only show tickets reported by Students (USER), not Technicians or Admins
        List<Ticket> results = ticketRepository.findByStatusAndReporterRoleNotOrderByCreatedAtDesc("Open", "TECHNICIAN");
        System.out.println("Fetching available tickets. Found: " + results.size() + " (Excluded Technicians)");
        return results;
    }

    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }

    public Ticket updateTicket(String id, TicketDTO dto, String updaterEmail) {
        Optional<Ticket> opt = ticketRepository.findById(id);
        if (opt.isEmpty()) return null;
        
        Ticket ticket = opt.get();

        // Allow students to update basic fields
        if (dto.getTitle() != null) ticket.setTitle(dto.getTitle());
        if (dto.getCategory() != null) ticket.setCategory(dto.getCategory());
        if (dto.getLocation() != null) ticket.setLocation(dto.getLocation());
        if (dto.getDescription() != null) ticket.setDescription(dto.getDescription());

        if (dto.getStatus() != null && !dto.getStatus().equals(ticket.getStatus())) {
            ticket.setStatus(dto.getStatus());
            
            // Notify student of status change
            String message = "Your ticket '" + ticket.getTitle() + "' is now " + ticket.getStatus();
            notificationService.createNotification(ticket.getReporterEmail(), message, NotificationType.TICKET_STATUS);
        }
        
        if (dto.getPriority() != null) ticket.setPriority(dto.getPriority());
        if (dto.getAssignedToEmail() != null && !dto.getAssignedToEmail().equals(ticket.getAssignedToEmail())) {
            ticket.setAssignedToEmail(dto.getAssignedToEmail());
            if(ticket.getStatus().equals("Open") && !dto.getAssignedToEmail().equals("Unassigned")) {
                ticket.setStatus("Assigned");
                // Notify student of assignment
                String message = "Your ticket '" + ticket.getTitle() + "' has been assigned to a technician.";
                notificationService.createNotification(ticket.getReporterEmail(), message, NotificationType.TICKET_STATUS);
            }
        }

        if (dto.getUpdateText() != null && !dto.getUpdateText().trim().isEmpty()) {
            Optional<User> updaterOpt = userRepository.findByEmail(updaterEmail);
            String authorName = updaterOpt.isPresent() ? updaterOpt.get().getName() : updaterEmail;
            
            TicketUpdate update = new TicketUpdate(dto.getUpdateText(), authorName, LocalDateTime.now());
            ticket.getUpdates().add(update);
            
            // Notify student of a new comment from technician
            String message = "Technician update on '" + ticket.getTitle() + "': " + dto.getUpdateText();
            notificationService.createNotification(ticket.getReporterEmail(), message, NotificationType.COMMENT);
        }

        return ticketRepository.save(ticket);
    }
}

