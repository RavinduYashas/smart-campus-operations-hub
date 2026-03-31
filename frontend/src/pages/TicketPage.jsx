import React from 'react';
import { 
    Ticket, 
    Clock, 
    Tool, 
    CheckCircle2, 
    AlertCircle, 
    Search, 
    Filter,
    Plus,
    Wrench,
    ArrowRight
} from 'lucide-react';

/**
 * TicketPage Component
 * 
 * Description: Operational interface for technicians to manage maintenance 
 * and support requests. It features a streamlined queue system, 
 * detailed issue tracking, and real-time status updates for campus facilities.
 * Designed with a high-contrast emerald theme for clarity and action focus.
 * 
 * Roles: Accessible to TECHNICIAN only.
 */

const TicketPage = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            {/* Technician Header */}
            <header className="mb-12 animate-in fade-in slide-in-from-left duration-700">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-600 p-3 rounded-2xl shadow-xl shadow-emerald-200">
                            <Wrench className="text-white h-8 w-8" />
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Maintenance Ops</h1>
                    </div>
                    <button className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center gap-2">
                        <Plus className="w-5 h-5" /> New Ticket
                    </button>
                </div>
                <p className="text-gray-500 text-xl font-medium max-w-2xl px-1">
                    Manage active tickets, schedule equipment checks, and resolve facility issues.
                </p>
            </header>

            {/* Filter & Search Bar */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10 flex flex-wrap gap-4 items-center">
                <div className="flex-grow flex items-center bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:border-emerald-500">
                    <Search className="text-gray-400 mr-4 group-hover:text-emerald-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search ticket ID, building, or issue type..." 
                        className="bg-transparent border-none outline-none w-full text-gray-700 font-bold placeholder:text-gray-400"
                    />
                </div>
                <button className="bg-gray-50 px-8 py-4 rounded-2xl font-black text-gray-700 hover:bg-white hover:shadow-md transition-all border border-gray-100 flex items-center gap-2">
                    <Filter className="w-5 h-5" /> Filter Queue
                </button>
            </div>

            {/* Ticket Queue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TicketCard 
                    id="#T-8942"
                    title="HVAC Leakage - Building G"
                    priority="HIGH"
                    status="IN PROGRESS"
                    time="Created 25m ago"
                    desc="Water damage reported on 4th floor server room ceiling. Urgent inspection required."
                />
                <TicketCard 
                    id="#T-8938"
                    title="Smart Lock Malfunction"
                    priority="MEDIUM"
                    status="OPEN"
                    time="Created 42m ago"
                    desc="Library entrance gate not responding to NFC credentials. Manual override active."
                />
                <TicketCard 
                    id="#T-8935"
                    title="Power Surge - Lab 102"
                    priority="CRITICAL"
                    status="ON HOLD"
                    time="Created 1.5h ago"
                    desc="Stabilizer failure caused multiple workstation shutdowns. Spare parts ordered."
                />
                <div className="bg-gray-50 border-4 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-500">
                    <div className="bg-white p-6 rounded-full shadow-lg mb-6 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-12 h-12 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-400 group-hover:text-emerald-700 transition-colors">Clear Pending Tasks</h3>
                    <p className="text-gray-400 group-hover:text-emerald-600 transition-colors">Everything is running smoothly right now.</p>
                </div>
            </div>
        </div>
    );
};

const TicketCard = ({ id, title, priority, status, time, desc }) => {
    const priorityColor = {
        HIGH: "bg-rose-50 text-rose-600",
        MEDIUM: "bg-amber-50 text-amber-600",
        CRITICAL: "bg-gray-900 text-white"
    };

    return (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 flex flex-col group hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">{id}</span>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${priorityColor[priority]}`}>{priority}</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">{title}</h3>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed line-clamp-2">{desc}</p>
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase">{time}</span>
                </div>
                <button className="flex items-center gap-2 text-indigo-600 font-black hover:gap-4 transition-all">
                    Assign/Start <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default TicketPage;
