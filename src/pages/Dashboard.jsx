import React, { useState, useEffect } from 'react';
import {
    TrendingUp, Calendar, MapPin, Droplets, Sun, Leaf, BarChart3,
    IndianRupee, ExternalLink, Users, Tractor, Map, ArrowUpRight,
    CloudRain, Wind, ThermometerSun, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        base44.auth.me().then(setUser).catch(() => setUser({ full_name: 'Farmer', email: 'demo@agrilink.in' }));
    }, []);

    const bookingTrend = [
        { month: 'Oct', bookings: 4 },
        { month: 'Nov', bookings: 7 },
        { month: 'Dec', bookings: 3 },
        { month: 'Jan', bookings: 9 },
        { month: 'Feb', bookings: 12 },
        { month: 'Mar', bookings: 8 },
    ];

    const soilData = [
        { name: 'Black', value: 40, color: '#334155' },
        { name: 'Red', value: 25, color: '#ef4444' },
        { name: 'Wet', value: 20, color: '#3b82f6' },
        { name: 'Dry', value: 15, color: '#f59e0b' },
    ];

    const stats = [
        { label: 'Total Bookings', value: '47', icon: Calendar, color: 'bg-blue-50 text-blue-600', trend: '+12%', trendUp: true },
        { label: 'Active Listings', value: '8', icon: Map, color: 'bg-emerald-50 text-emerald-600', trend: '+3', trendUp: true },
        { label: 'Revenue', value: '₹1.2L', icon: IndianRupee, color: 'bg-amber-50 text-amber-600', trend: '+18%', trendUp: true },
        { label: 'Rating', value: '4.8', icon: TrendingUp, color: 'bg-purple-50 text-purple-600', trend: '★★★★★', trendUp: true },
    ];

    const schemes = [
        { name: 'PM-KISAN', desc: '₹6,000/year income support for eligible farmers', ministry: 'Dept. of Agriculture', link: 'https://pmkisan.gov.in/' },
        { name: 'PMFBY', desc: 'Crop insurance at subsidized premiums against natural calamities', ministry: 'Min. of Agriculture', link: 'https://pmfby.gov.in/' },
        { name: 'KCC', desc: 'Credit facility at reduced interest rates for farmers', ministry: 'NABARD', link: 'https://www.nabard.org/' },
    ];

    return (
        <div className="container mx-auto px-4 pb-20 page-transition">
            {/* Header */}
            <div className="mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-widest mb-3">
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-2">
                        Welcome back, <span className="gradient-text">{user?.full_name?.split(' ')[0] || 'Farmer'}</span>
                    </h1>
                    <p className="text-slate-500 text-lg">Here's an overview of your farm activity and insights.</p>
                </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <motion.div key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden card-hover bg-white/80 backdrop-blur-lg h-full">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-5">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", stat.color)}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg",
                                        stat.trendUp ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100")}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">{stat.value}</div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2"
                >
                    <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-lg h-full">
                        <CardHeader className="pb-2 px-8 pt-8">
                            <CardTitle className="text-xl font-extrabold">Booking Trends</CardTitle>
                            <CardDescription>Monthly booking activity over the past 6 months</CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={bookingTrend} barSize={32}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: '12px 16px' }}
                                        labelStyle={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}
                                    />
                                    <Bar dataKey="bookings" fill="#059669" radius={[10, 10, 4, 4]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-lg h-full">
                        <CardHeader className="pb-2 px-8 pt-8">
                            <CardTitle className="text-xl font-extrabold">Soil Distribution</CardTitle>
                            <CardDescription>Types of soil in your listed lands</CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie data={soilData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                                        innerRadius={55} outerRadius={90} strokeWidth={4} stroke="#fff">
                                        {soilData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} />
                                    <Legend iconType="circle" iconSize={8}
                                        formatter={(value) => <span className="text-xs font-bold text-slate-600 ml-1">{value}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Weather + Schemes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-lg h-full">
                        <CardHeader className="px-8 pt-8 pb-6">
                            <CardTitle className="text-xl font-extrabold flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                                    <Sun className="w-5 h-5" />
                                </div>
                                Weather Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-transparent border border-amber-100 flex items-center gap-3">
                                    <ThermometerSun className="w-5 h-5 text-amber-500" />
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase">Temperature</div>
                                        <div className="font-extrabold text-slate-900 text-lg">32°C</div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-transparent border border-blue-100 flex items-center gap-3">
                                    <CloudRain className="w-5 h-5 text-blue-500" />
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase">Rainfall</div>
                                        <div className="font-extrabold text-slate-900 text-lg">20%</div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-transparent border border-purple-100 flex items-center gap-3">
                                    <Droplets className="w-5 h-5 text-purple-500" />
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase">Humidity</div>
                                        <div className="font-extrabold text-slate-900 text-lg">65%</div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-transparent border border-teal-100 flex items-center gap-3">
                                    <Wind className="w-5 h-5 text-teal-500" />
                                    <div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase">Wind</div>
                                        <div className="font-extrabold text-slate-900 text-lg">12 km/h</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <Leaf className="w-4 h-4 text-primary" />
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">AI Tip</span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed italic">"Moderate temperature and low rainfall — ideal conditions for field operations. Consider deep watering for cotton crops."</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-lg h-full">
                        <CardHeader className="px-8 pt-8 pb-6">
                            <CardTitle className="text-xl font-extrabold flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <ExternalLink className="w-5 h-5" />
                                </div>
                                Government Schemes
                            </CardTitle>
                            <CardDescription>Farmer welfare programs you can benefit from</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            <div className="space-y-4">
                                {schemes.map((scheme, i) => (
                                    <a key={i} href={scheme.link} target="_blank" rel="noopener noreferrer"
                                        className="block p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-primary/30 hover:bg-primary/3 transition-all group cursor-pointer">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-lg">{scheme.name}</h4>
                                            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors shrink-0" />
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-2">{scheme.desc}</p>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{scheme.ministry}</div>
                                    </a>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
