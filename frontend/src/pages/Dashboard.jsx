import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Users, 
    Ticket, 
    BarChart, 
    TrendingUp,
    Activity,
    Zap,
    ChevronRight,
    Search,
    Calendar,
    Bell,
    CheckCircle2,
    Clock,
    Building2,
    ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, lectureHalls: 0, openTickets: 0, activeResources: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/notifications/my-alerts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (Array.isArray(res.data)) {
                    setNotifications(res.data.slice(0, 4)); // Get top 4
                } else {
                    setNotifications([]);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setNotifications([]);
            }
        };

        const fetchStats = async () => {
            if (!user || user.role === 'USER') return;
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        const loadData = async () => {
            setLoading(true);
            await fetchNotifications();
            await fetchStats();
            setLoading(false);
        };

        loadData();
    }, [user]);

    // Role-based Quick Actions
    const getQuickActions = () => {
        if (!user) return [];
        switch(user.role) {
            case 'ADMIN':
                return [
                    { title: 'Manage Users', path: '/admin', icon: <Users />, color: 'bg-indigo-500' },
                    { title: 'System Alerts', path: '/notifications', icon: <ShieldAlert />, color: 'bg-rose-500' },
                    { title: 'Facility Approvals', path: '/admin/bookings', icon: <CheckCircle2 />, color: 'bg-emerald-500' }
                ];
            case 'MANAGER':
                return [
                    { title: 'Review Tickets', path: '/incident-tickets', icon: <Ticket />, color: 'bg-amber-500' },
                    { title: 'System Reports', path: '/reports', icon: <BarChart />, color: 'bg-blue-500' },
                ];
            case 'TECHNICIAN':
                return [
                    { title: 'My Tasks', path: '/technician/tasks', icon: <Activity />, color: 'bg-blue-500' },
                    { title: 'Service Tickets', path: '/tickets', icon: <Zap />, color: 'bg-amber-500' },
                ];
            default: // USER
                return [
                    { title: 'Book Facility', path: '/user/AssetCatalogue', icon: <Building2 />, color: 'bg-blue-500' },
                    { title: 'My Bookings', path: '/my-bookings', icon: <Calendar />, color: 'bg-emerald-500' },
                    { title: 'Report Incident', path: '/incident-tickets', icon: <Ticket />, color: 'bg-rose-500' }
                ];
        }
    };

    const quickActions = getQuickActions();

    return (
        <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto min-h-screen bg-slate-50/30">
            {/* Contextual Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-left duration-700">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-accent-gold rounded-full"></div>
                        <span className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Smart Campus OS</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-dark tracking-tight">
                        Welcome back, <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-amber-600">
                            {user?.name?.split(' ')[0] || 'User'}
                        </span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group lg:w-80 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-accent-orange transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search systems..." 
                            className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-accent-gold/10 focus:border-accent-gold transition-all shadow-sm"
                        />
                    </div>
                </div>
            </header>

            {/* Quick Actions Grid */}
            {quickActions.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                        {quickActions.map((action, idx) => (
                            <Link 
                                key={idx} 
                                to={action.path}
                                className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-4"
                            >
                                <div className={`p-3 rounded-xl text-white ${action.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {React.cloneElement(action.icon, { size: 24 })}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{action.title}</h3>
                                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mt-1">
                                        Access module <ChevronRight size={14} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Premium KPI Grid - Dynamic based on role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
                {user?.role === 'USER' ? (
                    <>
                        <StatCard icon={<Calendar className="w-6 h-6 text-emerald-600" />} title="My Bookings" value="2" trend="Active" positive={true} />
                        <StatCard icon={<Ticket className="w-6 h-6 text-rose-600" />} title="Open Tickets" value="0" trend="All clear" positive={true} />
                        <StatCard icon={<Bell className="w-6 h-6 text-amber-600" />} title="Unread Alerts" value={Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0} trend="Check Hub" positive={false} />
                        <StatCard icon={<Building2 className="w-6 h-6 text-blue-600" />} title="Campus Status" value="Online" trend="Operational" positive={true} />
                    </>
                ) : (
                    <>
                        <StatCard icon={<Users className="w-6 h-6 text-secondary-blue" />} title="Total Users" value={stats.totalUsers.toLocaleString()} trend="Active Base" positive={true} />
                        <StatCard icon={<Ticket className="w-6 h-6 text-rose-600" />} title="Open Tickets" value={stats.openTickets} trend="Pending Action" positive={false} />
                        <StatCard icon={<Building2 className="w-6 h-6 text-accent-orange" />} title="Lecture Halls" value={stats.lectureHalls} trend="Configured" positive={true} />
                        <StatCard icon={<Zap className="w-6 h-6 text-accent-gold" />} title="Total Assets" value={stats.activeResources} trend="Tracked" positive={true} />
                    </>
                )}
            </div>

            {/* Intelligence & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Insights Panel */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] border border-slate-100 p-8 md:p-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary-dark p-3 rounded-2xl shadow-xl shadow-slate-200">
                                <Bell className="text-accent-gold w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-primary-dark tracking-tight">Recent Alerts & Intelligence</h2>
                        </div>
                        <Link to="/notifications" className="text-xs font-bold text-accent-orange flex items-center gap-2 hover:bg-accent-gold/10 px-4 py-2.5 rounded-xl transition-all">
                           View All <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map(alert => (
                                <ActivityItem 
                                    key={alert.id}
                                    label={alert.title || "Notification"} 
                                    desc={alert.message || ""} 
                                    time={alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Now"} 
                                    type={alert.title && alert.title.toLowerCase().includes('incident') ? 'WARNING' : 'INFO'} 
                                    isNew={!alert.read}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
                                <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h3 className="font-bold text-slate-700">All caught up!</h3>
                                <p className="text-sm text-slate-500">You have no recent alerts or intelligence updates.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Efficiency Widget */}
                <div className="lg:col-span-4 bg-primary-dark rounded-[2.5rem] shadow-2xl p-10 text-white flex flex-col justify-between overflow-hidden relative group">
                    <div className="relative z-10 space-y-6">
                        <div className="p-4 bg-white/10 rounded-2xl w-max group-hover:rotate-12 transition-transform duration-500">
                            <TrendingUp className="w-10 h-10 text-accent-gold" />
                        </div>
                        <div className="space-y-2">
                             <h3 className="text-3xl font-bold tracking-tighter leading-none">Smart Efficiency</h3>
                             <p className="text-slate-400 font-medium leading-relaxed">System-wide resource allocation is currently 88% optimized.</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                            <span className="text-[10px] font-bold uppercase text-accent-gold block mb-2 tracking-[0.2em]">Next Suggested Action</span>
                            <p className="text-sm font-semibold text-slate-200">Shift chiller loads in Sector 4 by 45 minutes to avoid peak tariff.</p>
                        </div>
                        <button className="w-full bg-accent-gold text-primary-dark py-4 rounded-2xl font-bold shadow-[0_15px_30px_-5px_rgba(255,193,37,0.2)] hover:bg-amber-400 transition-all active:scale-95">Apply Optimization</button>
                    </div>
                    {/* Background visual element */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary-blue opacity-20 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
                </div>
            </div>
        </div>
    );
};

function StatCard({ icon, title, value, trend, positive }) {
    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_40px_-5px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 hover:-translate-y-1.5 group">
            <div className="flex items-center justify-between mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500">{icon}</div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {trend}
                </div>
            </div>
            <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{title}</span>
                <div className="text-4xl lg:text-5xl font-bold text-primary-dark tracking-tighter">{value}</div>
            </div>
        </div>
    );
}

function ActivityItem({ label, desc, time, type, isNew }) {
    return (
        <div className={`flex items-start gap-5 p-5 rounded-3xl transition-all border ${isNew ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-slate-100 hover:border-slate-200'} group cursor-default`}>
            <div className={`mt-1.5 h-3 w-3 rounded-full shrink-0 ring-4 ${
                type === 'SUCCESS' ? 'bg-emerald-500 ring-emerald-50' : 
                type === 'WARNING' ? 'bg-rose-500 ring-rose-50' : 'bg-blue-500 ring-blue-50'
            }`}></div>
            <div className="space-y-1 flex-grow">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-primary-dark tracking-tight text-lg leading-none flex items-center gap-2">
                        {label}
                        {isNew && <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>}
                    </h4>
                    <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                        <Clock size={12} /> {time}
                    </span>
                </div>
                <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-2xl">{desc}</p>
            </div>
        </div>
    );
}

export default Dashboard;
