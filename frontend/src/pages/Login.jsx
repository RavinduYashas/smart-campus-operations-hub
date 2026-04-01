import React, { useState } from 'react';
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

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
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

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
                {/* Branding Above Card */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="bg-accent-gold p-3.5 rounded-[1.5rem] shadow-2xl shadow-amber-900/20 mb-6 rotate-3">
                        <Building2 className="text-primary-dark h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary-dark tracking-tight leading-none mb-3">SmartCampus Hub</h1>
                    <p className="text-slate-500 font-semibold tracking-widest text-[10px] uppercase">Centralized Operations OS</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white flex flex-col group">
                    <div className="w-full text-center mb-8">
                        <h2 className="text-2xl font-bold text-primary-dark mb-2">Welcome Back</h2>
                        <p className="text-slate-400 font-medium text-sm leading-relaxed">
                            Log in to your institutional account to continue.
                        </p>
                    </div>

                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-4 py-4 px-8 bg-white border border-slate-200 text-slate-700 rounded-2xl font-semibold text-sm shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 mb-6 group/btn"
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
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within/input:text-accent-orange transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@my.sliit.lk"
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-accent-gold/20 focus:border-accent-gold transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within/input:text-accent-orange transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-accent-gold/20 focus:border-accent-gold transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 py-4 px-8 bg-primary-dark text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
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
