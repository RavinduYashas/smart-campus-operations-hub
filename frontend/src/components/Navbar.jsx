import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    CheckCircle2
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', label: 'Monitor', icon: <LayoutDashboard size={18} />, roles: ['USER', 'ADMIN', 'TECHNICIAN', 'MANAGER'] },
        
        // Module A & B (User)
        { path: '/assets', label: 'Catalogue', icon: <Building2 size={18} />, roles: ['USER'] },
        { path: '/my-bookings', label: 'Bookings', icon: <Calendar size={18} />, roles: ['USER'] },
        
        // Module C (User)
        { path: '/report-fault', label: 'Report', icon: <AlertCircle size={18} />, roles: ['USER'] },

        // Module A, B, C (Admin)
        { path: '/admin/assets', label: 'Facilities', icon: <Building2 size={18} />, roles: ['ADMIN'] },
        { path: '/admin/bookings', label: 'Approvals', icon: <CheckCircle2 size={18} />, roles: ['ADMIN'] },
        { path: '/admin/tickets', label: 'Operations', icon: <Ticket size={18} />, roles: ['ADMIN'] },

        // Module C (Technician)
        { path: '/technician/tasks', label: 'My Tasks', icon: <Ticket size={18} />, roles: ['TECHNICIAN'] },

        // Module D (Global Notifications)
        { path: '/notifications', label: 'Alerts', icon: <Bell size={18} />, roles: ['USER', 'ADMIN', 'TECHNICIAN'] },

        { path: '/reports', label: 'Strategy', icon: <BarChart size={18} />, roles: ['MANAGER'] },
    ];

    const filteredItems = user ? navItems.filter(item => item.roles.includes(user.role)) : [];

    return (
        <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100] transition-all">
            <div className="max-w-7xl mx-auto px-6 sm:px-10">
                <div className="flex justify-between h-20">
                    {/* Logo and Desktop Nav */}
                    <div className="flex items-center gap-12">
                        <Link to="/" className="flex items-center gap-3 group shrink-0">
                            <div className="bg-blue-600 p-2.5 rounded-2xl group-hover:rotate-6 transition-transform duration-500 shadow-lg shadow-blue-200">
                                <Building2 className="text-white h-7 w-7" />
                            </div>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">SmartCampus</span>
                        </Link>
                        
                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            <Link
                                to="/"
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                    isActive('/') ? 'text-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                Home
                            </Link>
                            {user && filteredItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 gap-2.5 ${
                                        isActive(item.path)
                                            ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50'
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
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
                                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50/80 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                                    <div className="flex flex-col items-end leading-none">
                                        <span className="text-[11px] font-black uppercase text-blue-600 mb-1">{user.role}</span>
                                        <span className="text-sm font-black text-slate-700 truncate max-w-[140px]">{user.name}</span>
                                    </div>
                                    <div className="h-10 w-10 bg-gradient-to-tr from-slate-200 to-slate-100 rounded-xl flex items-center justify-center p-0.5">
                                         <UserCircle className="h-full w-full text-slate-400" />
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-3 bg-rose-50 text-rose-500 border border-rose-100/50 rounded-2xl hover:bg-rose-500 hover:text-white transition-all duration-500 group shadow-sm active:scale-90"
                                    title="Sign Out"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden sm:block">
                                <Link 
                                    to="/login"
                                    className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 hover:-translate-y-0.5 hover:bg-black transition-all flex items-center gap-2.5 active:scale-95"
                                >
                                    Sign In <ArrowRight size={18} />
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-3 text-slate-500 hover:bg-slate-50 rounded-2xl transition-all active:scale-90"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-2xl animate-in slide-in-from-top duration-300">
                    <div className="p-6 space-y-2">
                        <Link
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center p-4 rounded-2xl font-bold ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                        >
                            Home
                        </Link>
                        {user && filteredItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-4 p-4 rounded-2xl font-bold ${isActive(item.path) ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                            >
                                {item.icon} {item.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-slate-100 mt-4">
                            {user ? (
                                <button 
                                    onClick={() => { logout(); setIsMenuOpen(false); }}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-rose-500 bg-rose-50"
                                >
                                    <LogOut size={20} /> Sign Out
                                </button>
                            ) : (
                                <Link 
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl font-bold bg-slate-900 text-white shadow-lg"
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
