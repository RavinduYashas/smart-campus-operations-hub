// frontend/src/pages/admin/AssetsManagement.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
    Plus, Edit, Trash2, X, Search,
    Building2, Wifi, Users, Monitor,
    Grid3x3, List, RefreshCw,
    MapPin, CheckCircle, AlertCircle,
    Landmark, HardDrive, School, Trees,
    Upload, Image, Trash2 as TrashIcon,
    CheckCircle2, XCircle
} from 'lucide-react';

const AssetsManagement = () => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    
    const [formData, setFormData] = useState({
        resourceCode: '',
        name: '',
        type: 'LECTURE_HALL',
        capacity: '',
        building: 'Main Building',
        location: '',
        floor: '',
        description: '',
        imageUrl: '',
        status: 'ACTIVE'
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    // Axios interceptor for auth token
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

    const resourceTypes = [
        { id: 'LECTURE_HALL', name: 'Lecture Hall', icon: <Users className="w-4 h-4" /> },
        { id: 'LAB', name: 'Laboratory', icon: <Wifi className="w-4 h-4" /> },
        { id: 'MEETING_ROOM', name: 'Meeting Room', icon: <Building2 className="w-4 h-4" /> },
        { id: 'EQUIPMENT', name: 'Equipment', icon: <Monitor className="w-4 h-4" /> },
        { id: 'OTHER', name: 'Other', icon: <Building2 className="w-4 h-4" /> }
    ];

    const buildings = [
        { id: 'Main Building', name: 'Main Building', icon: <Landmark className="w-4 h-4" /> },
        { id: 'New Building', name: 'New Building', icon: <Building2 className="w-4 h-4" /> },
        { id: 'Engineering Building', name: 'Engineering Building', icon: <HardDrive className="w-4 h-4" /> },
        { id: 'Business School Building', name: 'Business School Building', icon: <School className="w-4 h-4" /> },
        { id: 'Other', name: 'Special Locations', icon: <Trees className="w-4 h-4" /> }
    ];

    const statusOptions = [
        { id: 'ACTIVE', name: 'Active', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
        { id: 'OUT_OF_SERVICE', name: 'Out of Service', icon: <XCircle className="w-4 h-4 text-red-500" /> }
    ];

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

    useEffect(() => {
        fetchResources();
    }, []);

    // Apply filters whenever dependencies change
    useEffect(() => {
        let filtered = [...resources];
        
        // Filter by search term
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(r => 
                r.name?.toLowerCase().includes(term) ||
                (r.resourceCode && r.resourceCode.toLowerCase().includes(term)) ||
                (r.location && r.location.toLowerCase().includes(term))
            );
        }
        
        // Filter by building
        if (selectedBuilding !== 'all') {
            filtered = filtered.filter(r => r.building === selectedBuilding);
        }
        
        // Filter by type
        if (selectedType !== 'all') {
            filtered = filtered.filter(r => r.type === selectedType);
        }
        
        setFilteredResources(filtered);
    }, [searchTerm, selectedBuilding, selectedType, resources]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file (PNG, JPG, JPEG, GIF)');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setPreviewUrl(base64String);
                setFormData({...formData, imageUrl: base64String});
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreviewUrl(null);
        setFormData({...formData, imageUrl: ''});
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const submitData = {
            ...formData,
            status: formData.status || 'ACTIVE'
        };
        
        try {
            if (editingResource) {
                await axios.put(`${API_URL}/api/resources/${editingResource.id}`, submitData);
                showNotification('Resource updated successfully!');
            } else {
                await axios.post(`${API_URL}/api/resources`, submitData);
                showNotification('Resource created successfully!');
            }
            fetchResources();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.message || error.response?.data?.error || 'Error saving resource');
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
            try {
                await axios.delete(`${API_URL}/api/resources/${id}`);
                fetchResources();
                showNotification('Resource deleted successfully!');
            } catch (error) {
                alert('Error deleting resource');
            }
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
        try {
            await axios.patch(`${API_URL}/api/resources/${id}/status?status=${newStatus}`);
            fetchResources();
            showNotification(`Resource marked as ${newStatus === 'ACTIVE' ? 'Active' : 'Out of Service'}`);
        } catch (error) {
            alert('Error updating status');
        }
    };

    const showNotification = (message) => {
        setSuccessMessage(message);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const resetForm = () => {
        setFormData({
            resourceCode: '',
            name: '',
            type: 'LECTURE_HALL',
            capacity: '',
            building: 'Main Building',
            location: '',
            floor: '',
            description: '',
            imageUrl: '',
            status: 'ACTIVE'
        });
        setPreviewUrl(null);
        setEditingResource(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openEditModal = (resource) => {
        setEditingResource(resource);
        setFormData({
            resourceCode: resource.resourceCode || '',
            name: resource.name,
            type: resource.type,
            capacity: resource.capacity,
            building: resource.building || 'Main Building',
            location: resource.location || '',
            floor: resource.floor || '',
            description: resource.description || '',
            imageUrl: resource.imageUrl || '',
            status: resource.status || 'ACTIVE'
        });
        setPreviewUrl(resource.imageUrl || null);
        setShowModal(true);
    };

    const getTypeIcon = (type, size = "w-5 h-5") => {
        switch(type) {
            case 'LECTURE_HALL': return <Users className={`${size} text-blue-600`} />;
            case 'LAB': return <Wifi className={`${size} text-green-600`} />;
            case 'MEETING_ROOM': return <Building2 className={`${size} text-purple-600`} />;
            case 'EQUIPMENT': return <Monitor className={`${size} text-orange-600`} />;
            default: return <Building2 className={`${size} text-gray-600`} />;
        }
    };

    const getTypeLabel = (type) => {
        switch(type) {
            case 'LECTURE_HALL': return 'Lecture Hall';
            case 'LAB': return 'Laboratory';
            case 'MEETING_ROOM': return 'Meeting Room';
            case 'EQUIPMENT': return 'Equipment';
            case 'OTHER': return 'Other';
            default: return type;
        }
    };

    const getBuildingBadge = (building) => {
        const buildingInfo = buildings.find(b => b.id === building);
        return buildingInfo ? 
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                {buildingInfo.icon}
                {buildingInfo.name}
            </span> : 
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{building}</span>;
    };

    // Admin access check
    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-primary-dark mb-2">Access Denied</h1>
                    <p className="text-slate-500">Admin privileges required to manage assets.</p>
                </div>
            </div>
        );
    }

    const stats = {
        total: resources.length,
        lectureHalls: resources.filter(r => r.type === 'LECTURE_HALL').length,
        labs: resources.filter(r => r.type === 'LAB').length,
        meetingRooms: resources.filter(r => r.type === 'MEETING_ROOM').length,
        equipment: resources.filter(r => r.type === 'EQUIPMENT').length,
        other: resources.filter(r => r.type === 'OTHER').length,
        active: resources.filter(r => r.status === 'ACTIVE').length,
        outOfService: resources.filter(r => r.status === 'OUT_OF_SERVICE').length
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {showSuccess && (
                <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
                    <div className="bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-primary-dark to-secondary-blue text-white">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold">SLIIT Facilities & Assets Catalogue</h1>
                            <p className="text-slate-300 mt-2">Manage academic halls, laboratories, and equipment inventory</p>
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                {buildings.map(b => (
                                    <span key={b.id} className="flex items-center gap-1 text-xs text-slate-300">
                                        {b.icon}
                                        {b.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-accent-gold text-primary-dark rounded-xl font-semibold hover:bg-amber-400 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Add Resource
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-slate-500 text-xs">Total</p>
                        <p className="text-2xl font-bold text-primary-dark">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-slate-500 text-xs">Lecture Halls</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.lectureHalls}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-slate-500 text-xs">Labs</p>
                        <p className="text-2xl font-bold text-green-600">{stats.labs}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-slate-500 text-xs">Meeting Rooms</p>
                        <p className="text-2xl font-bold text-purple-600">{stats.meetingRooms}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-slate-500 text-xs">Equipment</p>
                        <p className="text-2xl font-bold text-orange-600">{stats.equipment}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-slate-500 text-xs">Other</p>
                        <p className="text-2xl font-bold text-gray-600">{stats.other}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-slate-500 text-xs">Active</p>
                        <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                        <p className="text-xs text-red-500">{stats.outOfService} maintenance</p>
                    </div>
                </div>

                {/* Building Filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <button
                        onClick={() => setSelectedBuilding('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedBuilding === 'all' 
                                ? 'bg-primary-dark text-white' 
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        All Buildings
                    </button>
                    {buildings.map(building => (
                        <button
                            key={building.id}
                            onClick={() => setSelectedBuilding(building.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                selectedBuilding === building.id 
                                    ? 'bg-primary-dark text-white' 
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {building.icon}
                            {building.name}
                            <span className="text-xs ml-1 text-slate-400">
                                ({resources.filter(r => r.building === building.id).length})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Type Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setSelectedType('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedType === 'all' 
                                ? 'bg-primary-dark text-white' 
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        All Types
                    </button>
                    {resourceTypes.map(type => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                selectedType === type.id 
                                    ? 'bg-primary-dark text-white' 
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {type.icon}
                            {type.name}
                            <span className="text-xs ml-1 text-slate-400">
                                ({resources.filter(r => r.type === type.id).length})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name, code, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-gold outline-none"
                        />
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 text-sm text-slate-500">
                    Showing {filteredResources.length} of {resources.length} resources
                </div>

                {/* Resources Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((resource) => (
                            <div key={resource.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                                <div className="relative h-48 bg-slate-100">
                                    {resource.imageUrl ? (
                                        <img src={resource.imageUrl} alt={resource.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Image className="w-12 h-12 text-slate-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        {getBuildingBadge(resource.building)}
                                    </div>
                                </div>
                                
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(resource.type)}
                                            <span className="text-xs font-semibold text-accent-orange">{resource.resourceCode || resource.id.slice(-4)}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            resource.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {resource.status === 'ACTIVE' ? 'Active' : 'Maintenance'}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-primary-dark mb-1">{resource.name}</h3>
                                    <p className="text-slate-500 text-xs mb-2">{getTypeLabel(resource.type)}</p>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <span>{resource.location}{resource.floor ? `, ${resource.floor}` : ''}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span>Capacity: {resource.capacity}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <button
                                            onClick={() => handleStatusToggle(resource.id, resource.status)}
                                            className={`text-xs px-2 py-1 rounded-full ${
                                                resource.status === 'ACTIVE' 
                                                    ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                            }`}
                                        >
                                            {resource.status === 'ACTIVE' ? 'Mark Maintenance' : 'Mark Active'}
                                        </button>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditModal(resource)} className="p-1.5 text-slate-400 hover:text-primary-dark rounded-lg hover:bg-slate-100">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(resource.id, resource.name)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Code</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Capacity</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Building</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredResources.map((resource) => (
                                    <tr key={resource.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            {resource.imageUrl ? (
                                                <img src={resource.imageUrl} alt={resource.name} className="w-10 h-10 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                    <Image className="w-5 h-5 text-slate-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-mono text-accent-orange">{resource.resourceCode || resource.id.slice(-4)}</td>
                                        <td className="px-4 py-3 font-medium text-primary-dark">{resource.name}</td>
                                        <td className="px-4 py-3 text-sm">{getTypeLabel(resource.type)}</td>
                                        <td className="px-4 py-3 text-sm">{resource.capacity}</td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{resource.location}</td>
                                        <td className="px-4 py-3">{getBuildingBadge(resource.building)}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleStatusToggle(resource.id, resource.status)}
                                                className={`text-xs px-2 py-1 rounded-full ${resource.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                            >
                                                {resource.status === 'ACTIVE' ? 'Active' : 'Maintenance'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => openEditModal(resource)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">Edit</button>
                                                <button onClick={() => handleDelete(resource.id, resource.name)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {filteredResources.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                        <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 mb-2">No resources found.</p>
                        <p className="text-slate-400 text-sm">Try changing your filters or add a new resource.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white p-5 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-primary-dark">
                                {editingResource ? 'Edit Resource' : 'Add New Resource'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-primary-dark">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            {/* Image Upload */}
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                                {previewUrl ? (
                                    <div className="relative">
                                        <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                                        <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer py-8">
                                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                        <p className="text-slate-500 text-sm">Click to upload image</p>
                                        <p className="text-slate-400 text-xs">PNG, JPG, JPEG, GIF up to 5MB</p>
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Resource Code</label>
                                    <input type="text" value={formData.resourceCode} onChange={(e) => setFormData({...formData, resourceCode: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="e.g., F101" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                                    <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                                        {resourceTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Building *</label>
                                    <select required value={formData.building} onChange={(e) => setFormData({...formData, building: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                                        {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Capacity *</label>
                                    <input type="number" required min="1" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Floor/Level</label>
                                    <input type="text" value={formData.floor} onChange={(e) => setFormData({...formData, floor: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="e.g., Level 2" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                                <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                                <select required value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                                    {statusOptions.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none" />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:text-primary-dark">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-primary-dark text-white rounded-lg hover:bg-black">{editingResource ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetsManagement;