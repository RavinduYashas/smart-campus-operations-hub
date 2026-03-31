import React from 'react';

/**
 * GlobalTicketView Component (Module C - Admin)
 * 
 * Description: 
 * Strategic oversight of all incoming incident tickets.
 * Allows administrators to assign tasks to technicians and monitor resolution workflows.
 *
 * Requirements Mapping:
 * - Workflow: OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED.
 * - Assignment of staff members to individual tickets.
 * - Global incident prioritization and tracking.
 */
const GlobalTicketView = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-black text-slate-900 mb-2">Service Tickets</h1>
            <p className="text-slate-500 mb-10 font-bold uppercase tracking-widest text-xs">Global Incident Oversight</p>

            <div className="space-y-6">
                <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="space-y-4 flex-grow">
                             <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">OPEN</span>
                                 <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest leading-none">CRITICAL</span>
                             </div>
                             <h3 className="text-2xl font-black text-slate-900 leading-none">#T-8942 - HVAC Failure - Server Room A</h3>
                             <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">Temperature exceeding safe limits in Building G. Urgent hardware protection required.</p>
                        </div>
                        <div className="flex flex-col gap-4 w-full md:w-64">
                             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Assign Technician</span>
                             <select className="p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm focus:bg-white transition-all text-sm font-bold text-slate-900">
                                 <option>Select Staff...</option>
                                 <option>John Doe (Electrical)</option>
                                 <option>Jane Smith (Network)</option>
                             </select>
                             <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200">
                                 Dispatch Team
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalTicketView;
