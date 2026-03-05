import React, { useState, useEffect } from 'react';
import {
    Search, MapPin, Truck, Star, Phone, Clock, IndianRupee,
    X, CheckCircle2, Route, CalendarRange, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Transport = () => {
    const [transports, setTransports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTransport, setSelectedTransport] = useState(null);
    const [bookingStep, setBookingStep] = useState(0);
    const [bookingData, setBookingData] = useState({ pickup: '', drop: '', date: '' });

    useEffect(() => {
        base44.entities.Transport.list("-created_date", 50).then(data => {
            setTransports(data.length > 0 ? data : mockTransports);
            setLoading(false);
        }).catch(() => {
            setTransports(mockTransports);
            setLoading(false);
        });
    }, []);

    const mockTransports = [
        { id: 't1', vehicle_type: 'Tata 407 Pickup', capacity: '2.5 Tonnes', per_km_rate: 18, provider_name: 'Kisan Logistics', provider_phone: '+91 98765 43210', location: 'Khammam, Telangana', rating: 4.7, response_time: '30 min', image_url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600', available: true },
        { id: 't2', vehicle_type: 'Mahindra Bolero Pickup', capacity: '1.5 Tonnes', per_km_rate: 14, provider_name: 'Rural Transport Co.', provider_phone: '+91 87654 32109', location: 'Warangal, Telangana', rating: 4.5, response_time: '1 hour', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600', available: true },
        { id: 't3', vehicle_type: 'Ashok Leyland 10-Wheeler', capacity: '16 Tonnes', per_km_rate: 35, provider_name: 'Heavy Haul India', provider_phone: '+91 76543 21098', location: 'Hyderabad, Telangana', rating: 4.9, response_time: '2 hours', image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600', available: true },
        { id: 't4', vehicle_type: 'Mini Truck (Tata Ace)', capacity: '750 Kg', per_km_rate: 10, provider_name: 'Quick Farm Delivery', provider_phone: '+91 65432 10987', location: 'Nalgonda, Telangana', rating: 4.3, response_time: '15 min', image_url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600', available: false },
    ];

    const filtered = transports.filter(t =>
        t.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBooking = () => {
        setBookingStep(2);
        setTimeout(() => { setBookingStep(0); setSelectedTransport(null); }, 2500);
    };

    return (
        <div className="container mx-auto px-4 pb-20 page-transition">
            {/* Header */}
            <div className="mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-widest mb-3">
                        <Truck className="w-4 h-4" />
                        Logistics
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4 heading-decoration">Transport Services</h1>
                    <p className="text-slate-500 text-lg max-w-2xl mt-6">Reliable transport solutions for moving your crops, equipment, and agricultural supplies across the region.</p>
                </motion.div>
            </div>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/80 backdrop-blur-lg rounded-[2rem] shadow-card border border-slate-200/40 p-6 mb-10"
            >
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search by vehicle type, provider, or location..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="input-modern w-full pl-11 pr-4 py-3.5 text-sm" />
                </div>
            </motion.div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-[2rem] skeleton"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatePresence>
                        {filtered.map((item, index) => (
                            <motion.div key={item.id} layout
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.06 }}>
                                <Card className="overflow-hidden rounded-[2rem] border border-slate-200/40 shadow-card bg-white/80 backdrop-blur-lg card-hover group h-full">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row h-full">
                                            {/* Image */}
                                            <div className="relative w-full md:w-2/5 h-48 md:h-auto overflow-hidden">
                                                <img src={item.image_url || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400'}
                                                    alt={item.vehicle_type} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r"></div>
                                                {/* Available badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className={cn("px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border flex items-center gap-1.5",
                                                        item.available ? 'bg-emerald-500/90 text-white border-emerald-400/30' : 'bg-slate-500/90 text-white border-slate-400/30')}>
                                                        {item.available && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                                        {item.available ? 'Available' : 'Busy'}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Details */}
                                            <div className="flex-grow p-6 flex flex-col">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <h3 className="font-extrabold text-xl text-slate-900 tracking-tight mb-1 group-hover:text-primary transition-colors">{item.vehicle_type}</h3>
                                                        <p className="text-primary font-bold text-sm">{item.provider_name}</p>
                                                    </div>
                                                    {item.rating && (
                                                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 shrink-0">
                                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                            <span className="font-bold text-amber-700 text-sm">{item.rating}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-5">
                                                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 border border-slate-100">
                                                        <Package className="w-3 h-3 text-slate-400" /> {item.capacity}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 border border-slate-100">
                                                        <Clock className="w-3 h-3 text-slate-400" /> {item.response_time}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 text-slate-600 border border-slate-100">
                                                        <MapPin className="w-3 h-3 text-slate-400" /> {item.location}
                                                    </span>
                                                </div>

                                                <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
                                                    <div className="flex items-center gap-1">
                                                        <IndianRupee className="w-4 h-4 text-primary" />
                                                        <span className="text-2xl font-extrabold text-slate-900">{item.per_km_rate}</span>
                                                        <span className="text-xs text-slate-500 font-medium">/km</span>
                                                    </div>
                                                    <Button variant="premium" className="rounded-2xl h-11 font-bold px-6"
                                                        onClick={() => { setSelectedTransport(item); setBookingStep(1); }}>
                                                        Book Now
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Truck className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No transport services found</h3>
                    <p className="text-slate-500">Try adjusting your search.</p>
                </motion.div>
            )}

            {/* Booking Modal */}
            <AnimatePresence>
                {selectedTransport && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => { setSelectedTransport(null); setBookingStep(0); }} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 z-10">
                            <button onClick={() => { setSelectedTransport(null); setBookingStep(0); }}
                                className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>

                            {bookingStep === 2 ? (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Booking Confirmed!</h3>
                                    <p className="text-slate-500 font-medium">{selectedTransport.vehicle_type} has been booked.</p>
                                </motion.div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                            <Truck className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-extrabold text-slate-900">{selectedTransport.vehicle_type}</h3>
                                            <p className="text-sm text-primary font-bold">{selectedTransport.provider_name}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5 mb-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pickup Location</label>
                                            <input type="text" placeholder="e.g. Khammam Market Yard" className="input-modern w-full pl-4"
                                                value={bookingData.pickup} onChange={e => setBookingData({ ...bookingData, pickup: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Drop Location</label>
                                            <input type="text" placeholder="e.g. Guntur Cold Storage" className="input-modern w-full pl-4"
                                                value={bookingData.drop} onChange={e => setBookingData({ ...bookingData, drop: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
                                            <input type="date" className="input-modern w-full pl-4"
                                                value={bookingData.date} onChange={e => setBookingData({ ...bookingData, date: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Rate</span>
                                            <span className="font-bold text-slate-900">₹{selectedTransport.per_km_rate}/km</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Capacity</span>
                                            <span className="font-bold text-slate-900">{selectedTransport.capacity}</span>
                                        </div>
                                        <div className="border-t border-slate-200 pt-3 flex justify-between text-sm">
                                            <span className="text-slate-500 font-bold">Response Time</span>
                                            <span className="font-bold text-primary">{selectedTransport.response_time}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1 rounded-2xl h-13 font-bold"
                                            onClick={() => { setSelectedTransport(null); setBookingStep(0); }}>Cancel</Button>
                                        <Button variant="premium" className="flex-1 rounded-2xl h-13 font-bold"
                                            onClick={handleBooking}>Book Transport</Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Transport;
