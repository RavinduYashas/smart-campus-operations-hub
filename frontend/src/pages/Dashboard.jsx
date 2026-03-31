import React from 'react';
import { 
    LayoutDashboard, 
    Users, 
    Ticket, 
    BarChart, 
    TrendingUp,
    Activity,
    Zap
} from 'lucide-react';

/**
 * Dashboard Component
 * 
 * Description: The central hub for all users of the Smart Campus Operations Hub.
 * It provides a high-level overview of system metrics, active users, pending tasks,
 * and overall system health. Designed with a clean, premium aesthetic using 
 * vibrant accents and modern typography.
 * 
 * Roles: Accessible to USER, ADMIN, TECHNICIAN, MANAGER.
 */

const Dashboard = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-transparent">
            {/* Header Section */}
            <header className="mb-12 animate-in fade-in slide-in-from-left duration-700">
                <div className="flex items-center gap-4 mb-2">
                    <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">Campus Dashboard</h1>
                </div>
                <p className="text-gray-500 text-xl font-medium max-w-2xl">
                    Welcome back! Here's what's happening across the smart campus facilities right now.
                </p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <StatCard 
                    icon={<Users className="w-8 h-8 text-blue-600" />} 
                    title="Live Connectivity" 
                    value="1,284" 
                    trend="+12% from yesterday"
                    color="bg-blue-50"
                />
                <StatCard 
                    icon={<Ticket className="w-8 h-8 text-emerald-600" />} 
                    title="Active Tickets" 
                    value="42" 
                    trend="5 items urgent"
                    color="bg-emerald-50"
                />
                <StatCard 
                    icon={<Activity className="w-8 h-8 text-rose-600" />} 
                    title="System Load" 
                    value="24%" 
                    trend="Healthy status"
                    color="bg-rose-50"
                />
                <StatCard 
                    icon={<Zap className="w-8 h-8 text-amber-600" />} 
                    title="Energy Flow" 
                    value="452 kW" 
                    trend="Normal consumption"
                    color="bg-amber-50"
                />
            </div>

            {/* Activity & Updates Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-10 transform transition hover:scale-[1.01] duration-500">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                           <LayoutDashboard className="text-blue-600" /> Operational Insights
                        </h2>
                        <button className="text-blue-600 font-bold hover:underline">View All</button>
                    </div>
                    <div className="space-y-6">
                        <ActivityItem 
                            label="Network Upgrade" 
                            desc="Core switch in Building A successfully updated." 
                            time="2h ago" 
                            status="success" 
                        />
                        <ActivityItem 
                            label="Security Alert" 
                            desc="Unusual login attempt blocked from 192.168.1.45." 
                            time="4h ago" 
                            status="warning" 
                        />
                        <ActivityItem 
                            label="Fleet Management" 
                            desc="Autonomous shuttles scheduled for battery maintenance." 
                            time="6h ago" 
                            status="info" 
                        />
                    </div>
                </div>

                <div className="bg-indigo-900 rounded-3xl shadow-2xl p-10 text-white flex flex-col justify-between overflow-hidden relative group">
                    <div className="relative z-10">
                        <TrendingUp className="w-12 h-12 mb-6 text-indigo-300 group-hover:scale-110 transition-transform" />
                        <h3 className="text-3xl font-black mb-4">Optimization Suggestions</h3>
                        <p className="text-indigo-200 font-medium mb-8">Based on current patterns, shifting chiller loads by 1 hour could save 15% in costs.</p>
                        <button className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-50 transition-all">Optimize Now</button>
                    </div>
                    {/* Abstract background shape */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 opacity-20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, trend, color }) => (
    <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-100 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-6">
            <div className={`${color} p-4 rounded-2xl`}>{icon}</div>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">{title}</span>
        </div>
        <div className="flex flex-col">
            <span className="text-4xl font-black text-gray-900 mb-1 leading-tight">{value}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">{trend}</span>
        </div>
    </div>
);

const ActivityItem = ({ label, desc, time, status }) => (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
        <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${
            status === 'success' ? 'bg-emerald-500' : 
            status === 'warning' ? 'bg-rose-500' : 'bg-blue-500'
        }`}></div>
        <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
                <h4 className="font-bold text-gray-900 leading-none">{label}</h4>
                <span className="text-xs font-medium text-gray-400">{time}</span>
            </div>
            <p className="text-sm text-gray-500 font-medium leading-relaxed group-hover:text-gray-700">{desc}</p>
        </div>
    </div>
);

export default Dashboard;
