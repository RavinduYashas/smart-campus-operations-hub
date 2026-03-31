import { 
    Ticket, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Search,
    Filter,
    Plus,
    Wrench,
    ArrowRight,
    ChevronRight,
    MoreVertical
} from 'lucide-react';

const TicketPage = () => {
    return (
        <div className="p-6 md:p-10 lg:p-16 max-w-[1600px] mx-auto min-h-screen">
            {/* Header Area */}
            <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 animate-in fade-in slide-in-from-left duration-700">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-4 rounded-3xl shadow-2xl shadow-blue-200">
                            <Ticket className="text-white h-8 w-8" />
                        </div>
                        <div>
                             <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] block mb-1">Queue Management</span>
                             <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Active Workloads</h1>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group flex-grow lg:flex-none lg:w-80">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
                         <input 
                            type="text" 
                            placeholder="Filter tickets..." 
                            className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all shadow-sm"
                         />
                    </div>
                    <button className="p-3.5 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm">
                        <Filter size={20} />
                    </button>
                    <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-slate-200 hover:bg-black transition-all">
                        <Plus size={18} /> New Request
                    </button>
                </div>
            </header>

            {/* Status Summaries */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <StatusSummary icon={<Clock size={16} />} label="In Queue" count="12" color="text-amber-600" bg="bg-amber-50" />
                <StatusSummary icon={<Wrench size={16} />} label="In Progress" count="08" color="text-blue-600" bg="bg-blue-50" />
                <StatusSummary icon={<CheckCircle2 size={16} />} label="Resolved" count="142" color="text-emerald-600" bg="bg-emerald-50" />
                <StatusSummary icon={<AlertCircle size={16} />} label="Flagged" count="03" color="text-rose-600" bg="bg-rose-50" />
            </div>

            {/* Tickets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <TicketCard 
                    id="TCK-8842"
                    title="HVAC Failure - Building C"
                    location="North Wing, 3rd Floor"
                    priority="HIGH"
                    status="IN_PROGRESS"
                    time="42m ago"
                />
                <TicketCard 
                    id="TCK-8839"
                    title="Elevator Calibration"
                    location="Science Block A"
                    priority="MEDIUM"
                    status="PENDING"
                    time="1h ago"
                />
                <TicketCard 
                    id="TCK-8835"
                    title="Emergency Lighting Check"
                    location="Main Auditorium"
                    priority="LOW"
                    status="COMPLETED"
                    time="3h ago"
                />
                <TicketCard 
                    id="TCK-8830"
                    title="Smart Meter Offline"
                    location="Staff Residence G4"
                    priority="HIGH"
                    status="FLAGGED"
                    time="5h ago"
                />
            </div>
        </div>
    );
};

const StatusSummary = ({ icon, label, count, color, bg }) => (
    <div className={`${bg} p-6 rounded-[2rem] border border-white/50 flex flex-col gap-2 group transition-all hover:shadow-lg`}>
        <div className={`p-2.5 rounded-xl bg-white w-max ${color} shadow-sm group-hover:rotate-6 transition-transform`}>{icon}</div>
        <div className="flex items-end justify-between mt-2">
            <span className={`text-[10px] font-black uppercase tracking-widest ${color} opacity-60`}>{label}</span>
            <span className={`text-2xl font-black ${color}`}>{count}</span>
        </div>
    </div>
);

const TicketCard = ({ id, title, location, priority, status, time }) => {
    const priorityColors = {
        HIGH: "text-rose-600 bg-rose-50 border-rose-100",
        MEDIUM: "text-amber-600 bg-amber-50 border-amber-100",
        CRITICAL: "text-slate-900 bg-slate-100 border-slate-200",
        LOW: "text-emerald-600 bg-emerald-50 border-emerald-100"
    };

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 flex flex-col group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black text-slate-400 tracking-[0.2em]">{id}</span>
                <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase tracking-wider ${priorityColors[priority] || "bg-slate-50 text-slate-400"}`}>
                    {priority}
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2 opacity-70">
                    <Building2 size={14} /> {location}
                </p>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-slate-400">
                    <Clock size={14} /> {time}
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <MoreVertical size={20} />
                </button>
            </div>

            {/* Status Indicator */}
            <div className={`absolute top-0 right-0 w-1.5 h-full ${
                status === 'COMPLETED' ? 'bg-emerald-500' : 
                status === 'IN_PROGRESS' ? 'bg-blue-500' :
                status === 'FLAGGED' ? 'bg-rose-500' : 'bg-slate-200'
            }`}></div>
        </div>
    );
};

const Building2 = ({ size, className }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22V12h6v10"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M12 18h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M16 18h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path><path d="M8 18h.01"></path></svg>;

export default TicketPage;
