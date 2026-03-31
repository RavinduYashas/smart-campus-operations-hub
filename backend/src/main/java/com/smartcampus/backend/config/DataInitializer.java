package com.smartcampus.backend.config;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String[][] testUsers = {
                {"Admin User", "admin@smart.com", "admin123", User.Role.ADMIN.name()},
                {"Manager User", "manager@smart.com", "manager123", User.Role.MANAGER.name()},
                {"Technician User", "tech@smart.com", "tech123", User.Role.TECHNICIAN.name()},
                {"Regular User", "user@smart.com", "user123", User.Role.USER.name()}
            };

            for (String[] userData : testUsers) {
                if (userRepository.findByEmail(userData[1]).isEmpty()) {
                    createUser(userRepository, userData[0], userData[1], userData[2], User.Role.valueOf(userData[3]), passwordEncoder);
                    System.out.println("Created initial user: " + userData[1]);
                }
            }
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
