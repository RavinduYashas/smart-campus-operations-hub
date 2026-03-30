package com.smartcampus.backend.config;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User dummyUser = new User();
                dummyUser.setName("Initial Admin");
                dummyUser.setEmail("admin@smartcampus.com");
                dummyUser.setRole(User.Role.ADMIN);
                dummyUser.setCreatedAt(LocalDateTime.now());
                userRepository.save(dummyUser);
                System.out.println("Dummy user created. Database 'smartCampus' and collection 'users' should now be visible.");
            } else {
                System.out.println("Database already initialized.");
            }
        };
    }
}
