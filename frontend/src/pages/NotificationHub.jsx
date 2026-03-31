import React from 'react';

/**
 * NotificationHub Component (Module D)
 * 
 * Description: 
 * Central hub for showing real-time alerts and updates on bookings, incidents, and messages.
 *
 * Requirements Mapping:
 * - Booking approval/rejection notifications.
 * - Ticket status changes.
 * - Comments/Messages from staff or users.
 */
const NotificationHub = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
      <p className="text-slate-500 mb-8 font-medium">Stay updated with the latest activity across the Smart Campus.</p>

      <div className="space-y-4">
        {/* Notification Card Placeholder */}
        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Booking Approved</h4>
            <p className="text-sm text-slate-500 font-medium">Your request for L-01 Hall on April 24 has been successfully approved by the ADMIN.</p>
            <span className="text-[10px] font-bold text-slate-400 uppercase mt-2 block tracking-widest leading-none">2m ago</span>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-start gap-4 hover:shadow-md transition-all opacity-60">
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Ticket Status Update</h4>
            <p className="text-sm text-slate-500 font-medium">Fault T-8942 "HVAC Failure" is now marked as IN_PROGRESS by the Technician.</p>
            <span className="text-[10px] font-bold text-slate-400 uppercase mt-2 block tracking-widest leading-none">1h ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationHub;
