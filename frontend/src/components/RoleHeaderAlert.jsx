import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, Wrench, BarChart2, Bell } from 'lucide-react';

const RoleHeaderAlert = () => {
    const { user } = useAuth();

    if (!user) return null;

    const getRoleContent = () => {
        switch (user.role) {
            case 'ADMIN':
                return {
                    label: 'System Control',
                    message: 'Pending resource approvals and system health reports require your attention.',
                    icon: <AlertCircle className="text-amber-500" size={18} />,
                    bgColor: 'bg-amber-50',
                    borderColor: 'border-amber-100',
                    textColor: 'text-amber-900'
                };
            case 'MANAGER':
                return {
                    label: 'Operations Review',
                    message: 'New resource utilization reports are ready for review.',
                    icon: <BarChart2 className="text-blue-500" size={18} />,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-100',
                    textColor: 'text-blue-900'
                };
            case 'TECHNICIAN':
                return {
                    label: 'Service Task',
                    message: 'New high-priority incident tickets assigned to your queue.',
                    icon: <Wrench className="text-rose-500" size={18} />,
                    bgColor: 'bg-rose-50',
                    borderColor: 'border-rose-100',
                    textColor: 'text-rose-900'
                };
            case 'USER':
                return {
                    label: 'Campus Update',
                    message: 'Check your booking status and active fault reports in the notification hub.',
                    icon: <CheckCircle2 className="text-emerald-500" size={18} />,
                    bgColor: 'bg-emerald-50',
                    borderColor: 'border-emerald-100',
                    textColor: 'text-emerald-900'
                };
            default:
                return null;
        }
    };

    const content = getRoleContent();
    if (!content) return null;

    return (
        <div className={`w-full ${content.bgColor} border-b ${content.borderColor} py-3 px-6 animate-in slide-in-from-top duration-500`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="shrink-0">
                        {content.icon}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/50 border border-current/10 ${content.textColor}`}>
                            {content.label}
                        </span>
                        <p className={`text-sm font-semibold ${content.textColor} truncate md:whitespace-normal`}>
                            {content.message}
                        </p>
                    </div>
                </div>
                <button className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${content.textColor} hover:opacity-70 transition-opacity shrink-0`}>
                    View Details
                    <Bell size={14} />
                </button>
            </div>
        </div>
    );
};

export default RoleHeaderAlert;
