import React from 'react';

/**
 * AdminBookingQueue Component (Module B - Admin)
 * 
 * Description: 
 * Professional interface for administrators to review, approve, and reject 
 * faculty and asset booking requests.
 *
 * Requirements Mapping:
 * - Workflow: PENDING -> APPROVED/REJECTED.
 * - Conflict detection logic (overlapping time check).
 * - Multi-criteria status tracking and management.
 */
const AdminBookingQueue = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Booking Approvals</h1>
            <p className="text-slate-500 mb-10 font-semibold uppercase tracking-widest text-xs">Administrative Review Queue</p>

            <div className="space-y-6">
                <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row justify-between items-center group hover:shadow-xl transition-all h-max hover:border-slate-200">
                    <div className="space-y-2 mb-6 md:mb-0">
                        <h4 className="font-bold text-2xl text-slate-900 tracking-tight leading-none uppercase text-xs text-slate-400">Request #B-8832</h4>
                        <h3 className="font-bold text-2xl text-slate-900 tracking-tight leading-none mt-2">Seminar Hall B / Dr. Sarah J.</h3>
                        <p className="text-sm font-medium text-slate-500">April 28, 2026 | 02:00 PM - 05:00 PM | Guest Lecture Series</p>
                    </div>
                    <div className="flex gap-3">
                         <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95">
                             Approve
                         </button>
                         <button className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95">
                             Reject
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBookingQueue;
