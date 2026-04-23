package com.smartcampus.backend.repository.booking;

import com.smartcampus.backend.model.booking.Booking;
import com.smartcampus.backend.model.booking.Booking.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByResourceId(String resourceId);
    List<Booking> findByResourceIdAndDateAndStatusIn(String resourceId, java.time.LocalDate date, List<BookingStatus> statuses);
}
