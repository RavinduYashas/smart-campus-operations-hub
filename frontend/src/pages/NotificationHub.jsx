import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    ShieldAlert, 
    Info, 
    MessageSquare, 
    CheckCircle, 
    Clock, 
    Check, 
    AlertCircle, 
    ChevronRight,
    Bell,
    Layers,
    Activity
} from 'lucide-react';

/**
 * NotificationHub Component
 * Displays role-based and user-specific notifications with rich context.
 */
const NotificationHub = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchAlerts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8080/api/notifications/my-alerts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (error) {
            console.error("Error fetching notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
        const intervalId = setInterval(fetchAlerts, 30000); // Poll every 30s
        return () => clearInterval(intervalId);
    }, []);

    const toggleRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:8080/api/notifications/${id}/toggle-read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
            
            // Notify navbar to update count
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } catch (error) {
            console.error("Error toggling read status", error);
        }
    };

    const handleViewDetails = (notif) => {
        const type = notif.type;
        const category = notif.category;
        const role = user?.role;

        // Routing logic based on category and role
        if (category === 'MAINTENANCE' || type === 'TICKET_STATUS' || type === 'COMMENT') {
            if (role === 'TECHNICIAN') navigate('/tickets');
            else if (role === 'ADMIN') navigate('/admin/tickets');
            else navigate('/incident-tickets');
        } else if (category === 'BOOKING' || type === 'BOOKING_APPROVED' || type === 'BOOKING_REJECTED') {
            if (role === 'ADMIN') navigate('/admin/bookings');
            else if (role === 'MANAGER') navigate('/reports'); // Managers see bookings in reports/dashboard
            else navigate('/my-bookings');
        } else {
            // Default fallbacks
            if (role === 'ADMIN') navigate('/admin');
            else navigate('/dashboard');
        }
    };

    const getIconInfo = (type, category) => {
        switch(type) {
            case 'TICKET_STATUS': 
                return { icon: <ShieldAlert size={18} />, style: 'bg-amber-50 text-amber-600 border-amber-100' };
            case 'COMMENT':
                return { icon: <MessageSquare size={18} />, style: 'bg-blue-50 text-blue-600 border-blue-100' };
            case 'BOOKING_APPROVED':
                return { icon: <CheckCircle size={18} />, style: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
            case 'BOOKING_REJECTED':
                return { icon: <AlertCircle size={18} />, style: 'bg-rose-50 text-rose-600 border-rose-100' };
            default:
                return { icon: <Info size={18} />, style: 'bg-slate-50 text-slate-600 border-slate-100' };
        }
    };

    const getPriorityBadge = (priority) => {
        const p = priority?.toUpperCase() || 'NORMAL';
        switch(p) {
            case 'URGENT':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 uppercase tracking-tighter">Urgent</span>;
            case 'HIGH':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase tracking-tighter">High</span>;
            case 'NORMAL':
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-tighter">Normal</span>;
            default:
                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-tighter">{p}</span>;
        }
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) return 'Today';
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                    <Bell className="text-blue-600" size={28} />
                    Notification Hub
                </h1>
                <p className="text-slate-500 mt-1 font-medium">Manage your campus alerts and activity updates.</p>
            </div>
            <div className="h-12 w-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
                <Activity size={20} />
            </div>
        </header>

        <div className="space-y-6">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                    <p className="text-slate-500 font-bold tracking-wide">Fetching your pulse...</p>
                </div>
            ) : notifications.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-slate-200">
                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Check size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">All caught up!</h3>
                    <p className="text-slate-500 mt-2">You don't have any new notifications at the moment.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notif) => {
                        const { icon, style } = getIconInfo(notif.type, notif.category);
                        const isRead = notif.read;

                        return (
                            <div 
                                key={notif.id} 
                                className={`group relative bg-white border border-slate-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${isRead ? 'opacity-60 grayscale-[0.2]' : 'ring-1 ring-blue-500/5'}`}
                            >
                                {!isRead && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                                )}
                                
                                <div className="p-5 flex items-start gap-4">
                                    <div className={`h-12 w-12 rounded-xl flex shrink-0 items-center justify-center border ${style}`}>
                                        {icon}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="font-bold text-slate-800 truncate">
                                                    {notif.title || notif.type.replace('_', ' ')}
                                                </h4>
                                                {getPriorityBadge(notif.priority)}
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-tighter flex items-center gap-1">
                                                    <Layers size={10} />
                                                    {notif.category || 'General'}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
                                                <Clock size={10} />
                                                {formatDate(notif.createdAt)} • {formatTime(notif.createdAt)}
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                            {notif.message}
                                        </p>

                                        <div className="mt-3 flex items-center gap-3">
                                            <button 
                                                onClick={() => toggleRead(notif.id)}
                                                className={`text-[11px] font-bold flex items-center gap-1 transition-colors px-3 py-1 rounded-full ${
                                                    isRead 
                                                    ? 'text-slate-600 bg-slate-100 hover:bg-slate-200' 
                                                    : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                                }`}
                                            >
                                                {isRead ? (
                                                    <>
                                                        <Clock size={12} />
                                                        Mark as unread
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check size={12} />
                                                        Mark as read
                                                    </>
                                                )}
                                            </button>
                                            <button 
                                                onClick={() => handleViewDetails(notif)}
                                                className="text-[11px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
                                            >
                                                View Details
                                                <ChevronRight size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        <footer className="mt-12 text-center">
            <p className="text-xs text-slate-400 font-medium">
                &copy; 2026 Smart Campus Operations Hub &bull; All systems operational
            </p>
        </footer>
      </div>
    </div>
  );
};

export default NotificationHub;
