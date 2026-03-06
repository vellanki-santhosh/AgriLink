
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    Map,
    Tractor,
    Users,
    LayoutDashboard,
    MessageSquare,
    Bell,
    User,
    LogOut,
    Menu,
    X,
    Globe,
    Leaf,
    Mic,
    Beaker,
    Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/i18n/LanguageContext';
import VoiceAssistant from '@/components/VoiceAssistant';

const Layout = ({ children }) => {
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [voiceOpen, setVoiceOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // translation context
    const { language, setLanguage, toggleLanguage, t } = useLanguage();

    const handleLangClick = () => toggleLanguage();

    useEffect(() => {
        base44.auth.me().then(setUser).catch(() => { });

        const interval = setInterval(() => {
            setUnreadCount(prev => Math.min(prev + 1, 5));
        }, 30000);

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // compute labels using translation helper so they update when language changes
    const navLinks = [
        { name: t('nav.home'), path: '/', icon: Home },
        { name: t('nav.lands'), path: '/lands', icon: Map },
        { name: t('nav.equipment'), path: '/equipment', icon: Tractor },
        { name: t('nav.workers'), path: '/workers', icon: Users },
        { name: t('nav.dashboard'), path: '/dashboard', icon: LayoutDashboard },
        { name: t('nav.messages'), path: '/messages', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
            {/* Navbar */}
            <nav className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
                scrolled
                    ? "bg-white/92 backdrop-blur-2xl border-slate-200/60 shadow-[0_1px_20px_rgba(15,23,42,0.06)] py-2"
                    : "bg-white/50 backdrop-blur-xl border-transparent py-3.5"
            )}>
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="premium-gradient p-2.5 rounded-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/20">
                                <Leaf className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-darkest to-primary tracking-tight">AgriLink</span>
                        </Link>

                        <div className="hidden lg:flex items-center gap-3">
                            <button
                                onClick={handleLangClick}
                                className="flex items-center gap-1.5 text-slate-600 hover:text-primary text-sm font-medium px-3 py-2 rounded-xl border border-slate-200/60 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
                            >
                                <Globe className="w-4 h-4" />
                                <span>{t('langName')}</span>
                            </button>

                            <div className="relative p-2 text-slate-600 hover:text-primary transition-all group cursor-pointer rounded-xl hover:bg-primary/5">
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}

                                {/* Notification Dropdown */}
                                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] translate-y-2 group-hover:translate-y-0">
                                    <h4 className="font-bold text-slate-900 mb-3 text-sm text-left">{t('nav.notifications')}</h4>
                                    <div className="space-y-2 text-left">
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[12px] text-slate-600 hover:bg-primary/5 transition-colors cursor-pointer">
                                            <span className="font-bold text-primary">New Message</span> from Raghav
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="w-full mt-3 h-9 text-[12px] font-bold rounded-xl" onClick={() => navigate('/messages')}>{t('nav.viewAll')}</Button>
                                </div>
                            </div>

                            {user ? (
                                <div className="flex items-center gap-3">
                                    <Link to="/profile" className="flex items-center gap-2.5 group p-1 pr-4 rounded-full hover:bg-primary/5 transition-all border border-transparent hover:border-primary/20">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary border border-primary/20 overflow-hidden shadow-sm avatar-glow">
                                            {user.profile_image ? <img src={user.profile_image} className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">{user.full_name?.split(' ')[0]}</span>
                                    </Link>
                                    <button onClick={() => base44.auth.logout().then(() => window.location.reload())} className="p-2 text-slate-300 hover:text-red-500 transition-all rounded-xl hover:bg-red-50">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <button className="btn-premium text-sm py-2.5 px-6 rounded-xl" onClick={() => navigate('/login')}>Login</button>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button className="lg:hidden p-2.5 text-primary rounded-xl hover:bg-primary/10 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <>
                        <div className="lg:hidden fixed inset-0 top-0 bg-slate-900/30 backdrop-blur-sm z-[-1]" onClick={() => setMobileMenuOpen(false)} />
                        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-slate-100 p-5 shadow-2xl flex flex-col gap-1.5 animate-slide-down">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) => cn(
                                        "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-base font-medium transition-all",
                                        isActive ? "text-primary bg-primary/10 font-bold" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    <link.icon className="w-5 h-5" />
                                    {link.name}
                                </NavLink>
                            ))}
                            <div className="h-px bg-slate-100 my-2"></div>
                            {user ? (
                                <>
                                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-3.5 text-slate-600 rounded-2xl hover:bg-slate-50 transition-colors">
                                        <User className="w-5 h-5" />
                                        {t('nav.profile')}
                                    </Link>
                                    <button onClick={() => base44.auth.logout()} className="flex items-center gap-4 px-4 py-3.5 text-red-500 rounded-2xl hover:bg-red-50 transition-colors">
                                        <LogOut className="w-5 h-5" />
                                        {t('nav.logout')}
                                    </button>
                                </>
                            ) : (
                                <Button variant="premium" className="w-full h-12 rounded-2xl" onClick={() => navigate('/login')}>Login</Button>
                            )}
                        </div>
                    </>
                )}
            </nav>

            <main className="flex-grow pt-24 page-transition" key={location.pathname}>
                {children}
            </main>

            {/* Quick Navigation Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-4xl font-bold text-slate-900 mb-3">Explore All Features</h2>
                        <p className="text-slate-600 text-lg">Quick access to all AgriLink services</p>
                    </div>
                    
                    {/* Core Services */}
                    <div className="mb-16">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <div className="w-1 h-6 bg-primary rounded-full"></div>
                            Core Services
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <Link to="/lands" className="group">
                                <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all h-full hover:-translate-y-1">
                                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                        <Map className="w-7 h-7 text-blue-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Find Lands</h4>
                                    <p className="text-sm text-slate-600">Browse and rent agricultural land</p>
                                </div>
                            </Link>

                            <Link to="/equipment" className="group">
                                <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-orange-500 hover:shadow-lg transition-all h-full hover:-translate-y-1">
                                    <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                                        <Tractor className="w-7 h-7 text-orange-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Equipment</h4>
                                    <p className="text-sm text-slate-600">Rent tractors and machinery</p>
                                </div>
                            </Link>

                            <Link to="/workers" className="group">
                                <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-purple-500 hover:shadow-lg transition-all h-full hover:-translate-y-1">
                                    <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                                        <Users className="w-7 h-7 text-purple-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Hire Workers</h4>
                                    <p className="text-sm text-slate-600">Find skilled agricultural workers</p>
                                </div>
                            </Link>

                            <Link to="/transport" className="group">
                                <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-cyan-500 hover:shadow-lg transition-all h-full hover:-translate-y-1">
                                    <div className="w-14 h-14 bg-cyan-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-100 transition-colors">
                                        <Tractor className="w-7 h-7 text-cyan-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Transport</h4>
                                    <p className="text-sm text-slate-600">Book delivery services</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Tools & Resources */}
                    <div className="mb-16">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <div className="w-1 h-6 bg-primary rounded-full"></div>
                            Tools & Resources
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <Link to="/dashboard" className="group">
                                <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition-all h-full hover:-translate-y-1">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                                        <LayoutDashboard className="w-7 h-7 text-indigo-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Dashboard</h4>
                                    <p className="text-sm text-slate-600">AI advisor & market updates</p>
                                </div>
                            </Link>

                            <Link to="/calendar" className="group">
                                <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-yellow-500 hover:shadow-lg transition-all h-full hover:-translate-y-1">
                                    <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors">
                                        <Beaker className="w-7 h-7 text-yellow-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Crop Calendar</h4>
                                    <p className="text-sm text-slate-600">Seasonal farming guide</p>
                                </div>
                            </Link>

                            <Link to="/soil-analysis" className="group">
                                <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-amber-500 hover:shadow-lg transition-all h-full hover:-translate-y-1">
                                    <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                                        <Beaker className="w-7 h-7 text-amber-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Soil Analysis</h4>
                                    <p className="text-sm text-slate-600">Test and improve soil health</p>
                                </div>
                            </Link>

                            <Link to="/advisory" className="group">
                                <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition-all h-full hover:-translate-y-1">
                                    <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                                        <Brain className="w-7 h-7 text-emerald-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Advisory</h4>
                                    <p className="text-sm text-slate-600">Expert farming tips</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Account & Support */}
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <div className="w-1 h-6 bg-primary rounded-full"></div>
                            Account & Support
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <Link to="/messages" className="group">
                                <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-pink-500 hover:shadow-lg transition-all h-full hover:-translate-y-1">
                                    <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-100 transition-colors">
                                        <MessageSquare className="w-7 h-7 text-pink-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Messages</h4>
                                    <p className="text-sm text-slate-600">Chat with users</p>
                                </div>
                            </Link>

                            <Link to="/bookings" className="group">
                                <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-rose-500 hover:shadow-lg transition-all h-full hover:-translate-y-1">
                                    <div className="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-100 transition-colors">
                                        <Bell className="w-7 h-7 text-rose-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Bookings</h4>
                                    <p className="text-sm text-slate-600">Manage your reservations</p>
                                </div>
                            </Link>

                            <Link to="/profile" className="group">
                                <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-500 hover:shadow-lg transition-all h-full hover:-translate-y-1">
                                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                                        <User className="w-7 h-7 text-slate-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Profile</h4>
                                    <p className="text-sm text-slate-600">Manage your account</p>
                                </div>
                            </Link>

                            <Link to="/support" className="group">
                                <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-teal-500 hover:shadow-lg transition-all h-full hover:-translate-y-1">
                                    <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
                                        <MessageSquare className="w-7 h-7 text-teal-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-1">Support</h4>
                                    <p className="text-sm text-slate-600">Help & contact support</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-300 relative overflow-hidden">
                {/* Animated top border */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-gradient-shift" style={{ backgroundSize: '200% auto' }}></div>

                <div className="pt-16 pb-8 px-4">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
                            <div className="col-span-1 md:col-span-1">
                                <Link to="/" className="flex items-center gap-2 mb-6 group">
                                    <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/30 transition-colors">
                                        <Leaf className="text-primary w-6 h-6" />
                                    </div>
                                    <span className="text-2xl font-bold text-white tracking-tight">AgriLink</span>
                                </Link>
                                <p className="text-sm leading-relaxed mb-8 text-slate-400">
                                    {t('footer.tagline')}
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={() => window.open('https://facebook.com', '_blank')} className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center hover:bg-primary hover:-translate-y-1 transition-all shadow-lg cursor-pointer text-slate-400 hover:text-white border border-slate-700/50 hover:border-primary">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z" /></svg>
                                    </button>
                                    <button onClick={() => window.open('https://twitter.com', '_blank')} className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center hover:bg-primary hover:-translate-y-1 transition-all shadow-lg cursor-pointer text-slate-400 hover:text-white border border-slate-700/50 hover:border-primary">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.95,4.57a10,10,0,0,1-2.82.77,4.96,4.96,0,0,0,2.16-2.72,9.9,9.9,0,0,1-3.12,.76,4.96,4.96,0,0,0-8.45,4.52A14.11,14.11,0,0,1,1.64,3.16,4.96,4.96,0,0,0,3.2,9.72,4.86,4.86,0,0,1,.96,9.11v.06a4.93,4.93,0,0,0,3.95,4.83,4.86,4.86,0,0,1-2.22.08,4.93,4.93,0,0,0,4.6,3.42A9.87,9.87,0,0,1,0,19.54a13.94,13.94,0,0,0,7.55,2.21A13.9,13.9,0,0,0,21.56,7.68c0-.21,0-.42,0-.63A12.61,12.61,0,0,0,24,4.64Z" /></svg>
                                    </button>
                                    <button onClick={() => window.open('https://instagram.com', '_blank')} className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center hover:bg-primary hover:-translate-y-1 transition-all shadow-lg cursor-pointer text-slate-400 hover:text-white border border-slate-700/50 hover:border-primary">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.35.2-6.78,2.62-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.36,2.62,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.35-.2,6.78-2.62,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.35-2.62-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z" /></svg>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-6 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Explore</h4>
                                <ul className="space-y-3 text-sm text-slate-400 border-l border-slate-800 pl-4">
                                    <li><Link to="/lands" className="hover:text-primary transition-all flex items-center gap-2 relative before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full before:absolute before:-left-5 before:opacity-0 hover:before:opacity-100 hover:translate-x-1 before:transition-all">Land Monitoring</Link></li>
                                    <li><Link to="/equipment" className="hover:text-primary transition-all flex items-center gap-2 relative before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full before:absolute before:-left-5 before:opacity-0 hover:before:opacity-100 hover:translate-x-1 before:transition-all">Equipment Rental</Link></li>
                                    <li><Link to="/workers" className="hover:text-primary transition-all flex items-center gap-2 relative before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full before:absolute before:-left-5 before:opacity-0 hover:before:opacity-100 hover:translate-x-1 before:transition-all">Hire Workers</Link></li>
                                    <li><Link to="/transport" className="hover:text-primary transition-all flex items-center gap-2 relative before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full before:absolute before:-left-5 before:opacity-0 hover:before:opacity-100 hover:translate-x-1 before:transition-all">Transport Services</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-6 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Resources</h4>
                                <ul className="space-y-3 text-sm text-slate-400 border-l border-slate-800 pl-4">
                                    <li><Link to="/dashboard" className="hover:text-primary transition-all flex items-center gap-2 relative before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full before:absolute before:-left-5 before:opacity-0 hover:before:opacity-100 hover:translate-x-1 before:transition-all">AI Crop Advisor</Link></li>
                                    <li><Link to="/dashboard" className="hover:text-primary transition-all flex items-center gap-2 relative before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full before:absolute before:-left-5 before:opacity-0 hover:before:opacity-100 hover:translate-x-1 before:transition-all">Market Prices</Link></li>
                                    <li><Link to="/dashboard" className="hover:text-primary transition-all flex items-center gap-2 relative before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full before:absolute before:-left-5 before:opacity-0 hover:before:opacity-100 hover:translate-x-1 before:transition-all">Govt Schemes</Link></li>
                                    <li><Link to="/calendar" className="hover:text-primary transition-all flex items-center gap-2 relative before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full before:absolute before:-left-5 before:opacity-0 hover:before:opacity-100 hover:translate-x-1 before:transition-all">Crop Calendar</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-white font-bold mb-6 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Support</h4>
                                <ul className="space-y-3 text-sm text-slate-400 border-l border-slate-800 pl-4">
                                    <li><Link to="/support" className="hover:text-primary transition-all flex items-center gap-2 relative before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full before:absolute before:-left-5 before:opacity-0 hover:before:opacity-100 hover:translate-x-1 before:transition-all">Help Center</Link></li>
                                    <li><Link to="/support" className="hover:text-primary transition-all flex items-center gap-2 relative before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full before:absolute before:-left-5 before:opacity-0 hover:before:opacity-100 hover:translate-x-1 before:transition-all">Contact Us</Link></li>
                                    <li><Link to="/support" className="hover:text-primary transition-all flex items-center gap-2 relative before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full before:absolute before:-left-5 before:opacity-0 hover:before:opacity-100 hover:translate-x-1 before:transition-all">Terms of Service</Link></li>
                                    <li><Link to="/support" className="hover:text-primary transition-all flex items-center gap-2 relative before:content-[''] before:w-1 before:h-1 before:bg-primary before:rounded-full before:absolute before:-left-5 before:opacity-0 hover:before:opacity-100 hover:translate-x-1 before:transition-all">Privacy Policy</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-slate-800/60 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-sm text-slate-500 font-medium tracking-wide">
                                &copy; {new Date().getFullYear()} AgriLink. Built for the future of Indian agriculture.
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    className="bg-slate-800 hover:bg-slate-700 text-white border-0 transition-all rounded-xl px-6 hover:shadow-lg"
                                    onClick={() => navigate('/login')}
                                >
                                    Login
                                </Button>
                                <Button
                                    className="btn-primary"
                                    onClick={() => navigate('/profile')}
                                >
                                    Get Started
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer decorative bg elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/3 rounded-full blur-[120px] pointer-events-none"></div>
            </footer>

            {/* Floating Voice Assistant Button */}
            <button
                onClick={() => setVoiceOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-tr from-primary-darkest to-primary rounded-full shadow-[0_10px_30px_rgba(5,150,105,0.4)] flex items-center justify-center transition-all hover:scale-110 hover:shadow-[0_15px_40px_rgba(5,150,105,0.5)] border-2 border-white/20 hover:border-white/50 group"
            >
                <Mic className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                <span className="absolute -inset-2 rounded-full border border-primary/30 animate-ping opacity-75"></span>
            </button>

            {/* Voice Assistant Modal */}
            <VoiceAssistant isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
        </div>
    );
};

export default Layout;

