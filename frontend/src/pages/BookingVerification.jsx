import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle, ShieldAlert, Calendar, Clock, User, Building2, MapPin } from 'lucide-react';

const BookingVerification = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyBooking = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/bookings/${id}/verify`);
                setBooking(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Verification error:", err);
                setError(err.response?.data?.message || "Invalid or Unrecognized Pass");
                setLoading(false);
            }
        };
        verifyBooking();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-accent-gold"></div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                    <XCircle size={64} className="text-rose-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Invalid Pass</h1>
                    <p className="text-slate-500 font-medium mb-6">{error}</p>
                    <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
                        Return to Portal
                    </Link>
                </div>
            </div>
        );
    }

    const isValid = booking.status === 'APPROVED';

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md relative">
                {/* Branding */}
                <div className="text-center mb-6">
                    <h2 className="text-white text-3xl font-extrabold tracking-tight">SMART<span className="text-accent-gold">CAMPUS</span></h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Access Control</p>
                </div>

                {/* Main Pass Card */}
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl relative">
                    {/* Header Strip */}
                    <div className={`py-6 text-center text-white ${isValid ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                        {isValid ? (
                            <CheckCircle2 size={48} className="mx-auto mb-2 opacity-90" />
                        ) : (
                            <ShieldAlert size={48} className="mx-auto mb-2 opacity-90" />
                        )}
                        <h1 className="text-2xl font-black tracking-tight uppercase">
                            {isValid ? 'Access Granted' : 'Access Denied'}
                        </h1>
                        <p className="text-white/80 text-sm font-medium mt-1">
                            {isValid ? 'Valid facility pass' : `Status: ${booking.status}`}
                        </p>
                    </div>

                    {/* Content Body */}
                    <div className="p-8">
                        <div className="text-center mb-8 pb-8 border-b border-slate-100 border-dashed">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Ref ID</p>
                            <p className="text-2xl font-mono font-bold text-slate-900 tracking-wider bg-slate-50 py-2 rounded-xl">
                                {booking.id.substring(0,8).toUpperCase()}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl text-primary-dark shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Facility / Resource</p>
                                    <p className="font-bold text-slate-900 text-lg leading-tight mt-0.5">{booking.resourceName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl text-primary-dark shrink-0">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Authorized User</p>
                                    <p className="font-bold text-slate-900 leading-tight mt-0.5">{booking.userEmail}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                                        <Calendar size={12} /> Date
                                    </p>
                                    <p className="font-bold text-slate-900">{booking.date}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                                        <Clock size={12} /> Time
                                    </p>
                                    <p className="font-bold text-slate-900">{booking.startTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Decorative Edge */}
                    <div className="h-4 bg-slate-100 flex items-center justify-center overflow-hidden opacity-50 relative">
                        <div className="w-[120%] border-t-[8px] border-dashed border-slate-300 -ml-4"></div>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-slate-500 text-xs font-medium">Scanned at: {new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default BookingVerification;
