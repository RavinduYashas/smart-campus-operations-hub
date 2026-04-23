import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, X, Calendar, Clock, Users, Building2 } from 'lucide-react';

const BookingManagement = ({ embedded = false }) => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        resourceId: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: ''
    });

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/bookings/my-bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const fetchFacilities = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/resources', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter only active facilities
            setFacilities(response.data.filter(r => r.status === 'ACTIVE'));
        } catch (error) {
            console.error('Error fetching facilities:', error);
        }
    };

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            await Promise.all([fetchBookings(), fetchFacilities()]);
            setLoading(false);
        };
        if (token) initData();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8081/api/bookings', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            setFormData({
                resourceId: '', date: '', startTime: '', endTime: '', purpose: '', attendees: ''
            });
            fetchBookings();
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to create booking. Please try again.');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-100 text-emerald-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
            case 'CANCELLED': return 'bg-slate-100 text-slate-700';
            default: return 'bg-amber-100 text-amber-700';
        }
    };

    return (
        <div className={embedded ? "w-full" : "p-8 max-w-6xl mx-auto"}>
            <div className={`flex justify-between items-end ${embedded ? 'mb-6' : 'mb-8'}`}>
                <div>
                    {embedded ? (
                        <>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3 mb-2">
                                <Building2 className="text-amber-500" /> Facility Operations & Bookings
                            </h2>
                            <p className="text-slate-500 font-medium">Manage executive reservations and facility access.</p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl font-semibold mb-2 text-primary-dark">My Bookings</h1>
                            <p className="text-gray-600">Track and manage your facility and equipment reservations.</p>
                        </>
                    )}
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-lg text-sm hover:bg-black transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Book Facility
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-dark"></div>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Available Facilities Section */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-primary-dark">Available Facilities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {facilities.map((facility) => (
                                <div key={facility.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="bg-slate-50 p-3 rounded-xl group-hover:bg-accent-gold/10 transition-colors">
                                            <Building2 className="w-6 h-6 text-primary-dark" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">Available</span>
                                    </div>
                                    <h4 className="font-bold text-lg text-primary-dark mb-1">{facility.name}</h4>
                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{facility.description || `${facility.type} - Capacity: ${facility.capacity}`}</p>
                                    <button 
                                        onClick={() => {
                                            setFormData({ ...formData, resourceId: facility.id });
                                            setShowModal(true);
                                        }}
                                        className="w-full py-2 bg-slate-100 hover:bg-primary-dark hover:text-white text-slate-700 font-semibold rounded-xl text-sm transition-all"
                                    >
                                        Book {facility.type === 'EQUIPMENT' ? 'Equipment' : 'Facility'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* My Bookings Section */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-primary-dark">My Booking History</h3>
                        {bookings.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                <p className="text-slate-500">You have no bookings yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((booking) => (
                                    <div key={booking.id} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div>
                                            <h3 className="font-semibold text-lg text-primary-dark flex items-center gap-2">
                                                <Building2 className="w-5 h-5 text-accent-gold" />
                                                {booking.resourceName || 'Unknown Facility'}
                                            </h3>
                                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {booking.date}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {booking.startTime} - {booking.endTime}</span>
                                                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {booking.attendees} attendees</span>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-2 font-medium">Purpose: {booking.purpose}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${getStatusStyle(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-primary-dark">Book a Facility</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-primary-dark">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Facility *</label>
                                <select
                                    required
                                    value={formData.resourceId}
                                    onChange={(e) => setFormData({...formData, resourceId: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none text-sm"
                                >
                                    <option value="">-- Choose a facility --</option>
                                    {facilities.map(f => (
                                        <option key={f.id} value={f.id}>{f.name} ({f.type} - Capacity: {f.capacity})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Time *</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">End Time *</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Attendees *</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={formData.attendees}
                                    onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none text-sm"
                                    placeholder="Number of expected attendees"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Purpose *</label>
                                <textarea
                                    required
                                    rows="3"
                                    value={formData.purpose}
                                    onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none text-sm resize-none"
                                    placeholder="Brief description of the event or purpose..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm text-slate-600 hover:text-primary-dark transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-primary-dark text-white rounded-lg hover:bg-black transition-colors"
                                >
                                    Submit Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;
