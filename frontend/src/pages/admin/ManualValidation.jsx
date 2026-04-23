import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Search, ShieldCheck, AlertCircle } from 'lucide-react';

const ManualValidation = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [refNumber, setRefNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleValidate = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!refNumber.trim()) {
            setError('Please enter a Reference Number');
            return;
        }

        // Clean up the input (remove REF- if they typed it, and uppercase it)
        const cleanRef = refNumber.replace(/^REF-/i, '').trim().toLowerCase();

        if (cleanRef.length < 8) {
            setError('Reference number must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            // Fetch all bookings (since ADMIN/MANAGER has access to this)
            const response = await axios.get('http://localhost:8081/api/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const bookings = response.data;
            
            // Find a booking that matches the prefix
            const matchedBooking = bookings.find(b => b.id.toLowerCase().startsWith(cleanRef));
            
            if (matchedBooking) {
                // If found, redirect to the actual verification screen with the full ID
                navigate(`/verify-booking/${matchedBooking.id}`);
            } else {
                setError('No booking found with that reference number.');
            }
            
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to query the database. Ensure you have admin privileges.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto relative min-h-[80vh] flex flex-col items-center justify-center">
            <div className="w-full max-w-lg bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent-gold to-amber-500"></div>
                
                <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-primary-dark shadow-inner">
                    <ShieldCheck size={40} />
                </div>
                
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Manual Validation</h1>
                <p className="text-slate-500 font-medium mb-8">Enter the Reference ID from the pass to verify its authenticity manually.</p>

                <form onSubmit={handleValidate} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-accent-gold transition-colors">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="e.g. REF-69EA3880"
                            value={refNumber}
                            onChange={(e) => setRefNumber(e.target.value)}
                            className="w-full pl-14 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-lg font-bold text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-accent-gold/20 focus:border-accent-gold outline-none transition-all shadow-inner tracking-widest uppercase"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center justify-center gap-2 text-rose-500 bg-rose-50 p-3 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-bottom-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary-dark text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                        ) : (
                            'Validate Pass'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManualValidation;
