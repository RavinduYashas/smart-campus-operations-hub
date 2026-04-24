import React, { useState, useEffect } from 'react';
import { ShieldCheck, Building2, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleMessage = async (event) => {
            // Ensure message is from our own domain
            if (event.origin !== window.location.origin) return;

            if (event.data?.type === 'OAUTH_SUCCESS' && event.data?.token) {
                setIsLoading(true);
                // AuthContext fetchUser will run, and the parent TokenHandler will do the redirect!
                await login(event.data.token);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [login]);

    const handleGoogleLogin = () => {
        // Calculate popup position to center it on the screen
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        window.open(
            'http://localhost:8080/oauth2/authorization/google',
            'Google Sign In',
            `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,status=0,menubar=0`
        );
    };

    const handleManualLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password
            });

            const { token, user } = response.data;
            await login(token, user);

            // Navigate based on role
            switch (user.role) {
                case 'ADMIN':
                    navigate('/admin');
                    break;
                case 'MANAGER':
                    navigate('/reports');
                    break;
                case 'TECHNICIAN':
                    navigate('/tickets');
                    break;
                default:
                    navigate('/dashboard');
                    break;
            }
        } catch (err) {
            const errorCode = err.response?.data?.error;
            if (errorCode === 'unauthorized_domain') {
                // Redirect to the Unauthorized page with SLIIT-specific messaging
                navigate('/unauthorized?reason=domain');
            } else {
                setError(
                    err.response?.data?.message ||
                    'Invalid email or password. Please try again.'
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 overflow-hidden bg-slate-50">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary-blue/10 rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-dark/10 rounded-full blur-[100px] opacity-60"></div>
            </div>

        <div className="w-full max-w-4xl relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 animate-in fade-in zoom-in duration-700">
            {/* Branding - Left Side */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm">
                <div className="bg-accent-gold p-3 rounded-[1.2rem] shadow-xl shadow-amber-900/10 mb-6 rotate-3 w-fit">
                    <Building2 className="text-primary-dark h-8 w-8 md:h-10 md:w-10" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary-dark tracking-tight leading-[1.1] mb-5">
                    SmartCampus <span className="text-accent-orange italic">Hub</span>
                </h1>
                <p className="text-slate-500 font-semibold tracking-widest text-[10px] uppercase mb-6">
                    Centralized Operations Operating System
                </p>
                <div className="hidden md:flex flex-col gap-3 text-slate-400 font-medium text-xs">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-gold"></div>
                        Real-time Ticket Tracking
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-orange"></div>
                        Resource Management
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary-blue"></div>
                        Advanced Analytics Dashboard
                    </div>
                </div>
            </div>

            {/* Login Card - Right Side */}
            <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl p-7 md:p-8 rounded-[2rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)] border border-white flex flex-col group">
                <div className="w-full text-center mb-6">
                    <h2 className="text-3xl font-bold text-primary-dark mb-1.5">Welcome Back</h2>
                    <p className="text-slate-400 font-medium text-xs leading-relaxed">
                        Log in to your institutional account to continue.
                    </p>
                </div>

                {/* Google Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-s shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 mb-5 group/btn"
                >
                    <div className="bg-white p-1 rounded-lg border border-slate-100">
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google Logo"
                            className="w-5 h-5"
                        />
                    </div>
                    Continue with Google
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="h-[1px] flex-grow bg-slate-100"></div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Or login with email</span>
                    <div className="h-[1px] flex-grow bg-slate-100"></div>
                </div>

                {/* Manual Login Form */}
                <form onSubmit={handleManualLogin} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl animate-in shake duration-300">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within/input:text-accent-orange transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@my.sliit.lk"
                                className="w-full pl-10 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl text-xs font-medium focus:ring-4 focus:ring-accent-gold/20 focus:border-accent-gold transition-all outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group/input">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within/input:text-accent-orange transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl text-xs font-medium focus:ring-4 focus:ring-accent-gold/20 focus:border-accent-gold transition-all outline-none"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-primary-dark text-white rounded-xl font-bold text-xs shadow-xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-1"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Log In to Hub
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-50 w-full flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-300 font-semibold text-[10px] uppercase tracking-[0.2em]">
                         <ShieldCheck size={14} className="text-accent-gold" /> End-to-End Secure
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Login;
