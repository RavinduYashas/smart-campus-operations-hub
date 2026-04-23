import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
    X, Check, AlertCircle, Calendar, Clock, Users, Building2, 
    Search, Filter, ChevronDown, MoreVertical, ShieldCheck,
    FileText, User, RefreshCw
} from 'lucide-react';

const AdminBookingQueue = () => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [actionType, setActionType] = useState(''); // 'APPROVED' or 'REJECTED'
    const [adminReason, setAdminReason] = useState('');

    const fetchBookings = async () => {
        setLoading(true);
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

    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            const matchesSearch = 
                (booking.resourceName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (booking.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.id.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [bookings, searchQuery, statusFilter]);

    const getStatusStyle = (status) => {
        switch(status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'APPROVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'REJECTED': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'CANCELLED': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'PENDING': return <AlertCircle size={14} className="mr-1" />;
            case 'APPROVED': return <ShieldCheck size={14} className="mr-1" />;
            case 'REJECTED': return <X size={14} className="mr-1" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 pb-20">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-gold/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-primary-dark rounded-xl text-accent-gold">
                                <Building2 size={24} />
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Facility Bookings</h1>
                        </div>
                        <p className="text-slate-500 font-medium ml-14">Comprehensive management and administrative review queue.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
                        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                        statusFilter === status 
                                            ? 'bg-white text-primary-dark shadow-md scale-100' 
                                            : 'text-slate-400 hover:text-slate-700 scale-95 hover:scale-100'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-dark transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by ID, Resource, or Email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-accent-gold/20 focus:border-accent-gold outline-none transition-all shadow-sm placeholder:text-slate-400 font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={fetchBookings}
                            className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-primary-dark transition-all shadow-sm"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-accent-gold mb-4"></div>
                        <p className="text-slate-400 font-medium animate-pulse">Synchronizing with registry...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredBookings.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                                    <FileText size={48} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-700 mb-2">No Requests Found</h3>
                                <p className="text-slate-400 max-w-sm">There are currently no facility booking requests matching your filters.</p>
                            </div>
                        ) : (
                            filteredBookings.map(booking => (
                                <div 
                                    key={booking.id} 
                                    className="bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col md:flex-row"
                                >
                                    {/* Left Status Bar */}
                                    <div className={`w-2 md:w-3 flex-shrink-0 transition-colors duration-300 ${
                                        booking.status === 'PENDING' ? 'bg-amber-400' :
                                        booking.status === 'APPROVED' ? 'bg-emerald-400' :
                                        booking.status === 'REJECTED' ? 'bg-rose-400' : 'bg-slate-300'
                                    }`} />
                                    
                                    <div className="p-6 md:p-8 flex-grow flex flex-col md:flex-row justify-between md:items-center gap-8">
                                        
                                        {/* Core Information */}
                                        <div className="space-y-4 flex-grow">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
                                                    REF-{booking.id.substring(0,8).toUpperCase()}
                                                </span>
                                                <div className={`flex items-center px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(booking.status)}`}>
                                                    {getStatusIcon(booking.status)}
                                                    {booking.status}
                                                </div>
                                                <span className="text-xs font-medium text-slate-400 ml-auto md:ml-0">
                                                    Submitted: {new Date(booking.createdAt || Date.now()).toLocaleDateString()}
                                                </span>
                                            </div>
                                            
                                            <div>
                                                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-primary-dark transition-colors">
                                                    {booking.resourceName || 'Unspecified Facility'}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-2 text-slate-600 font-medium">
                                                    <User size={16} className="text-slate-400" />
                                                    {booking.userEmail}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-4 border-t border-slate-100">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Calendar size={16} className="text-accent-gold" />
                                                    <span className="font-semibold">{booking.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Clock size={16} className="text-accent-gold" />
                                                    <span className="font-semibold">{booking.startTime} - {booking.endTime}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Users size={16} className="text-accent-gold" />
                                                    <span className="font-semibold">{booking.attendees} Participants</span>
                                                </div>
                                            </div>

                                            {/* Purpose & Admin Reason */}
                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-4 space-y-3">
                                                <div>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Purpose of Booking</span>
                                                    <p className="text-sm text-slate-700 font-medium">{booking.purpose}</p>
                                                </div>
                                                {booking.adminReason && (
                                                    <div className="pt-3 border-t border-slate-200/60">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Admin Remarks</span>
                                                        <p className="text-sm text-slate-700 font-medium italic">"{booking.adminReason}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        {booking.status === 'PENDING' && (
                                            <div className="flex md:flex-col gap-3 min-w-[160px] flex-shrink-0">
                                                <button 
                                                    onClick={() => openModal(booking, 'APPROVED')}
                                                    className="flex-1 w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95 group/btn"
                                                >
                                                    <Check size={18} className="group-hover/btn:scale-125 transition-transform" />
                                                    APPROVE
                                                </button>
                                                <button 
                                                    onClick={() => openModal(booking, 'REJECTED')}
                                                    className="flex-1 w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-rose-500 border-2 border-rose-100 rounded-2xl font-bold text-sm hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-95 group/btn"
                                                >
                                                    <X size={18} className="group-hover/btn:scale-125 transition-transform" />
                                                    REJECT
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Enhanced Approval/Rejection Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setShowModal(false)} 
                            className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`p-4 rounded-2xl ${actionType === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                {actionType === 'APPROVED' ? <ShieldCheck size={32} /> : <AlertCircle size={32} />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                    {actionType === 'APPROVED' ? 'Approve Request' : 'Reject Request'}
                                </h2>
                                <p className="text-slate-500 text-sm font-medium">
                                    REF-{selectedBooking?.id.substring(0,8).toUpperCase()}
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                            <p className="text-sm text-slate-600">
                                You are about to <strong className={actionType === 'APPROVED' ? 'text-emerald-600' : 'text-rose-600'}>{actionType.toLowerCase()}</strong> the booking for 
                                <strong className="text-slate-900"> {selectedBooking?.resourceName}</strong> by 
                                <strong className="text-slate-900"> {selectedBooking?.userEmail}</strong>.
                            </p>
                        </div>

                        <form onSubmit={handleStatusUpdate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Administrative Justification <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    required
                                    value={adminReason}
                                    onChange={(e) => setAdminReason(e.target.value)}
                                    placeholder={actionType === 'APPROVED' ? "e.g., Request verified. Please ensure the room is locked after use." : "e.g., Rejected due to scheduled maintenance during this window."}
                                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-accent-gold/20 focus:border-accent-gold outline-none resize-none min-h-[140px] text-sm font-medium transition-all shadow-inner bg-slate-50 focus:bg-white"
                                ></textarea>
                                <p className="text-xs text-slate-400 font-medium mt-2">This note will be visible to the user on their dashboard.</p>
                            </div>
                            
                            <div className="flex gap-4 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm tracking-wide hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className={`flex-1 px-6 py-4 text-white rounded-2xl font-bold text-sm tracking-wide transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2 ${
                                        actionType === 'APPROVED' 
                                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30' 
                                            : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                                    }`}
                                >
                                    <Check size={18} />
                                    Confirm Action
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
