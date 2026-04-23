import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
    Search, ShieldCheck, AlertCircle, Fingerprint, 
    ScanLine, CheckCircle2, ArrowRight, ShieldAlert,
    Building2, Activity
} from 'lucide-react';

const ManualValidation = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [refNumber, setRefNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isValidFormat, setIsValidFormat] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);

    // Live validation feedback
    useEffect(() => {
        const clean = refNumber.replace(/^REF-/i, '').trim();
        setIsValidFormat(clean.length >= 8);
    }, [refNumber]);

    const handleValidate = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!refNumber.trim()) {
            setError('Reference Number is required for validation.');
            return;
        }

        const cleanRef = refNumber.replace(/^REF-/i, '').trim().toLowerCase();

        if (cleanRef.length < 8) {
            setError('Cryptographic reference must be at least 8 hexadecimal characters.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8081/api/bookings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const bookings = response.data;
            const matchedBooking = bookings.find(b => b.id.toLowerCase().startsWith(cleanRef));
            
            if (matchedBooking) {
                // Save to local storage for recent searches
                const newSearch = `REF-${cleanRef.substring(0,8).toUpperCase()}`;
                const updatedSearches = [newSearch, ...recentSearches.filter(s => s !== newSearch)].slice(0, 3);
                setRecentSearches(updatedSearches);
                
                // Add a slight artificial delay for the "processing" feel
                setTimeout(() => {
                    navigate(`/verify-booking/${matchedBooking.id}`);
                }, 800);
            } else {
                setTimeout(() => {
                    setError('ACCESS DENIED: No recognized authorization found for that reference ID.');
                    setLoading(false);
                }, 800);
            }
        } catch (err) {
            console.error('Validation error:', err);
            setError('NETWORK ANOMALY: Failed to establish secure connection with authorization servers.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4.25rem)] bg-slate-900 relative overflow-hidden flex items-center justify-center p-6 font-sans">
            
            {/* Background Animated Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]"></div>
                <div className="absolute top-40 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite_delay-2s]"></div>
                <div className="absolute -bottom-20 left-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl animate-[pulse_7s_ease-in-out_infinite_delay-1s]"></div>
            </div>

            {/* Main Interface Container */}
            <div className="w-full max-w-5xl bg-slate-800/50 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10">
                
                {/* Left Panel: Information & Instructions */}
                <div className="w-full md:w-5/12 bg-slate-900/80 p-10 flex flex-col justify-between border-r border-white/5">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/20 mb-8">
                            <Activity size={14} className="animate-pulse" />
                            <span className="text-xs font-bold tracking-widest uppercase">Secure Protocol</span>
                        </div>
                        
                        <h1 className="text-3xl font-black text-white tracking-tight mb-4">
                            Cryptographic<br/>
                            <span className="text-slate-400">Validation Node</span>
                        </h1>
                        
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            This terminal establishes a secure handshake with the central campus authorization servers. Enter the 8-character cryptographic reference provided by the user to authenticate their facility access pass.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0">
                                    <ScanLine size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-bold mb-1">Optical Parity</h3>
                                    <p className="text-slate-400 text-xs leading-relaxed">Ensure the physical pass matches the exact digital signature stored in the database.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-bold mb-1">Clearance Level</h3>
                                    <p className="text-slate-400 text-xs leading-relaxed">Validation is automatically logged under your administrative credentials ({user?.name || 'Admin'}).</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex items-center justify-between text-[10px] text-slate-600 font-mono tracking-widest uppercase">
                        <span>SYS.VER: 4.2.0-STABLE</span>
                        <span>NODE: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                    </div>
                </div>

                {/* Right Panel: Interactive Form */}
                <div className="w-full md:w-7/12 p-10 lg:p-14 flex flex-col justify-center relative bg-slate-800/80">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 border-4 border-slate-700 shadow-inner mb-6 relative group">
                            {loading ? (
                                <div className="absolute inset-0 rounded-full border-4 border-accent-gold border-t-transparent animate-spin"></div>
                            ) : null}
                            <Fingerprint size={32} className={isValidFormat ? "text-accent-gold transition-colors duration-500" : "text-slate-500 group-hover:text-slate-400 transition-colors"} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Initialize Verification</h2>
                        <p className="text-slate-400 text-sm">Input the reference ID to query the master registry.</p>
                    </div>

                    <form onSubmit={handleValidate} className="max-w-md mx-auto w-full space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Reference ID</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-accent-gold transition-colors">
                                    <Search size={20} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="e.g. REF-69EA3880"
                                    value={refNumber}
                                    onChange={(e) => setRefNumber(e.target.value.toUpperCase())}
                                    className="w-full pl-12 pr-12 py-4 bg-slate-900/80 border-2 border-slate-700 rounded-2xl text-lg font-mono font-bold text-white placeholder:text-slate-600 focus:ring-4 focus:ring-accent-gold/20 focus:border-accent-gold outline-none transition-all shadow-inner uppercase tracking-wider"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    {isValidFormat ? (
                                        <CheckCircle2 size={20} className="text-emerald-500 animate-in zoom-in" />
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-sm font-medium animate-in slide-in-from-bottom-2 fade-in">
                                <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                                <p className="leading-relaxed">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !isValidFormat}
                            className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-sm flex justify-center items-center gap-3 transition-all duration-300 shadow-xl ${
                                loading || !isValidFormat
                                    ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
                                    : 'bg-gradient-to-r from-accent-gold to-amber-500 text-primary-dark hover:shadow-accent-gold/20 hover:scale-[1.02] active:scale-95 border border-amber-400'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-dark/30 border-t-primary-dark"></div>
                                    <span className="opacity-80">Querying Database...</span>
                                </>
                            ) : (
                                <>
                                    Authenticate Node <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {recentSearches.length > 0 && (
                        <div className="mt-12 max-w-md mx-auto w-full animate-in fade-in duration-500">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">Recent Queries</p>
                            <div className="flex gap-2 flex-wrap justify-center">
                                {recentSearches.map((search, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setRefNumber(search)}
                                        className="px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-700 text-xs font-mono text-slate-400 hover:text-white hover:border-accent-gold/50 hover:bg-slate-800 transition-all active:scale-95"
                                    >
                                        {search}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManualValidation;
