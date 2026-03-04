import React, { useState, useEffect } from 'react';
import {
    Search,
    MapPin,
    Filter,
    Plus,
    Layers,
    Droplets,
    Zap,
    Info,
    ChevronRight,
    LandPlot,
    IndianRupee
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import LandDetailModal from '@/components/lands/LandDetailModal';

const Lands = () => {
    const navigate = useNavigate();
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [selectedLand, setSelectedLand] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        loadLands();
    }, []);

    const openLandDetails = (land) => {
        setSelectedLand(land);
        setModalOpen(true);
    };

    const loadLands = async () => {
        setLoading(true);
        try {
            const data = await base44.entities.Land.list("-created_date", 50);
            setLands(data.length > 0 ? data : mockLands);
        } catch (e) {
            setLands(mockLands);
        } finally {
            setLoading(false);
        }
    };

    const mockLands = [
        {
            id: '1',
            title: 'Fertile Black Soil Land',
            land_type: 'Black',
            total_area: 5,
            area_unit: 'Acres',
            location_address: 'Village Nandi, Khammam',
            state: 'Telangana',
            district: 'Khammam',
            rental_price: 25000,
            rental_type: 'Per Year',
            images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
            status: 'Available',
            water_availability: 'Borewell',
            electricity_access: '3-Phase'
        },
        {
            id: '2',
            title: 'Red Soil Farm for Cotton',
            land_type: 'Red',
            total_area: 12,
            area_unit: 'Acres',
            location_address: 'Mylavaram Road, Guntur',
            state: 'Andhra Pradesh',
            district: 'Guntur',
            rental_price: 32000,
            rental_type: 'Per Year',
            images: ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80'],
            status: 'Available',
            water_availability: 'Canal',
            electricity_access: 'Available'
        },
        {
            id: '3',
            title: 'Wet Land near River',
            land_type: 'Wet',
            total_area: 3.5,
            area_unit: 'Acres',
            location_address: 'Near Krishna River',
            state: 'Andhra Pradesh',
            district: 'Krishna',
            rental_price: 45000,
            rental_type: 'Per Year',
            images: ['https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80'],
            status: 'Available',
            water_availability: 'River',
            electricity_access: 'High Voltage'
        }
    ];

    const filteredLands = lands.filter(land => {
        const matchesSearch = land.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            land.district.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || land.land_type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="container mx-auto px-4 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Agricultural Lands</h1>
                    <p className="text-slate-500">Find the perfect plot for your next harvest.</p>
                </div>
                <Button
                    variant="premium"
                    size="lg"
                    className="rounded-2xl h-14 px-8 shrink-0"
                    onClick={() => navigate('/login')}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    List Your Land
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-12 flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by location, soil type, or title..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                    {['All', 'Wet', 'Dry', 'Black', 'Red'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                                filterType === type
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                    <Button variant="outline" className="rounded-2xl py-6 px-6 border-slate-200">
                        <Filter className="w-4 h-4 mr-2" />
                        More Filters
                    </Button>
                </div>
            </div>

            {/* Lands Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-[400px] bg-slate-100 rounded-3xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredLands.map((land, index) => (
                            <motion.div
                                key={land.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <LandCard land={land} onClick={() => openLandDetails(land)} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && filteredLands.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Info className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No lands found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
            )}

            <LandDetailModal
                land={selectedLand}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

const LandCard = ({ land, onClick }) => (
    <Card onClick={onClick} className="cursor-pointer overflow-hidden group border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-3xl h-full flex flex-col">
        <div className="relative h-64 overflow-hidden">
            <img
                src={land.images?.[0] || 'https://via.placeholder.com/400x300?text=Agri+Land'}
                alt={land.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-primary font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                    {land.land_type} Soil
                </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-2">
                        <LandPlot className="w-4 h-4 text-primary" />
                        <span className="font-bold text-slate-800">{land.total_area} {land.area_unit}</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary font-bold">
                        <IndianRupee className="w-4 h-4" />
                        <span>{land.rental_price.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500 font-medium">/{land.rental_type === 'Per Year' ? 'yr' : 'mo'}</span>
                    </div>
                </div>
            </div>
        </div>

        <CardContent className="p-6 flex-grow flex flex-col">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{land.title}</h3>
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{land.district}, {land.state}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold text-slate-700">{land.water_availability}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold text-slate-700">{land.electricity_access}</span>
                </div>
            </div>

            <Button className="w-full mt-auto rounded-2xl h-12 bg-slate-900 hover:bg-primary shadow-lg shadow-slate-200 hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 group/btn">
                View Details
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
        </CardContent>
    </Card>
);

export default Lands;
