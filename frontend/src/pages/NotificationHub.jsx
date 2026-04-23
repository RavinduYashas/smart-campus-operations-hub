import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Info, MessageSquare, CheckCircle } from 'lucide-react';

/**
 * NotificationHub Component
 */
const NotificationHub = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchAlerts();
        
        // Polling for new alerts every 10 seconds
        const intervalId = setInterval(fetchAlerts, 10000);
        
        return () => clearInterval(intervalId); // Cleanup
    }, []);

    const getIconInfo = (type) => {
        switch(type) {
            case 'TICKET_STATUS': 
                return { icon: <ShieldAlert size={20} />, style: 'bg-amber-50 text-amber-600' };
            case 'COMMENT':
                return { icon: <MessageSquare size={20} />, style: 'bg-blue-50 text-blue-600' };
            case 'BOOKING_APPROVED':
                return { icon: <CheckCircle size={20} />, style: 'bg-emerald-50 text-emerald-600' };
            default:
                return { icon: <Info size={20} />, style: 'bg-slate-50 text-slate-600' };
        }
    };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
      <p className="text-slate-500 mb-8 font-medium">Stay updated with the latest activity across the Smart Campus.</p>

      <div className="space-y-4">
        {loading && <p className="text-slate-500 p-4 font-bold">Loading your alerts...</p>}
        {!loading && notifications.length === 0 && (
            <p className="text-slate-500 font-bold p-4">You have no new notifications.</p>
        )}
        
        {notifications.map((notif) => {
            const { icon, style } = getIconInfo(notif.type);
            return (
                <div key={notif.id} className={`p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-start gap-4 hover:shadow-md transition-all ${notif.read ? 'opacity-60' : ''}`}>
                  <div className={`h-12 w-12 rounded-2xl flex shrink-0 items-center justify-center p-2 ${style}`}>
                    {icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{notif.type.replace('_', ' ')}</h4>
                    <p className="text-sm text-slate-500 font-medium mt-1">{notif.message}</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-2 block tracking-widest leading-none">
                        {new Date(notif.createdAt).toLocaleDateString()} &bull; {new Date(notif.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default NotificationHub;
