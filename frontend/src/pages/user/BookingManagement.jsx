import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, X, Calendar, Clock, Users, Building2, QrCode, Download, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const BookingManagement = ({ embedded = false }) => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formError, setFormError] = useState('');
    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedQRBooking, setSelectedQRBooking] = useState(null);
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
        setFormError('');

        if (!formData.resourceId || !formData.date || !formData.startTime || !formData.endTime || !formData.attendees || !formData.purpose) {
            setFormError('All fields are required.');
            return;
        }

        if (formData.startTime >= formData.endTime) {
            setFormError('End time must be strictly after the start time.');
            return;
        }

        if (parseInt(formData.attendees) <= 0) {
            setFormError('Attendees must be at least 1.');
            return;
        }

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
            const msg = error.response?.data?.message || error.response?.data || 'Failed to create booking. Please try again.';
            alert(typeof msg === 'string' ? msg : 'Scheduling conflict or server error occurred.');
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await axios.post(`http://localhost:8081/api/bookings/${bookingId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBookings();
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Failed to cancel booking.');
        }
    };

    const exportToPDF = () => {
        import('jspdf').then(({ default: jsPDF }) => {
            import('jspdf-autotable').then(({ default: autoTable }) => {
                const doc = new jsPDF();
                const primaryDark = [15, 23, 42]; 
                const accentGold = [245, 158, 11]; 
                
                doc.setFillColor(...primaryDark);
                doc.rect(0, 0, 210, 40, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(24);
                doc.setFont("helvetica", "bold");
                doc.text("SMART CAMPUS", 14, 25);
                doc.setTextColor(...accentGold);
                doc.setFontSize(10);
                doc.text("PERSONAL BOOKING HISTORY", 14, 32);
                doc.setTextColor(100, 100, 100);
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                doc.text(`Generated: ${today}`, 14, 50);
                doc.text(`Total Bookings: ${bookings.length}`, 14, 56);
                
                const tableColumn = ["Ref ID", "Facility", "Date", "Time", "Attendees", "Status"];
                const tableRows = bookings.map(booking => [
                    booking.id.substring(0,8).toUpperCase(),
                    booking.resourceName || 'Unknown',
                    booking.date,
                    `${booking.startTime} - ${booking.endTime}`,
                    booking.attendees,
                    booking.status
                ]);
                
                autoTable(doc, {
                    startY: 65,
                    head: [tableColumn],
                    body: tableRows,
                    theme: 'grid',
                    styles: { font: 'helvetica', fontSize: 9, cellPadding: 4, lineColor: [226, 232, 240], lineWidth: 0.1 },
                    headStyles: { fillColor: primaryDark, textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
                    columnStyles: {
                        0: { fontStyle: 'bold', textColor: accentGold, halign: 'center' },
                        1: { fontStyle: 'bold' },
                        2: { halign: 'center' },
                        3: { halign: 'center' },
                        4: { halign: 'center' },
                        5: { fontStyle: 'bold', halign: 'center' }
                    },
                    alternateRowStyles: { fillColor: [248, 250, 252] },
                    didDrawPage: function (data) {
                        doc.setFontSize(8);
                        doc.setTextColor(150, 150, 150);
                        doc.text(`Page ${doc.internal.getNumberOfPages()}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
                        doc.text("Smart Campus Operations Hub - Confidential", doc.internal.pageSize.width - data.settings.margin.right - 60, doc.internal.pageSize.height - 10);
                    }
                });
                doc.save("My_Booking_History.pdf");
            });
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'REJECTED': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'CANCELLED': return 'bg-slate-700/30 text-slate-400 border-slate-700/50';
            default: return 'bg-amber-500/10 text-accent-gold border-amber-500/20';
        }
    };

    return (
        <div className={embedded ? "w-full text-slate-200" : "min-h-[calc(100vh-4.25rem)] bg-slate-900 text-slate-200 p-8"}>
            <div className={`max-w-6xl mx-auto`}>
                <div className={`flex flex-col sm:flex-row justify-between sm:items-end gap-4 ${embedded ? 'mb-8' : 'mb-10'}`}>
                    <div>
                        {embedded ? (
                            <>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 mb-4">
                                    <span className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.2em]">Module Active</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3 mb-2">
                                    <Building2 className="text-accent-gold" /> Facility Operations
                                </h2>
                                <p className="text-slate-400 font-medium">Manage executive reservations and facility access.</p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white tracking-tight">My Bookings</h1>
                                <p className="text-slate-400">Track and manage your facility and equipment reservations.</p>
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-gold to-amber-500 text-primary-dark rounded-xl text-sm font-bold shadow-lg hover:shadow-accent-gold/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Book Facility
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-700 border-t-accent-gold"></div>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Available Facilities Section */}
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <h3 className="text-xl font-bold text-white">Available Facilities</h3>
                                <div className="h-px bg-slate-800 flex-grow"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {facilities.map((facility) => (
                                    <div key={facility.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:shadow-2xl hover:bg-slate-800 hover:border-slate-600 transition-all group flex flex-col h-full relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/5 rounded-full blur-2xl group-hover:bg-accent-gold/10 transition-colors pointer-events-none"></div>
                                        
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div className="bg-slate-900/50 border border-slate-700 p-3 rounded-xl group-hover:border-accent-gold/30 transition-colors">
                                                <Building2 className="w-6 h-6 text-slate-300 group-hover:text-accent-gold transition-colors" />
                                            </div>
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full">Available</span>
                                        </div>
                                        <h4 className="font-bold text-xl text-white mb-2 relative z-10">{facility.name}</h4>
                                        <p className="text-sm text-slate-400 mb-6 line-clamp-2 relative z-10">{facility.description || `${facility.type} - Capacity: ${facility.capacity}`}</p>
                                        
                                        <div className="mt-auto relative z-10">
                                            <button 
                                                onClick={() => {
                                                    setFormData({ ...formData, resourceId: facility.id });
                                                    setFormError('');
                                                    setShowModal(true);
                                                }}
                                                className="w-full py-3 bg-slate-900/50 hover:bg-accent-gold hover:text-primary-dark border border-slate-700 hover:border-accent-gold text-slate-300 font-bold rounded-xl text-sm transition-all"
                                            >
                                                Book {facility.type === 'EQUIPMENT' ? 'Equipment' : 'Facility'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* My Bookings Section */}
                        <div>
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                                <div className="flex items-center gap-4 flex-grow">
                                    <h3 className="text-xl font-bold text-white">My Booking History</h3>
                                    <div className="h-px bg-slate-800 flex-grow hidden sm:block"></div>
                                </div>
                                {bookings.length > 0 && (
                                    <button 
                                        onClick={exportToPDF}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
                                    >
                                        <Download size={16} />
                                        Download Report
                                    </button>
                                )}
                            </div>
                            
                            {bookings.length === 0 ? (
                                <div className="text-center py-16 bg-slate-800/30 rounded-3xl border border-slate-700/50 border-dashed">
                                    <p className="text-slate-500 font-medium">No logistical history found under your credentials.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {bookings.map((booking) => (
                                        <div key={booking.id} className="p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-6 transition-colors">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-white flex items-center gap-2 mb-3">
                                                    <Building2 className="w-5 h-5 text-accent-gold" />
                                                    {booking.resourceName || 'Unknown Facility'}
                                                </h3>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-sm text-slate-400 font-medium">
                                                    <span className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700"><Calendar className="w-4 h-4 text-slate-500" /> {booking.date}</span>
                                                    <span className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700"><Clock className="w-4 h-4 text-slate-500" /> {booking.startTime} - {booking.endTime}</span>
                                                    <span className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700"><Users className="w-4 h-4 text-slate-500" /> {booking.attendees} attendees</span>
                                                </div>
                                                <p className="text-sm text-slate-300 font-medium bg-slate-900/30 p-3 rounded-xl border border-slate-800">
                                                    <span className="text-slate-500 mr-2 uppercase tracking-wider text-[10px] font-bold">Purpose:</span> 
                                                    {booking.purpose}
                                                </p>
                                                
                                                {booking.adminReason && (
                                                    <div className="mt-3 p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-sm text-indigo-300 flex items-start gap-2">
                                                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded mt-0.5">Admin Note</span>
                                                        {booking.adminReason}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-row md:flex-col items-center md:items-end gap-3 min-w-[140px]">
                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center w-full border ${getStatusStyle(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                                
                                                <div className="flex flex-col gap-2 w-full">
                                                    {booking.status === 'APPROVED' && (
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedQRBooking(booking);
                                                                setShowQRModal(true);
                                                            }}
                                                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-dark bg-accent-gold hover:bg-amber-400 rounded-xl transition-all w-full flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 active:scale-95"
                                                        >
                                                            <QrCode size={14} />
                                                            QR Pass
                                                        </button>
                                                    )}
                                                    
                                                    {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                                                        <button 
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-xl transition-all w-full border border-rose-500/20"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Booking Form Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                        <div className="bg-slate-900 border border-slate-700 rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative">
                            <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md flex justify-between items-center p-6 border-b border-slate-800 z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">Book a Facility</h2>
                                    <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-widest">Initialize Request</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setShowModal(false);
                                        setFormError('');
                                    }} 
                                    className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                                {formError && (
                                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium rounded-xl flex items-start gap-3">
                                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                        {formError}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Facility *</label>
                                        <select
                                            required
                                            value={formData.resourceId}
                                            onChange={(e) => setFormData({...formData, resourceId: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold text-white outline-none text-sm transition-all appearance-none"
                                        >
                                            <option value="" className="bg-slate-900">-- Choose a facility --</option>
                                            {facilities.map(f => (
                                                <option key={f.id} value={f.id} className="bg-slate-900">
                                                    {f.name} ({f.type} - Cap: {f.capacity})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Date *</label>
                                        <input
                                            type="date"
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            value={formData.date}
                                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold text-white outline-none text-sm transition-all [color-scheme:dark]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Start Time *</label>
                                            <input
                                                type="time"
                                                required
                                                value={formData.startTime}
                                                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold text-white outline-none text-sm transition-all [color-scheme:dark]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">End Time *</label>
                                            <input
                                                type="time"
                                                required
                                                value={formData.endTime}
                                                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold text-white outline-none text-sm transition-all [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Attendees *</label>
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={formData.attendees}
                                            onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold text-white outline-none text-sm transition-all"
                                            placeholder="e.g. 10"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Purpose *</label>
                                        <textarea
                                            required
                                            rows="3"
                                            value={formData.purpose}
                                            onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold text-white outline-none text-sm resize-none transition-all placeholder:text-slate-600"
                                            placeholder="Briefly explain the necessity of this reservation..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 text-sm font-bold bg-accent-gold text-primary-dark rounded-xl hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 active:scale-95"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* QR Code Modal */}
                {showQRModal && selectedQRBooking && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-900 border border-slate-700 rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl relative flex flex-col items-center text-center overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-accent-gold/10 to-transparent pointer-events-none"></div>
                            
                            <button 
                                onClick={() => setShowQRModal(false)} 
                                className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-2 rounded-full z-10"
                            >
                                <X size={18} />
                            </button>
                            
                            <div className="mb-4 text-accent-gold relative z-10">
                                <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 inline-block">
                                    <Building2 size={32} />
                                </div>
                            </div>
                            
                            <h2 className="text-2xl font-black text-white tracking-tight mb-1 relative z-10">
                                Access Protocol
                            </h2>
                            <p className="text-slate-400 text-sm font-medium mb-8 relative z-10">
                                Present cryptographic signature at terminal.
                            </p>

                            <div className="p-5 bg-white rounded-3xl shadow-[0_0_40px_-10px_rgba(245,158,11,0.3)] mb-8 relative z-10 group hover:scale-105 transition-transform duration-500">
                                <QRCodeSVG 
                                    value={`http://localhost:5173/verify-booking/${selectedQRBooking.id}`}
                                    size={200}
                                    level={"H"}
                                    includeMargin={false}
                                    fgColor={"#0f172a"}
                                />
                            </div>

                            <div className="w-full text-left bg-slate-800/50 p-5 rounded-2xl border border-slate-700 relative z-10">
                                <div className="mb-4 pb-4 border-b border-slate-700">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Target Resource</p>
                                    <p className="text-base font-bold text-white">{selectedQRBooking.resourceName}</p>
                                </div>
                                
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Auth Date</p>
                                        <p className="text-sm font-bold text-white">{selectedQRBooking.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Time Window</p>
                                        <p className="text-sm font-bold text-white">{selectedQRBooking.startTime}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex flex-col items-center relative z-10">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-1">Node Reference</p>
                                <p className="text-sm text-accent-gold font-mono font-bold tracking-widest">REF-{selectedQRBooking.id.substring(0,8).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingManagement;
