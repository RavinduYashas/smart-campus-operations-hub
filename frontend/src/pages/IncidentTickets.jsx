import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Ticket, PlusCircle, Paperclip, Clock, CheckCircle, Wrench, AlertCircle, X, Edit, Trash2 } from 'lucide-react';




const IncidentTickets = () => {
    const [activeTab, setActiveTab] = useState('my-tickets'); // 'my-tickets' or 'new-incident'

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState([]);

    // For editing an existing ticket
    const [editingTicketId, setEditingTicketId] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8080/api/tickets/my-tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tickets:", error);
            setLoading(false);
        }
    };

    const submitTicket = async () => {
        if (!title || !category || !location || !description) return alert("Please fill all fields");

        try {
            const token = localStorage.getItem('token');
            const data = {
                title,
                category,
                location,
                description,
                attachments: attachments.map(f => f.name) // Currently only saving filenames as per backend stub
            };

            if (editingTicketId) {
                const res = await axios.put(`http://localhost:8080/api/tickets/${editingTicketId}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTickets(tickets.map(t => t.id === editingTicketId ? res.data : t));
                setEditingTicketId(null);
            } else {
                const res = await axios.post('http://localhost:8080/api/tickets', data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Add new ticket to top of list
                setTickets([res.data, ...tickets]);
            }

            setActiveTab('my-tickets');

            // Clear form
            setTitle(''); setCategory(''); setLocation(''); setDescription(''); setAttachments([]);
        } catch (error) {
            console.error("Error creating ticket:", error);
            alert("Failed to submit ticket.");
        }
    };

    const handleEdit = (ticket) => {
        setEditingTicketId(ticket.id);
        setTitle(ticket.title);
        setCategory(ticket.category);
        setLocation(ticket.location);
        setDescription(ticket.description);
        setAttachments([]); // Reset attachments for edit mode since we rely on file handles
        setActiveTab('new-incident');
    };

    const handleDelete = async (ticketId) => {
        if (!window.confirm("Are you sure you want to delete this ticket?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/tickets/${ticketId}`);
            setTickets(tickets.filter(t => t.id !== ticketId));
        } catch (error) {
            console.error("Error deleting ticket:", error);
            alert("Failed to delete ticket.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'In Progress': return 'bg-amber-500/10 text-amber-600 border-amber-200';
            case 'Resolved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
            default: return 'bg-slate-500/10 text-slate-600 border-slate-200';
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setAttachments([...attachments, ...newFiles]);
        }
    };

    const removeAttachment = (indexToRemove) => {
        setAttachments(attachments.filter((_, idx) => idx !== indexToRemove));
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Incident Center</h1>
            <p className="text-slate-500 mb-8 max-w-2xl">
                Report faults, track your existing tickets, review technician updates, and attach evidence all in one place.
            </p>

            {/* Custom Tab Navigation */}
            <div className="flex space-x-2 mb-8 bg-slate-200/50 p-1 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('my-tickets')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'my-tickets'
                        ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                        }`}
                >
                    <Ticket size={18} />
                    My Tickets
                </button>
                <button
                    onClick={() => setActiveTab('new-incident')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'new-incident'
                        ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                        }`}
                >
                    <PlusCircle size={18} />
                    Create New Incident
                </button>
            </div>

            {/* Tab Contents */}
            <div className="relative">
                {activeTab === 'my-tickets' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {loading && <p className="text-slate-500 font-bold p-4">Loading your tickets...</p>}
                        {!loading && tickets.length === 0 && <p className="text-slate-500 font-bold p-4">No tickets reported yet.</p>}

                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-50 pb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-wider">{ticket.ticketId}</span>
                                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-wider">{ticket.category}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">{ticket.title}</h3>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                                        <div className={`px-4 py-1.5 rounded-xl text-sm font-bold border flex items-center gap-2 ${getStatusColor(ticket.status)}`}>
                                            {ticket.status === 'Resolved' ? <CheckCircle size={16} /> : <Clock size={16} />}
                                            {ticket.status}
                                        </div>
                                        <span className="text-sm font-medium text-slate-400">
                                            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Unknown'}
                                        </span>
                                        {ticket.status === 'Open' && (
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleEdit(ticket)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="Edit Ticket">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(ticket.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete Ticket">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Technician Updates Section */}
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5">
                                            <Wrench size={100} />
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Wrench size={16} />
                                            Technician Updates
                                        </h4>
                                        <div className="space-y-4">
                                            {ticket.updates && ticket.updates.map((update, idx) => (
                                                <div key={idx} className="relative pl-4 border-l-2 border-accent-gold/50 py-1">
                                                    <p className="text-sm text-slate-700 font-medium">{update.text}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs font-bold text-accent-gold">{update.authorName}</span>
                                                        <span className="text-xs text-slate-400">&bull; {new Date(update.time).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!ticket.updates || ticket.updates.length === 0) && (

                                                <p className="text-sm text-slate-400 italic">No updates from technicians yet.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Attachments Section */}
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <Paperclip size={16} />
                                            Attachments
                                        </h4>
                                        {ticket.attachments && ticket.attachments.length > 0 ? (
                                            <div className="flex flex-wrap gap-3">
                                                {ticket.attachments.map((file, idx) => (

                                                    <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm cursor-pointer hover:border-accent-gold transition-all">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                            <Paperclip size={14} />
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-600 truncate max-w-[120px]">{file}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">No attachments for this ticket.</p>
                                        )}

                                        {/* Action to add more attachments to open ticket */}
                                        {ticket.status !== 'Resolved' && (
                                            <button className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all">
                                                <PlusCircle size={14} /> Add Attachment
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'new-incident' && (
                    <div className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 animate-in fade-in slide-in-from-right-8 duration-500 max-w-3xl">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                                <AlertCircle size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{editingTicketId ? 'Edit Incident Ticket' : 'Report an Issue'}</h2>
                                <p className="text-slate-500">{editingTicketId ? 'Update details for your reported incident.' : 'Describe the problem so our technicians can assist you.'}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Issue Title</label>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="e.g., Projector completely dead in Room 4A" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10 transition-all outline-none font-medium" />
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10 transition-all outline-none font-medium appearance-none">
                                        <option value="">Select Category</option>
                                        <option value="equipment">Equipment / IT</option>
                                        <option value="facility">Facility / Building</option>
                                        <option value="software">Software / System</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Location</label>
                                    <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" placeholder="e.g., Library 2nd Floor" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10 transition-all outline-none font-medium" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Detailed Description</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" placeholder="Briefly describe what happened..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10 transition-all outline-none font-medium resize-none" />
                            </div>


                            <div className="pt-4 border-t border-slate-100">
                                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Paperclip size={16} /> Attach Evidence (Photos/Docs)
                                </label>
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    className="border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all rounded-3xl p-8 text-center cursor-pointer group mb-4"
                                >
                                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-all">
                                        <PlusCircle size={24} className="text-slate-400" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-700 mb-1">Click to upload or drag & drop</h4>
                                    <p className="text-sm text-slate-500">SVG, PNG, JPG or PDF (max. 5MB)</p>
                                </div>

                                {/* Hidden input */}
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    multiple
                                    onChange={handleFileChange}
                                />

                                {/* Selected Files Preview */}
                                {attachments.length > 0 && (
                                    <div className="flex flex-wrap gap-3">
                                        {attachments.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between gap-3 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                        <Paperclip size={14} />
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-600 truncate max-w-[150px]">{file.name}</span>
                                                </div>
                                                <button onClick={() => removeAttachment(idx)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 flex justify-end gap-4">
                                <button onClick={() => {
                                    setEditingTicketId(null);
                                    setTitle(''); setCategory(''); setLocation(''); setDescription(''); setAttachments([]);
                                    setActiveTab('my-tickets');
                                }} className="px-8 py-4 text-slate-500 font-bold hover:text-slate-700 transition-colors uppercase tracking-widest text-sm">
                                    Cancel
                                </button>
                                <button onClick={submitTicket} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 hover:-translate-y-1 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-3">
                                    {editingTicketId ? 'Update Ticket' : 'Submit Ticket'} <CheckCircle size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncidentTickets;
