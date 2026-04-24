package com.smartcampus.backend.service.booking;

import com.smartcampus.backend.dto.booking.BookingRequestDTO;
import com.smartcampus.backend.dto.booking.BookingResponseDTO;
import com.smartcampus.backend.model.booking.Booking;
import com.smartcampus.backend.model.booking.Booking.BookingStatus;
import com.smartcampus.backend.model.resource.Resource;
import com.smartcampus.backend.repository.booking.BookingRepository;
import com.smartcampus.backend.repository.resource.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.smartcampus.backend.dto.booking.BookingStatusUpdateDTO;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final com.smartcampus.backend.service.NotificationService notificationService;

    public BookingResponseDTO createBooking(BookingRequestDTO requestDTO, String userEmail) {
        // Check for scheduling conflicts
        List<BookingStatus> activeStatuses = Arrays.asList(BookingStatus.PENDING, BookingStatus.APPROVED);
        List<Booking> existingBookings = bookingRepository.findByResourceIdAndDateAndStatusIn(
                requestDTO.getResourceId(), requestDTO.getDate(), activeStatuses);
                
        for (Booking existing : existingBookings) {
            if (requestDTO.getStartTime().isBefore(existing.getEndTime()) && 
                requestDTO.getEndTime().isAfter(existing.getStartTime())) {
                throw new RuntimeException("Scheduling conflict: Resource is already booked during this time range.");
            }
        }

        Booking booking = new Booking();
        booking.setResourceId(requestDTO.getResourceId());
        booking.setUserEmail(userEmail);
        booking.setDate(requestDTO.getDate());
        booking.setStartTime(requestDTO.getStartTime());
        booking.setEndTime(requestDTO.getEndTime());
        booking.setPurpose(requestDTO.getPurpose());
        booking.setAttendees(requestDTO.getAttendees());
        
        Booking savedBooking = bookingRepository.save(booking);

        // Notify Managers about new booking
        notificationService.createRoleNotification("MANAGER", 
            "New Booking Request", 
            "A new booking request for " + requestDTO.getPurpose() + " is pending approval.", 
            "NORMAL", 
            "BOOKING", 
            savedBooking.getId(), 
            com.smartcampus.backend.model.Notification.NotificationType.TICKET_STATUS); // Using TICKET_STATUS as generic for now or I can add a new type

        return mapToDTO(savedBooking);
    }

    public List<BookingResponseDTO> getUserBookings(String userEmail) {
        return bookingRepository.findByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public BookingResponseDTO updateBookingStatus(String id, BookingStatusUpdateDTO updateDTO) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(updateDTO.getStatus());
        if (updateDTO.getAdminReason() != null) {
            booking.setAdminReason(updateDTO.getAdminReason());
        }
        booking.setUpdatedAt(LocalDateTime.now());
        
        Booking savedBooking = bookingRepository.save(booking);

        // Notify the user about the status update
        String title = booking.getStatus() == BookingStatus.APPROVED ? "Booking Approved" : "Booking Rejected";
        String priority = booking.getStatus() == BookingStatus.APPROVED ? "NORMAL" : "URGENT";
        
        notificationService.createNotification(booking.getUserEmail(), 
            title, 
            "Your booking for '" + booking.getPurpose() + "' has been " + booking.getStatus().toString().toLowerCase() + ".", 
            priority, 
            "BOOKING", 
            savedBooking.getId(), 
            com.smartcampus.backend.model.Notification.NotificationType.BOOKING_APPROVED); // Map appropriately

        return mapToDTO(savedBooking);
    }

    public BookingResponseDTO verifyBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToDTO(booking);
    }

    private BookingResponseDTO mapToDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setResourceId(booking.getResourceId());
        dto.setUserEmail(booking.getUserEmail());
        dto.setDate(booking.getDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setAttendees(booking.getAttendees());
        dto.setAdminReason(booking.getAdminReason());
        dto.setStatus(booking.getStatus());
        dto.setCreatedAt(booking.getCreatedAt());

        // Get resource name
        resourceRepository.findById(booking.getResourceId())
                .ifPresent(resource -> dto.setResourceName(resource.getName()));

        return dto;
    }
}
