import React, { useState, useEffect } from 'react';
import {
    Search, Star, Filter, MapPin, Clock, Calendar, IndianRupee,
    Tractor, Settings, X, CheckCircle2, AlertCircle, ChevronRight, Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Equipment = () => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [bookingStep, setBookingStep] = useState(0);
    const [bookingDates, setBookingDates] = useState({ start: '', end: '' });

    useEffect(() => {
        base44.entities.Equipment.list("-created_date", 50).then(data => {
            setEquipmentList(data.length > 0 ? data : mockEquipment);
            setLoading(false);
        }).catch(() => {
            setEquipmentList(mockEquipment);
            setLoading(false);
        });
    }, []);

    const mockEquipment = [
        { id: 'e1', name: 'John Deere 5310 Tractor', type: 'Tractor', hourly_rate: 700, daily_rate: 3500, location: 'Khammam, Telangana', condition: 'Excellent', year: 2022, owner_name: 'AgriRental Hub', rating: 4.8, image_url: 'https://images.unsplash.com/photo-1605002657780-26e7d31d8e0c?w=600', status: 'Available' },
        { id: 'e2', name: 'Mahindra Rotavator', type: 'Rotavator', hourly_rate: 500, daily_rate: 2500, location: 'Warangal, Telangana', condition: 'Good', year: 2021, owner_name: 'Farm Solutions', rating: 4.6, image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600', status: 'Available' },
        { id: 'e3', name: 'Kubota Combine Harvester', type: 'Harvester', hourly_rate: 1200, daily_rate: 8000, location: 'Guntur, AP', condition: 'Excellent', year: 2023, owner_name: 'Harvest King', rating: 4.9, image_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600', status: 'Available' },
        { id: 'e4', name: 'Sprayer Drone DJI Agras', type: 'Drone', hourly_rate: 2000, daily_rate: 12000, location: 'Hyderabad, Telangana', condition: 'New', year: 2024, owner_name: 'AgroDrone Tech', rating: 5.0, image_url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600', status: 'Available' },
        { id: 'e5', name: 'Seed Drill Machine', type: 'Seed Drill', hourly_rate: 400, daily_rate: 2000, location: 'Nalgonda, Telangana', condition: 'Good', year: 2020, owner_name: 'Kisan Equipment', rating: 4.3, image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600', status: 'Rented' },
    ];

    const equipTypes = ['All', 'Tractor', 'Rotavator', 'Harvester', 'Drone', 'Seed Drill'];
    const filtered = equipmentList.filter(e =>
        (selectedType === 'All' || e.type === selectedType) &&
        (e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.location?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const conditionColors = { 'New': 'bg-emerald-50 text-emerald-700 border-emerald-100', 'Excellent': 'bg-blue-50 text-blue-700 border-blue-100', 'Good': 'bg-amber-50 text-amber-700 border-amber-100' };

    const handleBooking = () => {
        setBookingStep(2);
        setTimeout(() => { setBookingStep(0); setSelectedEquipment(null); }, 2500);
    };

    return (
        <div className="container mx-auto px-4 pb-20 page-transition">
            {/* Header */}
            <div className="mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-widest mb-3">
                        <Wrench className="w-4 h-4" />
                        Equipment Hub
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4 heading-decoration">Rent Equipment</h1>
                    <p className="text-slate-500 text-lg max-w-2xl mt-6">Modern agricultural machinery available for rent at competitive rates, from tractors to drones.</p>
                </motion.div>
            </div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/80 backdrop-blur-lg rounded-[2rem] shadow-card border border-slate-200/40 p-6 mb-10 flex flex-col md:flex-row gap-5 items-center"
            >
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search equipment by name or location..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="input-modern w-full pl-11 pr-4 py-3.5 text-sm" />
                </div>
                <div className="flex gap-2 flex-wrap shrink-0">
                    {equipTypes.map(type => (
                        <button key={type} onClick={() => setSelectedType(type)}
                            className={cn("px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border",
                                selectedType === type
                                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-primary/30 hover:text-primary hover:shadow-sm")}>
                            {type}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-96 rounded-[2rem] skeleton"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filtered.map((item, index) => (
                            <motion.div key={item.id} layout
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.06 }}>
                                <Card className="overflow-hidden rounded-[2rem] border border-slate-200/40 shadow-card bg-white/80 backdrop-blur-lg card-hover group h-full flex flex-col">
                                    <div className="relative h-52 overflow-hidden">
                                        <img src={item.image_url || 'https://images.unsplash.com/photo-1605002657780-26e7d31d8e0c?w=600'}
                                            alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                        {/* Status */}
                                        <div className="absolute top-4 left-4">
                                            <span className={cn("px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border flex items-center gap-1.5",
                                                item.status === 'Available' ? 'bg-emerald-500/90 text-white border-emerald-400/30' : 'bg-white/90 text-slate-600 border-white/50')}>
                                                {item.status === 'Available' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                                {item.status}
                                            </span>
                                        </div>
                                        {/* Rating */}
                                        {item.rating && (
                                            <div className="absolute top-4 right-4 px-2.5 py-1.5 rounded-lg bg-black/40 backdrop-blur-md flex items-center gap-1 text-xs font-bold text-white border border-white/10">
                                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {item.rating}
                                            </div>
                                        )}
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="font-extrabold text-white text-xl tracking-tight drop-shadow-lg">{item.name}</h3>
                                            <p className="text-white/80 text-xs font-medium flex items-center gap-1 mt-1">
                                                <MapPin className="w-3 h-3" /> {item.location}
                                            </p>
                                        </div>
                                    </div>
                                    <CardContent className="p-6 flex flex-col flex-grow">
                                        <div className="flex flex-wrap gap-2 mb-5">
                                            <span className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold border", conditionColors[item.condition] || 'bg-slate-50 text-slate-600 border-slate-100')}>
                                                {item.condition}
                                            </span>
                                            {item.year && (
                                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-100">
                                                    {item.year}
                                                </span>
                                            )}
                                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-primary/5 text-primary border border-primary/10">
                                                {item.type}
                                            </span>
                                        </div>
                                        <div className="flex items-end justify-between mb-5 mt-auto">
                                            <div>
                                                <div className="text-xs text-slate-500 font-medium mb-1">From</div>
                                                <div className="flex items-center gap-1">
                                                    <IndianRupee className="w-4 h-4 text-primary" />
                                                    <span className="text-2xl font-extrabold text-slate-900">{item.hourly_rate}</span>
                                                    <span className="text-xs text-slate-500 font-medium">/hr</span>
                                                </div>
                                            </div>
                                            <div className="text-right text-xs text-slate-500 font-medium">
                                                or ₹{item.daily_rate?.toLocaleString()}/day
                                            </div>
                                        </div>
                                        <Button variant="premium" className="w-full rounded-2xl h-12 font-bold"
                                            onClick={() => { setSelectedEquipment(item); setBookingStep(1); }}>
                                            Review & Rent
                                        </Button>
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
                        <Tractor className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No equipment found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters.</p>
                </motion.div>
            )}

            {/* Booking Modal */}
            <AnimatePresence>
                {selectedEquipment && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => { setSelectedEquipment(null); setBookingStep(0); }} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 z-10">
                            <button onClick={() => { setSelectedEquipment(null); setBookingStep(0); }}
                                className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>

                            {bookingStep === 2 ? (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Booking Confirmed!</h3>
                                    <p className="text-slate-500 font-medium">{selectedEquipment.name} has been reserved for you.</p>
                                </motion.div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                                            <img src={selectedEquipment.image_url || 'https://images.unsplash.com/photo-1605002657780-26e7d31d8e0c?w=100'} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-extrabold text-slate-900">{selectedEquipment.name}</h3>
                                            <p className="text-sm text-primary font-bold">{selectedEquipment.owner_name}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5 mb-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date</label>
                                            <input type="date" className="input-modern w-full pl-4" value={bookingDates.start}
                                                onChange={e => setBookingDates({ ...bookingDates, start: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">End Date</label>
                                            <input type="date" className="input-modern w-full pl-4" value={bookingDates.end}
                                                onChange={e => setBookingDates({ ...bookingDates, end: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Hourly Rate</span>
                                            <span className="font-bold text-slate-900">₹{selectedEquipment.hourly_rate}/hr</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Daily Rate</span>
                                            <span className="font-bold text-slate-900">₹{selectedEquipment.daily_rate}/day</span>
                                        </div>
                                        <div className="border-t border-slate-200 pt-3 flex justify-between text-sm">
                                            <span className="text-slate-500 font-bold">Owner</span>
                                            <span className="font-bold text-primary">{selectedEquipment.owner_name}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1 rounded-2xl h-13 font-bold"
                                            onClick={() => { setSelectedEquipment(null); setBookingStep(0); }}>Cancel</Button>
                                        <Button variant="premium" className="flex-1 rounded-2xl h-13 font-bold"
                                            onClick={handleBooking}>Confirm Booking</Button>
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

export default Equipment;
