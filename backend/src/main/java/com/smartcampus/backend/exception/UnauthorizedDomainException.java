package com.smartcampus.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a user attempts to authenticate with an email address
 * that does not belong to an allowed SLIIT domain.
 * Allowed domains: @my.sliit.lk, @sliit.lk
 */
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UnauthorizedDomainException extends RuntimeException {

    public UnauthorizedDomainException(String email) {
        super("Access denied: email domain not allowed for address '" + email +
              "'. Only @my.sliit.lk and @sliit.lk accounts are permitted.");
    }
}
