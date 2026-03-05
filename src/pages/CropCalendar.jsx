import React, { useState } from 'react';
import { Calendar as CalendarIcon, Droplets, Sun, Sprout, Wind, CheckCircle2, AlertCircle, Plus, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const CropCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showTaskModal, setShowTaskModal] = useState(false);

    const tasks = [
        { id: 1, date: '2026-03-05', title: 'Sow Cotton Seeds', type: 'planting', status: 'pending', crop: 'Cotton' },
        { id: 2, date: '2026-03-08', title: 'First Irrigation', type: 'irrigation', status: 'pending', crop: 'Cotton' },
        { id: 3, date: '2026-03-02', title: 'Soil Preparation', type: 'general', status: 'completed', crop: 'Paddy' },
    ];

    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

    const getDayTasks = (date) => {
        if (!date) return [];
        return tasks.filter(t => t.date === date.toISOString().split('T')[0]);
    };

    const typeConfig = {
        planting: { icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        irrigation: { icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
        general: { icon: Sun, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
    };

    return (
        <div className="container mx-auto px-4 pb-20 page-transition">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-widest mb-3">
                        <CalendarIcon className="w-4 h-4" />
                        Planning
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-2 heading-decoration">Crop Calendar</h1>
                    <p className="text-slate-500 text-lg">Schedule your farming activities and never miss an important date.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                    <Button variant="premium" className="rounded-2xl h-12 px-6 shadow-xl" onClick={() => setShowTaskModal(true)}>
                        <Plus className="w-5 h-5 mr-2" /> Add Task
                    </Button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar View */}
                <div className="lg:col-span-2">
                    <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-lg">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={prevMonth} className="p-2.5 rounded-xl hover:bg-white text-slate-600 hover:text-primary transition-all shadow-sm border border-transparent hover:border-slate-200"><ChevronLeft className="w-5 h-5" /></button>
                                <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-2 font-bold text-sm text-slate-600 hover:text-primary transition-colors">Today</button>
                                <button onClick={nextMonth} className="p-2.5 rounded-xl hover:bg-white text-slate-600 hover:text-primary transition-all shadow-sm border border-transparent hover:border-slate-200"><ChevronRight className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="text-center text-xs font-bold text-slate-400 tracking-widest uppercase py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {days.map((date, i) => {
                                    if (!date) return <div key={`empty-${i}`} className="h-28 rounded-2xl bg-slate-50/30"></div>;
                                    const isToday = date.toDateString() === new Date().toDateString();
                                    const isSelected = selectedDate.toDateString() === date.toDateString();
                                    const dayTasks = getDayTasks(date);

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedDate(date)}
                                            className={cn("h-28 rounded-2xl p-2 border flex flex-col items-start justify-start transition-all overflow-hidden relative group",
                                                isSelected ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-slate-100 bg-white hover:border-primary/30 hover:shadow-sm",
                                                isToday && !isSelected && "border-blue-200 bg-blue-50/30"
                                            )}
                                        >
                                            <span className={cn("inline-flex w-7 h-7 items-center justify-center rounded-full text-sm font-bold mb-2",
                                                isToday ? "bg-primary text-white" : "text-slate-600 group-hover:text-primary",
                                                isSelected && !isToday && "text-primary bg-primary/10")}>
                                                {date.getDate()}
                                            </span>
                                            <div className="w-full space-y-1">
                                                {dayTasks.map((t, idx) => (
                                                    <div key={idx} className={cn("w-full truncate rounded px-1.5 py-0.5 text-[10px] font-bold  text-left", typeConfig[t.type].bg, typeConfig[t.type].color)}>
                                                        {t.title}
                                                    </div>
                                                ))}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Tasks */}
                <div>
                    <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-lg sticky top-24">
                        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-primary/5 to-transparent">
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Schedule</h3>
                            <p className="text-primary font-bold text-sm tracking-wide mt-1">
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="p-6">
                            {getDayTasks(selectedDate).length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <Sun className="w-8 h-8" />
                                    </div>
                                    <p className="font-bold text-slate-800">No tasks scheduled</p>
                                    <p className="text-sm text-slate-500 mt-1">Take a break or add a new activity.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {getDayTasks(selectedDate).map(task => {
                                        const config = typeConfig[task.type];
                                        const Icon = config.icon;
                                        return (
                                            <motion.div key={task.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                                className={cn("p-4 rounded-2xl border transition-all hover:shadow-md", config.bg, config.border)}>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shadow-sm", config.color)}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">{task.title}</h4>
                                                            <p className="text-xs font-bold opacity-80 mt-0.5 tracking-wider uppercase">{task.crop}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-4">
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white/60 px-2.5 py-1 rounded-lg">
                                                        <Clock className="w-3.5 h-3.5" /> All Day
                                                    </span>
                                                    {task.status === 'completed' ? (
                                                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Done
                                                        </span>
                                                    ) : (
                                                        <button className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-primary transition-colors hover:bg-primary/10 px-2 py-1 rounded-lg">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Done
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Add Task Modal */}
            <AnimatePresence>
                {showTaskModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowTaskModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 z-10">
                            <button onClick={() => setShowTaskModal(false)} className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-6">Add New Task</h3>
                            <div className="space-y-5 mb-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Task Title</label>
                                    <input type="text" placeholder="e.g. Apply Fertilizer" className="input-modern w-full font-medium" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Date</label>
                                        <input type="date" defaultValue={selectedDate.toISOString().split('T')[0]} className="input-modern w-full font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Crop</label>
                                        <input type="text" placeholder="e.g. Cotton" className="input-modern w-full font-medium" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Task Type</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {Object.entries(typeConfig).map(([key, config]) => {
                                            const Icon = config.icon;
                                            return (
                                                <button key={key} className={cn("p-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-2 transition-all hover:shadow-md", config.bg, config.border, config.color)}>
                                                    <Icon className="w-5 h-5 bg-white rounded-lg p-0.5" />
                                                    <span className="capitalize">{key}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <Button variant="premium" className="w-full h-14 rounded-2xl shadow-xl text-lg font-bold" onClick={() => setShowTaskModal(false)}>
                                Save Task
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CropCalendar;
