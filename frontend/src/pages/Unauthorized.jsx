import React from 'react';
import { 
    ShieldAlert, 
    ArrowLeft, 
    Lock, 
    MessageCircle, 
    Home,
    AlertCircle
} from 'lucide-react';

/**
 * Unauthorized Component
 * 
 * Description: The access denied view for users attempting to enter areas
 * of the system for which they are not authorized. It features a stark, 
 * alert-driven design to communicate level-restricted security boundaries.
 * 
 * Roles: Displayed to any user who fails the ProtectedRoute role check.
 */

const Unauthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] p-8 text-center animate-in zoom-in duration-700 bg-slate-50/30">
            {/* Visual Warning Section */}
            <div className="relative mb-12">
                <div className="bg-primary-dark p-12 rounded-full border-2 border-accent-gold/20 shadow-2xl shadow-slate-200 animate-pulse-slow">
                    <ShieldAlert className="w-24 h-24 text-accent-gold" />
                </div>
                <div className="absolute -top-4 -right-4 bg-accent-orange p-3 rounded-2xl shadow-lg transform rotate-12">
                     <Lock className="w-8 h-8 text-white" />
                </div>
            </div>

            {/* Error Message */}
            <h1 className="text-6xl font-black text-primary-dark mb-6 tracking-tight">Access Restricted</h1>
            <p className="text-slate-500 text-2xl max-w-xl mb-12 font-medium leading-relaxed">
                Your current credentials do not grant access to this high-security sector. 
                Please contact the <span className="text-accent-orange font-black">System Administrator</span> if you believe this is an error.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-6 justify-center">
                <button 
                   onClick={() => window.location.href = '/dashboard'}
                   className="bg-primary-dark text-white px-10 py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-slate-300 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
                >
                    <Home className="w-5 h-5" /> Back to Safety
                </button>
                <button 
                   className="bg-white text-primary-dark border-2 border-slate-100 px-10 py-5 rounded-2xl font-black text-lg hover:shadow-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-3"
                >
                    <MessageCircle className="w-5 h-5" /> Request Access
                </button>
            </div>

            {/* Security Note */}
            <div className="mt-16 flex items-center gap-3 bg-white px-8 py-4 rounded-3xl border border-slate-100 shadow-sm">
                <AlertCircle className="w-5 h-5 text-accent-orange" />
                <span className="text-slate-400 font-bold text-sm tracking-wide">
                    THIS ATTEMPT HAS BEEN LOGGED IN THE AUDIT STREAM.
                </span>
            </div>
        </div>
    );
};

export default Unauthorized;
