package com.smartcampus.backend.controller.booking;

import com.smartcampus.backend.dto.booking.BookingRequestDTO;
import com.smartcampus.backend.dto.booking.BookingResponseDTO;
import com.smartcampus.backend.dto.booking.BookingStatusUpdateDTO;
import com.smartcampus.backend.model.booking.Booking.BookingStatus;
import com.smartcampus.backend.service.booking.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @RequestBody BookingRequestDTO requestDTO, 
            Authentication authentication) {
        String userEmail = authentication.getName();
        return new ResponseEntity<>(bookingService.createBooking(requestDTO, userEmail), HttpStatus.CREATED);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.getUserBookings(userEmail));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> updateBookingStatus(
            @PathVariable String id, 
            @RequestBody BookingStatusUpdateDTO updateDTO) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, updateDTO));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'MANAGER')")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable String id,
            Authentication authentication) {
        BookingStatusUpdateDTO updateDTO = new BookingStatusUpdateDTO();
        updateDTO.setStatus(BookingStatus.CANCELLED);
        // Could optionally verify if the user owns the booking here in the controller or service
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, updateDTO));
    }

    @GetMapping("/{id}/verify")
    public ResponseEntity<BookingResponseDTO> verifyBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.verifyBooking(id));
    }
}
