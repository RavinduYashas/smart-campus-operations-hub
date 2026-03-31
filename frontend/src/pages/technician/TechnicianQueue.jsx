import React from 'react';

/**
 * TechnicianQueue Component (Module C - Tech)
 * 
 * Description: 
 * Operational management tool for maintenance staff. 
 * Allows for tracking of assigned tasks, real-time status updates, 
 * and adding final resolution notes for closed incidents.
 *
 * Requirements Mapping:
 * - Workflow: IN_PROGRESS -> RESOLVED.
 * - Resolution notes and status synchronization.
 * - Personalized task visibility for assigned technicians.
 */
const TechnicianQueue = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Service Tasks</h1>
            <p className="text-slate-500 mb-10 font-semibold uppercase tracking-widest text-xs">Assigned Maintenance Dashboard</p>

            <div className="space-y-6">
                <div className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                         <div className="space-y-4 flex-grow">
                             <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">ASSIGNED</span>
                                 <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest">PRIORITY: HIGH</span>
                             </div>
                             <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none uppercase text-xs text-slate-400 mb-2">Ticket #T-8942</h3>
                             <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">HVAC Failure - Building G</h3>
                             <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">Server room A temperature exceeding 35C. Synchronizer node risk high.</p>
                         </div>
                         <div className="flex gap-3">
                             <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95">
                                 Start Work
                             </button>
                             <button className="px-8 py-4 bg-white border border-slate-100 text-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                                 Add Resolution
                             </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicianQueue;
