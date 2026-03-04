import React, { useState } from 'react';
import {
    Calendar as CalendarIcon,
    Sprout,
    Droplets,
    Sun,
    ArrowRight,
    MapPin,
    Info,
    ChevronLeft,
    ChevronRight,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const CropCalendar = () => {
    const [selectedRegion, setSelectedRegion] = useState('South India');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const regions = ['North India', 'South India', 'East India', 'West India', 'Central India'];

    const cropData = {
        'South India': {
            5: [ // June
                { name: 'Paddy', type: 'Kharif', duration: '120-150 days', status: 'Sowing', advice: 'Begin nursery preparation. Ensure proper drainage.' },
                { name: 'Cotton', type: 'Kharif', duration: '160-180 days', status: 'Sowing', advice: 'Optimal time for sowing in rain-fed areas.' },
                { name: 'Maize', type: 'Kharif', duration: '90-110 days', status: 'Sowing', advice: 'Use high-yielding hybrid seeds for better results.' },
            ],
            9: [ // October
                { name: 'Groundnut', type: 'Rabi', duration: '100-120 days', status: 'Sowing', advice: 'Treat seeds with fungicide before sowing.' },
                { name: 'Bengal Gram', type: 'Rabi', duration: '90-110 days', status: 'Sowing', advice: 'Requires residual moisture from monsoon.' },
            ]
        },
        'North India': {
            5: [ // June
                { name: 'Paddy', type: 'Kharif', duration: '130 days', status: 'Nursery', advice: 'Prepare nursery beds for transplanting in July.' },
                { name: 'Sugar Cane', type: 'Perennial', duration: '12 months', status: 'Growth', advice: 'Regular irrigation required during peak summer.' },
            ]
        }
    };

    const currentCrops = cropData[selectedRegion]?.[selectedMonth] || [];

    return (
        <div className="container mx-auto px-4 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Seasonal Crop Calendar</h1>
                    <p className="text-slate-500">Plan your harvest with regional seasonal insights.</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="bg-white border border-slate-200 px-4 py-3 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            </div>

            {/* Month Selector */}
            <div className="bg-slate-900 p-2 rounded-[2rem] shadow-xl mb-12 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[800px]">
                    {months.map((month, i) => (
                        <button
                            key={month}
                            onClick={() => setSelectedMonth(i)}
                            className={cn(
                                "px-6 py-3 rounded-xl text-sm font-bold transition-all",
                                selectedMonth === i
                                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            {month.substring(0, 3)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-slate-900">{months[selectedMonth]} Recommendations</h3>
                        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold uppercase">
                            <Info className="w-4 h-4" />
                            Based on historical weather
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${selectedRegion}-${selectedMonth}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            {currentCrops.length > 0 ? currentCrops.map((crop, i) => (
                                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="w-full md:w-48 bg-slate-100 flex items-center justify-center p-8 group-hover:bg-primary/5 transition-colors">
                                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-primary">
                                                <Sprout className="w-10 h-10" />
                                            </div>
                                        </div>
                                        <div className="flex-grow p-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">{crop.type}</span>
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">{crop.status}</span>
                                            </div>
                                            <h4 className="text-2xl font-black text-slate-900 mb-2">{crop.name}</h4>
                                            <p className="text-slate-500 text-sm leading-relaxed mb-6">{crop.advice}</p>

                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                    <CalendarIcon className="w-4 h-4" />
                                                    {crop.duration}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                    <Droplets className="w-4 h-4" />
                                                    High Water Need
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 md:w-32 flex items-center justify-center border-t md:border-t-0 md:border-l border-slate-50">
                                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-all">
                                                <ArrowRight className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            )) : (
                                <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 py-20 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CalendarIcon className="w-10 h-10 text-slate-200" />
                                    </div>
                                    <h4 className="font-bold text-slate-400">No specific sowing recommendations for this month</h4>
                                    <p className="text-slate-500 text-sm mt-2 px-8 max-w-sm mx-auto">This period is usually for growth maintenance or preparation for the next season.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="space-y-8">
                    <Card className="premium-gradient border-none text-white overflow-hidden shadow-xl">
                        <CardContent className="p-8">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                                <Sun className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Regional Weather Outlook</h3>
                            <p className="text-white/80 text-sm leading-relaxed mb-8">
                                Monsoon onset expected in South India by June 1st week. Pre-monsoon showers
                                likely to be above average this year.
                            </p>
                            <Button className="w-full bg-white text-primary font-bold rounded-xl h-12 shadow-lg">
                                Full Weather Report
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Farming Tips</CardTitle>
                            <CardDescription>Expert advice for {months[selectedMonth]}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <TipItem text="Check soil PH levels before sowing Kharif crops." />
                            <TipItem text="Clean farm machinery and tools before the busy season." />
                            <TipItem text="Apply green manure to improve soil organic matter." />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const TipItem = ({ text }) => (
    <div className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50 transition-colors">
        <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <Plus className="w-3 h-3" />
        </div>
        <p className="text-sm text-slate-600 font-medium">{text}</p>
    </div>
);

const Plus = ({ className }) => <span className={className}>+</span>;

export default CropCalendar;
