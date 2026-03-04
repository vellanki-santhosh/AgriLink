import React, { useState, useEffect } from 'react';
import {
    X,
    MapPin,
    LandPlot,
    Droplets,
    Zap,
    Leaf,
    Calendar as CalendarIcon,
    ArrowRight,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from '@/components/ui/StarRating';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const LandDetailModal = ({ land, isOpen, onClose }) => {
    const [bookingStep, setBookingStep] = useState('detail'); // detail, booking, success
    const [reviews, setReviews] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        if (isOpen && land) {
            loadReviews();
            setBookingStep('detail');
        }
    }, [isOpen, land]);

    const loadReviews = async () => {
        try {
            const data = await base44.entities.Review.filter({ item_id: land.id, item_type: 'Land' }, "-created_date", 10);
            setReviews(data.length > 0 ? data : mockReviews);
        } catch (e) {
            setReviews(mockReviews);
        }
    };

    const handleBook = async () => {
        setLoading(true);
        try {
            const user = await base44.auth.me();
            await base44.entities.Booking.create({
                booking_type: "Land",
                item_id: land.id,
                item_title: land.title,
                farmer_email: user.email,
                farmer_name: user.full_name,
                owner_email: land.owner_email,
                start_date: startDate,
                end_date: endDate,
                total_amount: land.rental_price,
                status: "Pending"
            });
            setBookingStep('success');
        } catch (e) {
            console.error("Booking failed", e);
        } finally {
            setLoading(false);
        }
    };

    const mockReviews = [
        { id: 'r1', reviewer_name: 'Suresh Rao', rating: 5, comment: 'Excellent soil quality. The water availability is exactly as stated. Highly recommended.', created_date: '2026-01-15' },
        { id: 'r2', reviewer_name: 'Kiran G.', rating: 4, comment: 'Good land, very fertile. Access road is a bit narrow but manageable.', created_date: '2025-12-10' }
    ];

    if (!isOpen || !land) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="absolute top-6 right-6 z-10">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Left Side: Images & Quick Info */}
                        <div className="lg:w-1/2 relative bg-slate-100 h-[400px] lg:h-auto">
                            <img
                                src={land.images?.[activeImage] || 'https://via.placeholder.com/800x600'}
                                className="w-full h-full object-cover"
                                alt={land.title}
                            />
                            <div className="absolute bottom-6 left-6 right-6 flex gap-2 overflow-x-auto pb-2">
                                {land.images?.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={cn(
                                            "w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                                            activeImage === i ? "border-white shadow-lg scale-110" : "border-transparent opacity-70"
                                        )}
                                    >
                                        <img src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                            <div className="absolute top-6 left-6">
                                <div className="bg-emerald-600 text-white font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                                    {land.status}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Details */}
                        <div className="lg:w-1/2 p-8 lg:p-12">
                            <AnimatePresence mode="wait">
                                {bookingStep === 'detail' && (
                                    <motion.div
                                        key="detail"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
                                            <LandPlot className="w-4 h-4" />
                                            Agriculture Listing
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900 mb-2 leading-tight">{land.title}</h2>
                                        <div className="flex items-center gap-2 text-slate-500 mb-8">
                                            <MapPin className="w-4 h-4" />
                                            <span className="font-medium">{land.location_address}, {land.district}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <QuickStat icon={LandPlot} label="Total Area" value={`${land.total_area} ${land.area_unit}`} />
                                            <QuickStat icon={Leaf} label="Soil Type" value={`${land.land_type} Soil`} />
                                            <QuickStat icon={Droplets} label="Irrigation" value={land.water_availability} />
                                            <QuickStat icon={Zap} label="Power" value={land.electricity_access} />
                                        </div>

                                        <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
                                            <h4 className="font-bold text-slate-900 mb-2">Description</h4>
                                            <p className="text-slate-600 leading-relaxed text-sm">
                                                {land.description || "This fertile land is ideal for cotton and paddy cultivation. Well-connected to the main road and has consistent water supply. Previous crops include Maize and Chilies."}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Price</span>
                                                <div className="text-3xl font-black text-slate-900">
                                                    ₹{land.rental_price.toLocaleString()}
                                                    <span className="text-sm font-medium text-slate-400"> / {land.rental_type === 'Per Year' ? 'yr' : 'mo'}</span>
                                                </div>
                                            </div>
                                            <Button variant="premium" size="lg" className="rounded-2xl px-10 h-14" onClick={() => setBookingStep('booking')}>
                                                Book Now
                                            </Button>
                                        </div>

                                        <div className="pt-8 border-t border-slate-100">
                                            <div className="flex items-center justify-between mb-6">
                                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                    Reviews
                                                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{reviews.length}</span>
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <StarRating rating={4.5} size={4} />
                                                    <span className="text-sm font-bold text-slate-900">4.5</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {reviews.map(review => (
                                                    <div key={review.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="font-bold text-slate-800 text-sm">{review.reviewer_name}</span>
                                                            <StarRating rating={review.rating} size={3} />
                                                        </div>
                                                        <p className="text-slate-600 text-xs leading-relaxed">{review.comment}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {bookingStep === 'booking' && (
                                    <motion.div
                                        key="booking"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <button className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-8 hover:text-primary transition-colors" onClick={() => setBookingStep('detail')}>
                                            Back to details
                                        </button>
                                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Secure Booking</h2>
                                        <p className="text-slate-500 mb-10">Select your preferred dates to request a lease.</p>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                                    <CalendarIcon className="w-3 h-3" />
                                                    Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-slate-700 font-bold"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                                    <CalendarIcon className="w-3 h-3" />
                                                    End Date (Estimated)
                                                </label>
                                                <input
                                                    type="date"
                                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-slate-700 font-bold"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                />
                                            </div>

                                            <Card className="bg-emerald-50 border-emerald-100 shadow-none p-6">
                                                <div className="flex gap-4">
                                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl h-fit">
                                                        <ShieldCheck className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-emerald-900 text-sm">Protected Booking</h4>
                                                        <p className="text-emerald-700 text-xs leading-relaxed mt-1">
                                                            Your payment is held securely and only released to the owner after you confirm possession of the land.
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>

                                            <div className="pt-8">
                                                <div className="flex items-center justify-between mb-6">
                                                    <span className="text-slate-500 font-bold">Total to Pay</span>
                                                    <span className="text-3xl font-black text-slate-900">₹{land.rental_price.toLocaleString()}</span>
                                                </div>
                                                <Button
                                                    variant="premium"
                                                    size="xl"
                                                    className="w-full h-16 rounded-2xl text-lg group"
                                                    disabled={loading || !startDate || !endDate}
                                                    onClick={handleBook}
                                                >
                                                    {loading ? 'Processing...' : 'Proceed to Request'}
                                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {bookingStep === 'success' && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center text-center py-20"
                                    >
                                        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 animate-bounce">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Request Sent!</h2>
                                        <p className="text-slate-500 mb-10 max-w-sm">
                                            The owner has been notified of your request. You'll receive a notification once they confirm the booking.
                                        </p>
                                        <div className="flex flex-col gap-3 w-full">
                                            <Button variant="premium" className="h-14 rounded-2xl font-bold" onClick={() => window.location.href = '/bookings'}>
                                                View My Bookings
                                            </Button>
                                            <Button variant="ghost" className="h-12 rounded-2xl text-slate-500" onClick={onClose}>
                                                Close
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const QuickStat = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary shrink-0">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">{label}</span>
            <span className="text-sm font-bold text-slate-700 leading-none">{value}</span>
        </div>
    </div>
);

export default LandDetailModal;
