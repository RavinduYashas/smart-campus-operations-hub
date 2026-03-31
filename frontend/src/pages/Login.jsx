import { LogIn, ShieldCheck, Building2 } from 'lucide-react';

const Login = () => {
    const handleGoogleLogin = () => {
        // Redirect to the Spring Boot OAuth2 endpoint
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 overflow-hidden bg-slate-50">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-60"></div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
                {/* Branding Above Card */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="bg-blue-600 p-3.5 rounded-[1.5rem] shadow-2xl shadow-blue-200 mb-6 rotate-3">
                        <Building2 className="text-white h-8 w-8" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">SmartCampus Hub</h1>
                    <p className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">Centralized Operations OS</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white flex flex-col items-center group">
                    <div className="w-full text-center mb-10">
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Welcome Back</h2>
                        <p className="text-slate-400 font-medium text-sm px-4 leading-relaxed">
                            Access the mission control center with your institutional Google account.
                        </p>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-4 py-5 px-8 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all active:scale-95 group/btn"
                    >
                        <div className="bg-white p-1.5 rounded-lg shadow-sm">
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google Logo"
                                className="w-5 h-5"
                            />
                        </div>
                        Secure Sign In with Google
                    </button>

                    <div className="mt-10 pt-8 border-t border-slate-50 w-full flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-300 font-bold text-[10px] uppercase tracking-[0.2em]">
                             <ShieldCheck size={14} className="text-blue-500" /> End-to-End Secure
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold leading-relaxed text-center opacity-60">
                            By continuing, you agree to the Smart Campus <br />
                            Operational Protocols and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
