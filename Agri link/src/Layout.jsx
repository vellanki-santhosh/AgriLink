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
    Beaker
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';

const Layout = ({ children }) => {
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lang, setLang] = useState('English');
    const location = useLocation();
    const navigate = useNavigate();

    const toggleLang = () => setLang(prev => prev === 'English' ? 'Telugu' : 'English');

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

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Lands', path: '/lands', icon: Map },
        { name: 'Equipment', path: '/equipment', icon: Tractor },
        { name: 'Workers', path: '/workers', icon: Users },
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Soil Analysis', path: '/soil-analysis', icon: Beaker },
        { name: 'Messages', path: '/messages', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-inter">
            {/* Navbar */}
            <nav className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "glass py-2 shadow-sm" : "bg-transparent py-4"
            )}>
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform">
                                <Leaf className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold text-primary-darkest tracking-tight">AgriLink</span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) => cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-primary/10",
                                        isActive ? "text-primary bg-primary/10" : "text-slate-600 hover:text-primary"
                                    )}
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>

                        <div className="hidden lg:flex items-center gap-4">
                            <button
                                onClick={toggleLang}
                                className="flex items-center gap-1 text-slate-600 hover:text-primary text-sm font-medium px-3 py-1 rounded-lg border border-slate-200 transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                                <span>{lang}</span>
                            </button>

                            <div className="relative p-2 text-slate-600 hover:text-primary transition-colors group cursor-pointer">
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}

                                {/* Notification Dropdown */}
                                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
                                    <h4 className="font-bold text-slate-900 mb-2 text-sm text-left">Notifications</h4>
                                    <div className="space-y-2 text-left">
                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                                            <span className="font-bold text-primary">New Message</span> from Raghav
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="w-full mt-2 h-8 text-[11px] font-bold" onClick={() => navigate('/messages')}>View All</Button>
                                </div>
                            </div>

                            {user ? (
                                <div className="flex items-center gap-3">
                                    <Link to="/profile" className="flex items-center gap-2 group p-1 pr-3 rounded-full hover:bg-slate-100 transition-all">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 overflow-hidden">
                                            {user.profile_image ? <img src={user.profile_image} className="w-full h-full object-cover" /> : <User className="w-5 h-5" />}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{user.full_name?.split(' ')[0]}</span>
                                    </Link>
                                    <button onClick={() => base44.auth.logout().then(() => window.location.reload())} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <Button variant="premium" onClick={() => navigate('/login')}>Login</Button>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button className="lg:hidden p-2 text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 p-4 shadow-xl flex flex-col gap-2 animate-in slide-in-from-top duration-300">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium",
                                    isActive ? "text-primary bg-primary/10" : "text-slate-600"
                                )}
                            >
                                <link.icon className="w-5 h-5" />
                                {link.name}
                            </NavLink>
                        ))}
                        <div className="h-px bg-slate-100 my-2"></div>
                        {user ? (
                            <>
                                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 text-slate-600">
                                    <User className="w-5 h-5" />
                                    Profile
                                </Link>
                                <button onClick={() => base44.auth.logout()} className="flex items-center gap-4 px-4 py-3 text-red-500">
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Button variant="premium" className="w-full" onClick={() => navigate('/login')}>Login</Button>
                        )}
                    </div>
                )}
            </nav>

            <main className="flex-grow pt-24">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-12 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-1">
                            <Link to="/" className="flex items-center gap-2 mb-4">
                                <Leaf className="text-primary w-6 h-6" />
                                <span className="text-2xl font-bold text-white tracking-tight">AgriLink</span>
                            </Link>
                            <p className="text-sm leading-relaxed mb-6">
                                India's leading agricultural marketplace connecting farmers with resources they need to thrive.
                            </p>
                            <div className="flex gap-4">
                                {/* Social icons placeholder */}
                                {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"></div>)}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4">Explore</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/lands">Land Monitoring</Link></li>
                                <li><Link to="/equipment">Equipment Rental</Link></li>
                                <li><Link to="/workers">Hire Workers</Link></li>
                                <li><Link to="/transport">Transport Services</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/dashboard">AI Crop Advisor</Link></li>
                                <li><Link to="/dashboard">Market Prices</Link></li>
                                <li><Link to="/dashboard">Govt Schemes</Link></li>
                                <li><Link to="/dashboard">Techniques</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/help">Help Center</Link></li>
                                <li><Link to="/contact">Contact Us</Link></li>
                                <li><Link to="/terms">Terms of Service</Link></li>
                                <li><Link to="/privacy">Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
                        <p>&copy; {new Date().getFullYear()} AgriLink. Built for the future of Indian agriculture.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
