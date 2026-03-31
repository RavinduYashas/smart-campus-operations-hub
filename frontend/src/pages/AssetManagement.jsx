import React from 'react';

/**
 * AssetManagement Component (Module A - Admin)
 * 
 * Description: 
 * CRUD interface for administrators to manage the facility and asset catalogue.
 * Includes status updates (ACTIVE / OUT_OF_SERVICE) and metadata refinement.
 *
 * Requirements Mapping:
 * - Maintenance of resource catalogue (Lecture halls, Labs, Equipment).
 * - Capacity, Location, and Status management.
 */
const AssetManagement = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-black text-slate-900 mb-2">Asset Management</h1>
            <p className="text-slate-500 mb-10 font-bold uppercase tracking-widest text-xs">Global Facility Catalogue Control</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                    <div className="bg-slate-50 p-4 rounded-2xl w-max mb-6 group-hover:scale-110 transition-transform duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-blue-600"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22V12h6v10"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M12 18h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M16 18h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path><path d="M8 18h.01"></path></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 leading-none">Lecture Hall B-102</h3>
                    <p className="text-sm font-medium text-slate-500 mb-6">Capacity: 80 | Sector: East Block</p>
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Status</span>
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black tracking-tight uppercase">ACTIVE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetManagement;
