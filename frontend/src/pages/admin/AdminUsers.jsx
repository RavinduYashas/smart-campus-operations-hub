import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Search, Shield, User, Wrench, BarChart2, Mail, Building, Trash2, AlertTriangle, X, UserPlus, Save } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('ALL');
    const [userToDelete, setUserToDelete] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'TECHNICIAN', department: '' });
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8080/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/admin/users/${userToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u.id !== userToDelete.id));
            setUserToDelete(null);
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please check permissions.");
            setUserToDelete(null);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:8080/api/admin/users', newUser, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers([res.data, ...users]);
            setShowAddModal(false);
            setNewUser({ name: '', email: '', password: '', role: 'TECHNICIAN', department: '' });
            alert("User created successfully!");
        } catch (error) {
            console.error("Error creating user:", error);
            alert(error.response?.data?.error || "Failed to create user. Ensure email is unique.");
        } finally {
            setAdding(false);
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'ADMIN': return <Shield size={16} className="text-amber-500" />;
            case 'MANAGER': return <BarChart2 size={16} className="text-blue-500" />;
            case 'TECHNICIAN': return <Wrench size={16} className="text-rose-500" />;
            default: return <User size={16} className="text-emerald-500" />;
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'MANAGER': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'TECHNICIAN': return 'bg-rose-50 text-rose-700 border-rose-200';
            default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        }
    };

    const rolesList = [
        { id: 'ALL', label: 'All Users' },
        { id: 'USER', label: 'Students' },
        { id: 'MANAGER', label: 'Managers' },
        { id: 'TECHNICIAN', label: 'Technicians' },
        { id: 'ADMIN', label: 'Admins' }
    ];

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesRole = activeTab === 'ALL' || user.role === activeTab;

        return matchesSearch && matchesRole;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">User Directory</h1>
                    <p className="text-slate-500 font-medium max-w-xl">
                        Manage all registered accounts, their roles, and system access levels.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-72 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium transition-all shadow-sm"
                        />
                    </div>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                    >
                        <UserPlus size={18} /> Add User
                    </button>
                </div>
            </header>

            {/* Role Filter Tabs */}
            <div className="flex overflow-x-auto pb-4 mb-4 gap-2 no-scrollbar">
                {rolesList.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                            activeTab === tab.id 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200 hover:text-slate-900'
                        }`}
                    >
                        {tab.label}
                        <span className={`ml-2 px-2 py-0.5 rounded-lg text-xs ${
                            activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'
                        }`}>
                            {tab.id === 'ALL' 
                                ? users.length 
                                : users.filter(u => u.role === tab.id).length}
                        </span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                    <p className="text-slate-500 font-medium">Loading user database...</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100">
                                    <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">User</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Role</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Contact</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Department</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                                        {getRoleIcon(user.role)}
                                                    </div>
                                                    <span className="font-bold text-sm text-slate-800">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border inline-flex items-center gap-1.5 ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                                    <Mail size={14} className="text-slate-400" />
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user.department ? (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                                        <Building size={14} className="text-slate-400" />
                                                        {user.department}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-sm italic">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button 
                                                    onClick={() => setUserToDelete(user)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center">
                                            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                <Users size={24} className="text-slate-300" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-1">No users found</h3>
                                            <p className="text-slate-500 text-sm">We couldn't find any users matching your search criteria.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 sm:p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className="h-14 w-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-100 shrink-0">
                                    <AlertTriangle size={28} />
                                </div>
                                <button 
                                    onClick={() => setUserToDelete(null)}
                                    className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete User Account</h3>
                            <p className="text-slate-500 mb-6 leading-relaxed">
                                Are you sure you want to delete <span className="font-bold text-slate-700">{userToDelete.name}</span>? This action is permanent and cannot be undone. All data associated with this user will be removed.
                            </p>
                            
                            <div className="flex items-center gap-3 w-full">
                                <button 
                                    onClick={() => setUserToDelete(null)}
                                    className="flex-1 px-5 py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-bold text-sm transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="flex-1 px-5 py-3.5 bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} /> Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <UserPlus size={20} />
                                    </div>
                                    Create Staff Account
                                </h2>
                                <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleCreateUser} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium" 
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        required 
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium" 
                                        placeholder="user@my.sliit.lk"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Temporary Password</label>
                                    <input 
                                        type="password" 
                                        required 
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium" 
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Role</label>
                                        <select 
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium appearance-none"
                                        >
                                            <option value="TECHNICIAN">Technician</option>
                                            <option value="MANAGER">Manager</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Department</label>
                                        <input 
                                            type="text" 
                                            value={newUser.department}
                                            onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium" 
                                            placeholder="e.g. IT Support"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowAddModal(false)}
                                        className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={adding}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                                    >
                                        {adding ? 'Creating...' : <><Save size={18} /> Create Account</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default AdminUsers;
