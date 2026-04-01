import React from 'react';

/**
 * BookingManagement Component (Module B)
 * 
 * Description: 
 * Manages the user's personal booking requests, life cycle (PENDING -> APPROVED/REJECTED),
 * and conflict monitoring.
 *
 * Requirements Mapping:
 * - Request forms for Date, Time Range, Purpose, Attendees.
 * - Workflow: PENDING -> APPROVED/REJECTED.
 * - View own bookings.
 */
const BookingManagement = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4">My Bookings</h1>
      <p className="text-gray-600 mb-8">Track and manage your facility and equipment reservations.</p>

      <div className="space-y-4">
        {/* Booking Card Placeholder */}
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">Lab-02 / April 24, 2026</h3>
            <p className="text-sm text-gray-500">09:00 AM - 12:00 PM | Research Workshop</p>
          </div>
          <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-xs font-bold uppercase tracking-widest">PENDING</span>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
