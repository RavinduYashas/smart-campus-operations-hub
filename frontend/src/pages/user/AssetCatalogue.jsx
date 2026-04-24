// frontend/src/pages/resource/AssetsCatalogue.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
    Search, 
    Filter, 
    MapPin, 
    Users, 
    Wifi, 
    Building2,
    Monitor,
    ChevronDown,
    RefreshCw,
    Landmark,
    HardDrive,
    School,
    Trees,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AssetsCatalogue = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [showFilters, setShowFilters] = useState(true);

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

    // Resource Types
    const resourceTypes = [
        { id: 'LECTURE_HALL', name: 'Lecture Hall', icon: <Users className="w-4 h-4" /> },
        { id: 'LAB', name: 'Laboratory', icon: <Wifi className="w-4 h-4" /> },
        { id: 'MEETING_ROOM', name: 'Meeting Room', icon: <Building2 className="w-4 h-4" /> },
        { id: 'EQUIPMENT', name: 'Equipment', icon: <Monitor className="w-4 h-4" /> },
        { id: 'OTHER', name: 'Other', icon: <Building2 className="w-4 h-4" /> }
    ];

    // SLIIT Buildings
    const buildings = [
        { id: 'Main Building', name: 'Main Building', icon: <Landmark className="w-4 h-4" /> },
        { id: 'New Building', name: 'New Building', icon: <Building2 className="w-4 h-4" /> },
        { id: 'Engineering Building', name: 'Engineering Building', icon: <HardDrive className="w-4 h-4" /> },
        { id: 'Business School Building', name: 'Business School Building', icon: <School className="w-4 h-4" /> },
        { id: 'Other', name: 'Special Locations', icon: <Trees className="w-4 h-4" /> }
    ];

    const fetchResources = useCallback(async () => {
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
    }, [API_URL]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    // Apply filters
    useEffect(() => {
        let filtered = [...resources];
        
        // Filter by search term
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(r => 
                r.name?.toLowerCase().includes(term) ||
                (r.resourceCode && r.resourceCode.toLowerCase().includes(term)) ||
                (r.location && r.location.toLowerCase().includes(term)) ||
                (r.description && r.description.toLowerCase().includes(term))
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
        
        // Only show ACTIVE resources to students
        filtered = filtered.filter(r => r.status === 'ACTIVE');
        
        setFilteredResources(filtered);
    }, [searchTerm, selectedBuilding, selectedType, resources]);

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

    const getBuildingIcon = (building) => {
        const buildingInfo = buildings.find(b => b.id === building);
        return buildingInfo ? buildingInfo.icon : <Building2 className="w-3 h-3" />;
    };

    const clearFilters = () => {
        setSelectedBuilding('all');
        setSelectedType('all');
        setSearchTerm('');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-dark to-secondary-blue text-white">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <h1 className="text-3xl font-bold">Facilities & Assets Catalogue</h1>
                    <p className="text-slate-300 mt-2">Browse and book available campus resources</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        {buildings.map(b => (
                            <span key={b.id} className="flex items-center gap-1 text-xs text-slate-300">
                                {b.icon}
                                {b.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, code, location, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-accent-gold focus:border-accent-gold outline-none"
                        />
                    </div>
                </div>

                {/* Filters Toggle */}
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                    <button
                        onClick={fetchResources}
                        className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                    >
                        <RefreshCw className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-xl p-5 border border-slate-200 mb-6">
                        {/* Building Filters */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Building</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedBuilding('all')}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                        selectedBuilding === 'all' 
                                            ? 'bg-primary-dark text-white' 
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    All Buildings
                                </button>
                                {buildings.map(building => (
                                    <button
                                        key={building.id}
                                        onClick={() => setSelectedBuilding(building.id)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                                            selectedBuilding === building.id 
                                                ? 'bg-primary-dark text-white' 
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {building.icon}
                                        {building.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Type Filters */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Type</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedType('all')}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                        selectedType === 'all' 
                                            ? 'bg-primary-dark text-white' 
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    All Types
                                </button>
                                {resourceTypes.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                                            selectedType === type.id 
                                                ? 'bg-primary-dark text-white' 
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {type.icon}
                                        {type.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        {(selectedBuilding !== 'all' || selectedType !== 'all' || searchTerm) && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-accent-orange hover:underline mt-2"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}

                {/* Results Count */}
                <div className="mb-4 text-sm text-slate-500">
                    Found {filteredResources.length} active resource{filteredResources.length !== 1 ? 's' : ''}
                </div>

                {/* Resources Grid */}
                {filteredResources.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                        <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No resources found matching your criteria.</p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 text-accent-orange hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((resource) => (
                            <div key={resource.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
                                {/* Image */}
                                <div className="relative h-48 bg-gradient-to-r from-primary-dark/10 to-secondary-blue/10">
                                    {resource.imageUrl ? (
                                        <img 
                                            src={resource.imageUrl} 
                                            alt={resource.name} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Building2 className="w-16 h-16 text-primary-dark/20" />
                                        </div>
                                    )}
                                    {/* Building Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className="text-xs px-2 py-1 rounded-full bg-white/90 shadow-sm flex items-center gap-1">
                                            {getBuildingIcon(resource.building)}
                                            <span className="text-slate-700">{resource.building}</span>
                                        </span>
                                    </div>
                                    {/* Status Badge */}
                                    <div className="absolute bottom-3 left-3">
                                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Available
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-5">
                                    {/* Type */}
                                    <div className="flex items-center gap-2 mb-3">
                                        {getTypeIcon(resource.type)}
                                        <span className="text-xs font-semibold text-accent-orange uppercase">
                                            {getTypeLabel(resource.type)}
                                        </span>
                                    </div>
                                    
                                    {/* Name */}
                                    <h3 className="text-xl font-bold text-primary-dark mb-2">{resource.name}</h3>
                                    
                                    {/* Resource Code */}
                                    {resource.resourceCode && (
                                        <p className="text-xs text-slate-400 mb-2">Code: {resource.resourceCode}</p>
                                    )}
                                    
                                    {/* Description */}
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                                        {resource.description || 'No description available'}
                                    </p>
                                    
                                    {/* Details */}
                                    <div className="space-y-2 mb-5">
                                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            <span>{resource.location}{resource.floor ? `, ${resource.floor}` : ''}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span>Capacity: {resource.capacity} people</span>
                                        </div>
                                    </div>
                                    
                                    {/* Book Button */}
                                    <button
                                        onClick={() => navigate(`/my-bookings?resource=${resource.id}`)}
                                        className="w-full py-2.5 rounded-lg font-semibold transition-all bg-primary-dark text-white hover:bg-black hover:-translate-y-0.5"
                                    >
                                        Book This Resource
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssetsCatalogue;