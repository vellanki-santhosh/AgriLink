import React, { useState, useEffect } from 'react';
import {
    Truck,
    MapPin,
    Phone,
    Weight,
    Navigation,
    Plus,
    Search,
    Filter,
    Package,
    CheckCircle2,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Transport = () => {
    const navigate = useNavigate();
    const [transports, setTransports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadTransports();
    }, []);

    const loadTransports = async () => {
        setLoading(true);
        try {
            const data = await base44.entities.Transport.list("-created_date", 50);
            setTransports(data.length > 0 ? data : mockTransports);
        } catch (e) {
            setTransports(mockTransports);
        } finally {
            setLoading(false);
        }
    };

    const mockTransports = [
        {
            id: 't1',
            name: 'Ashok Leyland Dost',
            provider: 'Sri Rama Transport',
            location: 'Wyra Road, Khammam',
            capacity: '2.5 Tons',
            rate: '₹18/km',
            image: 'https://images.unsplash.com/photo-1519003722824-192d99787cdf?w=600&q=80',
            status: 'Available',
            verified: true
        },
        {
            id: 't2',
            name: 'Tata Ace (Chota Hathi)',
            provider: 'Vinayaka Logistics',
            location: 'Guntur bypass',
            capacity: '1.5 Tons',
            rate: '₹15/km',
            image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80',
            status: 'Available',
            verified: true
        },
        {
            id: 't3',
            name: 'Eicher Pro 2059',
            provider: 'Bhavani Carriers',
            location: 'Hyderabad Hwy',
            capacity: '5.0 Tons',
            rate: '₹25/km',
            image: 'https://images.unsplash.com/photo-1586864387917-f749f55939c1?w=600&q=80',
            status: 'Busy',
            verified: true
        }
    ];

    const filtered = transports.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.provider.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="container mx-auto px-4 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 underline decoration-primary decoration-4 underline-offset-8">Transport Services</h1>
                    <p className="text-slate-500 mt-4 font-medium">Book reliable transport for your produce and equipment.</p>
                </div>
                <Button
                    variant="premium"
                    className="h-14 px-8 rounded-2xl shadow-xl"
                    onClick={() => navigate('/login')}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Become a Provider
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 mb-12">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search vehicle type or provider..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="h-14 px-6 rounded-2xl border-slate-200">
                    <Filter className="w-5 h-5 mr-2" />
                    Filter capacity
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-50 rounded-3xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filtered.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <TransportCard item={item} navigate={navigate} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

const TransportCard = ({ item, navigate }) => (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] group h-full flex flex-col">
        <div className="relative h-56 overflow-hidden">
            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-4 left-4">
                <span className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg", item.status === 'Available' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white')}>
                    {item.status}
                </span>
            </div>
            {item.verified && (
                <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl text-primary shadow-lg">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                </div>
            )}
        </div>
        <CardContent className="p-8 flex-grow flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-primary">
                <Truck className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">{item.capacity} Capacity</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 truncate">{item.name}</h3>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <Navigation className="w-4 h-4" />
                <span>{item.provider} • {item.location}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Base Rate</span>
                    <span className="text-lg font-black text-slate-900">{item.rate}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Response</span>
                    <span className="text-lg font-black text-slate-900">Under 15m</span>
                </div>
            </div>

            <Button
                onClick={() => navigate('/login')}
                className="w-full mt-auto h-14 rounded-2xl bg-slate-900 hover:bg-primary transition-all shadow-lg text-white font-black flex items-center justify-center gap-2 group/btn"
            >
                Book Transport
                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
        </CardContent>
    </Card>
);

export default Transport;
