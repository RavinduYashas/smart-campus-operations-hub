import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
    ShieldAlert, 
    Users,
    CalendarDays,
    Package,
    Ticket,
    UserPlus,
    ChevronRight,
    Activity,
    Building2,
    Bell,
    TrendingUp,
    CheckCircle,
    Clock,
    AlertTriangle,
    XCircle,
    Mail,
    Shield,
    Wrench,
    BarChart2,
    User,
    Loader2,
    Eye
} from 'lucide-react';

const AdminPanel = () => {
    const [stats, setStats] = useState({ totalUsers: 0, lectureHalls: 0, openTickets: 0, activeResources: 0 });
    const [roleCounts, setRoleCounts] = useState({ ADMIN: 0, MANAGER: 0, TECHNICIAN: 0, USER: 0 });
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        department: 'electrical',
        password: 'Password123!'
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const [statsRes, usersRes] = await Promise.allSettled([
                axios.get('/api/admin/stats', { headers }),
                axios.get('/api/admin/users', { headers })
            ]);

            if (statsRes.status === 'fulfilled') {
                setStats(statsRes.value.data);
            }

            if (usersRes.status === 'fulfilled') {
                const users = usersRes.value.data;
                // Calculate role counts
                const counts = { ADMIN: 0, MANAGER: 0, TECHNICIAN: 0, USER: 0 };
                users.forEach(u => { if (counts[u.role] !== undefined) counts[u.role]++; });
                setRoleCounts(counts);
                // Get 5 most recent users
                const sorted = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRecentUsers(sorted.slice(0, 5));
            }

            // Try to fetch tickets
            try {
                const ticketsRes = await axios.get('/api/tickets', { headers });
                const tickets = ticketsRes.data || [];
                setRecentTickets(tickets.slice(0, 5));
            } catch {
                setRecentTickets([]);
            }
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

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
            fetchDashboardData(); // Refresh data
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create account");
        } finally {
            setIsCreating(false);
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'ADMIN': return <Shield size={14} className="text-amber-500" />;
            case 'MANAGER': return <BarChart2 size={14} className="text-blue-500" />;
            case 'TECHNICIAN': return <Wrench size={14} className="text-rose-500" />;
            default: return <User size={14} className="text-emerald-500" />;
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'MANAGER': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'TECHNICIAN': return 'bg-rose-50 text-rose-700 border-rose-200';
            default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        }
    };

    const getTicketStatusBadge = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Assigned': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'In Progress': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Closed': return 'bg-slate-50 text-slate-600 border-slate-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    const getTicketStatusIcon = (status) => {
        switch (status) {
            case 'Open': return <AlertTriangle size={14} className="text-blue-500" />;
            case 'Assigned': return <Clock size={14} className="text-amber-500" />;
            case 'In Progress': return <Activity size={14} className="text-purple-500" />;
            case 'Resolved': return <CheckCircle size={14} className="text-emerald-500" />;
            case 'Closed': return <XCircle size={14} className="text-slate-400" />;
            default: return <Clock size={14} className="text-slate-400" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-primary-dark" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto min-h-screen bg-slate-50/30">
            {/* Admin Header */}
            <header className="mb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6 animate-in fade-in slide-in-from-top duration-700">
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary-dark p-3.5 rounded-2xl shadow-2xl shadow-slate-200">
                            <ShieldAlert className="text-accent-gold h-7 w-7" />
                        </div>
                        <div>
                             <span className="text-accent-orange font-bold text-[10px] uppercase tracking-[0.4em] block mb-0.5">Admin Dashboard</span>
                             <h1 className="text-3xl md:text-4xl font-bold text-primary-dark tracking-tight">System Overview</h1>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2.5">
                    <Link to="/admin/users" className="px-4 py-3 bg-white border border-slate-200 text-primary-dark hover:bg-slate-50 hover:-translate-y-0.5 transition-all rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <Users size={15} className="text-secondary-blue" /> Users
                    </Link>
                    <Link to="/admin/bookings" className="px-4 py-3 bg-white border border-slate-200 text-primary-dark hover:bg-slate-50 hover:-translate-y-0.5 transition-all rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <CalendarDays size={15} className="text-secondary-blue" /> Bookings
                    </Link>
                    <Link to="/admin/assets" className="px-4 py-3 bg-white border border-slate-200 text-primary-dark hover:bg-slate-50 hover:-translate-y-0.5 transition-all rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <Package size={15} className="text-secondary-blue" /> Assets
                    </Link>
                    <Link to="/admin/tickets" className="px-4 py-3 bg-white border border-slate-200 text-primary-dark hover:bg-slate-50 hover:-translate-y-0.5 transition-all rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <Ticket size={15} className="text-secondary-blue" /> Tickets
                    </Link>
                    <Link to="/notifications" className="px-4 py-3 bg-primary-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-200 hover:-translate-y-0.5 transition-all">
                        <Bell size={15} className="text-accent-gold" /> Alerts
                    </Link>
                </div>
            </header>

            {/* Live Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard 
                    icon={<Users className="w-5 h-5 text-blue-600" />} 
                    title="Total Users" 
                    value={stats.totalUsers} 
                    subtitle={`${roleCounts.ADMIN} admins, ${roleCounts.TECHNICIAN} techs`}
                    color="bg-blue-50 border-blue-100"
                />
                <StatCard 
                    icon={<Building2 className="w-5 h-5 text-emerald-600" />} 
                    title="Lecture Halls" 
                    value={stats.lectureHalls} 
                    subtitle="Configured resources"
                    color="bg-emerald-50 border-emerald-100"
                />
                <StatCard 
                    icon={<Ticket className="w-5 h-5 text-amber-600" />} 
                    title="Open Tickets" 
                    value={stats.openTickets} 
                    subtitle="Pending resolution"
                    color="bg-amber-50 border-amber-100"
                />
                <StatCard 
                    icon={<Package className="w-5 h-5 text-purple-600" />} 
                    title="Total Assets" 
                    value={stats.activeResources} 
                    subtitle="All tracked resources"
                    color="bg-purple-50 border-purple-100"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                {/* Recent Users */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                                <Users size={18} className="text-blue-600" />
                            </div>
                            <h2 className="font-bold text-primary-dark text-lg">Recent Users</h2>
                        </div>
                        <Link to="/admin/users" className="text-xs font-bold text-accent-orange flex items-center gap-1 hover:underline">
                            View All <ChevronRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {recentUsers.length > 0 ? recentUsers.map((user, idx) => (
                            <div key={user.id || idx} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                        {getRoleIcon(user.role)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800">{user.name}</p>
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Mail size={10} /> {user.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(user.role)}`}>
                                        {user.role}
                                    </span>
                                    <span className="text-[10px] text-slate-400 hidden sm:block">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="px-6 py-10 text-center text-slate-400 text-sm">No users found</div>
                        )}
                    </div>
                </div>

                {/* Role Distribution + Quick Stats */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Role Distribution */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-accent-gold/10 p-2 rounded-lg">
                                <TrendingUp size={18} className="text-accent-orange" />
                            </div>
                            <h2 className="font-bold text-primary-dark">User Distribution</h2>
                        </div>
                        <div className="space-y-3">
                            <RoleBar label="Students" count={roleCounts.USER} total={stats.totalUsers} color="bg-emerald-500" />
                            <RoleBar label="Technicians" count={roleCounts.TECHNICIAN} total={stats.totalUsers} color="bg-rose-500" />
                            <RoleBar label="Managers" count={roleCounts.MANAGER} total={stats.totalUsers} color="bg-blue-500" />
                            <RoleBar label="Admins" count={roleCounts.ADMIN} total={stats.totalUsers} color="bg-amber-500" />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-primary-dark to-slate-800 p-6 rounded-2xl text-white">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Activity size={18} className="text-accent-gold" /> Quick Actions
                        </h3>
                        <div className="space-y-2.5">
                            <Link to="/admin/users" className="w-full flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/15 rounded-xl transition-all group">
                                <span className="text-sm font-medium flex items-center gap-2"><Users size={14} className="text-accent-gold" /> Manage All Users</span>
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/admin/assets" className="w-full flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/15 rounded-xl transition-all group">
                                <span className="text-sm font-medium flex items-center gap-2"><Package size={14} className="text-accent-gold" /> Manage Resources</span>
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/admin/tickets" className="w-full flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/15 rounded-xl transition-all group">
                                <span className="text-sm font-medium flex items-center gap-2"><Ticket size={14} className="text-accent-gold" /> View All Tickets</span>
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/admin/bookings" className="w-full flex items-center justify-between px-4 py-3 bg-white/10 hover:bg-white/15 rounded-xl transition-all group">
                                <span className="text-sm font-medium flex items-center gap-2"><CalendarDays size={14} className="text-accent-gold" /> Booking Approvals</span>
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Tickets */}
            {recentTickets.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-50 p-2 rounded-lg">
                                <Ticket size={18} className="text-amber-600" />
                            </div>
                            <h2 className="font-bold text-primary-dark text-lg">Recent Tickets</h2>
                        </div>
                        <Link to="/admin/tickets" className="text-xs font-bold text-accent-orange flex items-center gap-1 hover:underline">
                            View All <ChevronRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {recentTickets.map((ticket, idx) => (
                            <div key={ticket.id || idx} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    {getTicketStatusIcon(ticket.status)}
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800">{ticket.title}</p>
                                        <p className="text-xs text-slate-400">
                                            {ticket.ticketId} · {ticket.category} · {ticket.reporterEmail}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getTicketStatusBadge(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                    <span className="text-[10px] text-slate-400 hidden sm:block">
                                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '—'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Provision Staff Account */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-3 mb-6">
                      <div className="bg-secondary-blue/10 p-2.5 rounded-xl">
                           <UserPlus size={24} className="text-secondary-blue" />
                      </div>
                      <div>
                           <h2 className="text-xl font-bold text-primary-dark">Provision Staff Account</h2>
                           <p className="text-slate-500 text-sm">Register new technicians and assign system privileges.</p>
                      </div>
                 </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                      <div className="space-y-1.5">
                           <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">First Name</label>
                           <input 
                                type="text" 
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                placeholder="e.g. John" 
                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-secondary-blue focus:ring-4 focus:ring-secondary-blue/10 transition-all outline-none font-medium text-slate-700 text-sm" 
                           />
                      </div>
                      <div className="space-y-1.5">
                           <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Last Name</label>
                           <input 
                                type="text" 
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                placeholder="e.g. Doe" 
                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-secondary-blue focus:ring-4 focus:ring-secondary-blue/10 transition-all outline-none font-medium text-slate-700 text-sm" 
                           />
                      </div>
                      <div className="space-y-1.5">
                           <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">SLIIT Email</label>
                           <input 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="e.g. tech@sliit.lk" 
                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-secondary-blue focus:ring-4 focus:ring-secondary-blue/10 transition-all outline-none font-medium text-slate-700 text-sm" 
                           />
                      </div>
                      <button 
                        onClick={handleCreateAccount}
                        disabled={isCreating}
                        className="h-[50px] w-full bg-secondary-blue text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-secondary-blue/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                      >
                          {isCreating ? "Processing..." : "Create Account"}
                      </button>
                 </div>
            </div>
        </div>
    );
};

// --- Sub-components ---

const StatCard = ({ icon, title, value, subtitle, color }) => (
    <div className={`p-5 rounded-2xl border ${color} hover:shadow-md transition-all duration-300`}>
        <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
        </div>
        <div className="text-3xl font-bold text-primary-dark tracking-tight">{value}</div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{title}</div>
        <div className="text-[10px] text-slate-400 mt-0.5">{subtitle}</div>
    </div>
);

const RoleBar = ({ label, count, total, color }) => {
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-slate-700">{label}</span>
                <span className="text-xs font-bold text-slate-500">{count} <span className="text-slate-400">({percentage}%)</span></span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                    className={`h-2 rounded-full ${color} transition-all duration-700`} 
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                />
            </div>
        </div>
    );
};

export default AdminPanel;
