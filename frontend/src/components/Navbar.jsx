import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    ShieldAlert,
    Ticket,
    BarChart,
    LogOut,
    UserCircle,
    Building2,
    ArrowRight,
    Menu,
    X,
    Bell,
    Calendar,
    AlertCircle,
    CheckCircle2,
    Paperclip,
    Wrench
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8080/api/notifications/my-alerts', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const unread = res.data.filter(n => !n.isRead).length;
                setUnreadCount(unread);
            } catch (error) {
                console.error("Error fetching notification count", error);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [user]);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        // Dashboard — always first
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} />, roles: ['USER', 'ADMIN', 'TECHNICIAN', 'MANAGER'] },

        // USER role — Module A, B, C
        { path: '/user/AssetCatalogue', label: 'Catalogue', icon: <Building2 size={15} />, roles: ['USER'] },
        { path: '/my-bookings', label: 'My Bookings', icon: <Calendar size={15} />, roles: ['USER'] },

        // GLOBAL INCIDENT TICKETING (Accessible to Admin, Student, Manager)
        { path: '/incident-tickets', label: 'Incident Tickets', icon: <Ticket size={15} />, roles: ['USER', 'MANAGER'] },




        // ADMIN role — in logical order
        { path: '/admin', label: 'Control', icon: <ShieldAlert size={15} />, roles: ['ADMIN'] },
        { path: '/admin/AssetsManagement', label: 'Facilities', icon: <Building2 size={15} />, roles: ['ADMIN'] },
        { path: '/admin/bookings', label: 'Approvals', icon: <CheckCircle2 size={15} />, roles: ['ADMIN'] },
        { path: '/admin/tickets', label: 'Tickets', icon: <Ticket size={15} />, roles: ['ADMIN'] },

        // TECHNICIAN role
        { path: '/technician/tasks', label: 'My Tasks', icon: <Ticket size={15} />, roles: ['TECHNICIAN'] },

        // MONITORING & REPORTS
        { path: '/reports', label: 'Reports', icon: <BarChart size={15} />, roles: ['MANAGER', 'ADMIN'] },
    ];

    const filteredItems = user ? navItems.filter(item => item.roles.includes(user.role)) : [];

    return (
        <nav className="navbar backdrop-blur-xl sticky top-0 z-[100] transition-all">
            <div className="max-w-7xl mx-auto px-5 sm:px-4">
                <div className="flex justify-between h-[4.25rem]">
                    {/* Logo and Desktop Nav */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center group shrink-0 select-none">
                            <span className="text-xl sm:text-xl font-bold text-white tracking-widest flex items-center overflow-hidden pb-1">
                                SM
                                <svg
                                    className="w-7 h-7 sm:w-8 sm:h-8 mx-0.5 text-accent-gold group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 2L1.5 22H6.8L12 11.5L17.2 22H22.5L12 2Z" />
                                    <path d="M7.5 17H16.5V20H7.5V17Z" />
                                </svg>
                                RTCAMPUS
                            </span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            <Link
                                to="/"
                                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive('/') ? 'text-accent-gold bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                Home
                            </Link>
                            {user && filteredItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 gap-2 ${isActive(item.path)
                                            ? 'bg-accent-gold/10 text-accent-gold shadow-sm border border-accent-gold/20'
                                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span className="opacity-70">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right side Actions */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="hidden sm:flex items-center gap-5">
                                <Link to="/notifications" className="relative p-2.5 bg-white/5 text-slate-300 border border-white/10 rounded-2xl hover:bg-white/10 hover:text-accent-gold transition-all group">
                                    <Bell size={20} className={unreadCount > 0 ? "animate-swing" : ""} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg border-2 border-primary-dark">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Link>
                                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 group transition-all hover:bg-white/10 hover:shadow-md">
                                    <div className="flex flex-col items-end leading-none">
                                        <span className="text-[11px] font-bold uppercase text-accent-gold mb-1">{user.role}</span>
                                        <span className="text-sm font-bold text-white truncate max-w-[140px]">{user.name}</span>
                                    </div>
                                    <div className="h-10 w-10 bg-gradient-to-tr from-white/10 to-white/5 rounded-xl flex items-center justify-center p-0.5">
                                        <UserCircle className="h-full w-full text-slate-400" />
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl hover:bg-rose-500 hover:text-white transition-all duration-500 group shadow-sm active:scale-90"
                                    title="Sign Out"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden sm:block">
                                <Link
                                    to="/login"
                                    className="bg-accent-gold text-primary-dark px-8 py-2.5 rounded-2xl font-bold text-sm shadow-xl shadow-amber-900/20 hover:-translate-y-0.5 hover:bg-amber-400 transition-all flex items-center gap-2.5 active:scale-95"
                                >
                                    Sign In <ArrowRight size={18} />
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-3 text-slate-300 hover:bg-white/5 rounded-2xl transition-all active:scale-90"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-primary-dark border-b border-white/10 shadow-2xl animate-in slide-in-from-top duration-300">
                    <div className="p-6 space-y-2">
                        <Link
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center p-4 rounded-2xl font-semibold ${isActive('/') ? 'bg-white/10 text-accent-gold' : 'text-slate-300'}`}
                        >
                            Home
                        </Link>
                        {user && filteredItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-4 p-4 rounded-2xl font-semibold ${isActive(item.path) ? 'bg-white/10 text-accent-gold' : 'text-slate-300'}`}
                            >
                                {item.icon} {item.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-white/10 mt-4">
                            {user ? (
                                <button
                                    onClick={() => { logout(); setIsMenuOpen(false); }}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl font-semibold text-rose-500 bg-rose-500/10"
                                >
                                    <LogOut size={20} /> Sign Out
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl font-semibold bg-accent-gold text-primary-dark shadow-lg"
                                >
                                    Sign In <ArrowRight size={20} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
