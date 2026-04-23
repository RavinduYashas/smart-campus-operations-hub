// src/main/java/com/smartcampus/backend/exception/ResourceConflictException.java
package com.smartcampus.backend.exception.resource;

public class ResourceConflictException extends RuntimeException {
    public ResourceConflictException(String message) {
        super(message);
    }
}