import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Filter,
    Star,
    MapPin,
    Briefcase,
    Clock,
    CheckCircle2,
    ChevronRight,
    Plus,
    IndianRupee,
    Phone,
    MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate, Link } from 'react-router-dom';

const Workers = () => {
    const navigate = useNavigate();
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        loadWorkers();
    }, []);

    const loadWorkers = async () => {
        setLoading(true);
        try {
            const data = await base44.entities.Worker.list("-created_date", 50);
            setWorkers(data.length > 0 ? data : mockWorkers);
        } catch (e) {
            setWorkers(mockWorkers);
        } finally {
            setLoading(false);
        }
    };

    const mockWorkers = [
        {
            id: 'w1',
            name: 'Raghav Kumar',
            worker_type: 'Tractor Driver',
            experience_years: 12,
            daily_wage: 600,
            location_address: 'Village Nandi, Khammam',
            district: 'Khammam',
            rating: 4.8,
            total_reviews: 45,
            profile_image: 'https://images.unsplash.com/photo-1540560522866-da2270928e4a?w=400&q=80',
            skills: ['Ploughing', 'Seeding', 'Engine Maintenance']
        },
        {
            id: 'w2',
            name: 'Laxmi Devi',
            worker_type: 'Irrigation Specialist',
            experience_years: 8,
            daily_wage: 450,
            location_address: 'Mylavaram Road, Guntur',
            district: 'Guntur',
            rating: 4.9,
            total_reviews: 32,
            profile_image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400&q=80',
            skills: ['Drip Irrigation', 'Borewell Mgmt', 'Fertigation']
        },
        {
            id: 'w3',
            name: 'Surya Prakash',
            worker_type: 'General Labor',
            experience_years: 5,
            daily_wage: 400,
            location_address: 'Near Canal, Krishna',
            district: 'Krishna',
            rating: 4.5,
            total_reviews: 18,
            profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
            skills: ['Harvesting', 'Sorting', 'Packaging']
        }
    ];

    const tabs = ['All', 'Tractor Driver', 'Irrigation Specialist', 'Skilled Laborer', 'General Labor'];

    const filtered = workers.filter(w => {
        const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'All' || w.worker_type === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="container mx-auto px-4 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Skilled Farm Workers</h1>
                    <p className="text-slate-500">Hire experienced laborers and specialized operators for your farm.</p>
                </div>
                <Button
                    variant="premium"
                    className="h-14 px-8 rounded-2xl shadow-xl"
                    onClick={() => navigate('/login')}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Register as Worker
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 mb-12">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or skills..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                    {tabs.map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                                activeTab === t ? "bg-primary text-white shadow-lg" : "bg-white text-slate-500 border border-slate-100"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence>
                        {filtered.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <WorkerCard item={item} navigate={navigate} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

const WorkerCard = ({ item, navigate }) => (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] group h-full flex flex-col">
        <div className="relative h-48 premium-gradient p-8 text-center bg-slate-100">
            <div className="relative inline-block">
                <div className="w-24 h-24 rounded-3xl border-4 border-white overflow-hidden shadow-xl bg-slate-50 relative z-10">
                    <img src={item.profile_image} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center text-emerald-500 z-20 border-2 border-white">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
            </div>
        </div>

        <CardContent className="px-8 pb-8 pt-6 flex-grow flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest mb-4">
                <Briefcase className="w-3 h-3" />
                {item.worker_type}
            </span>

            <h3 className="text-2xl font-black text-slate-900 mb-1">{item.name}</h3>

            <div className="flex items-center gap-1 mb-6">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-slate-900">{item.rating}</span>
                <span className="text-xs text-slate-400 font-medium ml-1">({item.total_reviews} reviews)</span>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {item.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-500">{skill}</span>
                ))}
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Daily Wage</span>
                    <div className="flex items-center justify-center gap-1 text-lg font-black text-slate-900">
                        <IndianRupee className="w-4 h-4" />
                        {item.daily_wage}
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Experience</span>
                    <span className="text-lg font-black text-slate-900">{item.experience_years}y</span>
                </div>
            </div>

            <div className="w-full mt-auto flex gap-2">
                <Button
                    variant="outline"
                    className="flex-grow rounded-2xl h-14 border-slate-200"
                    onClick={() => navigate('/messages')}
                >
                    <MessageCircle className="w-5 h-5" />
                </Button>
                <Button
                    onClick={() => navigate('/login')}
                    className="flex-[3] h-14 rounded-2xl bg-slate-900 hover:bg-primary text-white font-black transition-all shadow-lg flex items-center justify-center gap-2 group/btn"
                >
                    Hire Now
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
            </div>
        </CardContent>
    </Card>
);

export default Workers;
