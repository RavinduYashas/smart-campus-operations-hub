import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, Clock, Search, ListTodo, Paperclip, Send, ArrowRight, Activity, Wrench, ShieldAlert, XCircle } from 'lucide-react';


const TechnicianQueue = () => {
    const [activeTab, setActiveTab] = useState('assigned'); // 'available' or 'assigned'

    const [availableTickets, setAvailableTickets] = useState([]);
    const [assignedTickets, setAssignedTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [commentTexts, setCommentTexts] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [availableRes, assignedRes] = await Promise.all([
                axios.get('/api/tickets/available'),
                axios.get('/api/tickets/assigned')
            ]);
            
            setAvailableTickets(availableRes.data);
            setAssignedTickets(assignedRes.data);
        } catch (error) {
            console.error("Error fetching technician queues", error);
        } finally {
            setLoading(false);
        }
    };


    // Helper for API calls
    const updateTicket = async (id, data) => {
        try {
            await axios.put(`/api/tickets/${id}`, data);
            fetchData(); 
        } catch (error) {
            console.error("Error updating ticket", error);
            alert("Failed to update ticket");
        }
    };

    const handleAccept = (ticketId) => {
        updateTicket(ticketId, { 
            assignedToEmail: 'tech@my.sliit.lk', // Fallback, the backend interceptor handles correct identity usually
            status: 'Assigned' 
        });
        setActiveTab('assigned');
    };

    const handleReject = (ticketId) => {
        if(window.confirm("Are you sure you want to reject this ticket? It will be marked as Closed.")) {
            updateTicket(ticketId, { 
                status: 'Closed',
                updateText: 'Ticket rejected by technician.'
            });
        }
    };

    const handleStatusChange = (ticketId, e) => {
        updateTicket(ticketId, { status: e.target.value });
    };

    const handleSendComment = (ticketId) => {
        const text = commentTexts[ticketId];
        if (!text || !text.trim()) return;
        
        updateTicket(ticketId, { updateText: text });
        setCommentTexts({...commentTexts, [ticketId]: ''});
    };


    const getStatusColor = (status) => {
        switch(status) {
            case 'Open': return 'bg-rose-500/10 text-rose-600 border-rose-200';
            case 'Assigned': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'In Progress': return 'bg-amber-500/10 text-amber-600 border-amber-200';
            case 'Resolved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
            case 'Closed': return 'bg-slate-500/10 text-slate-600 border-slate-200';
            default: return 'bg-slate-500/10 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Technician Workspace</h1>
            <p className="text-slate-500 mb-8 max-w-2xl">
                Manage your workload, provide real-time updates, and resolve campus incidents.
            </p>

            {/* Custom Tab Navigation */}
            <div className="flex space-x-2 mb-8 bg-slate-200/50 p-1 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('assigned')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        activeTab === 'assigned' 
                        ? 'bg-white text-slate-900 shadow-sm shadow-slate-200' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                    }`}
                >
                    <ListTodo size={18} />
                    My Assigned Tasks ({assignedTickets.length})
                </button>
                <button
                    onClick={() => setActiveTab('available')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        activeTab === 'available' 
                        ? 'bg-white text-slate-900 shadow-sm shadow-slate-200' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                    }`}
                >
                    <Search size={18} />
                    Available Incidents ({availableTickets.length})
                </button>
            </div>

            {/* Tab Contents */}
            <div className="relative">
                {activeTab === 'available' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {availableTickets.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100">
                                <Activity className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-700">No available incidents</h3>
                                <p className="text-slate-500">All caught up! Excellent work.</p>
                            </div>
                        ) : (
                            availableTickets.map((ticket) => (
                                <div key={ticket.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center hover:shadow-2xl transition-all">
                                    <div className="space-y-3 flex-grow">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-wider">{ticket.ticketId}</span>
                                            <span className={`text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest ${ticket.priority === 'Urgent' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                                {ticket.priority} Priority
                                            </span>
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-wider">{ticket.category}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800">{ticket.title}</h3>
                                        <p className="text-slate-500 font-medium">{ticket.description}</p>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <Clock size={14} /> Reported: {ticket.date}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 shrink-0">
                                        <button 
                                            onClick={() => handleAccept(ticket.id)}
                                            className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            Accept Task <ArrowRight size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleReject(ticket.id)}
                                            className="px-8 py-3 bg-white text-rose-500 border border-rose-200 rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            Reject <XCircle size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'assigned' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {assignedTickets.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100">
                                <Activity className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-700">No assigned tasks</h3>
                                <p className="text-slate-500">Pick up a new incident from the available queue.</p>
                            </div>
                        ) : (
                            assignedTickets.map((ticket, index) => (
                                <div key={ticket.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col xl:flex-row gap-8">
                                    {/* Left Column: Ticket Details */}
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-wider">{ticket.ticketId}</span>
                                                <span className={`text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-widest ${ticket.priority === 'Urgent' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                                    {ticket.priority} Priority
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-800 mb-2">{ticket.title}</h3>
                                            <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">{ticket.description}</p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Update Status</label>
                                            <select 
                                                className={`w-full p-4 rounded-xl border outline-none font-bold transition-all appearance-none cursor-pointer ${getStatusColor(ticket.status)} border-opacity-50 hover:border-opacity-100 shadow-sm`}
                                                value={ticket.status}
                                                onChange={(e) => handleStatusChange(ticket.id, e)}
                                            >
                                                <option className="text-slate-800" value="Assigned">Task Accepted (Assigned)</option>
                                                <option className="text-slate-800" value="In Progress">Work in Progress</option>
                                                <option className="text-slate-800" value="Resolved">Issue Resolved</option>
                                                <option className="text-slate-800" value="Closed">Task Closed</option>
                                            </select>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Paperclip size={14} /> Service Proof / Notes (Upload)
                                            </label>
                                            <div className="flex gap-4 items-center">
                                                <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all">
                                                    <Paperclip size={16} /> Choose File
                                                </button>
                                                <span className="text-sm text-slate-400 italic">Optional: Upload photo of repaired item</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Interaction & Updates */}
                                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-200 pb-4">
                                            <Wrench size={16} />
                                            Progress Updates
                                        </h4>
                                        
                                        <div className="flex-grow space-y-4 mb-6 overflow-y-auto max-h-60 pr-2">
                                            {ticket.updates && ticket.updates.length > 0 ? ticket.updates.map((update, idx) => (
                                                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                                    <p className="text-sm text-slate-700 font-medium">{update.text}</p>
                                                    <div className="text-[11px] font-bold text-accent-gold mt-2 uppercase tracking-wide">{update.authorName} &bull; {new Date(update.time).toLocaleString()}</div>
                                                </div>
                                            )) : (
                                                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center space-y-3">
                                                    <ShieldAlert size={32} className="opacity-20" />
                                                    <p className="text-sm">No updates posted yet. Keep the student informed of your progress!</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-auto">
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    placeholder="Type a progress update..." 
                                                    className="w-full p-4 pr-16 bg-white border border-slate-200 rounded-2xl focus:border-accent-gold focus:ring-4 focus:ring-accent-gold/10 transition-all outline-none text-sm font-medium shadow-sm"
                                                    value={commentTexts[ticket.id] || ''}
                                                    onChange={e => setCommentTexts({...commentTexts, [ticket.id]: e.target.value})}
                                                    onKeyDown={e => e.key === 'Enter' && handleSendComment(ticket.id)}
                                                />
                                                <button 
                                                    onClick={() => handleSendComment(ticket.id)} 
                                                    className="absolute right-2 top-2 p-2 bg-slate-900 text-white rounded-xl hover:bg-black hover:scale-105 active:scale-95 transition-all"
                                                >
                                                    <Send size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicianQueue;
