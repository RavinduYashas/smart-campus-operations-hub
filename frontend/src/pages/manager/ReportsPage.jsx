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
    Map,
    ArrowUpRight,
    Search
} from 'lucide-react';

const ReportsPage = () => {
    return (
        <div className="p-6 md:p-10 lg:p-16 max-w-[1600px] mx-auto min-h-screen">
            {/* Executive Header */}
            <header className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8 animate-in fade-in slide-in-from-right duration-700">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-500 p-4 rounded-3xl shadow-2xl shadow-amber-200 -rotate-2 hover:rotate-0 transition-transform duration-500">
                            <Layers className="text-white h-8 w-8" />
                        </div>
                        <div>
                             <span className="text-amber-600 font-bold text-[10px] uppercase tracking-[0.4em] block mb-1">Executive Analytics</span>
                             <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">Strategic Intelligence</h1>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-white border border-slate-100 p-2 rounded-2xl flex items-center gap-2 shadow-sm">
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Q3 2026</button>
                        <button className="px-4 py-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-slate-900 transition-colors">Historical</button>
                    </div>
                    <button className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-amber-200 hover:bg-amber-600 transition-all">
                        <Download size={18} /> Export Briefing
                    </button>
                </div>
            </header>

            {/* Strategic KPI Core */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <KPICard 
                    title="Fiscal Efficiency" 
                    value="94.2%" 
                    trend="+2.4%"
                    icon={<Target className="w-6 h-6 text-amber-600" />}
                    desc="Operational spend vs. automated savings model."
                    accent="bg-amber-50"
                />
                <KPICard 
                    title="Carbon Offset" 
                    value="12.8t" 
                    trend="-18%"
                    icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
                    desc="Net reduction in building energy footprints."
                    accent="bg-emerald-50"
                />
                <KPICard 
                    title="Asset Lifecycle" 
                    value="8.2y" 
                    trend="+1.2y"
                    icon={<Map className="w-6 h-6 text-blue-600" />}
                    desc="Extended equipment longevity via predictive maintenance."
                    accent="bg-blue-50"
                />
            </div>

            {/* Visual Intelligence Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Visualizer */}
                <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] p-10 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
                            <BarChart className="text-amber-500" /> Resource Distribution Matrix
                        </h2>
                        <div className="flex gap-2">
                             <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                             <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                             <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                        </div>
                    </div>
                    
                    <div className="aspect-[16/7] bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 text-center group-hover:bg-white transition-all duration-700 relative z-10">
                        <div className="bg-white p-6 rounded-3xl shadow-xl mb-6 relative">
                            <LineChart size={48} className="text-slate-200 group-hover:text-blue-500 transition-colors duration-700" />
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-rose-500 rounded-full animate-ping"></div>
                        </div>
                        <p className="text-slate-400 font-semibold max-w-sm italic leading-relaxed">
                            Inter-building energy orchestration telemetry currently synchronizing with the central hub.
                        </p>
                    </div>

                    {/* Gradient Flare */}
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-amber-500/5 to-transparent pointer-events-none"></div>
                </div>

                {/* Sustainability Highlight */}
                <div className="lg:col-span-4 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl flex flex-col justify-between group overflow-hidden relative">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-bold uppercase tracking-widest mb-8 border border-emerald-500/20">
                             Board Briefing Ready
                        </div>
                        <h3 className="text-4xl font-bold tracking-tighter leading-[0.95] mb-6">Green Campus <br /> Initiative</h3>
                        <p className="text-slate-400 font-medium leading-relaxed mb-10">
                            Smart sector S-04 achieved a record energy recovery rate of 34% this month. Ready for executive review.
                        </p>
                    </div>

                    <button className="bg-white text-slate-900 py-5 rounded-2xl font-bold text-sm shadow-xl shadow-white/5 hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-3 relative z-10">
                        View Detailed Audit <ArrowUpRight size={18} />
                    </button>

                    {/* Background Visual */}
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, trend, icon, desc, accent }) => (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 hover:-translate-y-2 group flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
            <div className={`${accent} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>{icon}</div>
            <div className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {trend}
            </div>
        </div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</h3>
        <div className="text-5xl font-bold text-slate-900 tracking-tighter leading-none mb-6">{value}</div>
        <div className="mt-auto pt-6 border-t border-slate-50">
            <p className="text-xs font-medium text-slate-500 leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default ReportsPage;
