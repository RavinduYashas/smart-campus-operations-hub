import React from 'react';

/**
 * AssetsCatalogue Component (Module A)
 * 
 * Description: 
 * This page fulfills the requirement for maintaining a catalogue of bookable resources.
 * It allows users to search and filter lecture halls, labs, and equipment.
 *
 * Requirements Mapping:
 * - Search by Type, Capacity, Location.
 * - Resource metadata display (Type, Capacity, Status).
 */
const AssetsCatalogue = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-4">Assets & Facilities</h1>
      <p className="text-gray-600 mb-8">Browse and search for lecture halls, laboratories, and specialized equipment.</p>
      
      {/* Search & Filter UI (Skeleton) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Search by name..." className="p-2 border rounded-lg" />
            <select className="p-2 border rounded-lg"><option>All Types</option></select>
            <select className="p-2 border rounded-lg"><option>All Locations</option></select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resource Cards Placeholder */}
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
             <h3 className="font-semibold">L-01 Lecture Hall</h3>
             <p className="text-sm text-gray-500">Capacity: 120 | Location: Block A</p>
             <span className="inline-block mt-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default AssetsCatalogue;
