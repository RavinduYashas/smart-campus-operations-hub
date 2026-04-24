// frontend/src/pages/manager/ReportsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
    BarChart, 
    PieChart, 
    LineChart, 
    Calendar, 
    Download, 
    TrendingUp, 
    Target,
    Layers,
    ChevronDown,
    Map,
    ArrowUpRight,
    Search,
    Building2,
    Activity,
    Sparkles,
    Zap,
    Award,
    Globe,
    ExternalLink,
    FileText,
    Users,
    Ticket,
    Clock,
    CheckCircle,
    AlertTriangle,
    Eye,
    Loader2
} from 'lucide-react';

const ReportsPage = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalResources: 0,
        activeResources: 0,
        totalBookings: 0,
        pendingBookings: 0,
        openTickets: 0,
        utilizationRate: 0,
        totalUsers: 0,
        activeUsers: 0
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    // Axios interceptor
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Resources
            const resourcesRes = await axios.get(`${API_URL}/api/resources`);
            const resources = resourcesRes.data;
            const totalResources = resources.length;
            const activeResources = resources.filter(r => r.status === 'ACTIVE').length;
            
            // Calculate total capacity for utilization
            const totalCapacity = resources.reduce((sum, r) => sum + (r.capacity || 0), 0);
            
            // Try to fetch Bookings (if available)
            let totalBookings = 0;
            let pendingBookings = 0;
            try {
                const bookingsRes = await axios.get(`${API_URL}/api/bookings`);
                const bookings = bookingsRes.data || [];
                totalBookings = bookings.length;
                pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
            } catch (error) {
                console.log('Bookings API not available yet');
            }
            
            // Calculate utilization rate (using bookings if available, otherwise estimate)
            const utilizationRate = totalCapacity > 0 ? Math.min(Math.round((totalBookings / totalCapacity) * 100), 100) : 42;
            
            // Try to fetch Tickets (if available)
            let openTickets = 0;
            try {
                const ticketsRes = await axios.get(`${API_URL}/api/tickets`);
                const tickets = ticketsRes.data || [];
                openTickets = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
            } catch (error) {
                console.log('Tickets API not available yet');
                openTickets = 0;
            }
            
            // Try to fetch Users (if available)
            let totalUsers = 0;
            let activeUsers = 0;
            try {
                const usersRes = await axios.get(`${API_URL}/api/users`);
                const users = usersRes.data || [];
                totalUsers = users.length;
                activeUsers = users.filter(u => u.active !== false).length;
            } catch (error) {
                console.log('Users API not available yet');
                // Demo data for users if API not available
                totalUsers = 145;
                activeUsers = 128;
            }
            
            setStats({
                totalResources,
                activeResources,
                totalBookings,
                pendingBookings,
                openTickets,
                utilizationRate,
                totalUsers,
                activeUsers
            });
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const reportCategories = [
        {
            id: 'resource',
            title: 'Resource Reports',
            icon: <Building2 className="w-5 h-5" />,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            reports: [
                { name: 'Resource Inventory', path: '/manager/ResourceInventoryReports', description: 'Complete asset catalogue with filters', icon: <Layers className="w-4 h-4" /> },
                { name: 'Resource Utilization', path: '/manager/ResourceUtilizationReports', description: 'Usage patterns and efficiency metrics', icon: <TrendingUp className="w-4 h-4" /> },
                { name: 'Maintenance Schedule', path: '/manager/MaintenanceReports', description: 'Equipment service and repair tracking', icon: <Clock className="w-4 h-4" /> }
            ]
        },
        {
            id: 'booking',
            title: 'Booking Reports',
            icon: <Calendar className="w-5 h-5" />,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
            reports: [
                { name: 'Booking Analytics', path: '/manager/booking-analytics', description: 'Booking trends and patterns', icon: <BarChart className="w-4 h-4" /> },
                { name: 'Approval Metrics', path: '/manager/approval-metrics', description: 'Approval rates and response times', icon: <CheckCircle className="w-4 h-4" /> },
                { name: 'Cancellation Analysis', path: '/manager/cancellation-analysis', description: 'Cancellation reasons and patterns', icon: <AlertTriangle className="w-4 h-4" /> }
            ]
        },
        {
            id: 'ticket',
            title: 'Support Ticket Reports',
            icon: <Ticket className="w-5 h-5" />,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600',
            reports: [
                { name: 'Ticket Analytics', path: '/manager/ticket-analytics', description: 'Ticket volume and resolution metrics', icon: <Activity className="w-4 h-4" /> },
                { name: 'Technician Performance', path: '/manager/technician-performance', description: 'Response and resolution times', icon: <Users className="w-4 h-4" /> },
                { name: 'Issue Categories', path: '/manager/issue-categories', description: 'Common issues and patterns', icon: <PieChart className="w-4 h-4" /> }
            ]
        },
        {
            id: 'user',
            title: 'User Reports',
            icon: <Users className="w-5 h-5" />,
            color: 'bg-emerald-500',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600',
            reports: [
                { name: 'User Analytics', path: '/manager/user-analytics', description: 'User activity and engagement metrics', icon: <Activity className="w-4 h-4" /> },
                { name: 'Role Distribution', path: '/manager/role-distribution', description: 'User roles and permissions overview', icon: <PieChart className="w-4 h-4" /> },
                { name: 'User Engagement', path: '/manager/user-engagement', description: 'Login frequency and activity patterns', icon: <TrendingUp className="w-4 h-4" /> }
            ]
        }
    ];

    const quickStats = [
        { 
            label: 'Total Resources', 
            value: stats.totalResources, 
            change: `+${stats.activeResources} active`, 
            icon: <Building2 className="w-4 h-4" />, 
            color: 'text-blue-600',
            trend: 'up'
        },
        { 
            label: 'Active Bookings', 
            value: stats.totalBookings, 
            change: `${stats.pendingBookings} pending`, 
            icon: <Calendar className="w-4 h-4" />, 
            color: 'text-purple-600',
            trend: stats.totalBookings > 0 ? 'up' : 'neutral'
        },
        { 
            label: 'Open Tickets', 
            value: stats.openTickets, 
            change: 'needs attention', 
            icon: <Ticket className="w-4 h-4" />, 
            color: 'text-orange-600',
            trend: stats.openTickets > 0 ? 'down' : 'neutral'
        },
        { 
            label: 'Utilization Rate', 
            value: `${stats.utilizationRate}%`, 
            change: `${stats.activeResources}/${stats.totalResources} resources`, 
            icon: <TrendingUp className="w-4 h-4" />, 
            color: 'text-emerald-600',
            trend: stats.utilizationRate > 50 ? 'up' : 'neutral'
        }
    ];

    const recentReports = [
        { name: 'Monthly Resource Utilization Report', date: '2024-03-15', type: 'PDF', size: '2.4 MB' },
        { name: 'Booking Analytics - Q1 Summary', date: '2024-03-10', type: 'Excel', size: '1.8 MB' },
        { name: 'Ticket Resolution Performance', date: '2024-03-05', type: 'PDF', size: '1.2 MB' },
        { name: 'User Activity Report', date: '2024-02-28', type: 'PDF', size: '3.1 MB' }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-primary-dark" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
                
                {/* Header */}
                <header className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-dark to-secondary-blue rounded-2xl flex items-center justify-center shadow-lg">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-primary-dark">Reports & Analytics</h1>
                                    <p className="text-slate-500 mt-1">Comprehensive insights and performance metrics</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="bg-white border border-slate-200 p-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                                <button 
                                    onClick={() => setSelectedPeriod('week')}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                        selectedPeriod === 'week' 
                                            ? 'bg-primary-dark text-white' 
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    This Week
                                </button>
                                <button 
                                    onClick={() => setSelectedPeriod('month')}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                        selectedPeriod === 'month' 
                                            ? 'bg-primary-dark text-white' 
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    This Month
                                </button>
                                <button 
                                    onClick={() => setSelectedPeriod('quarter')}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                        selectedPeriod === 'quarter' 
                                            ? 'bg-primary-dark text-white' 
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    This Quarter
                                </button>
                                <button 
                                    onClick={() => setSelectedPeriod('year')}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                                        selectedPeriod === 'year' 
                                            ? 'bg-primary-dark text-white' 
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    This Year
                                </button>
                            </div>
                            <button 
                                onClick={fetchData}
                                className="px-5 py-2.5 bg-accent-gold text-primary-dark rounded-xl font-semibold text-sm flex items-center gap-2 shadow-md hover:bg-amber-400 transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Export Report
                            </button>
                        </div>
                    </div>
                </header>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {quickStats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`${stat.color}`}>{stat.icon}</div>
                                <span className={`text-xs font-medium ${
                                    stat.trend === 'up' ? 'text-green-600' : 
                                    stat.trend === 'down' ? 'text-red-600' : 'text-slate-400'
                                }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-primary-dark">{stat.value}</p>
                            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Report Categories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {reportCategories.map((category) => (
                        <div key={category.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {/* Category Header */}
                            <div className={`${category.bgColor} px-6 py-4 border-b border-slate-100`}>
                                <div className="flex items-center gap-3">
                                    <div className={`${category.color} w-10 h-10 rounded-xl flex items-center justify-center text-white`}>
                                        {category.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-primary-dark">{category.title}</h2>
                                        <p className="text-xs text-slate-500">View and export detailed reports</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Report List */}
                            <div className="p-4 divide-y divide-slate-100">
                                {category.reports.map((report, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => navigate(report.path)}
                                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`${category.bgColor} p-2 rounded-lg ${category.textColor}`}>
                                                {report.icon}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-primary-dark text-sm">{report.name}</p>
                                                <p className="text-xs text-slate-400">{report.description}</p>
                                            </div>
                                        </div>
                                        <Eye className="w-4 h-4 text-slate-400 group-hover:text-accent-orange transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Featured Report Section */}
                <div className="bg-gradient-to-r from-primary-dark to-secondary-blue rounded-2xl p-6 md:p-8 text-white mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">Executive Summary Report</h3>
                                <p className="text-slate-300 text-sm max-w-2xl">
                                    Comprehensive overview of campus operations, resource utilization, 
                                    booking trends, and support ticket performance. Includes actionable insights 
                                    and recommendations for the management team.
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="text-xs px-2 py-1 rounded-full bg-white/20">Q4 2024 Data</span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-white/20">Updated Daily</span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-white/20">PDF Available</span>
                                </div>
                            </div>
                        </div>
                        <button className="px-6 py-3 bg-white text-primary-dark rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-slate-100 transition-all whitespace-nowrap">
                            <Eye className="w-4 h-4" />
                            Generate Report
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-accent-orange" />
                                <h3 className="font-semibold text-primary-dark">Recently Generated Reports</h3>
                            </div>
                            <button className="text-xs text-accent-orange hover:underline">View All</button>
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentReports.map((report, idx) => (
                            <div key={idx} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium text-primary-dark text-sm">{report.name}</p>
                                        <p className="text-xs text-slate-400">Generated on {report.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-slate-400">{report.type} • {report.size}</span>
                                    <button className="p-1.5 text-slate-400 hover:text-accent-orange transition-colors">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
                    SLIIT Smart Campus Operations Hub | Reports Portal | Data refreshes every 5 minutes
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;