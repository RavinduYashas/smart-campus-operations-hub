// backend/src/main/java/com/smartcampus/backend/config/DotenvConfig.java
package com.smartcampus.backend.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class DotenvConfig {
    
    private static Dotenv dotenv;
    
    @PostConstruct
    public void init() {
        dotenv = Dotenv.configure()
                .ignoreIfMissing()  // Don't crash if .env doesn't exist
                .load();
        
        // Set system properties so Spring Boot can read them
        if (dotenv != null) {
            dotenv.entries().forEach(entry -> {
                System.setProperty(entry.getKey(), entry.getValue());
                System.out.println("Loaded: " + entry.getKey()); // Debug - remove later
            });
        }
    }
    
    public static String get(String key) {
        return dotenv != null ? dotenv.get(key) : System.getenv(key);
    }
    
    public static String get(String key, String defaultValue) {
        return dotenv != null ? dotenv.get(key, defaultValue) : System.getenv().getOrDefault(key, defaultValue);
    }
}