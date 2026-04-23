import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Ticket, Users, AlertTriangle, Settings, ChevronRight, Activity, Wrench, RefreshCcw, CheckCircle2, Search } from 'lucide-react';

const GlobalTicketView = () => {
    const [tickets, setTickets] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCategoriesModal, setShowCategoriesModal] = useState(false);
    const [categories] = useState(['Equipment / IT', 'Facility / Building', 'Software / System', 'Other']);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ticketRes, techRes] = await Promise.all([
                axios.get('/api/tickets/all'),
                axios.get('/api/user/by-role?role=TECHNICIAN')
            ]);
            setTickets(Array.isArray(ticketRes.data) ? ticketRes.data : []);
            setTechnicians(Array.isArray(techRes.data) ? techRes.data : []);
        } catch (err) {
            toast.error("Failed to load control data");
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    // Status Badge generator
    const getStatusBadge = (status) => {
        const specs = {
            'Open': 'bg-rose-500/10 text-rose-600 border-rose-200',
            'Assigned': 'bg-blue-500/10 text-blue-600 border-blue-200',
            'In Progress': 'bg-amber-500/10 text-amber-600 border-amber-200',
            'Resolved': 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
            'Closed': 'bg-slate-500/10 text-slate-600 border-slate-200'
        };
        const stClass = specs[status] || specs['Open'];
        return <span className={`px-3 py-1 text-[11px] font-bold rounded-lg border uppercase tracking-widest ${stClass}`}>{status}</span>;
    };

    // Updates a ticket's status persists to DB
    const updateTicket = async (id, payload) => {
        try {
            await axios.put(`/api/tickets/${id}`, payload);
            toast.success("Control updated successfully");
            fetchData(); // Refresh list
        } catch (err) {
            toast.error("Handshake failed with core server");
        }
    };

    const handleAssignment = async (id, e) => {
        const email = e.target.value;
        const status = email === 'Unassigned' ? 'Open' : 'Assigned';
        updateTicket(id, { assignedToEmail: email === 'Unassigned' ? null : email, status });
    };

    const handlePriorityChange = (id, priority) => {
        updateTicket(id, { priority });
    };

    const filteredTickets = tickets.filter(t => 
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Global Incident Control</h1>
                    <p className="text-slate-500 font-medium">Prioritize, route, and monitor all campus tasks.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setShowCategoriesModal(true)}
                        className="px-5 py-3 bg-white border border-slate-200 text-slate-700 hover:text-primary-dark hover:border-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm"
                    >
                        <Settings size={16} /> Manage Categories
                    </button>
                    <button className="px-5 py-3 bg-primary-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-200 hover:-translate-y-0.5 transition-all">
                        <Activity size={16} className="text-accent-gold" /> System Analytics
                    </button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Active', val: tickets.filter(t => ['Open', 'Assigned', 'In Progress'].includes(t.status)).length, icon: Activity, color: 'text-blue-500' },
                    { label: 'Unassigned', val: tickets.filter(t => t.status === 'Open').length, icon: AlertTriangle, color: 'text-rose-500' },
                    { label: 'In Progress', val: tickets.filter(t => t.status === 'In Progress').length, icon: Wrench, color: 'text-amber-500' },
                    { label: 'Resolved', val: tickets.filter(t => t.status === 'Resolved').length, icon: CheckCircle2, color: 'text-emerald-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 slide-in-from-bottom-8 animate-in" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-100 ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-800 leading-none mb-1">{stat.val}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Global Ticket Data Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative">
                 <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                     <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                         <Ticket className="text-secondary-blue" />
                         Incident Master List
                     </h3>
                     <div className="relative">
                         <input 
                            type="text" 
                            placeholder="Search ID or Keyword..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm w-64 focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/10 outline-none transition-all" 
                         />
                         <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
                     </div>
                 </div>

                 <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                         <thead>
                             <tr className="bg-slate-50/80 border-b border-slate-100 uppercase tracking-widest text-[10px] font-bold text-slate-400">
                                 <th className="py-4 px-8 font-bold">Ticket ID</th>
                                 <th className="py-4 px-4 font-bold">Issue Title</th>
                                 <th className="py-4 px-4 font-bold">Status</th>
                                 <th className="py-4 px-4 font-bold">Priority</th>
                                 <th className="py-4 px-4 font-bold">Assigned Tech</th>
                                 <th className="py-4 px-8 font-bold text-right">Admin Actions</th>
                             </tr>
                         </thead>
                         <tbody>
                             {filteredTickets.map((ticket) => (
                                 <tr key={ticket.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                     <td className="py-5 px-8">
                                         <div className="font-bold text-slate-700">{ticket.ticketId}</div>
                                         <div className="text-[11px] text-slate-400 font-medium">{new Date(ticket.createdAt).toLocaleString()}</div>
                                     </td>
                                     <td className="py-5 px-4 w-1/4">
                                         <div className="font-bold text-slate-800 truncate block max-w-xs">{ticket.title}</div>
                                         <div className="text-xs text-slate-500 font-medium">Reported by: {ticket.reporterEmail}</div>
                                     </td>
                                     <td className="py-5 px-4">
                                         {getStatusBadge(ticket.status)}
                                     </td>
                                     <td className="py-5 px-4">
                                        <select 
                                            className="bg-transparent font-bold text-sm text-slate-600 outline-none cursor-pointer border-b border-dashed border-slate-300 hover:border-slate-500"
                                            value={ticket.priority}
                                            onChange={(e) => handlePriorityChange(ticket.id, e.target.value)}
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Urgent">Urgent</option>
                                        </select>
                                     </td>
                                     <td className="py-5 px-4">
                                         <select 
                                            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none cursor-pointer hover:border-accent-gold transition-all"
                                            value={ticket.assignedToEmail || 'Unassigned'}
                                            onChange={(e) => handleAssignment(ticket.id, e)}
                                         >
                                            <option value="Unassigned">-- Unassigned --</option>
                                            {technicians.map(tech => (
                                                <option key={tech.id} value={tech.email}>{tech.name}</option>
                                            ))}
                                         </select>
                                     </td>
                                     <td className="py-5 px-8 text-right space-x-2">
                                         {ticket.status === 'Resolved' && (
                                            <button 
                                                onClick={() => updateTicket(ticket.id, { status: 'Closed' })}
                                                className="px-4 py-2 bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-emerald-600 transition-all shadow-sm"
                                            >
                                                Close Ticket
                                            </button>
                                         )}
                                         {ticket.status === 'Closed' && (
                                            <button 
                                                onClick={() => updateTicket(ticket.id, { status: 'Open' })}
                                                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-[10px] uppercase tracking-widest rounded-lg hover:bg-slate-300 transition-all shadow-sm inline-flex items-center gap-1"
                                            >
                                                <RefreshCcw size={12} /> Reopen
                                            </button>
                                         )}
                                         {['Open','Assigned','In Progress'].includes(ticket.status) && (
                                             <button 
                                                onClick={() => updateTicket(ticket.id, { status: 'Closed' })}
                                                className="px-4 py-2 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all shadow-sm"
                                            >
                                                Force Close
                                            </button>
                                         )}
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
            </div>

            {/* Categories Modal Overlay */}
            {showCategoriesModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCategoriesModal(false)}></div>
                    <div className="bg-white rounded-[2rem] p-8 max-w-md w-full relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Manage Categories</h3>
                        <div className="space-y-3 mb-6">
                            {categories.map((cat, i) => (
                                <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <span className="font-semibold text-slate-700">{cat}</span>
                                    <button className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg text-xs font-bold uppercase tracking-widest">Remove</button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mb-8">
                            <input type="text" placeholder="New category name" className="flex-1 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-accent-gold" />
                            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black">Add</button>
                        </div>
                        <button 
                            className="w-full py-4 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold tracking-widest uppercase text-sm"
                            onClick={() => setShowCategoriesModal(false)}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalTicketView;
