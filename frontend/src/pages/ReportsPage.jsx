import React from 'react';
import { 
    BarChart, 
    PieChart, 
    LineChart, 
    Calendar, 
    Download, 
    TrendingUp, 
    Target,
    Layers,
    ChevronDown,
    Map
} from 'lucide-react';

/**
 * ReportsPage Component
 * 
 * Description: Analytics and reporting dashboard for campus management.
 * It provides strategic insights into resource utilization, budget allocation,
 * environmental impact, and long-term facility trends.
 * Features a sophisticated amber/slate theme suitable for executive review.
 * 
 * Roles: Accessible to MANAGER only.
 */

const ReportsPage = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            {/* Manager Header */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-right duration-700">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="bg-amber-500 p-3 rounded-2xl shadow-xl shadow-amber-100">
                            <Layers className="text-white h-8 w-8" />
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Strategic Insights</h1>
                    </div>
                    <p className="text-gray-500 text-xl font-medium max-w-2xl px-1">
                        Review performance benchmarks, resource allocation, and budget forecasts.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="bg-white border-2 border-gray-100 px-6 py-4 rounded-2xl font-black shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-all">
                        <Calendar className="w-5 h-5" /> Last 30 Days <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:shadow-gray-300 hover:-translate-y-1 transition-all flex items-center gap-2">
                        <Download className="w-5 h-5" /> Export PDF
                    </button>
                </div>
            </header>

            {/* Strategic KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <KPICard 
                    title="Budget Utilization" 
                    value="78.2%" 
                    icon={<Target className="w-8 h-8 text-amber-500" />}
                    trend="+4.5% vs Q1"
                    desc="Current expenditure against annual facility budget."
                />
                <KPICard 
                    title="Resource Efficiency" 
                    value="92/100" 
                    icon={<TrendingUp className="w-8 h-8 text-blue-500" />}
                    trend="Optimal Range"
                    desc="Workforce productivity and equipment uptime metrics."
                />
                <KPICard 
                    title="Campus Coverage" 
                    value="14.2k" 
                    icon={<Map className="w-8 h-8 text-emerald-500" />}
                    trend="2 New Nodes Active"
                    desc="Total monitored square footage across smart sectors."
                />
            </div>

            {/* Visual Analytics Placeholder Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <ChartSection 
                    title="Energy Distribution Matrix" 
                    icon={<LineChart className="w-6 h-6 text-indigo-500" />} 
                    placeholder="Real-time multi-building energy consumption trend lines." 
                />
                <ChartSection 
                    title="Facility Maintenance Forecast" 
                    icon={<PieChart className="w-6 h-6 text-rose-500" />} 
                    placeholder="Predictive modeling of equipment failures based on usage cycles." 
                />
                <div className="lg:col-span-2 bg-gradient-to-r from-amber-900 to-gray-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-4xl font-black mb-6">Annual Sustainability Report</h2>
                        <p className="text-amber-100 text-lg mb-10 leading-relaxed font-medium">
                            Your smart campus has reduced overall carbon emissions by 22% this fiscal year. 
                            Download the full report to share these insights with the board.
                        </p>
                        <button className="bg-amber-400 text-amber-950 px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-amber-950/20 hover:bg-amber-300 transition-all active:scale-95 group-hover:px-12 transition-all">
                           Generate Executive Summary
                        </button>
                    </div>
                    {/* Abstract circular decorations */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] border-[50px] border-white/5 rounded-full animate-spin-slow"></div>
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, icon, trend, desc }) => (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 flex flex-col hover:shadow-2xl hover:shadow-amber-100/50 transition-all duration-500 group">
        <div className="flex items-center justify-between mb-8">
            <div className="bg-gray-50 p-4 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{trend}</span>
        </div>
        <h3 className="text-gray-500 font-bold mb-2 uppercase tracking-wide text-sm">{title}</h3>
        <span className="text-5xl font-black text-gray-900 mb-6 tracking-tight">{value}</span>
        <p className="text-gray-400 font-medium leading-relaxed border-t border-gray-50 pt-6">{desc}</p>
    </div>
);

const ChartSection = ({ title, icon, placeholder }) => (
    <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col min-h-[400px] group transition-all hover:bg-gray-50">
        <div className="flex items-center gap-3 mb-8">
            {icon}
            <h3 className="text-2xl font-black text-gray-900 group-hover:translate-x-2 transition-transform">{title}</h3>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 group-hover:bg-white transition-colors duration-500">
             <div className="animate-pulse bg-gray-200 h-24 w-24 rounded-full mb-6"></div>
             <p className="text-gray-400 text-center px-12 font-bold italic tracking-tight">{placeholder}</p>
        </div>
    </div>
);

export default ReportsPage;
