import { Link } from 'react-router-dom';
import { 
    Building2, 
    Zap, 
    ShieldCheck, 
    BarChart3, 
    ArrowRight,
    Globe2,
    Cpu,
    Smartphone,
    MousePointer2
} from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50">
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 lg:pt-40 lg:pb-32 overflow-hidden px-6">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-[40rem] h-[40rem] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-[30rem] h-[30rem] bg-indigo-100/50 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="text-center lg:text-left space-y-8">
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-xs uppercase tracking-widest border border-blue-100 animate-in fade-in slide-in-from-bottom duration-500">
                                <Zap size={14} className="fill-current" /> 
                                <span>Intelligence at Scale</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.95] tracking-tight animate-in fade-in slide-in-from-bottom duration-700 delay-100">
                                Smart Campus <br />
                                <span className="text-blue-600">Operations Hub</span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
                                The unified operating system for modern educational infrastructure. 
                                Monitor, automate, and optimize your campus ecosystem in real-time.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                                <Link 
                                    to="/login"
                                    className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    Launch Dashboard <ArrowRight size={20} />
                                </Link>
                                <button className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-lg hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95">
                                    Explore Platform
                                </button>
                            </div>
                        </div>

                        {/* Interactive Visual Shell */}
                        <div className="relative group lg:block hidden animate-in fade-in zoom-in duration-1000 delay-100">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 rounded-[3rem] blur-2xl"></div>
                            <div className="relative bg-white p-5 rounded-[2.5rem] shadow-2xl border border-slate-100 ring-8 ring-slate-50/50">
                                <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-slate-900 relative">
                                    <img 
                                        src="https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80&w=1200" 
                                        alt="Platform Preview" 
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                    <div className="absolute bottom-8 left-8 right-8">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                            <span className="text-white font-black text-xs uppercase tracking-widest">Live System Feed</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                            <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating Badges */}
                                <div className="absolute -top-6 -left-6 bg-white p-5 rounded-3xl shadow-xl border border-slate-50 animate-bounce cursor-default">
                                    <MousePointer2 className="text-blue-600 w-8 h-8" />
                                </div>
                                <div className="absolute -bottom-6 -right-6 bg-slate-900 p-5 rounded-3xl shadow-xl text-white">
                                    <ShieldCheck className="text-blue-400 w-10 h-10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content/Features Section */}
            <section className="py-24 bg-white px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em]">Operational Excellence</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Engineered for the modern campus.</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        <FeatureCard 
                            icon={<Globe2 className="w-10 h-10 text-blue-600" />} 
                            title="Global Monitoring" 
                            desc="Comprehensive data granularity across every square foot of your institution." 
                            delay="delay-0"
                        />
                        <FeatureCard 
                            icon={<Cpu className="w-10 h-10 text-indigo-600" />} 
                            title="Predictive AI" 
                            desc="Automated fault detection utilizing advanced machine learning models." 
                            delay="delay-100"
                        />
                        <FeatureCard 
                            icon={<Smartphone className="w-10 h-10 text-emerald-600" />} 
                            title="Mobile First" 
                            desc="Empower your technical teams with real-time operational mobility." 
                            delay="delay-200"
                        />
                    </div>
                </div>
            </section>

            {/* Bottom CTA Section */}
            <section className="py-24 px-6 mb-12">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-slate-900 rounded-[3rem] p-10 md:p-24 text-center text-white relative overflow-hidden ring-1 ring-white/10 shadow-2xl">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                        
                        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter relative z-10 leading-[0.95]"> Ready to elevate your <br className="hidden md:block"/> operations?</h2>
                        <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto relative z-10">
                            Join the world's leading academic institutions in building the next generation of smart infrastructure.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                            <Link 
                                to="/login"
                                className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-3 group active:scale-95 shadow-xl"
                            >
                                Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="px-12 py-5 rounded-2xl font-black text-lg border border-white/20 hover:bg-white/5 transition-all">
                                Request Private Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 px-6 border-t border-slate-100 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Building2 className="text-slate-300 h-5 w-5" />
                    <span className="text-sm font-black text-slate-400 tracking-tighter uppercase">SmartCampus Hub</span>
                </div>
                <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">
                    &copy; {new Date().getFullYear()} ALL SYSTEMS OPERATIONAL.
                </p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
    <div className={`p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 group animate-in fade-in slide-in-from-bottom duration-700 ${delay}`}>
        <div className="bg-white p-6 rounded-3xl w-max mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-slate-100">{icon}</div>
        <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-none group-hover:text-blue-600 transition-colors uppercase text-sm font-black tracking-widest opacity-50 mb-2">{title}</h4>
        <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-none">{title}</h4>
        <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
);

export default Home;
