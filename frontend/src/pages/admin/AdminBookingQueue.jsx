import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';

const AdminBookingQueue = () => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [actionType, setActionType] = useState(''); // 'APPROVED' or 'REJECTED'
    const [adminReason, setAdminReason] = useState('');

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchBookings();
    }, [token]);

    const openModal = (booking, action) => {
        setSelectedBooking(booking);
        setActionType(action);
        setAdminReason('');
        setShowModal(true);
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:8081/api/bookings/${selectedBooking.id}/status`, {
                status: actionType,
                adminReason: adminReason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            fetchBookings();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update booking status.');
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'PENDING': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest">Pending</span>;
            case 'APPROVED': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest">Approved</span>;
            case 'REJECTED': return <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-bold uppercase tracking-widest">Rejected</span>;
            case 'CANCELLED': return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold uppercase tracking-widest">Cancelled</span>;
            default: return null;
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto relative">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Booking Approvals</h1>
            <p className="text-slate-500 mb-10 font-semibold uppercase tracking-widest text-xs">Administrative Review Queue</p>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-dark"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                            <p className="text-slate-500">No bookings in the queue.</p>
                        </div>
                    ) : (
                        bookings.map(booking => (
                            <div key={booking.id} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row justify-between md:items-center group hover:shadow-xl transition-all h-max hover:border-slate-200">
                                <div className="space-y-2 mb-6 md:mb-0">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-bold text-slate-900 tracking-tight leading-none uppercase text-xs text-slate-400">Request #{booking.id.substring(0,8)}</h4>
                                        {getStatusBadge(booking.status)}
                                    </div>
                                    <h3 className="font-bold text-2xl text-slate-900 tracking-tight leading-none mt-2">
                                        {booking.resourceName || 'Unknown Facility'} / {booking.userEmail}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500">
                                        {booking.date} | {booking.startTime} - {booking.endTime} | {booking.purpose} ({booking.attendees} attendees)
                                    </p>
                                    {booking.adminReason && (
                                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600">
                                            <strong>Admin Note:</strong> {booking.adminReason}
                                        </div>
                                    )}
                                </div>
                                
                                {booking.status === 'PENDING' && (
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => openModal(booking, 'APPROVED')}
                                            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => openModal(booking, 'REJECTED')}
                                            className="px-6 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Approval/Rejection Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors">
                            <X size={24} />
                        </button>
                        
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                            {actionType === 'APPROVED' ? 'Approve Booking' : 'Reject Booking'}
                        </h2>
                        <p className="text-slate-500 mb-6 text-sm">
                            Please provide a reason or note for this action. This will be visible to the user.
                        </p>

                        <form onSubmit={handleStatusUpdate}>
                            <textarea
                                required
                                value={adminReason}
                                onChange={(e) => setAdminReason(e.target.value)}
                                placeholder={actionType === 'APPROVED' ? "e.g., Approved. Please ensure room is locked after." : "e.g., Rejected due to maintenance."}
                                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-accent-gold outline-none resize-none min-h-[120px] mb-6 text-sm"
                            ></textarea>
                            
                            <div className="flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className={`flex-1 px-6 py-3 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                                        actionType === 'APPROVED' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 shadow-lg' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20 shadow-lg'
                                    }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookingQueue;
