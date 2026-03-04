import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Tractor as TractorIcon,
    ChevronRight,
    Zap,
    ShieldCheck,
    MapPin,
    Gauge,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate, Link } from 'react-router-dom';

const Equipment = () => {
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeType, setActiveType] = useState('All');

    useEffect(() => {
        loadEquipment();
    }, []);

    const loadEquipment = async () => {
        setLoading(true);
        try {
            const data = await base44.entities.Equipment.list("-created_date", 50);
            setEquipment(data.length > 0 ? data : mockEquipment);
        } catch (e) {
            setEquipment(mockEquipment);
        } finally {
            setLoading(false);
        }
    };

    const mockEquipment = [
        {
            id: 'e1',
            name: 'John Deere 5310',
            equipment_type: 'Tractor',
            owner_email: 'tractor_hub@example.com',
            hourly_rate: 800,
            daily_rate: 6000,
            fuel_included: false,
            images: ['https://images.unsplash.com/photo-1593110050241-ee7ce35e9700?w=800&q=80'],
            location_address: 'Wyra, Khammam',
            state: 'Telangana',
            district: 'Khammam',
            status: 'Available',
            condition: 'Excellent',
            year: 2023
        },
        {
            id: 'e2',
            name: 'Kubota Combine Harvester',
            equipment_type: 'Harvester',
            owner_email: 'agri_rentals@example.com',
            hourly_rate: 2500,
            daily_rate: 18000,
            fuel_included: true,
            images: ['https://images.unsplash.com/photo-1594494424758-a24a597d2c6f?w=800&q=80'],
            location_address: 'Agri Hub, Guntur',
            state: 'Andhra Pradesh',
            district: 'Guntur',
            status: 'Available',
            condition: 'New',
            year: 2024
        },
        {
            id: 'e3',
            name: 'DJI Agras T40 Drone',
            equipment_type: 'Drone',
            owner_email: 'skytech@example.com',
            hourly_rate: 1500,
            daily_rate: 10000,
            fuel_included: true,
            images: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80'],
            location_address: 'Tech Park, Hyderabad',
            state: 'Telangana',
            district: 'Hyderabad',
            status: 'Busy',
            condition: 'Excellent',
            year: 2023
        }
    ];

    const types = ['All', 'Tractor', 'Harvester', 'Rotavator', 'Drone', 'Sprayer'];

    const filtered = equipment.filter(e => {
        const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = activeType === 'All' || e.equipment_type === activeType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="container mx-auto px-4 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Equipment Rental</h1>
                    <p className="text-slate-500">Rent modern agricultural machinery at competitive rates.</p>
                </div>
                <Button
                    variant="premium"
                    className="h-14 px-8 rounded-2xl shadow-xl"
                    onClick={() => navigate('/login')}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    List Your Equipment
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-12">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search tractor, harvester, drone..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                    {types.map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveType(t)}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                                activeType === t ? "bg-primary text-white shadow-lg" : "bg-white text-slate-500 border border-slate-100"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>
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
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <EquipmentCard item={item} navigate={navigate} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

const EquipmentCard = ({ item, navigate }) => (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] group h-full flex flex-col">
        <div className="relative h-56 overflow-hidden">
            <img src={item.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute top-4 left-4">
                <span className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg", item.status === 'Available' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white')}>
                    {item.status}
                </span>
            </div>
            <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl text-primary shadow-lg">
                    <ShieldCheck className="w-5 h-5" />
                </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Hourly Rate</span>
                    <span className="text-lg font-black text-slate-900">₹{item.hourly_rate}</span>
                </div>
            </div>
        </div>
        <CardContent className="p-8 flex-grow flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-widest">
                <TractorIcon className="w-4 h-4" />
                {item.equipment_type}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 truncate">{item.name}</h3>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <MapPin className="w-4 h-4" />
                <span>{item.district}, {item.state}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                    <Gauge className="w-5 h-5 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700">{item.condition}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                    <Calendar className="w-5 h-5 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700">{item.year} Model</span>
                </div>
            </div>

            <Button
                onClick={() => navigate('/login')}
                className="w-full mt-auto h-14 rounded-2xl bg-slate-900 hover:bg-primary transition-all shadow-lg text-white font-black flex items-center justify-center gap-2 group/btn"
            >
                Review & Rent
                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
        </CardContent>
    </Card>
);

export default Equipment;
