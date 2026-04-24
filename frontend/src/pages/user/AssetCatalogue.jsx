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
    Coffee, 
    Building2,
    Monitor,
    ChevronDown,
    RefreshCw,
    Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AssetCatalogue = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    
    const [filters, setFilters] = useState({
        type: '',
        minCapacity: '',
        location: '',
        status: 'ACTIVE'
    });

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    const fetchResources = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
            if (filters.location) params.append('location', filters.location);
            if (filters.status) params.append('status', filters.status);
            
            const response = await axios.get(`${API_URL}/api/resources/search?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResources(response.data);
            setFilteredResources(response.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    }, [filters, token, API_URL]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredResources(resources);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = resources.filter(resource => 
                resource.name.toLowerCase().includes(term) ||
                (resource.description && resource.description.toLowerCase().includes(term)) ||
                resource.location.toLowerCase().includes(term)
            );
            setFilteredResources(filtered);
        }
    }, [searchTerm, resources]);

    const getTypeIcon = (type) => {
        switch(type) {
            case 'LECTURE_HALL': return <Building2 className="w-5 h-5" />;
            case 'LAB': return <Wifi className="w-5 h-5" />;
            case 'MEETING_ROOM': return <Users className="w-5 h-5" />;
            case 'EQUIPMENT': return <Monitor className="w-5 h-5" />;
            default: return <Building2 className="w-5 h-5" />;
        }
    };

    const getTypeLabel = (type) => {
        switch(type) {
            case 'LECTURE_HALL': return 'Lecture Hall';
            case 'LAB': return 'Lab';
            case 'MEETING_ROOM': return 'Meeting Room';
            case 'EQUIPMENT': return 'Equipment';
            default: return type;
        }
    };

    const clearFilters = () => {
        setFilters({
            type: '',
            minCapacity: '',
            location: '',
            status: 'ACTIVE'
        });
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
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, description, or location..."
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({...filters, type: e.target.value})}
                                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none"
                            >
                                <option value="">All Types</option>
                                <option value="LECTURE_HALL">Lecture Hall</option>
                                <option value="LAB">Lab</option>
                                <option value="MEETING_ROOM">Meeting Room</option>
                                <option value="EQUIPMENT">Equipment</option>
                            </select>
                            
                            <input
                                type="number"
                                placeholder="Min Capacity"
                                value={filters.minCapacity}
                                onChange={(e) => setFilters({...filters, minCapacity: e.target.value})}
                                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none"
                            />
                            
                            <input
                                type="text"
                                placeholder="Location"
                                value={filters.location}
                                onChange={(e) => setFilters({...filters, location: e.target.value})}
                                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none"
                            />
                            
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-slate-500 hover:text-primary-dark transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="mb-4 text-sm text-slate-500">
                    Found {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
                </div>

                {/* Resources Grid */}
                {filteredResources.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                        <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No resources found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((resource) => (
                            <div key={resource.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Image */}
                                {resource.imageUrl ? (
                                    <img 
                                        src={resource.imageUrl} 
                                        alt={resource.name} 
                                        className="w-full h-48 object-cover"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-r from-primary-dark/10 to-secondary-blue/10 flex items-center justify-center">
                                        <Building2 className="w-16 h-16 text-primary-dark/30" />
                                    </div>
                                )}
                                
                                <div className="p-5">
                                    {/* Type & Status */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(resource.type)}
                                            <span className="text-xs font-semibold text-accent-orange uppercase">
                                                {getTypeLabel(resource.type)}
                                            </span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            resource.status === 'ACTIVE' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {resource.status === 'ACTIVE' ? 'Available' : 'Unavailable'}
                                        </span>
                                    </div>
                                    
                                    {/* Name */}
                                    <h3 className="text-xl font-bold text-primary-dark mb-2">{resource.name}</h3>
                                    
                                    {/* Description */}
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                                        {resource.description || 'No description available'}
                                    </p>
                                    
                                    {/* Details */}
                                    <div className="space-y-2 mb-5">
                                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <MapPin className="w-4 h-4" />
                                            <span>{resource.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <Users className="w-4 h-4" />
                                            <span>Capacity: {resource.capacity} people</span>
                                        </div>
                                    </div>
                                    
                                    {/* Book Button */}
                                    <button
                                        onClick={() => navigate(`/my-bookings?resource=${resource.id}`)}
                                        disabled={resource.status !== 'ACTIVE'}
                                        className={`w-full py-2.5 rounded-lg font-semibold transition-colors ${
                                            resource.status === 'ACTIVE'
                                                ? 'bg-primary-dark text-white hover:bg-black'
                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {resource.status === 'ACTIVE' ? 'Book This Resource' : 'Currently Unavailable'}
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

export default AssetCatalogue;