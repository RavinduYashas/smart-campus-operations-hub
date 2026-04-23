// src/pages/resource/AssetManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
    Plus, 
    Edit, 
    Trash2, 
    X, 
    Check,
    Search,
    Filter,
    MapPin,
    Users,
    Wifi,
    Building2,
    Monitor,
    ChevronDown,
    RefreshCw,
    AlertCircle
} from 'lucide-react';

const AssetManagement = () => {
    const { token, user } = useAuth();
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [bulkSelect, setBulkSelect] = useState([]);
    const [filterType, setFilterType] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        type: 'LECTURE_HALL',
        capacity: '',
        location: '',
        status: 'ACTIVE',
        description: '',
        imageUrl: '',
        availabilityWindows: []
    });

    // Check if user is ADMIN
    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-primary-dark mb-2">Access Denied</h1>
                    <p className="text-slate-500">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    const fetchResources = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/resources', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResources(response.data);
            setFilteredResources(response.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    useEffect(() => {
        let filtered = [...resources];
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(r => 
                r.name.toLowerCase().includes(term) ||
                r.location.toLowerCase().includes(term)
            );
        }
        
        if (filterType) {
            filtered = filtered.filter(r => r.type === filterType);
        }
        
        setFilteredResources(filtered);
    }, [searchTerm, filterType, resources]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingResource) {
                await axios.put(`http://localhost:8080/api/resources/${editingResource.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:8080/api/resources', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchResources();
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Error saving resource:', error);
            alert(error.response?.data?.message || 'Error saving resource');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/resources/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchResources();
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting resource:', error);
            alert('Error deleting resource');
        }
    };

    const handleBulkDelete = async () => {
        if (bulkSelect.length === 0) return;
        try {
            await axios.delete('http://localhost:8080/api/resources/bulk', {
                headers: { Authorization: `Bearer ${token}` },
                data: { ids: bulkSelect }
            });
            fetchResources();
            setBulkSelect([]);
        } catch (error) {
            console.error('Error bulk deleting:', error);
            alert('Error deleting resources');
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
        try {
            await axios.patch(`http://localhost:8080/api/resources/${id}/status?status=${newStatus}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchResources();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status');
        }
    };

    const handleBulkStatusUpdate = async (status) => {
        if (bulkSelect.length === 0) return;
        try {
            await axios.patch('http://localhost:8080/api/resources/bulk/status', 
                { ids: bulkSelect, status: status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchResources();
            setBulkSelect([]);
        } catch (error) {
            console.error('Error bulk updating status:', error);
            alert('Error updating status');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'LECTURE_HALL',
            capacity: '',
            location: '',
            status: 'ACTIVE',
            description: '',
            imageUrl: '',
            availabilityWindows: []
        });
        setEditingResource(null);
    };

    const openEditModal = (resource) => {
        setEditingResource(resource);
        setFormData({
            name: resource.name,
            type: resource.type,
            capacity: resource.capacity,
            location: resource.location,
            status: resource.status,
            description: resource.description || '',
            imageUrl: resource.imageUrl || '',
            availabilityWindows: resource.availabilityWindows || []
        });
        setShowModal(true);
    };

    const toggleSelectAll = () => {
        if (bulkSelect.length === filteredResources.length) {
            setBulkSelect([]);
        } else {
            setBulkSelect(filteredResources.map(r => r.id));
        }
    };

    const toggleSelect = (id) => {
        if (bulkSelect.includes(id)) {
            setBulkSelect(bulkSelect.filter(i => i !== id));
        } else {
            setBulkSelect([...bulkSelect, id]);
        }
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'LECTURE_HALL': return <Building2 className="w-4 h-4" />;
            case 'LAB': return <Wifi className="w-4 h-4" />;
            case 'MEETING_ROOM': return <Users className="w-4 h-4" />;
            default: return <Monitor className="w-4 h-4" />;
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

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-primary-dark text-white py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-2xl font-bold">Asset Management</h1>
                    <p className="text-slate-300 text-sm mt-1">Manage facilities, rooms, and equipment</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Toolbar */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="flex gap-3 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by name or location..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-gold outline-none"
                                />
                            </div>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-accent-gold outline-none"
                            >
                                <option value="">All Types</option>
                                <option value="LECTURE_HALL">Lecture Hall</option>
                                <option value="LAB">Lab</option>
                                <option value="MEETING_ROOM">Meeting Room</option>
                                <option value="EQUIPMENT">Equipment</option>
                            </select>
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={fetchResources}
                                className="p-2 text-slate-500 hover:text-primary-dark rounded-lg border border-slate-200"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => { resetForm(); setShowModal(true); }}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-lg text-sm hover:bg-black transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Resource
                            </button>
                        </div>
                    </div>
                    
                    {/* Bulk Actions */}
                    {bulkSelect.length > 0 && (
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                            <span className="text-sm text-slate-600">{bulkSelect.length} selected</span>
                            <button
                                onClick={() => handleBulkStatusUpdate('ACTIVE')}
                                className="px-3 py-1 text-xs bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
                            >
                                Set Active
                            </button>
                            <button
                                onClick={() => handleBulkStatusUpdate('OUT_OF_SERVICE')}
                                className="px-3 py-1 text-xs bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100"
                            >
                                Set Out of Service
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                            >
                                Delete Selected
                            </button>
                            <button
                                onClick={() => setBulkSelect([])}
                                className="px-3 py-1 text-xs text-slate-400 hover:text-slate-600"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>

                {/* Resources Table */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-dark"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="w-10 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={bulkSelect.length === filteredResources.length && filteredResources.length > 0}
                                            onChange={toggleSelectAll}
                                            className="rounded border-slate-300"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Capacity</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredResources.map((resource) => (
                                    <tr key={resource.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={bulkSelect.includes(resource.id)}
                                                onChange={() => toggleSelect(resource.id)}
                                                className="rounded border-slate-300"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-slate-600">
                                                {getTypeIcon(resource.type)}
                                                <span className="text-xs">{getTypeLabel(resource.type)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-primary-dark">{resource.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{resource.capacity}</td>
                                        <td className="px-4 py-3 text-slate-600">{resource.location}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleStatusToggle(resource.id, resource.status)}
                                                className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                                                    resource.status === 'ACTIVE'
                                                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                }`}
                                            >
                                                {resource.status === 'ACTIVE' ? 'Active' : 'Out of Service'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(resource)}
                                                    className="p-1.5 text-slate-400 hover:text-primary-dark rounded-lg hover:bg-slate-100 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(resource)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {filteredResources.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                No resources found
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-primary-dark">
                                {editingResource ? 'Edit Resource' : 'Add New Resource'}
                            </h2>
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="text-slate-400 hover:text-primary-dark"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none text-sm"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none text-sm"
                                >
                                    <option value="LECTURE_HALL">Lecture Hall</option>
                                    <option value="LAB">Lab</option>
                                    <option value="MEETING_ROOM">Meeting Room</option>
                                    <option value="EQUIPMENT">Equipment</option>
                                </select>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Capacity *</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none text-sm"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none text-sm"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="OUT_OF_SERVICE">Out of Service</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none text-sm resize-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-gold outline-none text-sm"
                                    placeholder="https://..."
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm text-slate-600 hover:text-primary-dark transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-primary-dark text-white rounded-lg hover:bg-black transition-colors"
                                >
                                    {editingResource ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-sm p-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-primary-dark mb-2">Delete Resource</h3>
                            <p className="text-slate-500 text-sm mb-6">
                                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm.id)}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetManagement;