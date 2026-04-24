package com.smartcampus.backend.config;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.repository.TicketRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.Optional;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, TicketRepository ticketRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String[][] testUsers = {
                {"Admin User", "admin@my.sliit.lk", "admin123", User.Role.ADMIN.name()},
                {"Manager User", "manager@my.sliit.lk", "manager123", User.Role.MANAGER.name()},
                {"Technician User", "tech@my.sliit.lk", "tech123", User.Role.TECHNICIAN.name()},
                {"Student User", "student@my.sliit.lk", "student123", User.Role.USER.name()}
            };

            for (String[] userData : testUsers) {
                if (userRepository.findByEmail(userData[1]).isEmpty()) {
                    createUser(userRepository, userData[0], userData[1], userData[2], User.Role.valueOf(userData[3]), passwordEncoder);
                    System.out.println("Created initial user: " + userData[1]);
                }
            }

            // Data Migration: Set reporterRole for existing tickets that don't have it
            ticketRepository.findAll().forEach(ticket -> {
                if (ticket.getReporterRole() == null) {
                    Optional<User> user = userRepository.findByEmail(ticket.getReporterEmail());
                    if (user.isPresent()) {
                        ticket.setReporterRole(user.get().getRole().name());
                        ticketRepository.save(ticket);
                        System.out.println("Migrated ticket " + ticket.getTicketId() + " to role " + ticket.getReporterRole());
                    } else {
                        ticket.setReporterRole("USER");
                        ticketRepository.save(ticket);
                    }
                }
            });
        };
    }

    private void createUser(UserRepository repo, String name, String email, String password, User.Role role, PasswordEncoder encoder) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        user.setRole(role);
        user.setCreatedAt(LocalDateTime.now());
        repo.save(user);
    }
}
