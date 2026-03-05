import React, { useState, useEffect } from 'react';
import {
    Search, MapPin, CircleDot, Filter, Eye, CalendarRange, Ruler,
    IndianRupee, X, ChevronRight, Layers, Map as MapIcon, Grid, Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Lands = () => {
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedLand, setSelectedLand] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

    // Custom marker icons based on status using standard Leaflet divIcon
    const getMarkerIcon = (status) => {
        let colorClass = 'bg-blue-500';
        let shadowClass = 'shadow-blue-500/50';

        if (status === 'Available') {
            colorClass = 'bg-emerald-500';
            shadowClass = 'shadow-emerald-500/50';
        } else if (status === 'Ready to Lease') {
            colorClass = 'bg-indigo-500';
            shadowClass = 'shadow-indigo-500/50';
        } else if (status === 'Rented' || status === 'Leased') {
            colorClass = 'bg-orange-500';
            shadowClass = 'shadow-orange-500/50';
        }

        return L.divIcon({
            className: 'custom-div-icon',
            html: `
                <div class="relative flex items-center justify-center w-8 h-8 -mt-4 -ml-4">
                    <div class="absolute inset-0 ${colorClass} rounded-full opacity-30 animate-ping"></div>
                    <div class="relative w-4 h-4 ${colorClass} rounded-full border-2 border-white shadow-lg ${shadowClass}"></div>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16]
        });
    };

    useEffect(() => {
        base44.entities.Land.list("-created_date", 50).then(data => {
            setLands(data.length > 0 ? data : mockLands);
            setLoading(false);
        }).catch(() => {
            setLands(mockLands);
            setLoading(false);
        });
    }, []);

    // Enhanced mock lands with realistic geocoordinates for the map
    const mockLands = [
        { id: '1', title: 'Fertile Black Soil Land', land_type: 'Black', total_area: 5, area_unit: 'Acres', location: 'Khammam, Telangana', position: [17.2473, 80.1514], status: 'Available', rental_price: 25000, description: 'Rich black soil perfect for cotton, chili and paddy cultivation. Borewell and drip irrigation available.', owner_name: 'Venkat Rao', image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600' },
        { id: '2', title: 'Red Soil Farmland', land_type: 'Red', total_area: 3, area_unit: 'Acres', location: 'Warangal, Telangana', position: [17.9689, 79.5941], status: 'Ready to Lease', rental_price: 18000, description: 'Red soil land suitable for groundnut and turmeric. Well maintained with proper fencing. Ready to lease immediately.', owner_name: 'Srinivas Goud', image_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600' },
        { id: '3', title: 'Irrigated Wet Land', land_type: 'Wet', total_area: 10, area_unit: 'Acres', location: 'Guntur, Andhra Pradesh', position: [16.3067, 80.4365], status: 'Available', rental_price: 45000, description: 'Canal-irrigated wetland ideal for paddy cultivation. Access to both Kharif and Rabi seasons.', owner_name: 'Ravi Kumar', image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600' },
        { id: '4', title: 'Dry Land Farm Plot', land_type: 'Dry', total_area: 8, area_unit: 'Acres', location: 'Nizamabad, Telangana', position: [18.6704, 78.0931], status: 'Rented', rental_price: 15000, description: 'Well drainable dry land for maize and soybean. Near highway for easy transport access.', owner_name: 'Ramesh Patil', image_url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600' },
        { id: '5', title: 'Premium Orchard Setup', land_type: 'Red', total_area: 12, area_unit: 'Acres', location: 'Sangareddy, Telangana', position: [17.6294, 78.0908], status: 'Ready to Lease', rental_price: 35000, description: 'Perfect land for fruit orchards. Drip lines already installed across 8 acres.', owner_name: 'Lakshmi N', image_url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600' }
    ];

    const landTypes = ['All', 'Black', 'Red', 'Wet', 'Dry'];
    const filtered = lands.filter(l => (selectedType === 'All' || l.land_type === selectedType) && (l.title?.toLowerCase().includes(searchTerm.toLowerCase()) || l.location?.toLowerCase().includes(searchTerm.toLowerCase())));

    const typeColors = { 'Black': 'bg-slate-800 text-white', 'Red': 'bg-red-600 text-white', 'Wet': 'bg-blue-600 text-white', 'Dry': 'bg-amber-600 text-white' };

    // Status UI helpers
    const getStatusStyle = (status) => {
        if (status === 'Available') return 'bg-emerald-500/90 text-white border-emerald-400/30';
        if (status === 'Ready to Lease') return 'bg-indigo-500/90 text-white border-indigo-400/30';
        return 'bg-amber-500/90 text-white border-amber-400/30'; // Rented/Leased
    };

    return (
        <div className="container mx-auto px-4 pb-20 page-transition">
            {/* Header */}
            <div className="mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-widest mb-3">
                        <Layers className="w-4 h-4" />
                        Marketplace
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4 heading-decoration">Available Lands</h1>
                            <p className="text-slate-500 text-lg max-w-2xl mt-6">Browse verified agricultural lands across India, ready for lease. Filter by soil type and explore via map.</p>
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200 backdrop-blur-md self-start shrink-0">
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                                    viewMode === 'list' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                            >
                                <Grid className="w-4 h-4" /> List
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                                    viewMode === 'map' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                            >
                                <MapIcon className="w-4 h-4" /> Map
                            </button>
                        </div>
                    </div>
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
                    <input type="text" placeholder="Search by land name or location..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="input-modern w-full pl-11 pr-4 py-3.5 text-sm" />
                </div>
                <div className="flex gap-2 flex-wrap shrink-0">
                    {landTypes.map(type => (
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

            {/* Content Area */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-96 rounded-[2rem] skeleton"></div>)}
                </div>
            ) : (
                <>
                    {/* List View */}
                    {viewMode === 'list' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {filtered.map((land, index) => (
                                    <motion.div
                                        key={land.id}
                                        layout
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.06, duration: 0.4 }}
                                    >
                                        <Card className="overflow-hidden rounded-[2rem] border border-slate-200/40 shadow-card bg-white/80 backdrop-blur-lg card-hover cursor-pointer group h-full flex flex-col"
                                            onClick={() => setSelectedLand(land)}>
                                            <div className="relative h-52 shrink-0 overflow-hidden">
                                                <img src={land.image_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600'} alt={land.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

                                                {/* Status badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className={cn("px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border", getStatusStyle(land.status))}>
                                                        {land.status}
                                                    </span>
                                                </div>

                                                {/* Type badge */}
                                                <div className="absolute top-4 right-4">
                                                    <span className={cn("px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm", typeColors[land.land_type] || 'bg-slate-800 text-white')}>
                                                        {land.land_type} Soil
                                                    </span>
                                                </div>

                                                {/* Bottom details */}
                                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                                    <h3 className="font-extrabold text-xl tracking-tight leading-tight drop-shadow-lg mb-1">{land.title}</h3>
                                                    <p className="text-white/90 text-xs font-medium flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-primary/80" /> {land.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <CardContent className="p-6 flex-grow flex flex-col">
                                                <div className="flex items-center justify-between mb-5 mt-auto">
                                                    <div className="flex items-center gap-1.5">
                                                        <IndianRupee className="w-4 h-4 text-primary" />
                                                        <span className="text-2xl font-extrabold text-slate-900">{land.rental_price?.toLocaleString()}</span>
                                                        <span className="text-xs text-slate-500 font-medium">/year</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl text-sm font-bold text-slate-600 border border-slate-100 shadow-sm">
                                                        <Ruler className="w-3.5 h-3.5 text-slate-400" />
                                                        {land.total_area} {land.area_unit}
                                                    </div>
                                                </div>
                                                <Button variant="outline" className="w-full rounded-2xl h-12 font-bold text-sm border-slate-200 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all shadow-sm">
                                                    <Eye className="w-4 h-4 mr-2" /> View Details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Map View */}
                    {viewMode === 'map' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50 relative z-10"
                        >
                            {/* Map Key overlay */}
                            <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex flex-col gap-2">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status Key</h4>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div> Available
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm"></div> Ready to Lease
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></div> Rented
                                </div>
                            </div>

                            <MapContainer
                                center={[17.3850, 78.4867]} // Center roughly on Hyderabad/Telangana
                                zoom={7}
                                scrollWheelZoom={true}
                                className="w-full h-full"
                                style={{ background: '#e2e8f0' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                />

                                {filtered.filter(l => l.position).map(land => (
                                    <Marker
                                        key={land.id}
                                        position={land.position}
                                        icon={getMarkerIcon(land.status)}
                                    >
                                        <Popup className="custom-popup" closeButton={false}>
                                            <div className="p-0 -m-3 max-w-[240px] overflow-hidden rounded-2xl shadow-xl">
                                                <div className="h-24 overflow-hidden relative">
                                                    <img src={land.image_url} alt={land.title} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                                    <span className={cn("absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase backdrop-blur-md", getStatusStyle(land.status))}>
                                                        {land.status}
                                                    </span>
                                                </div>
                                                <div className="p-4 bg-white">
                                                    <h4 className="font-extrabold text-slate-900 leading-tight mb-1">{land.title}</h4>
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> {land.location.split(',')[0]}
                                                        </span>
                                                        <span className="text-sm font-bold text-primary">₹{land.rental_price / 1000}k/yr</span>
                                                    </div>
                                                    <Button
                                                        onClick={(e) => { e.stopPropagation(); setSelectedLand(land); }}
                                                        className="w-full h-8 text-xs rounded-xl"
                                                    >
                                                        Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </motion.div>
                    )}
                </>
            )}

            {/* Empty State */}
            {!loading && filtered.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <MapPin className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">No lands found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters.</p>
                </motion.div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedLand && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedLand(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]">

                            {/* Image Section (Left on Desktop, Top on Mobile) */}
                            <div className="relative h-56 md:h-auto md:w-5/12 shrink-0">
                                <img src={selectedLand.image_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600'} className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-tr"></div>
                                {/* Close Button logic handled differently in new layout to not obscure image heavily */}

                                <div className="absolute top-5 left-5">
                                    <span className={cn("px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border shadow-lg", getStatusStyle(selectedLand.status))}>
                                        {selectedLand.status}
                                    </span>
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <h3 className="text-3xl font-extrabold tracking-tight mb-2 drop-shadow-md">{selectedLand.title}</h3>
                                    <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                                        <MapPin className="w-4 h-4 text-primary" /> {selectedLand.location}
                                    </div>
                                </div>
                            </div>

                            {/* Details Section (Right on Desktop, Bottom on Mobile) */}
                            <div className="p-6 md:p-8 flex-1 flex flex-col overflow-y-auto relative">
                                {/* Desktop Close Button */}
                                <button onClick={() => setSelectedLand(null)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-all text-slate-500 z-10">
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="pr-12 mb-6"> {/* Padding right to avoid close button */}
                                    <h3 className="text-3xl font-extrabold tracking-tight mb-2 text-slate-900 leading-tight">{selectedLand.title}</h3>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                        <MapPin className="w-4 h-4 text-primary" /> {selectedLand.location}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    <div className="glass p-3 rounded-2xl text-center border border-slate-200/60 shadow-sm flex flex-col items-center justify-center bg-slate-50">
                                        <div className="flex justify-center mb-1"><Ruler className="w-4 h-4 text-slate-400" /></div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Area</div>
                                        <div className="text-sm font-black text-slate-800">{selectedLand.total_area} {selectedLand.area_unit}</div>
                                    </div>
                                    <div className="glass p-3 rounded-2xl text-center border border-slate-200/60 shadow-sm flex flex-col items-center justify-center">
                                        <div className="flex justify-center mb-1"><Layers className="w-4 h-4 text-slate-400" /></div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Soil</div>
                                        <div className="text-sm font-black text-slate-800">{selectedLand.land_type}</div>
                                    </div>
                                    <div className="bg-primary/5 p-3 rounded-2xl text-center border border-primary/20 shadow-sm flex flex-col items-center justify-center">
                                        <div className="flex justify-center mb-1"><IndianRupee className="w-4 h-4 text-primary" /></div>
                                        <div className="text-[10px] text-primary font-bold uppercase tracking-wider mb-0.5">Price</div>
                                        <div className="text-sm font-black text-slate-900">₹{selectedLand.rental_price?.toLocaleString()}</div>
                                    </div>
                                </div>

                                {selectedLand.description && (
                                    <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-1 flex flex-col justify-center">
                                        <h4 className="font-bold text-[10px] text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <CircleDot className="w-3 h-3 text-primary" /> Description
                                        </h4>
                                        <p className="text-slate-600 leading-relaxed text-xs">{selectedLand.description}</p>
                                    </div>
                                )}

                                {selectedLand.owner_name && (
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm mb-6 hover:border-primary/30 transition-colors cursor-pointer group mt-auto">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-base border border-primary/20 shadow-inner">
                                            {selectedLand.owner_name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">{selectedLand.owner_name}</div>
                                            <div className="text-[10px] text-slate-500 font-bold tracking-wide uppercase mt-0.5">Verified Landowner</div>
                                        </div>

                                        {/* Map Navigation Button */}
                                        {selectedLand.position && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedLand.position[0]},${selectedLand.position[1]}`, '_blank');
                                                }}
                                                className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                title="Navigate via Google Maps"
                                            >
                                                <Navigation className="w-4 h-4" />
                                            </button>
                                        )}
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center ml-1 group-hover:bg-primary/10 transition-colors">
                                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button variant="outline" className="hidden md:flex flex-1 rounded-xl h-12 font-bold border-slate-200 text-slate-600 hover:bg-slate-50 text-sm" onClick={() => setSelectedLand(null)}>Cancel</Button>
                                    <Button className="flex-[2] rounded-xl h-12 font-bold bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-sm w-full md:w-auto">
                                        {selectedLand.status === 'Available' || selectedLand.status === 'Ready to Lease' ? 'Book Land' : 'Contact Owner'}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Lands;
