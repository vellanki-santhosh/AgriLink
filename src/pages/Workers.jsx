import React, { useState, useEffect } from 'react';
import {
    Search, Star, MapPin, Phone, MessageSquare, IndianRupee, Users,
    Filter, Briefcase, ChevronRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Workers = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        base44.entities.Worker.list("-created_date", 50).then(data => {
            setWorkers(data.length > 0 ? data : mockWorkers);
            setLoading(false);
        }).catch(() => {
            setWorkers(mockWorkers);
            setLoading(false);
        });
    }, []);

    const mockWorkers = [
        { id: 'w1', name: 'Raghav Kumar', worker_type: 'Tractor Driver', skills: ['Land Ploughing', 'Rotavating', 'Seed Drilling'], location: 'Khammam, Telangana', daily_wage: 800, rating: 4.8, experience_years: 6, image_url: 'https://images.unsplash.com/photo-1540560522866-da2270928e4a?w=300', is_available: true },
        { id: 'w2', name: 'Lakshmi Devi', worker_type: 'Harvester', skills: ['Paddy Harvesting', 'Cotton Picking', 'Threshing'], location: 'Guntur, AP', daily_wage: 600, rating: 4.5, experience_years: 10, image_url: 'https://images.unsplash.com/photo-1580213144054-e372f741c235?w=300', is_available: true },
        { id: 'w3', name: 'Suresh Patil', worker_type: 'Sprayer', skills: ['Pesticide Spraying', 'Weed Management', 'Fertilizer Application'], location: 'Warangal, Telangana', daily_wage: 700, rating: 4.6, experience_years: 4, image_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300', is_available: false },
        { id: 'w4', name: 'Randhir Singh', worker_type: 'Irrigation', skills: ['Drip Setup', 'Sprinkler Systems', 'Borewell Maintenance'], location: 'Nizamabad, Telangana', daily_wage: 900, rating: 4.9, experience_years: 8, image_url: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=300', is_available: true },
    ];

    const workerTypes = ['All', 'Tractor Driver', 'Harvester', 'Sprayer', 'Irrigation'];
    const filtered = workers.filter(w =>
        (selectedType === 'All' || w.worker_type === selectedType) &&
        (w.name.toLowerCase().includes(searchTerm.toLowerCase()) || w.worker_type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container mx-auto px-4 pb-20 page-transition">
            {/* Header */}
            <div className="mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-widest mb-3">
                        <Users className="w-4 h-4" />
                        Workforce
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4 heading-decoration">Skilled Workers</h1>
                    <p className="text-slate-500 text-lg max-w-2xl mt-6">Find experienced agriculture workers near your area — tractor drivers, harvesters, sprayers, and irrigation specialists.</p>
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
                    <input type="text" placeholder="Search workers by name or skill..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="input-modern w-full pl-11 pr-4 py-3.5 text-sm" />
                </div>
                <div className="flex gap-2 flex-wrap shrink-0">
                    {workerTypes.map(type => (
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
                    {[1, 2, 3].map(i => <div key={i} className="h-80 rounded-[2rem] skeleton"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filtered.map((worker, index) => (
                            <motion.div key={worker.id} layout
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.06 }}>
                                <Card className="overflow-hidden rounded-[2rem] border border-slate-200/40 shadow-card bg-white/80 backdrop-blur-lg card-hover group h-full flex flex-col">
                                    {/* Header with gradient */}
                                    <div className="relative h-28 bg-gradient-to-br from-primary/10 via-primary/5 to-slate-50 overflow-hidden">
                                        <div className="absolute inset-0 opacity-[0.03]"
                                            style={{ backgroundImage: 'radial-gradient(circle, rgba(5,150,105,1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                        {/* Availability indicator */}
                                        <div className="absolute top-4 right-4">
                                            <span className={cn("px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border flex items-center gap-1.5",
                                                worker.is_available ? 'bg-emerald-500/90 text-white border-emerald-400/30' : 'bg-slate-500/90 text-white border-slate-400/30')}>
                                                {worker.is_available && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                                {worker.is_available ? 'Available' : 'Busy'}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Avatar */}
                                    <div className="flex justify-center -mt-12 relative z-10 px-6">
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white avatar-glow">
                                            <img src={worker.image_url || `https://ui-avatars.com/api/?name=${worker.name}&background=059669&color=fff&size=200`}
                                                alt={worker.name} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <CardContent className="p-6 pt-4 text-center flex flex-col flex-grow">
                                        <h3 className="font-extrabold text-xl text-slate-900 mb-1 tracking-tight">{worker.name}</h3>
                                        <p className="text-primary font-bold text-sm mb-1">{worker.worker_type}</p>
                                        <p className="text-slate-500 text-xs font-medium flex items-center justify-center gap-1 mb-4">
                                            <MapPin className="w-3 h-3" /> {worker.location}
                                        </p>

                                        {/* Rating & experience */}
                                        <div className="flex justify-center items-center gap-4 mb-5">
                                            <div className="flex items-center gap-1 text-sm">
                                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                <span className="font-bold text-slate-900">{worker.rating}</span>
                                            </div>
                                            <div className="w-px h-4 bg-slate-200"></div>
                                            <div className="text-sm font-medium text-slate-500">
                                                {worker.experience_years}+ yrs exp
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                                            {worker.skills?.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-100">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Wage */}
                                        <div className="flex items-center justify-center gap-1 mb-6 mt-auto">
                                            <IndianRupee className="w-4 h-4 text-primary" />
                                            <span className="text-2xl font-extrabold text-slate-900">{worker.daily_wage}</span>
                                            <span className="text-xs text-slate-500 font-medium">/day</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="flex-1 rounded-2xl h-11 font-bold text-sm"
                                                onClick={() => navigate('/messages')}>
                                                <MessageSquare className="w-4 h-4 mr-1.5" /> Message
                                            </Button>
                                            <Button variant="premium" className="flex-1 rounded-2xl h-11 font-bold text-sm"
                                                onClick={() => navigate('/login')}>
                                                <Briefcase className="w-4 h-4 mr-1.5" /> Hire
                                            </Button>
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
                        <Users className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No workers found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters.</p>
                </motion.div>
            )}
        </div>
    );
};

export default Workers;
