import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    ShieldAlert, 
    Ticket, 
    BarChart, 
    LogOut,
    UserCircle,
    Building2
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['USER', 'ADMIN', 'TECHNICIAN', 'MANAGER'] },
        { path: '/admin', label: 'Admin Panel', icon: <ShieldAlert size={20} />, roles: ['ADMIN'] },
        { path: '/tickets', label: 'Tickets', icon: <Ticket size={20} />, roles: ['TECHNICIAN'] },
        { path: '/reports', label: 'Reports', icon: <BarChart size={20} />, roles: ['MANAGER'] },
    ];

    const filteredItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center gap-3 group">
                            <div className="bg-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                <Building2 className="text-white h-6 w-6" />
                            </div>
                            <span className="text-2xl font-black text-gray-900 tracking-tight">SmartCampus</span>
                        </Link>
                        
                        <div className="hidden sm:ml-10 sm:flex sm:space-x-4">
                            {filteredItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 gap-2 ${
                                        isActive(item.path)
                                            ? 'bg-blue-50 text-blue-700 shadow-sm'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex flex-col items-end mr-1">
                                <span className="text-sm font-bold text-gray-900">{user.name}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 rounded-md">{user.role}</span>
                            </div>
                            <UserCircle className="h-10 w-10 text-gray-400" />
                        </div>

                        <button
                            onClick={logout}
                            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                            title="Sign Out"
                        >
                            <LogOut className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
