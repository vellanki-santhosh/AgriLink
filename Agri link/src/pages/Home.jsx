import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Map,
    Tractor,
    Users,
    Zap,
    ShieldCheck,
    TrendingUp,
    MapPin,
    Star,
    CheckCircle2,
    Sprout,
    BarChart3,
    Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Home = () => {
    const [recentLands, setRecentLands] = useState([]);
    const [activeTab, setActiveTab] = useState('prices');

    useEffect(() => {
        base44.entities.Land.list("-created_date", 3).then(setRecentLands).catch(() => { });
    }, []);

    const stats = [
        { label: 'Active Farmers', value: '50K+', icon: Users },
        { label: 'Acres Listed', value: '120K+', icon: Map },
        { label: 'Equipment Available', value: '15K+', icon: Tractor },
        { label: 'Successful Bookings', value: '200K+', icon: CheckCircle2 },
    ];

    const cropPrices = [
        { crop: 'Paddy', price: '₹2,183/qntl', trend: '+2.4%', state: 'Telangana' },
        { crop: 'Cotton', price: '₹7,020/qntl', trend: '-1.1%', state: 'Maharashtra' },
        { crop: 'Wheat', price: '₹2,275/qntl', trend: '+0.8%', state: 'Punjab' },
        { crop: 'Maize', price: '₹1,960/qntl', trend: '+1.7%', state: 'Karnataka' },
    ];

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-16 pb-32 px-4">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-6">
                                <Zap className="w-3 h-3" />
                                The Future of Agriculture is Here
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight tracking-tight">
                                Empowering India's <span className="text-primary italic">Farmers</span> for a Greener Tomorrow
                            </h1>
                            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                                Connect with landowners, rent high-tech equipment, and hire skilled workers.
                                Everything you need to grow your agricultural business in one place.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/lands">
                                    <Button variant="premium" size="xl" className="group w-full sm:w-auto">
                                        Explore Marketplace
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Button variant="outline" size="xl" className="rounded-xl border-slate-200">
                                    How it Works
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Counter */}
            <section className="py-12 bg-white border-y border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors"
                            >
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Market & AI Insights */}
            <section className="py-24 px-4 bg-slate-50">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                                Real-time Data at Your <br />
                                <span className="text-primary">Finger Tips</span>
                            </h2>
                            <p className="text-slate-600 mb-10 text-lg leading-relaxed">
                                Stay updated with the latest mandi prices across India. Our AI algorithms
                                analyze price trends to help you decide when to sell your produce.
                            </p>

                            <Card className="border-none shadow-xl overflow-hidden">
                                <div className="bg-primary px-6 py-4 flex justify-between items-center">
                                    <span className="text-white font-bold flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Market Pulse
                                    </span>
                                    <span className="text-white/80 text-xs uppercase tracking-widest font-bold">Updated: Today</span>
                                </div>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        {cropPrices.map((item, i) => (
                                            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                <div>
                                                    <div className="font-bold text-slate-800">{item.crop}</div>
                                                    <div className="text-xs text-slate-500 font-medium">{item.state}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-slate-900">{item.price}</div>
                                                    <div className={cn("text-xs font-bold", item.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500")}>
                                                        {item.trend}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative z-10"
                            >
                                <div className="rounded-3xl overflow-hidden shadow-2xl bg-white p-8 border border-slate-100">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                                            <Sun className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-xl">AI Weather Advisor</h3>
                                            <p className="text-sm text-slate-500">Khammam, Telangana</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                                        <p className="text-slate-700 italic border-l-4 border-primary pl-4 py-1">
                                            "Ideal conditions for cotton harvesting this week. Soil moisture is optimal for rabi sowing. Avoid spraying chemicals tomorrow due to predicted light winds."
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Temp</div>
                                            <div className="font-bold text-slate-900 text-lg">32°C</div>
                                        </div>
                                        <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">Rain</div>
                                            <div className="font-bold text-slate-900 text-lg">5%</div>
                                        </div>
                                        <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="text-xs text-slate-500 font-bold uppercase mb-1">UV</div>
                                            <div className="font-bold text-slate-900 text-lg">High</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Decorative elements */}
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute top-1/2 -right-12 w-48 h-48 bg-emerald-100 rounded-full -z-10 blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Services */}
            <section className="py-24 px-4 bg-white">
                <div className="container mx-auto">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <div className="text-primary font-bold text-sm uppercase tracking-widest mb-4">Our Ecosystem</div>
                            <h2 className="text-4xl font-bold text-slate-900">One Platform, Endless Possibilities</h2>
                        </div>
                        <Link to="/lands" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                            View All Services <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ServiceCard
                            title="Land Leasing"
                            desc="Browse verified land listings for lease across major agricultural hubs."
                            icon={Map}
                            color="bg-emerald-50 text-emerald-600"
                            link="/lands"
                        />
                        <ServiceCard
                            title="Equipment Rental"
                            desc="Rent tractors, harvesters, and drones from nearby providers at best rates."
                            icon={Tractor}
                            color="bg-blue-50 text-blue-600"
                            link="/equipment"
                        />
                        <ServiceCard
                            title="Skilled Labor"
                            desc="Connect with experienced farm workers and specialists for your crops."
                            icon={Users}
                            color="bg-amber-50 text-amber-600"
                            link="/workers"
                        />
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-20 bg-slate-900 overflow-hidden relative">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Trusted by Indian Farmers</h2>
                        <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
                        {/* Mock Partner Logos */}
                        {['Krishi Vigyan', 'AgriTech India', 'National Seeds', 'FPO Alliance'].map((p, i) => (
                            <div key={i} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-default">
                                <span className="text-white font-black text-xl md:text-2xl tracking-tighter opacity-70">{p}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 bg-primary relative overflow-hidden">
                <div className="container mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to grow your farm?</h2>
                    <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto">
                        Join thousands of farmers and landowners who are already using AgriLink to optimize their yields and increase income.
                    </p>
                    <Link to="/profile">
                        <Button size="xl" className="bg-white text-primary hover:bg-slate-100 font-bold rounded-2xl px-12">
                            Get Started Now
                        </Button>
                    </Link>
                </div>
                {/* Decorative Circles */}
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-black/10 blur-3xl"></div>
            </section>
        </div>
    );
};

const ServiceCard = ({ title, desc, icon: Icon, color, link }) => (
    <Link to={link}>
        <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all h-full"
        >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", color)}>
                <Icon className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
            <p className="text-slate-600 leading-relaxed mb-8">{desc}</p>
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                Learn More <ArrowRight className="w-4 h-4" />
            </div>
        </motion.div>
    </Link>
);

export default Home;
