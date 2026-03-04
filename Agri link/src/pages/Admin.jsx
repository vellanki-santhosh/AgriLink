import React, { useState, useEffect } from 'react';
import {
    Users,
    Briefcase,
    Calendar,
    TrendingUp,
    ShieldCheck,
    AlertCircle,
    Search,
    Filter,
    ArrowUpRight,
    MoreVertical,
    CheckCircle2,
    XCircle,
    BarChart3,
    LogOut,
    Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [listings, setListings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        // Mocking all data for admin view
        setListings(mockPendingListings);
        setBookings(mockRecentBookings);
        setUsers(mockUsers);
    };

    const analyticsData = [
        { name: 'Mon', revenue: 45000, bookings: 12 },
        { name: 'Tue', revenue: 32000, bookings: 8 },
        { name: 'Wed', revenue: 58000, bookings: 15 },
        { name: 'Thu', revenue: 41000, bookings: 10 },
        { name: 'Fri', revenue: 82000, bookings: 22 },
        { name: 'Sat', revenue: 95000, bookings: 25 },
        { name: 'Sun', revenue: 75000, bookings: 18 },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <div className="w-72 bg-slate-900 text-slate-400 p-6 flex flex-col fixed h-full z-50">
                <div className="flex items-center gap-3 mb-12 px-2">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black text-white tracking-tight">AdminPanel</span>
                </div>

                <nav className="space-y-2 flex-grow">
                    <AdminNavLink active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={TrendingUp} label="Platform Overview" />
                    <AdminNavLink active={activeTab === 'listings'} onClick={() => setActiveTab('listings')} icon={Briefcase} label="Listing Moderation" badge="5" />
                    <AdminNavLink active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} icon={Calendar} label="All Bookings" />
                    <AdminNavLink active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users} label="User Management" />
                    <AdminNavLink active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="System Settings" />
                </nav>

                <div className="pt-6 border-t border-slate-800">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 w-full transition-colors text-rose-400 font-bold">
                        <LogOut className="w-5 h-5" />
                        Exit Admin
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow ml-72 p-10">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            {activeTab === 'overview' && "Analytics Dashboard"}
                            {activeTab === 'listings' && "Listing Moderation"}
                            {activeTab === 'bookings' && "Platform Bookings"}
                            {activeTab === 'users' && "User Directory"}
                        </h1>
                        <p className="text-slate-500">System status: <span className="text-emerald-500 font-bold">Optimal</span></p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Global search..." className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm w-64" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 border border-white shadow-sm overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Admin+User&background=059669&color=fff" />
                        </div>
                    </div>
                </div>

                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <SummaryGridItem label="Total Revenue" value="₹12.4L" trend="+8% vs last week" icon={TrendingUp} color="text-emerald-500" />
                            <SummaryGridItem label="Active Users" value="8,402" trend="+12% daily" icon={Users} color="text-blue-500" />
                            <SummaryGridItem label="New Bookings" value="156" trend="+24% this month" icon={Calendar} color="text-amber-500" />
                            <SummaryGridItem label="Reports" value="12" trend="-4% resolved" icon={AlertCircle} color="text-rose-500" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle>Revenue Analytics</CardTitle>
                                    <CardDescription>Daily gross transaction volume</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={analyticsData}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#059669" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="revenue" stroke="#059669" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle>Popular Soil Types</CardTitle>
                                    <CardDescription>Based on booking frequency</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[
                                            { name: 'Black', value: 450 },
                                            { name: 'Red', value: 320 },
                                            { name: 'Clay', value: 210 },
                                            { name: 'Wet', value: 580 },
                                            { name: 'Sandy', value: 120 }
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'listings' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800">Pending Review Requests</h3>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="rounded-xl">All Types</Button>
                                <Button variant="outline" size="sm" className="rounded-xl">Newest First</Button>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {listings.map((item, i) => (
                                <div key={i} className="p-8 hover:bg-slate-50 transition-colors flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                                        <img src={item.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] uppercase font-bold text-primary tracking-widest">{item.type}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{item.date}</span>
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h4>
                                        <p className="text-sm text-slate-500">Proposed by <span className="font-bold text-slate-700">{item.owner}</span> • {item.location}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 font-bold h-11">Approve</Button>
                                        <Button size="sm" variant="outline" className="border-rose-100 text-rose-500 hover:bg-rose-50 rounded-xl px-6 font-bold h-11">Reject</Button>
                                        <Button size="sm" variant="ghost" className="rounded-xl h-11"><MoreVertical className="w-5 h-5" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const AdminNavLink = ({ active, onClick, icon: Icon, label, badge }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-sm font-bold",
            active ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-800 text-slate-400"
        )}
    >
        <Icon className="w-5 h-5 shrink-0" />
        <span className="flex-grow text-left">{label}</span>
        {badge && <span className="bg-primary-darkest text-white text-[10px] px-2 py-0.5 rounded-full">{badge}</span>}
    </button>
);

const SummaryGridItem = ({ label, value, trend, icon: Icon, color }) => (
    <Card className="border-none shadow-sm">
        <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 bg-slate-50 rounded-xl", color)}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-bold text-slate-400 flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    {trend}
                </div>
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-1">{value}</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        </CardContent>
    </Card>
);

const mockPendingListings = [
    { title: "Red Soil Farm", type: "Land", owner: "Ravi Teja", location: "Warangal", date: "2h ago", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400" },
    { title: "Kubota L4508", type: "Equipment", owner: "AgriRental Ltd", location: "Khammam", date: "4h ago", image: "https://images.unsplash.com/photo-1593110050241-ee7ce35e9700?w=400" },
    { title: "Fertile Paddy Field", type: "Land", owner: "Suresh Rao", location: "Nellore", date: "Yesterday", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400" },
];

const mockRecentBookings = [];
const mockUsers = [];

export default Admin;
