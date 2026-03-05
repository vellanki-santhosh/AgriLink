import React, { useState, useEffect } from 'react';
import {
    Calendar, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight,
    Filter, Search, IndianRupee, Briefcase, Tractor, Map as MapIcon, Truck, Star, X,
    BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const toast = (msg) => {
        const id = Date.now();
        setToasts(t => [...t, { id, msg }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
    };
    return { toasts, toast };
};

const Bookings = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('as_farmer');
    const [bookings, setBookings] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [loading, setLoading] = useState(true);
    const [reviewBooking, setReviewBooking] = useState(null);
    const { toasts, toast } = useToast();

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
        } catch (e) { console.error("Action failed", e); }
    };

    const mockFarmerBookings = [
        { id: 'b1', booking_type: 'Land', item_title: 'Fertile Black Soil Land', item_id: '1', owner_email: 'owner@example.com', farmer_name: 'Test User', start_date: '2026-03-01', end_date: '2027-02-28', total_amount: 25000, status: 'Confirmed', payment_status: 'Paid', created_date: '2026-02-15' },
        { id: 'b2', booking_type: 'Equipment', item_title: 'John Deere Tractor', item_id: 'e1', owner_email: 'tractor_hub@example.com', farmer_name: 'Test User', start_date: '2026-03-05', end_date: '2026-03-06', total_amount: 3500, status: 'Pending', payment_status: 'Unpaid', created_date: '2026-02-25' }
    ];

    const mockOwnerBookings = [
        { id: 'b3', booking_type: 'Land', item_title: 'My Mango Garden', item_id: 'l5', farmer_name: 'Rajesh Kumar', farmer_email: 'rajesh@example.com', start_date: '2026-04-01', end_date: '2027-03-31', total_amount: 40000, status: 'Pending', payment_status: 'Unpaid', created_date: '2026-02-20' }
    ];

    const filteredBookings = bookings.filter(b => filterStatus === 'All' || b.status === filterStatus);
    const stats = {
        total: filteredBookings.length,
        pending: filteredBookings.filter(b => b.status === 'Pending').length,
        confirmed: filteredBookings.filter(b => b.status === 'Confirmed' || b.status === 'Completed').length,
    };

    return (
        <div className="container mx-auto px-4 pb-20 page-transition">
            {/* Toasts */}
            <div className="fixed top-24 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div key={t.id} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
                            className="px-5 py-3 rounded-2xl shadow-xl text-sm font-bold bg-emerald-600 text-white">
                            {t.msg}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Header */}
            <div className="mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-widest mb-3">
                        <BarChart3 className="w-4 h-4" />
                        Reservations
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4 heading-decoration">My Bookings</h1>
                    <p className="text-slate-500 text-lg max-w-2xl mt-6">Manage your rentals and service requests in one place.</p>
                </motion.div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <BookingStat label="Total Bookings" value={stats.total} icon={Briefcase} color="bg-blue-50 text-blue-600" />
                <BookingStat label="Pending Approval" value={stats.pending} icon={Clock} color="bg-amber-50 text-amber-600" />
                <BookingStat label="Successful Sessions" value={stats.confirmed} icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
            </div>

            {/* Tabs */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8 items-start lg:items-center justify-between">
                <div className="bg-white/80 backdrop-blur-lg p-1.5 rounded-2xl flex gap-1 shadow-card border border-slate-200/40">
                    <button onClick={() => setActiveTab('as_farmer')}
                        className={cn("px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                            activeTab === 'as_farmer' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-500 hover:text-slate-700")}>
                        Requested by Me
                    </button>
                    <button onClick={() => setActiveTab('as_owner')}
                        className={cn("px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                            activeTab === 'as_owner' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-500 hover:text-slate-700")}>
                        My Listings Bookings
                    </button>
                </div>
                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto">
                    {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(status => (
                        <button key={status} onClick={() => setFilterStatus(status)}
                            className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border",
                                filterStatus === status
                                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700")}>
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bookings List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-[2rem] skeleton"></div>)}
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence mode='popLayout'>
                        {filteredBookings.map((booking, index) => (
                            <motion.div key={booking.id}
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}>
                                <BookingCard booking={booking} isOwner={activeTab === 'as_owner'} onAction={handleAction} onReview={setReviewBooking} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filteredBookings.length === 0 && (
                        <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-16 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300"><Calendar className="w-8 h-8" /></div>
                            <h3 className="font-bold text-slate-800">No bookings found</h3>
                            <p className="text-slate-500 text-sm">There are no bookings matching your current filters.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Review Modal */}
            <AnimatePresence>
                {reviewBooking && (
                    <ReviewModal booking={reviewBooking} onClose={() => setReviewBooking(null)}
                        onSubmit={(rating, comment) => {
                            setReviewBooking(null);
                            toast(`⭐ Review submitted for "${reviewBooking.item_title}" — ${rating} stars!`);
                        }} />
                )}
            </AnimatePresence>
        </div>
    );
};

const ReviewModal = ({ booking, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async () => {
        if (!rating) return;
        setLoading(true);
        try {
            await base44.entities.Review.create({ item_id: booking.item_id, item_type: booking.booking_type, rating, comment, reviewer_name: booking.farmer_name || 'Anonymous' });
        } catch (e) { }
        setLoading(false);
        setDone(true);
        setTimeout(() => onSubmit(rating, comment), 1200);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 z-10">
                <button onClick={onClose} className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-xl transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
                {done ? (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                            <Star className="w-10 h-10 fill-amber-400" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Review Submitted!</h3>
                        <p className="text-slate-500">Thank you for your feedback on <b>{booking.item_title}</b>.</p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Leave a Review</h3>
                        <p className="text-slate-500 text-sm mb-8">{booking.item_title}</p>
                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}
                                    className="transition-transform hover:scale-125 active:scale-95">
                                    <Star className={cn("w-10 h-10 transition-colors", (hover || rating) >= s ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200")} />
                                </button>
                            ))}
                        </div>
                        <textarea value={comment} onChange={e => setComment(e.target.value)}
                            placeholder="Share your experience (optional)..."
                            className="input-modern w-full pl-4 h-28 resize-none mb-6" />
                        <Button variant="premium" className="w-full h-14 rounded-2xl" disabled={!rating || loading} onClick={handleSubmit}>
                            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Submit Review'}
                        </Button>
                    </>
                )}
            </motion.div>
        </div>
    );
};

const BookingCard = ({ booking, isOwner, onAction, onReview }) => {
    const statusColors = {
        'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
        'Confirmed': 'bg-blue-50 text-blue-600 border-blue-100',
        'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Cancelled': 'bg-rose-50 text-rose-600 border-rose-100'
    };
    const typeIcons = { 'Land': MapIcon, 'Equipment': Tractor, 'Worker': Briefcase, 'Transport': Truck };
    const Icon = typeIcons[booking.booking_type] || Calendar;

    return (
        <Card className="overflow-hidden hover:shadow-md transition-all border-slate-200/40 rounded-[2rem] bg-white/80 backdrop-blur-lg">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                    <div className="p-6 md:w-2/3 flex flex-col md:flex-row gap-6">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", booking.booking_type === 'Land' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600')}>
                            <Icon className="w-7 h-7" />
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-1.5">
                                <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border", statusColors[booking.status] || 'bg-slate-50 text-slate-500 border-slate-100')}>
                                    {booking.status}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">ID: {booking.id}</span>
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">{booking.item_title}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
                                <div className="flex items-center gap-2 text-sm text-slate-500"><Calendar className="w-4 h-4 text-slate-400" /><span>{new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}</span></div>
                                <div className="flex items-center gap-2 text-sm text-slate-500"><Briefcase className="w-4 h-4 text-slate-400" /><span>{isOwner ? `Customer: ${booking.farmer_name}` : `Owner: ${booking.owner_email?.split('@')[0] || 'N/A'}`}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 md:w-1/3 bg-slate-50/50 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-between gap-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Amount</span>
                                <div className="flex items-center gap-1 text-2xl font-extrabold text-slate-900"><IndianRupee className="w-5 h-5" />{booking.total_amount.toLocaleString()}</div>
                                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-lg mt-2 inline-block border", booking.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200')}>
                                    {booking.payment_status}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {isOwner && booking.status === 'Pending' && (
                                <Button size="sm" className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold" onClick={() => onAction(booking.id, 'Confirmed')}>Accept</Button>
                            )}
                            {booking.status === 'Confirmed' && (
                                <Button size="sm" className="flex-grow bg-primary hover:bg-primary-dark text-white rounded-xl font-bold" onClick={() => onAction(booking.id, 'Completed')}>Mark Complete</Button>
                            )}
                            {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                                <Button size="sm" variant="outline" className="flex-grow border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all" onClick={() => onAction(booking.id, 'Cancelled')}>Cancel</Button>
                            )}
                            {booking.status === 'Completed' && (
                                <Button size="sm" variant="outline" className="flex-grow border-primary text-primary rounded-xl font-bold hover:bg-primary/5" onClick={() => onReview(booking)}>Leave Review</Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const BookingStat = ({ label, value, icon: Icon, color }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border border-slate-200/40 shadow-card rounded-[2rem] h-full bg-white/80 backdrop-blur-lg card-hover">
            <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", color)}>
                    <Icon className="w-7 h-7" />
                </div>
                <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</span>
                    <span className="text-2xl font-extrabold text-slate-900">{value}</span>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

export default Bookings;
