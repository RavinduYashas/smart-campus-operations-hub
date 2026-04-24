import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
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
    Users,
    CalendarDays,
    Package,
    Ticket,
    UserPlus
} from 'lucide-react';

const AdminPanel = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        department: 'electrical',
        password: 'Password123!' // Default password for new staff
    });
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateAccount = async () => {
        if (!formData.email.endsWith('@sliit.lk') && !formData.email.endsWith('@my.sliit.lk')) {
            toast.error("Valid SLIIT email required");
            return;
        }

        setIsCreating(true);
        try {
            await axios.post('/api/auth/register', {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                password: formData.password,
                role: 'TECHNICIAN'
            });
            toast.success(`Account created for ${formData.firstName}!`);
            setFormData({ firstName: '', lastName: '', email: '', department: 'electrical', password: 'Password123!' });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create account");
        } finally {
            setIsCreating(false);
        }
    };
    return (
        <div className="p-6 md:p-10 lg:p-16 max-w-[1600px] mx-auto min-h-screen bg-slate-50/30">
            {/* Admin Header */}
            <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8 animate-in fade-in slide-in-from-top duration-700">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary-dark p-4 rounded-3xl shadow-2xl shadow-slate-200 -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <ShieldAlert className="text-accent-gold h-8 w-8" />
                        </div>
                        <div>
                             <span className="text-accent-orange font-bold text-[10px] uppercase tracking-[0.4em] block mb-1">Restricted Zone</span>
                             <h1 className="text-4xl md:text-6xl font-bold text-primary-dark tracking-tight">Mission Control</h1>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <Link to="/admin/bookings" className="px-5 py-3.5 bg-white border border-slate-200 text-primary-dark hover:bg-slate-50 hover:-translate-y-1 transition-all rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2.5">
                        <CalendarDays size={16} className="text-secondary-blue" /> Bookings
                    </Link>
                    <Link to="/admin/assets" className="px-5 py-3.5 bg-white border border-slate-200 text-primary-dark hover:bg-slate-50 hover:-translate-y-1 transition-all rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2.5">
                        <Package size={16} className="text-secondary-blue" /> Assets
                    </Link>
                    <Link to="/admin/tickets" className="px-5 py-3.5 bg-white border border-slate-200 text-primary-dark hover:bg-slate-50 hover:-translate-y-1 transition-all rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2.5">
                        <Ticket size={16} className="text-secondary-blue" /> Tickets
                    </Link>
                    <button className="px-6 py-3.5 bg-primary-dark text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2.5 shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all">
                        <Activity size={16} className="text-accent-gold" /> Global Health
                    </button>
                </div>
            </header>

            {/* Admin Core Functions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <AdminCard 
                    title="Access Control" 
                    desc="Manage authentication layers, session TTLs, and global role mapping configurations."
                    icon={<Lock size={28} className="text-secondary-blue" />}
                    action="Configure Security"
                    accent="bg-secondary-blue/10"
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
                    icon={<Settings size={28} className="text-accent-gold" />}
                    action="Modify Overrides"
                    accent="bg-accent-gold/10"
                />
            </div>

            {/* Audit & Intelligence Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Audit Stream */}
                <div className="lg:col-span-8 bg-primary-dark rounded-[3rem] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] p-8 md:p-12 text-slate-300 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-4">
                                <Terminal className="text-accent-gold" /> Security Audit
                            </h2>
                            <p className="text-slate-500 font-semibold text-xs uppercase tracking-widest px-1">Raw encrypted telemetry</p>
                        </div>
                        <button className="bg-white/5 hover:bg-white/10 px-5 py-3 rounded-2xl transition-all border border-white/5 flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest text-slate-100">
                            <RefreshCcw size={14} /> Clear Stream
                        </button>
                    </div>

                    <div className="space-y-3 font-mono text-[13px] relative z-10">
                        <LogEntry time="10:42:15" level="OK" msg="Cluster synchronizer: building_g-node-01 successfully replicated metadata." />
                        <LogEntry time="10:40:02" level="WARN" msg="Unauthorized ingress attempt blocked: remote_ip: 42.102.34.x via /api/legacy" />
                        <LogEntry time="10:38:45" level="ERR" msg="Cache invalidation failed for regional sector S-04. Retrying in 300ms..." color="text-accent-orange" />
                        <LogEntry time="10:35:12" level="INFO" msg="OAuth2 provider configuration updated by ADMIN_ROOT [ravin@smart.campus]" />
                    </div>

                    {/* Visual Flare */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent-gold/10 to-transparent pointer-events-none"></div>
                </div>

                {/* User Stats/Shortcuts */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                         <div className="flex items-center gap-4">
                            <div className="bg-accent-gold/10 p-4 rounded-3xl">
                                <Users size={32} className="text-accent-orange" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Management</span>
                                <h3 className="text-2xl font-bold text-primary-dark leading-none">Active Staff</h3>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <QuickStat label="Admins" val="04" />
                            <QuickStat label="Technicians" val="12" />
                            <QuickStat label="Managers" val="08" />
                            <QuickStat label="Standard" val="24k" />
                         </div>

                         <button className="w-full py-4 bg-slate-50 hover:bg-primary-dark hover:text-white rounded-2xl font-bold transition-all group flex items-center justify-center gap-2">
                             Full User Directory <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                         </button>
                    </div>
                </div>
            </div>

            {/* Admin Management Section: Add Technician */}
            <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-4 mb-8">
                      <div className="bg-secondary-blue/10 p-4 rounded-3xl">
                           <UserPlus size={32} className="text-secondary-blue" />
                      </div>
                      <div>
                           <h2 className="text-3xl font-bold text-primary-dark">Provision Staff Account</h2>
                           <p className="text-slate-500 font-medium text-sm">Register new technicians and assign system privileges.</p>
                      </div>
                 </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                      <div className="space-y-2">
                           <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">First Name</label>
                           <input 
                                type="text" 
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                placeholder="e.g. John" 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-secondary-blue focus:ring-4 focus:ring-secondary-blue/10 transition-all outline-none font-medium text-slate-700" 
                           />
                      </div>
                      <div className="space-y-2">
                           <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Last Name</label>
                           <input 
                                type="text" 
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                placeholder="e.g. Doe" 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-secondary-blue focus:ring-4 focus:ring-secondary-blue/10 transition-all outline-none font-medium text-slate-700" 
                           />
                      </div>
                      <div className="space-y-2">
                           <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">SLIIT Email</label>
                           <input 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="e.g. tech@sliit.lk" 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-secondary-blue focus:ring-4 focus:ring-secondary-blue/10 transition-all outline-none font-medium text-slate-700" 
                           />
                      </div>
                      <button 
                        onClick={handleCreateAccount}
                        disabled={isCreating}
                        className="h-[56px] w-full bg-secondary-blue text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-secondary-blue/20 hover:bg-theme-blue-dark transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                          {isCreating ? "Processing..." : "Create Account"}
                      </button>
                 </div>
            </div>
        </div>
    );
};


const AdminCard = ({ title, desc, icon, action, accent }) => (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 hover:-translate-y-2 group">
        <div className={`${accent} p-5 rounded-3xl w-max mb-8 group-hover:scale-110 transition-transform duration-500`}>{icon}</div>
        <h3 className="text-2xl font-bold text-primary-dark mb-4 tracking-tight leading-none">{title}</h3>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed text-sm">{desc}</p>
        <button className="flex items-center gap-3 text-primary-dark font-bold text-sm uppercase tracking-wider group/btn hover:text-accent-orange transition-colors">
            {action} <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
        </button>
    </div>
);

const LogEntry = ({ time, level, msg, color }) => (
    <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-start gap-5 ${color || "text-slate-400"}`}>
        <span className="opacity-40 font-bold shrink-0">[{time}]</span>
        <span className={`font-bold shrink-0 w-12 ${
            level === 'OK' ? 'text-emerald-500' : 
            level === 'WARN' ? 'text-accent-gold' : 'text-accent-orange'
        }`}>{level}</span>
        <span className="font-medium text-slate-300 break-all">{msg}</span>
    </div>
);

const QuickStat = ({ label, val }) => (
    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
        <div className="text-xl font-bold text-primary-dark leading-none mb-1">{val}</div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase">{label}</div>
    </div>
);

export default AdminPanel;
