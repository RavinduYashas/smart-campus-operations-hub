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
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;

    public BookingResponseDTO createBooking(BookingRequestDTO requestDTO, String userEmail) {
        Booking booking = new Booking();
        booking.setResourceId(requestDTO.getResourceId());
        booking.setUserEmail(userEmail);
        booking.setDate(requestDTO.getDate());
        booking.setStartTime(requestDTO.getStartTime());
        booking.setEndTime(requestDTO.getEndTime());
        booking.setPurpose(requestDTO.getPurpose());
        booking.setAttendees(requestDTO.getAttendees());
        
        Booking savedBooking = bookingRepository.save(booking);
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

    public BookingResponseDTO updateBookingStatus(String id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());
        
        return mapToDTO(bookingRepository.save(booking));
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
        dto.setStatus(booking.getStatus());
        dto.setCreatedAt(booking.getCreatedAt());

        // Get resource name
        resourceRepository.findById(booking.getResourceId())
                .ifPresent(resource -> dto.setResourceName(resource.getName()));

        return dto;
    }
}
