import React, { useState, useEffect } from 'react';
import { Users, MapPin, Tractor, ShieldAlert, CheckCircle2, Search, XCircle, BarChart3, TrendingUp, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [lands, setLands] = useState([]);
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [u, l, e] = await Promise.all([
                    base44.entities.User.list("-created_date", 20),
                    base44.entities.Land.list("-created_date", 20),
                    base44.entities.Equipment.list("-created_date", 20)
                ]);
                setUsers(u.length > 0 ? u : mockUsers);
                setLands(l);
                setEquipments(e);
            } catch (err) {
                setUsers(mockUsers);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const mockUsers = [
        { id: 1, full_name: 'Raghav Kumar', email: 'raghav@example.com', role: 'Farmer', status: 'Active', joined: '2026-02-15' },
        { id: 2, full_name: 'Suresh Rao', email: 'suresh@example.com', role: 'Landowner', status: 'Pending', joined: '2026-03-01' },
        { id: 3, full_name: 'Agri Hub', email: 'hub@example.com', role: 'Equipment Provider', status: 'Active', joined: '2026-01-20' },
        { id: 4, full_name: 'Ramesh Singh', email: 'ramesh@example.com', role: 'Worker', status: 'Suspended', joined: '2026-02-28' },
    ];

    const growthData = [
        { name: 'Oct', users: 120, listings: 45 },
        { name: 'Nov', users: 200, listings: 80 },
        { name: 'Dec', users: 150, listings: 60 },
        { name: 'Jan', users: 320, listings: 120 },
        { name: 'Feb', users: 400, listings: 180 },
        { name: 'Mar', users: 450, listings: 220 },
    ];

    const stats = [
        { label: 'Total Users', value: users.length, icon: Users, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
        { label: 'Active Lands', value: lands.length || 45, icon: MapPin, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
        { label: 'Equipment Listed', value: equipments.length || 82, icon: Tractor, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
        { label: 'Pending Approvals', value: 12, icon: ShieldAlert, color: 'bg-rose-50 text-rose-600', border: 'border-rose-100' },
    ];

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 pb-20 page-transition">
            {/* Header */}
            <div className="mb-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 text-rose-600 font-bold text-sm uppercase tracking-widest mb-3">
                        <ShieldAlert className="w-4 h-4" />
                        Administrator Access
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-2 heading-decoration">Admin Control Center</h1>
                    <p className="text-slate-500 text-lg">Manage users, oversee marketplace activity, and monitor platform health.</p>
                </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 bg-white/80 backdrop-blur-lg p-2 rounded-2xl shadow-card w-fit border border-slate-200/40">
                {[
                    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
                    { id: 'users', label: 'User Directory', icon: Users },
                    { id: 'settings', label: 'Platform Settings', icon: Settings }
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all",
                            activeTab === tab.id ? "bg-slate-900 text-white shadow-md shadow-slate-900/20" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100")}>
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            {activeTab === 'dashboard' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <Card className={cn("border shadow-card rounded-[2rem] h-full bg-white/80 backdrop-blur-lg card-hover", stat.border)}>
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", stat.color)}>
                                            <stat.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">{stat.label}</span>
                                            <span className="text-2xl font-extrabold text-slate-900">{stat.value}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Chart */}
                    <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-lg">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 pt-8 pb-6">
                            <CardTitle className="text-xl font-extrabold flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-primary" /> Platform Growth
                            </CardTitle>
                            <CardDescription>Monthly new user registrations and listing creations</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={growthData} barSize={24} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: '12px 16px' }}
                                        labelStyle={{ fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}
                                    />
                                    <Bar dataKey="users" name="New Users" fill="#0f172a" radius={[6, 6, 0, 0]} />
                                    <Bar dataKey="listings" name="New Listings" fill="#059669" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {activeTab === 'users' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-lg">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4 items-center">
                            <h2 className="text-xl font-extrabold text-slate-900">User Directory</h2>
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="text" placeholder="Search users by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                    className="input-modern w-full pl-11 bg-white" />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-400">User Details</th>
                                        <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-400">Role</th>
                                        <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-400">Joined</th>
                                        <th className="p-5 font-bold text-xs uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {filteredUsers.map((user, i) => (
                                            <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors group">
                                                <td className="p-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white font-extrabold flex items-center justify-center shadow-sm">
                                                            {user.full_name?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="font-extrabold text-slate-900 text-sm tracking-tight">{user.full_name}</p>
                                                            <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-sm font-bold text-slate-700">{user.role}</td>
                                                <td className="p-5">
                                                    <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border inline-flex items-center gap-1.5",
                                                        user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                            user.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                'bg-rose-50 text-rose-700 border-rose-200')}>
                                                        {user.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                                                        {user.status === 'Suspended' && <XCircle className="w-3 h-3" />}
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="p-5 text-sm font-medium text-slate-500">{new Date(user.joined).toLocaleDateString()}</td>
                                                <td className="p-5 text-right">
                                                    <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                        <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs font-bold border-slate-200 bg-white">View</Button>
                                                        <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs font-bold border-rose-200 text-rose-600 hover:bg-rose-50 bg-white">Suspend</Button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-16 text-slate-400">No users found matching your search.</div>
                            )}
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

export default Admin;
