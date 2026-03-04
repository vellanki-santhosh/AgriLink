import React, { useState, useEffect } from 'react';
import {
    Calendar,
    MapPin,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronRight,
    Filter,
    Search,
    IndianRupee,
    Briefcase,
    Tractor,
    Map as MapIcon,
    Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Bookings = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('as_farmer');
    const [bookings, setBookings] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        base44.auth.me().then(u => {
            setUser(u);
            loadBookings(u.email);
        });
    }, [activeTab]);

    const loadBookings = async (email) => {
        setLoading(true);
        try {
            const field = activeTab === 'as_farmer' ? 'farmer_email' : 'owner_email';
            const data = await base44.entities.Booking.filter({ [field]: email }, "-created_date", 50);
            setBookings(data.length > 0 ? data : (activeTab === 'as_farmer' ? mockFarmerBookings : mockOwnerBookings));
        } catch (e) {
            setBookings(activeTab === 'as_farmer' ? mockFarmerBookings : mockOwnerBookings);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, newStatus) => {
        try {
            await base44.entities.Booking.update(id, { status: newStatus });
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        } catch (e) {
            console.error("Action failed", e);
        }
    };

    const mockFarmerBookings = [
        {
            id: 'b1',
            booking_type: 'Land',
            item_title: 'Fertile Black Soil Land',
            item_id: '1',
            owner_email: 'owner@example.com',
            farmer_name: 'Test User',
            start_date: '2026-03-01',
            end_date: '2027-02-28',
            total_amount: 25000,
            status: 'Confirmed',
            payment_status: 'Paid',
            created_date: '2026-02-15'
        },
        {
            id: 'b2',
            booking_type: 'Equipment',
            item_title: 'John Deere Tractor',
            item_id: 'e1',
            owner_email: 'tractor_hub@example.com',
            farmer_name: 'Test User',
            start_date: '2026-03-05',
            end_date: '2026-03-06',
            total_amount: 3500,
            status: 'Pending',
            payment_status: 'Unpaid',
            created_date: '2026-02-25'
        }
    ];

    const mockOwnerBookings = [
        {
            id: 'b3',
            booking_type: 'Land',
            item_title: 'My Mango Garden',
            item_id: 'l5',
            farmer_name: 'Rajesh Kumar',
            farmer_email: 'rajesh@example.com',
            start_date: '2026-04-01',
            end_date: '2027-03-31',
            total_amount: 40000,
            status: 'Pending',
            payment_status: 'Unpaid',
            created_date: '2026-02-20'
        }
    ];

    const filteredBookings = bookings.filter(b => filterStatus === 'All' || b.status === filterStatus);

    const stats = {
        total: filteredBookings.length,
        pending: filteredBookings.filter(b => b.status === 'Pending').length,
        confirmed: filteredBookings.filter(b => b.status === 'Confirmed' || b.status === 'Completed').length,
    };

    return (
        <div className="container mx-auto px-4 pb-20">
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">My Bookings</h1>
                <p className="text-slate-500">Manage your rentals and service requests in one place.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <BookingStat label="Total Bookings" value={stats.total} icon={Briefcase} color="bg-blue-50 text-blue-600" />
                <BookingStat label="Pending Approval" value={stats.pending} icon={Clock} color="bg-amber-50 text-amber-600" />
                <BookingStat label="Successful Sessions" value={stats.confirmed} icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
            </div>

            {/* Tabs */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8 items-start lg:items-center justify-between">
                <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
                    <button
                        onClick={() => setActiveTab('as_farmer')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                            activeTab === 'as_farmer' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Requested by Me
                    </button>
                    <button
                        onClick={() => setActiveTab('as_owner')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                            activeTab === 'as_owner' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        My Listings Bookings
                    </button>
                </div>

                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto">
                    {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border",
                                filterStatus === status
                                    ? "bg-slate-900 text-white border-slate-900"
                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bookings List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-50 rounded-3xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence mode='popLayout'>
                        {filteredBookings.map((booking, index) => (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <BookingCard
                                    booking={booking}
                                    isOwner={activeTab === 'as_owner'}
                                    onAction={handleAction}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredBookings.length === 0 && (
                        <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-16 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <Calendar className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-slate-800">No bookings found</h3>
                            <p className="text-slate-500 text-sm">There are no bookings matching your current filters.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const BookingCard = ({ booking, isOwner, onAction }) => {
    const statusColors = {
        'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
        'Confirmed': 'bg-blue-50 text-blue-600 border-blue-100',
        'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Cancelled': 'bg-rose-50 text-rose-600 border-rose-100'
    };

    const typeIcons = {
        'Land': MapIcon,
        'Equipment': Tractor,
        'Worker': Briefcase,
        'Transport': Truck
    };

    const Icon = typeIcons[booking.booking_type] || Calendar;

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow border-slate-100">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                    {/* Left info */}
                    <div className="p-6 md:w-2/3 flex flex-col md:flex-row gap-6">
                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0", booking.booking_type === 'Land' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600')}>
                            <Icon className="w-8 h-8" />
                        </div>

                        <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-1">
                                <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", statusColors[booking.status] || 'bg-slate-50 text-slate-500')}>
                                    {booking.status}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">ID: {booking.id}</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{booking.item_title}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span>{new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Briefcase className="w-4 h-4 text-slate-400" />
                                    <span>{isOwner ? `Customer: ${booking.farmer_name}` : `Owner: ${booking.owner_email.split('@')[0]}`}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right action/price */}
                    <div className="p-6 md:w-1/3 bg-slate-50/50 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-between gap-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Total Amount</span>
                                <div className="flex items-center gap-1 text-2xl font-black text-slate-900">
                                    <IndianRupee className="w-5 h-5" />
                                    {booking.total_amount.toLocaleString()}
                                </div>
                                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full mt-2 inline-block", booking.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600')}>
                                    {booking.payment_status}
                                </span>
                            </div>
                            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                                <ChevronRight className="w-5 h-5 text-slate-300" />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {isOwner && booking.status === 'Pending' && (
                                <Button size="sm" className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold" onClick={() => onAction(booking.id, 'Confirmed')}>
                                    Accept
                                </Button>
                            )}
                            {booking.status === 'Confirmed' && (
                                <Button size="sm" className="flex-grow bg-primary hover:bg-primary-dark text-white rounded-xl font-bold" onClick={() => onAction(booking.id, 'Completed')}>
                                    Mark Complete
                                </Button>
                            )}
                            {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                                <Button size="sm" variant="outline" className="flex-grow border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all" onClick={() => onAction(booking.id, 'Cancelled')}>
                                    Cancel
                                </Button>
                            )}
                            {booking.status === 'Completed' && (
                                <Button size="sm" variant="outline" className="flex-grow border-primary text-primary rounded-xl font-bold hover:bg-primary/5">
                                    Leave Review
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const BookingStat = ({ label, value, icon: Icon, color }) => (
    <Card className="border-none shadow-sm h-full">
        <CardContent className="p-6 flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0", color)}>
                <Icon className="w-7 h-7" />
            </div>
            <div>
                <span className="block text-xs font-bold text-slate-400 uppercase mb-0.5">{label}</span>
                <span className="text-2xl font-black text-slate-900">{value}</span>
            </div>
        </CardContent>
    </Card>
);

export default Bookings;
