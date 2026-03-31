import { Link } from 'react-router-dom';
import {
    Building2,
    Zap,
    ShieldCheck,
    ArrowRight,
    CalendarDays,
    Wrench,
    Bell,
    Users,
    CheckCircle,
    Clock,
    BarChart3,
    Lock,
    ChevronRight,
    Star,
    Activity
} from 'lucide-react';

/* ─── Data ─────────────────────────────────────────── */

const MODULES = [
    {
        id: 'A',
        icon: <Building2 className="w-7 h-7" />,
        label: 'Module A',
        title: 'Facilities & Assets Catalogue',
        desc: 'Browse lecture halls, labs, meeting rooms and equipment. Filter by type, capacity, location and real-time availability status.',
        color: 'text-secondary-blue',
        bg: 'bg-secondary-blue/10',
        border: 'border-secondary-blue/20',
        tags: ['Rooms', 'Labs', 'Equipment', 'Search & Filter'],
    },
    {
        id: 'B',
        icon: <CalendarDays className="w-7 h-7" />,
        label: 'Module B',
        title: 'Booking Management',
        desc: 'Request facility bookings, track PENDING → APPROVED / REJECTED status, and get automatic conflict detection for overlapping slots.',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        tags: ['Booking Requests', 'Approval Workflow', 'Conflict Detection'],
    },
    {
        id: 'C',
        icon: <Wrench className="w-7 h-7" />,
        label: 'Module C',
        title: 'Maintenance & Incident Ticketing',
        desc: 'Report faults with image evidence, assign technicians, and track OPEN → IN_PROGRESS → RESOLVED lifecycle with full comment threads.',
        color: 'text-accent-orange',
        bg: 'bg-accent-gold/10',
        border: 'border-accent-gold/30',
        tags: ['Fault Reports', 'Image Attachments', 'Technician Assignment'],
    },
    {
        id: 'D',
        icon: <Bell className="w-7 h-7" />,
        label: 'Module D',
        title: 'Smart Notifications',
        desc: 'Receive real-time alerts for booking approvals, ticket status changes, and new comments — all accessible from the notification panel.',
        color: 'text-violet-600',
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        tags: ['Real-time Alerts', 'Booking Updates', 'Ticket Events'],
    },
    {
        id: 'E',
        icon: <Lock className="w-7 h-7" />,
        label: 'Module E',
        title: 'Authentication & Access Control',
        desc: 'Secure Google OAuth 2.0 sign-in with JWT sessions. Role-based access for USER, ADMIN, TECHNICIAN and MANAGER across all routes.',
        color: 'text-rose-500',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        tags: ['Google OAuth2', 'JWT', 'RBAC', '4 Roles'],
    },
];

const STATS = [
    { label: 'Campus Resources', value: '200+', icon: <Building2 className="w-5 h-5" /> },
    { label: 'Daily Bookings', value: '1,400+', icon: <CalendarDays className="w-5 h-5" /> },
    { label: 'Tickets Resolved', value: '98%', icon: <CheckCircle className="w-5 h-5" /> },
    { label: 'Response Time', value: '<2 hrs', icon: <Clock className="w-5 h-5" /> },
];

const ROLES = [
    {
        role: 'USER',
        color: 'bg-secondary-blue',
        desc: 'Browse resources, make bookings, report faults, receive notifications.',
        perks: ['Asset Catalogue', 'Booking Requests', 'Incident Reports', 'Notifications'],
    },
    {
        role: 'ADMIN',
        color: 'bg-accent-orange',
        desc: 'Approve/reject bookings, manage resources, oversee all tickets system-wide.',
        perks: ['Resource CRUD', 'Booking Approvals', 'Global Ticket View', 'User Management'],
    },
    {
        role: 'TECHNICIAN',
        color: 'bg-emerald-600',
        desc: 'View assigned maintenance tasks, update ticket status, add resolution notes.',
        perks: ['Task Queue', 'Status Updates', 'Resolution Notes', 'Comment Thread'],
    },
    {
        role: 'MANAGER',
        color: 'bg-violet-600',
        desc: 'View platform-wide analytics, booking trends, and operational performance reports.',
        perks: ['Usage Analytics', 'Peak Hours', 'Booking Trends', 'Fault Stats'],
    },
];

/* ─── Component ─────────────────────────────────────── */

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-slate-50/50 px-6 pt-24 pb-16 lg:pt-12 lg:pb-32">
                {/* Background glows */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-[40rem] h-[40rem] bg-secondary-blue/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-[30rem] h-[30rem] bg-primary-dark/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                        {/* Left — Text */}
                        <div className="text-center lg:text-left space-y-8">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-accent-gold/10 text-accent-orange rounded-full font-semibold text-xs uppercase tracking-widest border border-accent-gold/20 animate-in fade-in slide-in-from-bottom duration-500">
                                <Activity size={13} className="animate-pulse" />
                                <span>SLIIT UNI</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-dark leading-[0.95] tracking-tight animate-in fade-in slide-in-from-bottom duration-700 delay-100">
                                Smart Campus <br />
                                <span className="text-accent-gold">Operations Hub</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
                                A unified platform for university facility bookings, maintenance ticketing,
                                and campus-wide notifications — built with Spring Boot &amp; React.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                                <Link
                                    to="/login"
                                    className="px-10 py-3.5 bg-primary-dark text-white rounded-2xl font-bold text-base shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 group"
                                >
                                    Launch Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a
                                    href="#modules"
                                    className="px-10 py-3.5 bg-white text-primary-dark border border-slate-200 rounded-2xl font-bold text-base hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 flex items-center justify-center"
                                >
                                    Explore Modules
                                </a>
                            </div>

                            {/* Mini stats row */}
                            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-2 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
                                {STATS.map((s) => (
                                    <div key={s.label} className="flex items-center gap-2">
                                        <span className="text-accent-orange">{s.icon}</span>
                                        <span className="font-bold text-primary-dark">{s.value}</span>
                                        <span className="text-slate-400 text-sm">{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — Visual Shell */}
                        <div className="relative group lg:block hidden animate-in fade-in zoom-in duration-1000 delay-100">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-primary-dark/10 to-secondary-blue/10 rounded-[3rem] blur-2xl" />
                            <div className="relative bg-white p-5 rounded-[2.5rem] shadow-2xl border border-slate-100 ring-8 ring-slate-50/50">
                                <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-primary-dark relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200"
                                        alt="Smart Campus Platform"
                                        className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 to-transparent" />
                                    {/* Overlay chips */}
                                    <div className="absolute bottom-8 left-8 right-8 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-accent-gold animate-pulse" />
                                            <span className="text-white font-bold text-xs uppercase tracking-widest">All Systems Operational</span>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {['Module A', 'Module B', 'Module C', 'Module D', 'Module E'].map(m => (
                                                <span key={m} className="text-[10px] font-bold px-2.5 py-1 bg-white/15 text-white rounded-full border border-white/20">{m}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Badges */}
                                <div className="absolute -top-6 -left-6 bg-white p-4 rounded-3xl shadow-xl border border-slate-100 animate-bounce cursor-default">
                                    <ShieldCheck className="text-accent-orange w-8 h-8" />
                                </div>
                                <div className="absolute -bottom-6 -right-6 bg-primary-dark p-4 rounded-3xl shadow-xl">
                                    <BarChart3 className="text-accent-gold w-9 h-9" />
                                </div>
                                <div className="absolute top-1/2 -right-8 -translate-y-1/2 bg-emerald-500 p-3 rounded-2xl shadow-xl">
                                    <CheckCircle className="text-white w-6 h-6" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── Modules ── */}
            <section id="modules" className="py-28 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-3">
                        <span className="text-xs font-bold text-accent-orange uppercase tracking-[0.3em]">Core Feature Modules</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-primary-dark">Five modules. One platform.</h2>
                        <p className="text-slate-500 text-lg max-w-xl mx-auto">Every workflow your campus needs, from booking a room to resolving a fault.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MODULES.map((m, i) => (
                            <ModuleCard key={m.id} module={m} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Workflow ── */}
            <section className="py-28 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-3">
                        <span className="text-xs font-bold text-accent-orange uppercase tracking-[0.3em]">How It Works</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-primary-dark">Simple, auditable workflows</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Booking workflow */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-6 hover:shadow-xl transition-all">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-50 p-3 rounded-2xl"><CalendarDays className="text-emerald-600 w-6 h-6" /></div>
                                <h3 className="font-bold text-primary-dark text-lg">Booking Workflow</h3>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {['PENDING', '→', 'APPROVED', '/', 'REJECTED', '→', 'CANCELLED'].map((s, i) => (
                                    <span key={i} className={`text-sm font-bold px-3 py-1 rounded-full ${
                                        s === '→' || s === '/' ? 'text-slate-400 px-0' :
                                        s === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                        s === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                                        s === 'REJECTED' ? 'bg-rose-50 text-rose-500' :
                                        'bg-slate-100 text-slate-500'
                                    }`}>{s}</span>
                                ))}
                            </div>
                            <ul className="space-y-2">
                                {['User requests a room/equipment booking', 'Admin reviews and approves or rejects with reason', 'System detects and prevents scheduling conflicts', 'Approved bookings can later be cancelled'].map(t => (
                                    <li key={t} className="flex items-start gap-2.5 text-slate-500 text-sm">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{t}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Ticket workflow */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-6 hover:shadow-xl transition-all">
                            <div className="flex items-center gap-3">
                                <div className="bg-accent-gold/10 p-3 rounded-2xl"><Wrench className="text-accent-orange w-6 h-6" /></div>
                                <h3 className="font-bold text-primary-dark text-lg">Incident Ticket Workflow</h3>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {['OPEN', '→', 'IN_PROGRESS', '→', 'RESOLVED', '→', 'CLOSED'].map((s, i) => (
                                    <span key={i} className={`text-sm font-bold px-3 py-1 rounded-full ${
                                        s === '→' ? 'text-slate-400 px-0' :
                                        s === 'OPEN' ? 'bg-rose-50 text-rose-500' :
                                        s === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600' :
                                        s === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' :
                                        'bg-slate-100 text-slate-500'
                                    }`}>{s}</span>
                                ))}
                            </div>
                            <ul className="space-y-2">
                                {['Report a fault with category, priority & photo evidence', 'Technician gets assigned and updates status', 'Comment thread for staff and user communication', 'Admin can override status or set REJECTED with reason'].map(t => (
                                    <li key={t} className="flex items-start gap-2.5 text-slate-500 text-sm">
                                        <CheckCircle className="w-4 h-4 text-accent-orange mt-0.5 shrink-0" />{t}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Roles ── */}
            <section className="py-28 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-3">
                        <span className="text-xs font-bold text-accent-orange uppercase tracking-[0.3em]">Role-Based Access Control</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-primary-dark">Built for every stakeholder</h2>
                        <p className="text-slate-500 text-lg max-w-xl mx-auto">Four distinct roles, each with tailored dashboards and access permissions.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {ROLES.map((r) => (
                            <div key={r.role} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-400 group">
                                <div className={`${r.color} w-10 h-10 rounded-2xl mb-6 flex items-center justify-center`}>
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white ${r.color} inline-block mb-3`}>{r.role}</span>
                                <p className="text-slate-500 text-sm leading-relaxed mb-5">{r.desc}</p>
                                <ul className="space-y-1.5">
                                    {r.perks.map(p => (
                                        <li key={p} className="flex items-center gap-2 text-slate-600 text-sm">
                                            <ChevronRight size={14} className="text-accent-gold shrink-0" />{p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Tech Stack ── */}
            <section className="py-20 px-6 bg-slate-50 border-y border-slate-100">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">Technology Stack</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Spring Boot 3', 'MongoDB', 'React 18', 'Vite', 'JWT Auth', 'Google OAuth2', 'Tailwind CSS', 'REST API', 'GitHub Actions'].map(t => (
                            <span key={t} className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-28 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-primary-dark rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-secondary-blue/15 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] bg-accent-gold/10 rounded-full blur-[80px] pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-center">
                                <div className="bg-accent-gold/10 border border-accent-gold/20 p-4 rounded-3xl">
                                    <ShieldCheck className="text-accent-gold w-10 h-10" />
                                </div>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                                Ready to modernize <br className="hidden md:block" />
                                <span className="text-accent-gold">your campus?</span>
                            </h2>
                            <p className="text-slate-400 text-lg max-w-xl mx-auto">
                                Sign in with your university Google account and get started in seconds.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Link
                                    to="/login"
                                    className="bg-accent-gold text-primary-dark px-12 py-4 rounded-2xl font-bold text-base hover:bg-amber-400 transition-all flex items-center justify-center gap-3 group active:scale-95 shadow-xl"
                                >
                                    Sign In Now <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-10 px-6 border-t border-slate-100 text-center bg-white">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Building2 className="text-slate-300 h-5 w-5" />
                    <span className="text-sm font-bold text-slate-400 tracking-widest uppercase">SmartCampus Hub</span>
                </div>
                <p className="text-xs text-slate-400 tracking-widest uppercase font-semibold">
                    © {new Date().getFullYear()} &nbsp;·&nbsp; IT3030 PAF Assignment &nbsp;·&nbsp; SLIIT Faculty of Computing
                </p>
            </footer>
        </div>
    );
};

/* ─── Module Card ───────────────────────────────────── */

const ModuleCard = ({ module: m, index }) => (
    <div className={`p-8 rounded-[2.5rem] bg-white border ${m.border} hover:shadow-2xl hover:shadow-slate-100 hover:-translate-y-2 transition-all duration-500 group flex flex-col ${index === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
        <div className={`${m.bg} ${m.color} p-4 rounded-3xl w-max mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
            {m.icon}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${m.color} mb-1`}>{m.label}</span>
        <h3 className="text-xl font-bold text-primary-dark mb-3 leading-snug">{m.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{m.desc}</p>
        <div className="flex flex-wrap gap-2">
            {m.tags.map(t => (
                <span key={t} className={`text-[11px] font-semibold px-3 py-1 rounded-full ${m.bg} ${m.color} border ${m.border}`}>{t}</span>
            ))}
        </div>
    </div>
);

export default Home;
