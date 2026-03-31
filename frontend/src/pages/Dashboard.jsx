import { 
    LayoutDashboard, 
    Users, 
    Ticket, 
    BarChart, 
    TrendingUp,
    Activity,
    Zap,
    ChevronRight,
    Search
} from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="p-6 md:p-10 lg:p-16 max-w-[1600px] mx-auto min-h-screen bg-slate-50/30">
            {/* Contextual Header */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-left duration-700">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-accent-gold rounded-full"></div>
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Operational OS</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-primary-dark tracking-tight">Campus Overview</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group lg:w-80 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-accent-orange transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search systems..." 
                            className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-accent-gold/10 focus:border-accent-gold transition-all shadow-sm"
                        />
                    </div>
                </div>
            </header>

            {/* Premium KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
                <StatCard 
                    icon={<Users className="w-6 h-6 text-secondary-blue" />} 
                    title="Active Sessions" 
                    value="1,284" 
                    trend="+12% YoY"
                    positive={true}
                />
                <StatCard 
                    icon={<Ticket className="w-6 h-6 text-primary-dark" />} 
                    title="Pending Ops" 
                    value="42" 
                    trend="5 Critical"
                    positive={false}
                />
                <StatCard 
                    icon={<Activity className="w-6 h-6 text-accent-orange" />} 
                    title="Core Load" 
                    value="24%" 
                    trend="Stable"
                    positive={true}
                />
                <StatCard 
                    icon={<Zap className="w-6 h-6 text-accent-gold" />} 
                    title="Power Flow" 
                    value="452 kW" 
                    trend="Normal"
                    positive={true}
                />
            </div>

            {/* Intelligence & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Insights Panel */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] border border-slate-100 p-8 md:p-12">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary-dark p-3 rounded-2xl shadow-xl shadow-slate-200">
                                <LayoutDashboard className="text-accent-gold w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-primary-dark tracking-tight">System Intelligence</h2>
                        </div>
                        <button className="text-xs font-bold text-accent-orange flex items-center gap-2 hover:bg-accent-gold/10 px-4 py-2.5 rounded-xl transition-all">
                           Live Activity <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <ActivityItem 
                            label="Core Network" 
                            desc="Building A distribution switch successfully synchronized with secondary node." 
                            time="2h" 
                            type="SUCCESS" 
                        />
                        <ActivityItem 
                            label="Access Violation" 
                            desc="Multiple failed login attempts detected from unauthorized subnet 192.168.x.x." 
                            time="4h" 
                            type="WARNING" 
                        />
                        <ActivityItem 
                            label="Logistics Hub" 
                            desc="Autonomous shuttle battery lifecycle maintenance scheduled for 04:00 AM." 
                            time="6h" 
                            type="INFO" 
                        />
                    </div>
                </div>

                {/* Efficiency Widget */}
                <div className="lg:col-span-4 bg-primary-dark rounded-[2.5rem] shadow-2xl p-10 text-white flex flex-col justify-between overflow-hidden relative group">
                    <div className="relative z-10 space-y-6">
                        <div className="p-4 bg-white/10 rounded-2xl w-max group-hover:rotate-12 transition-transform duration-500">
                            <TrendingUp className="w-10 h-10 text-accent-gold" />
                        </div>
                        <div className="space-y-2">
                             <h3 className="text-3xl font-bold tracking-tighter leading-none">Smart Efficiency</h3>
                             <p className="text-slate-400 font-medium leading-relaxed">System-wide resource allocation is currently 88% optimized.</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                            <span className="text-[10px] font-bold uppercase text-accent-gold block mb-2 tracking-[0.2em]">Next Suggested Action</span>
                            <p className="text-sm font-semibold text-slate-200">Shift chiller loads in Sector 4 by 45 minutes to avoid peak tariff.</p>
                        </div>
                        <button className="w-full bg-accent-gold text-primary-dark py-4 rounded-2xl font-bold shadow-[0_15px_30px_-5px_rgba(255,193,37,0.2)] hover:bg-amber-400 transition-all active:scale-95">Apply Optimization</button>
                    </div>
                    {/* Background visual element */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary-blue opacity-20 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, trend, positive }) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_40px_-5px_rgba(0,0,0,0.02)] border border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 hover:-translate-y-1.5 group">
        <div className="flex items-center justify-between mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500">{icon}</div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {trend}
            </div>
        </div>
        <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{title}</span>
            <div className="text-4xl lg:text-5xl font-bold text-primary-dark tracking-tighter">{value}</div>
        </div>
    </div>
);

const ActivityItem = ({ label, desc, time, type }) => (
    <div className="flex items-start gap-5 p-6 hover:bg-slate-50 rounded-3xl transition-all border border-transparent hover:border-slate-100 group cursor-default">
        <div className={`mt-1.5 h-3 w-3 rounded-full shrink-0 ring-4 ${
            type === 'SUCCESS' ? 'bg-emerald-500 ring-emerald-50' : 
            type === 'WARNING' ? 'bg-accent-orange ring-rose-50' : 'bg-secondary-blue ring-blue-50'
        }`}></div>
        <div className="space-y-1 flex-grow">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-primary-dark tracking-tight text-lg leading-none">{label}</h4>
                <span className="text-xs font-bold text-slate-400 uppercase">{time} ago</span>
            </div>
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-2xl">{desc}</p>
        </div>
    </div>
);

export default Dashboard;
