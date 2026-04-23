package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByReporterEmailOrderByCreatedAtDesc(String reporterEmail);
    List<Ticket> findByAssignedToEmailOrderByCreatedAtDesc(String assignedToEmail);
    List<Ticket> findByStatusOrderByCreatedAtDesc(String status);
    List<Ticket> findByStatusAndReporterRoleNotOrderByCreatedAtDesc(String status, String reporterRole);
    List<Ticket> findAllByOrderByCreatedAtDesc();
}
