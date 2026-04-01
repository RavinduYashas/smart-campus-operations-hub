import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
    ShieldAlert, 
    Lock, 
    MessageCircle, 
    Home,
    AlertCircle,
    MailX
} from 'lucide-react';

/**
 * Unauthorized Component
 *
 * Handles two distinct unauthorized scenarios:
 *  1. Domain rejection – user tried to log in with a non-SLIIT Google account.
 *     Detected via ?reason=domain in the query string (set by the backend failure handler
 *     or the frontend login page when the manual-login API returns 'unauthorized_domain').
 *  2. Role restriction – user is authenticated but lacks the required role for a route.
 *     Default view when no ?reason param is present.
 */
const Unauthorized = () => {
    const location = useLocation();
    const params   = new URLSearchParams(location.search);
    const reason   = params.get('reason'); // 'domain' | null

    const isDomainRejection = reason === 'domain';

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] p-8 text-center animate-in zoom-in duration-700 bg-slate-50/30">

            {/* Visual Warning Section */}
            <div className="relative mb-12">
                <div className="bg-primary-dark p-12 rounded-full border-2 border-accent-gold/20 shadow-2xl shadow-slate-200 animate-pulse-slow">
                    {isDomainRejection
                        ? <MailX className="w-24 h-24 text-accent-gold" />
                        : <ShieldAlert className="w-24 h-24 text-accent-gold" />
                    }
                </div>
                <div className="absolute -top-4 -right-4 bg-accent-orange p-3 rounded-2xl shadow-lg transform rotate-12">
                    <Lock className="w-8 h-8 text-white" />
                </div>
            </div>

            {/* Error Message */}
            {isDomainRejection ? (
                <>
                    <h1 className="text-6xl font-bold text-primary-dark mb-6 tracking-tight">
                        Domain Not Allowed
                    </h1>
                    <p className="text-slate-500 text-2xl max-w-xl mb-4 font-medium leading-relaxed">
                        Smart Campus is exclusively available to{' '}
                        <span className="text-accent-orange font-bold">SLIIT</span> members.
                    </p>
                    <p className="text-slate-400 text-lg max-w-lg mb-12 leading-relaxed">
                        Please sign in with your official{' '}
                        <code className="bg-slate-100 text-primary-dark px-2 py-0.5 rounded font-semibold">@my.sliit.lk</code>
                        {' '}or{' '}
                        <code className="bg-slate-100 text-primary-dark px-2 py-0.5 rounded font-semibold">@sliit.lk</code>
                        {' '}Google account.
                    </p>
                </>
            ) : (
                <>
                    <h1 className="text-6xl font-bold text-primary-dark mb-6 tracking-tight">
                        Access Restricted
                    </h1>
                    <p className="text-slate-500 text-2xl max-w-xl mb-12 font-medium leading-relaxed">
                        Your current credentials do not grant access to this high-security sector.
                        Please contact the{' '}
                        <span className="text-accent-orange font-bold">System Administrator</span>
                        {' '}if you believe this is an error.
                    </p>
                </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-6 justify-center">
                <button
                    onClick={() => {
                        if (window.opener) {
                            window.close();
                        } else {
                            window.location.href = '/login';
                        }
                    }}
                    className="bg-primary-dark text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-slate-300 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
                >
                    <Home className="w-5 h-5" />
                    {isDomainRejection ? (window.opener ? 'Close Window' : 'Back to Login') : 'Back to Safety'}
                </button>
                <button
                    className="bg-white text-primary-dark border-2 border-slate-100 px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-3"
                >
                    <MessageCircle className="w-5 h-5" /> Request Access
                </button>
            </div>

            {/* Security Note */}
            <div className="mt-16 flex items-center gap-3 bg-white px-8 py-4 rounded-3xl border border-slate-100 shadow-sm">
                <AlertCircle className="w-5 h-5 text-accent-orange" />
                <span className="text-slate-400 font-semibold text-sm tracking-wide">
                    THIS ATTEMPT HAS BEEN LOGGED IN THE AUDIT STREAM.
                </span>
            </div>
        </div>
    );
};

export default Unauthorized;
