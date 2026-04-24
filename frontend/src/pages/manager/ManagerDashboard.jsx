// frontend/src/pages/manager/ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Building2, 
  Calendar, 
  Ticket, 
  TrendingUp,
  Activity,
  Zap,
  ChevronRight,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  RefreshCw,
  Target,
  Award,
  PieChart,
  Users,
  Wifi,
  Monitor,
  Landmark,
  HardDrive,
  School,
  Trees,
  Loader2
} from 'lucide-react';

const ManagerDashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [apiStatus, setApiStatus] = useState({
    resources: false,
    bookings: false,
    tickets: false
  });
  const [stats, setStats] = useState({
    totalResources: 0,
    activeResources: 0,
    maintenanceResources: 0,
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    totalTickets: 0,
    openTickets: 0,
    utilizationRate: 0,
    resourcesByType: {},
    resourcesByBuilding: {}
  });
  const [topResources, setTopResources] = useState([]);

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

  // Role-based access control
  if (!user || user.role !== 'MANAGER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary-dark mb-2">Access Denied</h1>
          <p className="text-slate-500">Manager privileges required to access this page.</p>
          <p className="text-slate-400 text-sm mt-2">Your role: {user?.role || 'Not logged in'}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-black"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    
    // Fetch resources (always available)
    try {
      const resourcesRes = await axios.get(`${API_URL}/api/resources`);
      setResources(resourcesRes.data);
      setApiStatus(prev => ({ ...prev, resources: true }));
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
    
    // Try to fetch bookings (might not exist yet)
    try {
      const bookingsRes = await axios.get(`${API_URL}/api/bookings`);
      setBookings(bookingsRes.data || []);
      setApiStatus(prev => ({ ...prev, bookings: true }));
    } catch (error) {
      console.log('Bookings API not available yet');
      setBookings([]);
    }
    
    // Try to fetch tickets (might not exist yet)
    try {
      const ticketsRes = await axios.get(`${API_URL}/api/tickets`);
      setTickets(ticketsRes.data || []);
      setApiStatus(prev => ({ ...prev, tickets: true }));
    } catch (error) {
      console.log('Tickets API not available yet');
      setTickets([]);
    }
    
    setLoading(false);
  };

  // Update stats whenever data changes
  useEffect(() => {
    if (resources.length > 0) {
      updateStats();
    }
  }, [resources, bookings, tickets]);

  const updateStats = () => {
    const totalResources = resources.length;
    const activeResources = resources.filter(r => r.status === 'ACTIVE').length;
    const maintenanceResources = resources.filter(r => r.status === 'OUT_OF_SERVICE').length;
    
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
    const approvedBookings = bookings.filter(b => b.status === 'APPROVED').length;
    
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
    
    // Calculate utilization rate
    const totalCapacity = resources.reduce((sum, r) => sum + (r.capacity || 0), 0);
    const utilizationRate = totalCapacity > 0 ? Math.min(Math.round((totalBookings / totalCapacity) * 100), 100) : 0;
    
    // Group resources by type
    const resourcesByType = {};
    resources.forEach(r => {
      const type = r.type || 'OTHER';
      resourcesByType[type] = (resourcesByType[type] || 0) + 1;
    });
    
    // Group resources by building
    const resourcesByBuilding = {};
    resources.forEach(r => {
      const building = r.building || 'Other';
      resourcesByBuilding[building] = (resourcesByBuilding[building] || 0) + 1;
    });
    
    // Get top 5 most booked resources
    const resourceBookCount = {};
    bookings.forEach(booking => {
      const id = booking.resourceId;
      resourceBookCount[id] = (resourceBookCount[id] || 0) + 1;
    });
    
    const top5 = Object.entries(resourceBookCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, count]) => {
        const resource = resources.find(r => r.id === id);
        return { name: resource?.name || 'Unknown', bookings: count, type: resource?.type };
      });
    setTopResources(top5);
    
    setStats({
      totalResources,
      activeResources,
      maintenanceResources,
      totalBookings,
      pendingBookings,
      approvedBookings,
      totalTickets,
      openTickets,
      utilizationRate,
      resourcesByType,
      resourcesByBuilding
    });
  };

  const getTypeIcon = (type, size = "w-4 h-4") => {
    switch(type) {
      case 'LECTURE_HALL': return <Users className={size} />;
      case 'LAB': return <Wifi className={size} />;
      case 'MEETING_ROOM': return <Users className={size} />;
      case 'EQUIPMENT': return <Monitor className={size} />;
      default: return <Building2 className={size} />;
    }
  };

  const getBuildingIcon = (building, size = "w-4 h-4") => {
    switch(building) {
      case 'Main Building': return <Landmark className={size} />;
      case 'New Building': return <Building2 className={size} />;
      case 'Engineering Building': return <HardDrive className={size} />;
      case 'Business School Building': return <School className={size} />;
      default: return <Trees className={size} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary-dark" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-dark to-secondary-blue rounded-xl flex items-center justify-center shadow-lg">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-primary-dark">Manager Dashboard</h1>
                  <p className="text-slate-500 text-sm">Welcome back, {user?.name?.split(' ')[0] || 'Manager'}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchAllData}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
          
          {/* API Status Indicators */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className={`text-xs px-2 py-1 rounded-full ${apiStatus.resources ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {apiStatus.resources ? '✓ Resources API' : '✗ Resources API'}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${apiStatus.bookings ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {apiStatus.bookings ? '✓ Bookings API' : '⏳ Bookings API (Coming Soon)'}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${apiStatus.tickets ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {apiStatus.tickets ? '✓ Tickets API' : '⏳ Tickets API (Coming Soon)'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-50 p-2.5 rounded-xl">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">{stats.activeResources} active</span>
            </div>
            <p className="text-3xl font-bold text-primary-dark">{stats.totalResources}</p>
            <p className="text-sm text-slate-500 mt-1">Total Resources</p>
            {stats.maintenanceResources > 0 && (
              <p className="text-xs text-orange-500 mt-2">{stats.maintenanceResources} under maintenance</p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-50 p-2.5 rounded-xl">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">{stats.pendingBookings} pending</span>
            </div>
            <p className="text-3xl font-bold text-primary-dark">{stats.totalBookings}</p>
            <p className="text-sm text-slate-500 mt-1">Total Bookings</p>
            {!apiStatus.bookings && (
              <p className="text-xs text-blue-500 mt-2">Awaiting Module B integration</p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-orange-50 p-2.5 rounded-xl">
                <Ticket className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">{stats.openTickets} open</span>
            </div>
            <p className="text-3xl font-bold text-primary-dark">{stats.totalTickets}</p>
            <p className="text-sm text-slate-500 mt-1">Support Tickets</p>
            {!apiStatus.tickets && (
              <p className="text-xs text-blue-500 mt-2">Awaiting Module C integration</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-primary-dark to-secondary-blue rounded-2xl p-5 shadow-lg text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white/20 p-2.5 rounded-xl">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.utilizationRate}%</p>
            <p className="text-sm text-slate-300 mt-1">Resource Utilization</p>
            <div className="mt-2 w-full bg-white/20 rounded-full h-1.5">
              <div className="bg-accent-gold h-1.5 rounded-full" style={{ width: `${stats.utilizationRate}%` }}></div>
            </div>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Resource Distribution Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* By Type */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="w-5 h-5 text-accent-orange" />
                  <h3 className="font-semibold text-primary-dark">Resources by Type</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(stats.resourcesByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(type)}
                        <span className="text-sm text-slate-600">{type?.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-secondary-blue rounded-full"
                            style={{ width: `${(count / stats.totalResources) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-primary-dark">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Building */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-accent-orange" />
                  <h3 className="font-semibold text-primary-dark">Resources by Building</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(stats.resourcesByBuilding).map(([building, count]) => (
                    <div key={building} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getBuildingIcon(building)}
                        <span className="text-sm text-slate-600">{building}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-dark rounded-full"
                            style={{ width: `${(count / stats.totalResources) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-primary-dark">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resources Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-accent-orange" />
                  <h3 className="font-semibold text-primary-dark">Resource Inventory</h3>
                </div>
                <span className="text-xs text-slate-400">{stats.totalResources} total items</span>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Building</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Capacity</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {resources.slice(0, 10).map((resource) => (
                      <tr key={resource.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 text-sm font-mono text-accent-orange">{resource.resourceCode || resource.id.slice(-4)}</td>
                        <td className="px-6 py-3 font-medium text-primary-dark">{resource.name}</td>
                        <td className="px-6 py-3 text-sm text-slate-600">{resource.type?.replace('_', ' ')}</td>
                        <td className="px-6 py-3 text-sm text-slate-600">{resource.building || 'N/A'}</td>
                        <td className="px-6 py-3 text-sm text-slate-600">{resource.capacity}</td>
                        <td className="px-6 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            resource.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {resource.status === 'ACTIVE' ? 'Active' : 'Maintenance'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {resources.length > 10 && (
                  <div className="px-6 py-3 text-center text-sm text-slate-400 border-t border-slate-100">
                    Showing 10 of {resources.length} resources
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Insights & Actions */}
          <div className="space-y-6">
            
            {/* Top Resources */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-accent-orange" />
                <h3 className="font-semibold text-primary-dark">Most Booked Resources</h3>
              </div>
              <div className="space-y-4">
                {topResources.length > 0 ? (
                  topResources.map((resource, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-gold/20 flex items-center justify-center text-sm font-bold text-accent-orange">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-primary-dark text-sm">{resource.name}</p>
                          <p className="text-xs text-slate-400">{resource.type?.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-dark">{resource.bookings}</p>
                        <p className="text-xs text-slate-400">bookings</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-slate-500">No booking data available</p>
                    <p className="text-xs text-slate-400 mt-1">Bookings will appear here once Module B is integrated</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-primary-dark to-secondary-blue rounded-2xl p-5 text-white">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/manager/ResourceInventoryReports')}
                  className="w-full py-3 bg-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors flex items-center justify-between px-4"
                >
                  View Resource Reports
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => navigate('/manager/ResourceUtilizationReports')}
                  className="w-full py-3 bg-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors flex items-center justify-between px-4"
                >
                  View Utilization Reports
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Resource Stats Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent-orange" />
                Resource Health
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Active Resources</span>
                    <span className="font-semibold text-green-600">{stats.activeResources}/{stats.totalResources}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.activeResources / stats.totalResources) * 100}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Under Maintenance</span>
                    <span className="font-semibold text-orange-600">{stats.maintenanceResources}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(stats.maintenanceResources / stats.totalResources) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-primary-dark mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent-orange" />
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Resources API</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Bookings API</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Pending Integration</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Tickets API</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Pending Integration</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-sm text-slate-600">Last Sync</span>
                  <span className="text-xs text-slate-400">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
          SLIIT Smart Campus Operations Hub | Manager Dashboard | Module A Active | Modules B & C Coming Soon
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;