// frontend/src/pages/manager/ResourceInventoryReport.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
    ArrowLeft,
    Download, 
    Printer,
    FileText,
    FileSpreadsheet,
    Building2,
    Search,
    Filter,
    ChevronDown,
    Loader2,
    CheckCircle,
    XCircle,
    Eye,
    Users,
    MapPin,
    Calendar
} from 'lucide-react';

const ResourceInventoryReport = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showExportMenu, setShowExportMenu] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    // Buildings
    const buildings = [
        { id: 'all', name: 'All Buildings' },
        { id: 'Main Building', name: 'Main Building' },
        { id: 'New Building', name: 'New Building' },
        { id: 'Engineering Building', name: 'Engineering Building' },
        { id: 'Business School Building', name: 'Business School Building' },
        { id: 'Other', name: 'Special Locations' }
    ];

    // Resource Types
    const resourceTypes = [
        { id: 'all', name: 'All Types' },
        { id: 'LECTURE_HALL', name: 'Lecture Hall' },
        { id: 'LAB', name: 'Laboratory' },
        { id: 'MEETING_ROOM', name: 'Meeting Room' },
        { id: 'EQUIPMENT', name: 'Equipment' },
        { id: 'OTHER', name: 'Other' }
    ];

    // Status Options
    const statusOptions = [
        { id: 'all', name: 'All Status' },
        { id: 'ACTIVE', name: 'Active' },
        { id: 'OUT_OF_SERVICE', name: 'Out of Service' }
    ];

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
        fetchResources();
    }, []);

    useEffect(() => {
        filterResources();
    }, [searchTerm, selectedBuilding, selectedType, selectedStatus, resources]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/resources`);
            setResources(response.data);
            setFilteredResources(response.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterResources = () => {
        let filtered = [...resources];
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(r => 
                r.name?.toLowerCase().includes(term) ||
                (r.resourceCode && r.resourceCode.toLowerCase().includes(term)) ||
                (r.location && r.location.toLowerCase().includes(term))
            );
        }
        
        if (selectedBuilding !== 'all') {
            filtered = filtered.filter(r => r.building === selectedBuilding);
        }
        
        if (selectedType !== 'all') {
            filtered = filtered.filter(r => r.type === selectedType);
        }
        
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(r => r.status === selectedStatus);
        }
        
        setFilteredResources(filtered);
    };

    // Export as CSV (Excel)
    const exportToCSV = () => {
        const headers = ['Code', 'Name', 'Type', 'Building', 'Location', 'Floor', 'Capacity', 'Status', 'Description', 'Created Date'];
        
        const rows = filteredResources.map(r => [
            r.resourceCode || r.id.slice(-4),
            r.name,
            r.type?.replace('_', ' ') || 'N/A',
            r.building || 'N/A',
            r.location || 'N/A',
            r.floor || 'N/A',
            r.capacity || 0,
            r.status || 'N/A',
            r.description || '',
            new Date(r.createdAt).toLocaleDateString()
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `resource_inventory_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Export as JSON
    const exportToJSON = () => {
        const reportData = {
            generatedAt: new Date().toISOString(),
            totalResources: filteredResources.length,
            filters: {
                building: selectedBuilding,
                type: selectedType,
                status: selectedStatus,
                searchTerm: searchTerm
            },
            resources: filteredResources.map(r => ({
                code: r.resourceCode,
                name: r.name,
                type: r.type,
                building: r.building,
                location: r.location,
                floor: r.floor,
                capacity: r.capacity,
                status: r.status,
                description: r.description,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt
            }))
        };
        
        const jsonContent = JSON.stringify(reportData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `resource_inventory_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Print Report
    const printReport = () => {
        window.print();
    };

    const getTypeBadge = (type) => {
        const styles = {
            LECTURE_HALL: 'bg-blue-100 text-blue-700',
            LAB: 'bg-green-100 text-green-700',
            MEETING_ROOM: 'bg-purple-100 text-purple-700',
            EQUIPMENT: 'bg-orange-100 text-orange-700',
            OTHER: 'bg-gray-100 text-gray-700'
        };
        return styles[type] || 'bg-gray-100 text-gray-700';
    };

    const getStatusBadge = (status) => {
        return status === 'ACTIVE' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-primary-dark" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
                
                {/* Header */}
                <div className="mb-6">
                    <button 
                        onClick={() => navigate('/manager/reports')}
                        className="flex items-center gap-2 text-slate-500 hover:text-primary-dark transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Reports
                    </button>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-primary-dark">Resource Inventory Report</h1>
                            <p className="text-slate-500 mt-1">Complete asset catalogue with detailed information</p>
                        </div>
                        
                        <div className="flex gap-3">
                            {/* Export Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    className="px-5 py-2.5 bg-primary-dark text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-black transition-all"
                                >
                                    <Download className="w-4 h-4" />
                                    Export Report
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {showExportMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-10">
                                        <button 
                                            onClick={() => { exportToCSV(); setShowExportMenu(false); }}
                                            className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
                                        >
                                            <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                            Export as CSV (Excel)
                                        </button>
                                        <button 
                                            onClick={() => { exportToJSON(); setShowExportMenu(false); }}
                                            className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
                                        >
                                            <FileText className="w-4 h-4 text-blue-600" />
                                            Export as JSON
                                        </button>
                                        <button 
                                            onClick={() => { printReport(); setShowExportMenu(false); }}
                                            className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50 flex items-center gap-3 border-t border-slate-100"
                                        >
                                            <Printer className="w-4 h-4 text-slate-600" />
                                            Print Report
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-slate-500 text-sm">Total Resources</p>
                        <p className="text-2xl font-bold text-primary-dark">{filteredResources.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-slate-500 text-sm">Active</p>
                        <p className="text-2xl font-bold text-green-600">{filteredResources.filter(r => r.status === 'ACTIVE').length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-slate-500 text-sm">Under Maintenance</p>
                        <p className="text-2xl font-bold text-red-600">{filteredResources.filter(r => r.status === 'OUT_OF_SERVICE').length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-slate-500 text-sm">Total Capacity</p>
                        <p className="text-2xl font-bold text-primary-dark">{filteredResources.reduce((sum, r) => sum + (r.capacity || 0), 0)}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name, code, location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-gold outline-none"
                            />
                        </div>
                        <select
                            value={selectedBuilding}
                            onChange={(e) => setSelectedBuilding(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-gold outline-none"
                        >
                            {buildings.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-gold outline-none"
                        >
                            {resourceTypes.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-gold outline-none"
                        >
                            {statusOptions.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Resource Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Code</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Building</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Floor</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Capacity</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Created</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredResources.length > 0 ? (
                                    filteredResources.map((resource) => (
                                        <tr key={resource.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 text-sm font-mono text-accent-orange">
                                                {resource.resourceCode || resource.id.slice(-4)}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-primary-dark">
                                                {resource.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full ${getTypeBadge(resource.type)}`}>
                                                    {resource.type?.replace('_', ' ') || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {resource.building || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {resource.location || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {resource.floor || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {resource.capacity || 0}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(resource.status)}`}>
                                                    {resource.status === 'ACTIVE' ? 'Active' : 'Maintenance'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600">
                                                {new Date(resource.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="px-4 py-12 text-center text-slate-500">
                                            No resources found matching your filters
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 text-sm text-slate-500 print:hidden">
                        Showing {filteredResources.length} of {resources.length} resources
                    </div>
                </div>

                {/* Print Footer (only visible when printing) */}
                <div className="hidden print:block mt-8 text-center text-xs text-slate-400">
                    Resource Inventory Report - Generated on {new Date().toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default ResourceInventoryReport;