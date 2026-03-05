import React, { useState } from 'react';
import { Brain, Activity, Droplets, MapPin, TrendingUp, Sun, Wind, CloudRain, AlertTriangle, CheckCircle2, Sprout, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const yieldData = [
    { month: 'Jan', current: 4000, projected: 4400 },
    { month: 'Feb', current: 3000, projected: 3200 },
    { month: 'Mar', current: 2000, projected: 2400 },
    { month: 'Apr', current: 2780, projected: 3100 },
    { month: 'May', current: 1890, projected: 2100 },
    { month: 'Jun', current: 2390, projected: 2800 },
];

const priceData = [
    { week: 'W1', price: 2100 },
    { week: 'W2', price: 2250 },
    { week: 'W3', price: 2150 },
    { week: 'W4', price: 2400 },
    { week: 'W5 (Est)', price: 2600 },
    { week: 'W6 (Est)', price: 2750 },
];

const Advisory = () => {
    const [soilData, setSoilData] = useState({ n: 50, p: 40, k: 30, ph: 6.5 });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = () => {
        setLoading(true);
        setTimeout(() => {
            setPrediction([
                { crop: 'Cotton', confidence: 92, reason: 'Optimal pH and Nitrogen levels for current season.' },
                { crop: 'Maize', confidence: 85, reason: 'Good soil structure, but requires additional Phosphorus.' },
                { crop: 'Soybean', confidence: 78, reason: 'Viable rotation crop; potassium levels are sufficient.' }
            ]);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="container mx-auto px-4 pb-20 page-transition">
            {/* Header */}
            <div className="mb-10 text-center md:text-left">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-center md:justify-start gap-3 text-purple-600 font-bold text-sm uppercase tracking-widest mb-3">
                        <Brain className="w-5 h-5" />
                        AI Farming Assistant
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4 heading-decoration inline-block">Smart Advisory</h1>
                    <p className="text-slate-500 text-lg max-w-2xl">Leverage real-time data and artificial intelligence to optimize your yield, predict market prices, and prevent crop diseases.</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Weather & Alerts Card */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1">
                    <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50/30 backdrop-blur-lg h-full">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-extrabold flex items-center gap-2 text-slate-900">
                                <MapPin className="w-5 h-5 text-blue-500" /> Hyper-Local Conditions
                            </CardTitle>
                            <CardDescription>Guntur District, Andhra Pradesh</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
                                <div>
                                    <h4 className="text-4xl font-black text-slate-800 tracking-tighter">32°<span className="text-2xl text-slate-400">C</span></h4>
                                    <p className="font-bold text-slate-500 mt-1">Partly Cloudy</p>
                                </div>
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 shadow-inner">
                                    <Sun className="w-8 h-8" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-white p-4 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2"><Droplets className="w-4 h-4 text-emerald-500" /><span className="text-xs font-bold text-slate-500">HUMIDITY</span></div>
                                    <p className="text-xl font-extrabold text-slate-800">65%</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 mb-2"><Wind className="w-4 h-4 text-sky-500" /><span className="text-xs font-bold text-slate-500">WIND</span></div>
                                    <p className="text-xl font-extrabold text-slate-800">12 km/h</p>
                                </div>
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Active Advisories</h4>
                            <div className="space-y-3">
                                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-0.5">Pest Warning (Cotton)</p>
                                        <p className="text-xs text-amber-700 leading-relaxed">High probability of Pink Bollworm based on current humidity. Consider preventive spray.</p>
                                    </div>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-0.5">Irrigation Window</p>
                                        <p className="text-xs text-emerald-700 leading-relaxed">Optimal soil moisture detected. No immediate irrigation required for next 48 hours.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Charts Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Yield Prediction */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-lg">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-extrabold flex items-center gap-2 text-slate-900">
                                            <Target className="w-5 h-5 text-emerald-500" /> Yield Prediction Model
                                        </CardTitle>
                                        <CardDescription>AI-generated forecast based on historical data and current inputs</CardDescription>
                                    </div>
                                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">+10% Efficiency</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={yieldData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
                                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                                            <Area type="monotone" dataKey="current" stroke="#cbd5e1" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrent)" name="Without Platform" />
                                            <Area type="monotone" dataKey="projected" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProjected)" name="With Advisory" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Price Forecasting */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-lg">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <CardTitle className="text-xl font-extrabold flex items-center gap-2 text-slate-900">
                                    <TrendingUp className="w-5 h-5 text-indigo-500" /> Market Price Forecasting
                                </CardTitle>
                                <CardDescription>Predictive analytics for Cotton (₹/Quintal) via Time-Series NLP</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={priceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
                                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} domain={['dataMin - 100', 'dataMax + 100']} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                                            <Line type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} name="Predicted Price" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* AI Crop Recommender Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-lg">
                    <div className="grid md:grid-cols-2">
                        <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100 bg-gradient-to-br from-purple-50 to-white">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-inner mb-2">
                                    <Sprout className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Crop Recommender Engine</h3>
                                    <p className="text-sm font-medium text-slate-500">Input your soil metrics to generate an AI-backed crop recommendation.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Nitrogen (N)</label>
                                    <input type="number" value={soilData.n} onChange={(e) => setSoilData({ ...soilData, n: parseInt(e.target.value) })} className="input-modern w-full font-black text-slate-700 bg-white" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Phosphorus (P)</label>
                                    <input type="number" value={soilData.p} onChange={(e) => setSoilData({ ...soilData, p: parseInt(e.target.value) })} className="input-modern w-full font-black text-slate-700 bg-white" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Potassium (K)</label>
                                    <input type="number" value={soilData.k} onChange={(e) => setSoilData({ ...soilData, k: parseInt(e.target.value) })} className="input-modern w-full font-black text-slate-700 bg-white" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">pH Level</label>
                                    <input type="number" step="0.1" value={soilData.ph} onChange={(e) => setSoilData({ ...soilData, ph: parseFloat(e.target.value) })} className="input-modern w-full font-black text-slate-700 bg-white" />
                                </div>
                            </div>
                            <Button onClick={handlePredict} disabled={loading} variant="premium" className="w-full rounded-xl h-14 text-lg font-bold shadow-xl shadow-purple-500/20 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                                {loading ? (
                                    <span className="flex items-center gap-2"><Activity className="w-5 h-5 animate-spin" /> Processing Neural Network...</span>
                                ) : (
                                    <span className="flex items-center gap-2"><Brain className="w-5 h-5" /> Generate Recommendation</span>
                                )}
                            </Button>
                        </div>

                        <div className="p-8 bg-slate-50/50">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">AI Results Matrix</h4>

                            {!prediction && !loading && (
                                <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center opacity-50">
                                    <Brain className="w-16 h-16 text-slate-300 mb-4" />
                                    <p className="font-bold text-slate-500">Awaiting soil input parameters</p>
                                    <p className="text-xs text-slate-400 mt-1 max-w-[250px]">Select run to prompt the classification model.</p>
                                </div>
                            )}

                            {loading && (
                                <div className="h-full min-h-[200px] flex flex-col items-center justify-center">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-3 h-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-6 animate-pulse">Analyzing terrain data...</p>
                                </div>
                            )}

                            {prediction && !loading && (
                                <div className="space-y-4">
                                    {prediction.map((item, index) => (
                                        <motion.div key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                                            className={cn("p-4 rounded-2xl border transition-all",
                                                index === 0 ? "bg-emerald-50 border-emerald-200 shadow-sm" : "bg-white border-slate-100"
                                            )}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {index === 0 && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                                                    <h5 className={cn("font-extrabold text-lg", index === 0 ? "text-emerald-900" : "text-slate-700")}>{item.crop}</h5>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm">
                                                    <span className={cn("text-sm font-black", index === 0 ? "text-emerald-600" : "text-slate-600")}>{item.confidence}%</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Match</span>
                                                </div>
                                            </div>
                                            <p className={cn("text-xs leading-relaxed", index === 0 ? "text-emerald-700 font-medium" : "text-slate-500")}>
                                                {item.reason}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Advisory;
