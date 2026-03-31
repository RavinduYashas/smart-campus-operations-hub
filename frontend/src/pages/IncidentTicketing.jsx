import React from 'react';

/**
 * IncidentTicketing Component (Module C)
 * 
 * Description: 
 * Handles the creation and tracking of maintenance and fault report tickets.
 * Permits attaching multiple images for evidence and community commenting.
 *
 * Requirements Mapping:
 * - Create tickets with Category, Description, and Priority.
 * - Image attachments (Max 3).
 * - Workflow: OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED.
 * - View own ticket status and latest updates.
 */
const IncidentTicketing = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-black text-slate-900 mb-2">Report a Fault</h1>
      <p className="text-slate-500 mb-10">Notify the maintenance team about equipment or facility issues on campus.</p>

      {/* Ticket Creation Form Skeleton */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-10">
        <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Issue / Category</label>
        <input type="text" placeholder="e.g., Broken Projector" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-6 shadow-sm focus:bg-white transition-all" />
        
        <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Detailed Description</label>
        <textarea rows="4" placeholder="Briefly describe the fault..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-6 focus:bg-white transition-all shadow-sm" />

        <div className="flex justify-between items-center bg-blue-50 p-6 rounded-2xl border border-blue-100/50">
            <span className="text-sm font-bold text-blue-700">Attach Evidence / Photos (Max 3)</span>
            <button className="bg-white px-4 py-2 border rounded-xl text-blue-600 font-bold shadow-sm">Browse Files</button>
        </div>

        <button className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all active:scale-95">
          Submit Report
        </button>
      </div>
    </div>
  );
};

export default IncidentTicketing;
