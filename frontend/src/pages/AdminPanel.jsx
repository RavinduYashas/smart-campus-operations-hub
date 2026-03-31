import React from 'react';
import { 
    ShieldAlert, 
    Settings, 
    Database, 
    Lock, 
    Terminal, 
    RefreshCcw,
    Activity,
    AlertTriangle
} from 'lucide-react';

/**
 * AdminPanel Component
 * 
 * Description: High-security control center for system administrators.
 * This panel allows for comprehensive user management, real-time security auditing,
 * system configuration overrides, and database health monitoring.
 * Features a high-contrast design to emphasize the importance of administrative actions.
 * 
 * Roles: Accessible to ADMIN only.
 */

const AdminPanel = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            {/* Admin Header with Gradient Accent */}
            <header className="mb-12 animate-in fade-in slide-in-from-top duration-700">
                <div className="flex items-center gap-4 mb-3">
                    <div className="bg-rose-600 p-3 rounded-2xl shadow-xl shadow-rose-200">
                        <ShieldAlert className="text-white h-8 w-8" />
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">Control Center</h1>
                </div>
                <p className="text-gray-500 text-xl font-medium max-w-2xl px-1 border-l-4 border-gray-200 ml-1">
                    Command and control system-wide parameters, security protocols, and operational workflows.
                </p>
            </header>

            {/* Quick Actions & System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <AdminCard 
                    title="User Access Control" 
                    desc="Manage authentication methods, session timeouts, and role mapping."
                    icon={<Lock className="w-8 h-8 text-indigo-500" />}
                    action="Manage Access"
                    variant="indigo"
                />
                <AdminCard 
                    title="Database Health" 
                    desc="Live monitoring of MongoDB clusters and indexing performance."
                    icon={<Database className="w-8 h-8 text-emerald-500" />}
                    action="Sync Clustered DB"
                    variant="emerald"
                />
                <AdminCard 
                    title="System Overrides" 
                    desc="Forced updates, maintenance mode toggle, and API throttling."
                    icon={<Settings className="w-8 h-8 text-amber-500" />}
                    action="Configure Overrides"
                    variant="amber"
                />
            </div>

            {/* Real-time Audit Log */}
            <div className="bg-gray-950 rounded-[2.5rem] shadow-2xl p-10 border border-gray-800 text-white overflow-hidden relative group">
                <div className="flex items-center justify-between mb-10 relative z-10">
                    <div>
                        <h2 className="text-3xl font-black mb-1 flex items-center gap-3">
                            <Terminal className="text-rose-500" /> Security Audit Stream
                        </h2>
                        <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Live activity logs</span>
                    </div>
                    <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all border border-white/5 flex items-center gap-2 font-bold">
                        <RefreshCcw className="w-4 h-4" /> Export Report
                    </button>
                </div>

                <div className="space-y-4 font-mono text-sm relative z-10">
                    <LogLine timestamp="10:24:05" type="SUCCESS" msg="OAuth2 callback processed successfully for user: ravin@example.com" />
                    <LogLine timestamp="10:22:12" type="WARNING" msg="Role violation detected: USER attempted access to /api/admin/config" />
                    <LogLine timestamp="10:20:45" type="CRITICAL" msg="MongoDB secondary cluster failover test completed." color="text-amber-400" />
                    <LogLine timestamp="10:18:30" type="INFO" msg="JWT token revocation list (CRL) successfully synchronized." />
                </div>

                {/* Abstract Security Overlay */}
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                    <div className="absolute top-10 -right-20 w-[500px] h-[500px] border-[40px] border-rose-500 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-20 left-10 w-[300px] h-[300px] bg-indigo-500 rounded-full blur-[100px]"></div>
                </div>
            </div>
        </div>
    );
};

const AdminCard = ({ title, desc, icon, action, variant }) => {
    const colors = {
        indigo: "hover:border-indigo-500 hover:shadow-indigo-100",
        emerald: "hover:border-emerald-500 hover:shadow-emerald-100",
        amber: "hover:border-amber-500 hover:shadow-amber-100"
    };

    return (
        <div className={`bg-white p-10 rounded-[2rem] shadow-lg shadow-gray-100 border border-gray-100 transition-all duration-500 ${colors[variant]}`}>
            <div className="mb-8">{icon}</div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">{desc}</p>
            <button className="w-full py-4 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-2xl font-black transition-all transform active:scale-95 border border-gray-100">
                {action}
            </button>
        </div>
    );
};

const LogLine = ({ timestamp, type, msg, color }) => (
    <div className={`p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-start gap-4 ${color || "text-gray-300"}`}>
        <span className="text-gray-500 font-black whitespace-nowrap">[{timestamp}]</span>
        <span className={`font-black tracking-tighter w-20 text-center rounded-md px-2 ${
            type === 'SUCCESS' ? 'text-emerald-400' : 
            type === 'WARNING' ? 'text-rose-400' : 
            type === 'CRITICAL' ? 'text-amber-400' : 'text-blue-400'
        }`}>{type}</span>
        <span className="font-medium">{msg}</span>
    </div>
);

export default AdminPanel;
