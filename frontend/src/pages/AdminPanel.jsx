import { 
    ShieldAlert, 
    Settings, 
    Database, 
    Lock, 
    Terminal, 
    RefreshCcw,
    Activity,
    AlertTriangle,
    ChevronRight,
    Users
} from 'lucide-react';

const AdminPanel = () => {
    return (
        <div className="p-6 md:p-10 lg:p-16 max-w-[1600px] mx-auto min-h-screen">
            {/* Admin Header */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top duration-700">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-rose-600 p-4 rounded-3xl shadow-2xl shadow-rose-200 -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <ShieldAlert className="text-white h-8 w-8" />
                        </div>
                        <div>
                             <span className="text-rose-600 font-black text-[10px] uppercase tracking-[0.4em] block mb-1">Restricted Zone</span>
                             <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Mission Control</h1>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2.5 shadow-xl shadow-slate-200">
                        <Activity size={16} /> Global Health
                    </button>
                </div>
            </header>

            {/* Admin Core Functions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <AdminCard 
                    title="Access Control" 
                    desc="Manage authentication layers, session TTLs, and global role mapping configurations."
                    icon={<Lock size={28} className="text-indigo-600" />}
                    action="Configure Security"
                    accent="bg-indigo-50"
                />
                <AdminCard 
                    title="Persistence Layer" 
                    desc="Real-time monitoring of MongoDB cluster clusters, replication health, and indexing."
                    icon={<Database size={28} className="text-emerald-600" />}
                    action="Monitor Data"
                    accent="bg-emerald-50"
                />
                <AdminCard 
                    title="System Params" 
                    desc="Override API throttling, maintenance mode toggle, and service discovery routing."
                    icon={<Settings size={28} className="text-amber-600" />}
                    action="Modify Overrides"
                    accent="bg-amber-50"
                />
            </div>

            {/* Audit & Intelligence Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Audit Stream */}
                <div className="lg:col-span-8 bg-slate-950 rounded-[3rem] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] p-8 md:p-12 text-slate-300 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
                                <Terminal className="text-rose-500" /> Security Audit
                            </h2>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest px-1">Raw encrypted telemetry</p>
                        </div>
                        <button className="bg-white/5 hover:bg-white/10 px-5 py-3 rounded-2xl transition-all border border-white/5 flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-slate-100">
                            <RefreshCcw size={14} /> Clear Stream
                        </button>
                    </div>

                    <div className="space-y-3 font-mono text-[13px] relative z-10">
                        <LogEntry time="10:42:15" level="OK" msg="Cluster synchronizer: building_g-node-01 successfully replicated metadata." />
                        <LogEntry time="10:40:02" level="WARN" msg="Unauthorized ingress attempt blocked: remote_ip: 42.102.34.x via /api/legacy" />
                        <LogEntry time="10:38:45" level="ERR" msg="Cache invalidation failed for regional sector S-04. Retrying in 300ms..." color="text-rose-400" />
                        <LogEntry time="10:35:12" level="INFO" msg="OAuth2 provider configuration updated by ADMIN_ROOT [ravin@smart.campus]" />
                    </div>

                    {/* Visual Flare */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-rose-500/10 to-transparent pointer-events-none"></div>
                </div>

                {/* User Stats/Shortcuts */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                         <div className="flex items-center gap-4">
                            <div className="bg-blue-50 p-4 rounded-3xl">
                                <Users size={32} className="text-blue-600" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User Management</span>
                                <h3 className="text-2xl font-black text-slate-900 leading-none">Active Staff</h3>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <QuickStat label="Admins" val="04" />
                            <QuickStat label="Technicians" val="12" />
                            <QuickStat label="Managers" val="08" />
                            <QuickStat label="Standard" val="24k" />
                         </div>

                         <button className="w-full py-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl font-black transition-all group flex items-center justify-center gap-2">
                             Full User Directory <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminCard = ({ title, desc, icon, action, accent }) => (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 hover:-translate-y-2 group">
        <div className={`${accent} p-5 rounded-3xl w-max mb-8 group-hover:scale-110 transition-transform duration-500`}>{icon}</div>
        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-none">{title}</h3>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed text-sm">{desc}</p>
        <button className="flex items-center gap-3 text-slate-900 font-black text-sm uppercase tracking-wider group/btn">
            {action} <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
        </button>
    </div>
);

const LogEntry = ({ time, level, msg, color }) => (
    <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-start gap-5 ${color || "text-slate-400"}`}>
        <span className="opacity-40 font-black shrink-0">[{time}]</span>
        <span className={`font-black shrink-0 w-12 ${
            level === 'OK' ? 'text-emerald-500' : 
            level === 'WARN' ? 'text-amber-500' : 'text-rose-500'
        }`}>{level}</span>
        <span className="font-medium text-slate-300 break-all">{msg}</span>
    </div>
);

const QuickStat = ({ label, val }) => (
    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
        <div className="text-xl font-black text-slate-900 leading-none mb-1">{val}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase">{label}</div>
    </div>
);

export default AdminPanel;
