package com.smartcampus.backend.dto.booking;

import com.smartcampus.backend.model.booking.Booking.BookingStatus;

public class BookingStatusUpdateDTO {
    private BookingStatus status;
    private String adminReason;

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getAdminReason() {
        return adminReason;
    }

    public void setAdminReason(String adminReason) {
        this.adminReason = adminReason;
    }
}
