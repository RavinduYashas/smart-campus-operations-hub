// src/pages/resource/AssetsCatalogue.jsx
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
    ChevronRight, 
    Grid3x3,
    List,
    ChevronDown,
    RefreshCw,
    Building2,
    Monitor,
    Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AssetsCatalogue = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [filters, setFilters] = useState({
        type: '',
        minCapacity: '',
        location: '',
        status: 'ACTIVE'
    });

    const fetchResources = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
            if (filters.location) params.append('location', filters.location);
            if (filters.status) params.append('status', filters.status);
            
            const response = await axios.get(`http://localhost:8081/api/resources/search?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResources(response.data);
            setFilteredResources(response.data);
        } catch (err) {
            console.error('Error fetching resources:', err);
            setError('Failed to load resources. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [filters, token]);

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
            default: return <ChevronRight className="w-5 h-5" />;
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

    const handleBookResource = (resourceId) => {
        navigate(`/my-bookings?resource=${resourceId}`);
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
            <div className="bg-primary-dark text-white py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-2">Facilities & Assets Catalogue</h1>
                    <p className="text-slate-300">Browse and book available campus resources</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Search Bar */}
                <div className="mb-4">
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
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-primary-dark text-white' : 'bg-white text-slate-400'}`}
                        >
                            <Grid3x3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-primary-dark text-white' : 'bg-white text-slate-400'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={fetchResources}
                            className="p-1.5 rounded-lg bg-white text-slate-400 hover:text-primary-dark"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-xl p-4 border border-slate-200 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({...filters, type: e.target.value})}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-gold outline-none"
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
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-gold outline-none"
                            />
                            
                            <input
                                type="text"
                                placeholder="Location"
                                value={filters.location}
                                onChange={(e) => setFilters({...filters, location: e.target.value})}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-gold outline-none"
                            />
                            
                            <button
                                onClick={clearFilters}
                                className="px-3 py-2 text-slate-500 hover:text-primary-dark text-sm transition-colors"
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

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Resources Grid/List */}
                {filteredResources.length === 0 && !error ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                        <p className="text-slate-500">No resources found matching your criteria.</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredResources.map((resource) => (
                            <ResourceCard 
                                key={resource.id} 
                                resource={resource} 
                                onBook={handleBookResource}
                                getTypeIcon={getTypeIcon}
                                getTypeLabel={getTypeLabel}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredResources.map((resource) => (
                            <ResourceListItem 
                                key={resource.id} 
                                resource={resource} 
                                onBook={handleBookResource}
                                getTypeIcon={getTypeIcon}
                                getTypeLabel={getTypeLabel}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Resource Card Component (Grid View)
const ResourceCard = ({ resource, onBook, getTypeIcon, getTypeLabel }) => {
    const [imageError, setImageError] = useState(false);
    
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
            {resource.imageUrl && !imageError ? (
                <img 
                    src={resource.imageUrl} 
                    alt={resource.name} 
                    className="w-full h-40 object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="w-full h-40 bg-gradient-to-r from-primary-dark/10 to-secondary-blue/10 flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-primary-dark/30" />
                </div>
            )}
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                        {getTypeIcon(resource.type)}
                        <span className="text-xs font-medium text-accent-orange uppercase">
                            {getTypeLabel(resource.type)}
                        </span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                        resource.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-red-50 text-red-600'
                    }`}>
                        {resource.status === 'ACTIVE' ? 'Available' : 'Out of Service'}
                    </span>
                </div>
                
                <h3 className="text-lg font-bold text-primary-dark mb-1">{resource.name}</h3>
                <p className="text-slate-500 text-sm mb-3 line-clamp-2">{resource.description || 'No description available'}</p>
                
                <div className="space-y-1.5 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{resource.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Users className="w-3.5 h-3.5" />
                        <span>Capacity: {resource.capacity} people</span>
                    </div>
                </div>
                
                <button
                    onClick={() => onBook(resource.id)}
                    disabled={resource.status !== 'ACTIVE'}
                    className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${
                        resource.status === 'ACTIVE'
                            ? 'bg-primary-dark text-white hover:bg-black'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    {resource.status === 'ACTIVE' ? 'Book This Resource' : 'Unavailable'}
                </button>
            </div>
        </div>
    );
};

// Resource List Item Component (List View)
const ResourceListItem = ({ resource, onBook, getTypeIcon, getTypeLabel }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        {getTypeIcon(resource.type)}
                    </div>
                    <div>
                        <h3 className="font-bold text-primary-dark">{resource.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{resource.location}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{resource.capacity}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        {getTypeLabel(resource.type)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        resource.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                        {resource.status === 'ACTIVE' ? 'Available' : 'Out of Service'}
                    </span>
                    <button
                        onClick={() => onBook(resource.id)}
                        disabled={resource.status !== 'ACTIVE'}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            resource.status === 'ACTIVE'
                                ? 'bg-primary-dark text-white hover:bg-black'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        Book
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssetsCatalogue;