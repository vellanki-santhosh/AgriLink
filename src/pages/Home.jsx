import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import {
    ArrowRight,
    Map,
    Tractor,
    Users,
    Zap,
    MapPin,
    Star,
    CheckCircle2,
    Sprout,
    Sun,
    CloudRain,
    Wind,
    Loader2,
    LocateFixed,
    Thermometer,
    TrendingUp,
    LayoutDashboard,
    Search,
    Beaker,
    Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import heroFarm from '@/assets/hero_farm.png';

// Generate AI farming advice based on real weather data
const generateFarmingAdvice = (temp, rain, windspeed, humidity) => {
    const tips = [];
    if (rain > 60) tips.push('Heavy rain likely — avoid spraying pesticides or fertilizers today.');
    else if (rain > 30) tips.push('Moderate rain chance — hold off on irrigation to conserve water.');
    else tips.push('Dry conditions ahead — ensure adequate irrigation for crops.');

    if (temp > 38) tips.push('Extreme heat alert: water crops in early morning or evening to reduce evaporation.');
    else if (temp > 32) tips.push('High temperature: monitor soil moisture closely and provide shade for young seedlings.');
    else if (temp < 15) tips.push('Cool conditions: ideal for sowing Rabi crops like wheat and mustard.');
    else tips.push('Moderate temperature: favorable for most field operations.');

    if (windspeed > 30) tips.push('Strong winds: avoid harvesting or spraying. Secure greenhouse covers.');
    else if (windspeed > 15) tips.push('Moderate winds: good for natural pollination of flowering crops.');

    if (humidity > 80) tips.push('High humidity: watch for fungal diseases — inspect crops for early blight or powdery mildew.');

    return tips.slice(0, 2).join(' ');
};

const Home = () => {
    const [recentLands, setRecentLands] = useState([]);
    const { t } = useLanguage();

    // Weather state
    const [weather, setWeather] = useState(null);
    const [locationName, setLocationName] = useState('');
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState('');
    const [locationRequested, setLocationRequested] = useState(false);

    useEffect(() => {
        base44.entities.Land.list("-created_date", 3).then(setRecentLands).catch(() => { });
    }, []);

    const fetchWeather = () => {
        if (!navigator.geolocation) {
            setWeatherError('Geolocation is not supported by your browser.');
            return;
        }
        setWeatherLoading(true);
        setWeatherError('');
        setLocationRequested(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude: lat, longitude: lon } = pos.coords;
                try {
                    const geoRes = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
                        { headers: { 'Accept-Language': 'en' } }
                    );
                    const geoData = await geoRes.json();
                    const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county || 'Your Location';
                    const state = geoData.address?.state || '';
                    setLocationName(state ? `${city}, ${state}` : city);

                    const weatherRes = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,uv_index,weather_code&timezone=auto`
                    );
                    const weatherData = await weatherRes.json();
                    const c = weatherData.current;
                    setWeather({
                        temp: Math.round(c.temperature_2m),
                        humidity: Math.round(c.relative_humidity_2m),
                        rain: Math.round(c.precipitation_probability),
                        wind: Math.round(c.wind_speed_10m),
                        uv: c.uv_index != null ? (c.uv_index >= 8 ? 'Very High' : c.uv_index >= 6 ? 'High' : c.uv_index >= 3 ? 'Moderate' : 'Low') : 'N/A',
                        advice: generateFarmingAdvice(c.temperature_2m, c.precipitation_probability, c.wind_speed_10m, c.relative_humidity_2m),
                    });
                } catch (e) {
                    setWeatherError('Could not fetch weather data.');
                } finally {
                    setWeatherLoading(false);
                }
            },
            (err) => {
                setWeatherLoading(false);
                setWeatherError('Location access denied.');
            },
            { timeout: 10000 }
        );
    };

    const stats = [
        { label: t('home.activeFarmers'), value: '50K+', icon: Users },
        { label: t('home.acresListed'), value: '120K+', icon: Map },
        { label: t('home.equipmentAvailable'), value: '15K+', icon: Tractor },
        { label: t('home.successfulBookings'), value: '200K+', icon: CheckCircle2 },
    ];

    const cropPrices = [
        { crop: 'Paddy', price: '₹2,183/qntl', trend: '+2.4%', state: 'Telangana' },
        { crop: 'Cotton', price: '₹7,020/qntl', trend: '-1.1%', state: 'Maharashtra' },
        { crop: 'Wheat', price: '₹2,275/qntl', trend: '+0.8%', state: 'Punjab' },
        { crop: 'Maize', price: '₹1,960/qntl', trend: '+1.7%', state: 'Karnataka' },
    ];

    return (
        <div className="bg-[#fcfdfb]">
            {/* ── Hero Section ── */}
            <section className="relative min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroFarm}
                        alt="Farm Landscape"
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fcfdfb] to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs uppercase tracking-widest mb-6">
                                <Zap className="w-4 h-4 text-emerald-300 fill-emerald-300" />
                                {t('home.badge')}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                                {t('home.heroTitle1')}
                                <span className="text-emerald-400 italic">
                                    {t('home.heroTitleHighlight')}
                                </span>
                                {t('home.heroTitle2')}
                            </h1>
                            <p className="text-xl text-white/90 mb-10 max-w-xl leading-relaxed font-medium">
                                {t('home.heroDesc')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/lands">
                                    <Button className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary-dark text-lg font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
                                        {t('home.exploreMarketplace')}
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    className="h-16 px-10 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border-white/30 text-white text-lg font-bold transition-all"
                                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    {t('home.howItWorks')}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Quick Actions ── */}
            <section className="relative z-20 -mt-16 container mx-auto px-4 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { icon: Map, path: '/lands', label: t('home.findLand'), color: 'bg-emerald-600' },
                        { icon: Tractor, path: '/equipment', label: t('home.rentEquipment'), color: 'bg-blue-600' },
                        { icon: Users, path: '/workers', label: t('home.hireLabor'), color: 'bg-orange-600' },
                        { icon: TrendingUp, path: '/dashboard', label: t('home.checkPrices'), color: 'bg-indigo-600' },
                        { icon: Beaker, path: '/soil-analysis', label: t('nav.soilAnalysis'), color: 'bg-teal-600' },
                        { icon: Brain, path: '/advisory', label: t('nav.advisory'), color: 'bg-violet-600' }
                    ].map((action, i) => (
                        <Link to={action.path} key={i} className="group">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center gap-4 text-center hover:shadow-2xl group-hover:scale-[1.05] group-hover:-translate-y-2 transition-all cursor-pointer border border-slate-100 group-hover:border-primary/30"
                            >
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform", action.color)}>
                                    <action.icon className="w-7 h-7" />
                                </div>
                                <span className="font-bold text-slate-800 text-sm md:text-base">{action.label}</span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Dashboard Lite (Weather & Market) ── */}
            <section id="market" className="py-24 container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{t('home.realTimeTitle1')} {t('home.realTimeTitle2')}</h2>
                        <p className="text-slate-500 font-medium">{t('home.realTimeDesc')}</p>
                    </div>
                    <Link to="/dashboard">
                        <Button variant="outline" className="rounded-full px-6 flex items-center gap-2 font-bold border-slate-200 text-slate-600">
                            <LayoutDashboard className="w-4 h-4" />
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Market Prices */}
                    <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white">
                        <div className="bg-slate-900 p-8 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500 rounded-xl">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">{t('home.marketPulse')}</h3>
                            </div>
                            <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">{t('home.updatedToday')}</span>
                        </div>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {cropPrices.map((item, i) => (
                                    <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-slate-50/50 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                                {item.crop[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-lg">{item.crop}</div>
                                                <div className="text-sm text-slate-500 flex items-center gap-1 font-medium">
                                                    <MapPin className="w-3.5 h-3.5" /> {item.state}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-slate-900 text-lg">{item.price}</div>
                                            <div className={cn("text-xs font-bold px-3 py-1 rounded-full inline-block mt-1",
                                                item.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                                                {item.trend}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-slate-50/50 text-center">
                                <Button variant="link" className="text-primary font-bold">{t('home.checkPrices')} <ArrowRight className="w-4 h-4 ml-1" /></Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Weather Advisor */}
                    <motion.div
                        className="rounded-[2.5rem] p-8 md:p-10 border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                                    <Sun className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-xl md:text-2xl">{t('home.aiWeatherAdvisor')}</h3>
                                    <p className="text-sm text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {weather ? locationName : 'Select Location'}
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={fetchWeather}
                                disabled={weatherLoading}
                                className="rounded-2xl h-12 px-6 bg-primary font-bold shadow-md active:scale-95 transition-all"
                            >
                                {weatherLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LocateFixed className="w-5 h-5 mr-2" />}
                                {weatherLoading ? '...' : (weather ? 'Refresh' : 'Detect')}
                            </Button>
                        </div>

                        {!weather ? (
                            <div className="flex-grow flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                <Sprout className="w-12 h-12 text-primary/30 mb-4" />
                                <p className="text-slate-500 font-medium max-w-xs">Get real-time weather and AI farming advice for your village</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fade-up">
                                <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100 relative overflow-hidden">
                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">
                                        <Zap className="w-4 h-4 fill-emerald-600" /> AI Insights
                                    </div>
                                    <p className="text-slate-800 text-lg italic leading-relaxed font-medium">
                                        "{weather.advice}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                    {[
                                        { label: t('home.temp'), value: `${weather.temp}°C`, icon: Thermometer, color: 'text-amber-500', bg: 'bg-amber-50' },
                                        { label: t('home.rain'), value: `${weather.rain}%`, icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-50' },
                                        { label: t('home.uv'), value: weather.uv, icon: Sun, color: 'text-orange-500', bg: 'bg-orange-50' },
                                        { label: 'Wind', value: `${weather.wind} km/h`, icon: Wind, color: 'text-indigo-500', bg: 'bg-indigo-50' }
                                    ].map((s, i) => (
                                        <div key={i} className={cn("text-center p-4 rounded-2xl flex flex-col items-center gap-1", s.bg)}>
                                            <s.icon className={cn("w-5 h-5 mb-1", s.color)} />
                                            <span className="text-[10px] text-slate-400 font-bold uppercase">{s.label}</span>
                                            <span className="font-bold text-slate-800 text-sm md:text-base">{s.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                                            <Sprout className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <div className="text-sm font-bold text-slate-700">Soil Moisture: <span className="text-emerald-600">Optimal</span></div>
                                    </div>
                                    <Link to="/crops" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                                        Calendar <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* ── Services Section ── */}
            <section id="services" className="py-24 bg-[#f4f7f2]">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-4 block">{t('home.ourEcosystem')}</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900">{t('home.onePlatform')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ServiceCard
                            title={t('home.landLeasing')}
                            desc={t('home.landLeasingDesc')}
                            icon={Map}
                            color="bg-emerald-600"
                            link="/lands"
                            t={t}
                            delay={0}
                        />
                        <ServiceCard
                            title={t('home.equipmentRentalTitle')}
                            desc={t('home.equipmentRentalDesc')}
                            icon={Tractor}
                            color="bg-blue-600"
                            link="/equipment"
                            t={t}
                            delay={0.1}
                        />
                        <ServiceCard
                            title={t('home.skilledLabor')}
                            desc={t('home.skilledLaborDesc')}
                            icon={Users}
                            color="bg-orange-600"
                            link="/workers"
                            t={t}
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            {/* ── Stats Section ── */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                                <stat.icon className="w-8 h-8 text-primary" />
                            </div>
                            <div className="text-4xl font-extrabold text-slate-900 mb-2">{stat.value}</div>
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Trust Section ── */}
            <section className="py-24 bg-slate-900 overflow-hidden relative">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-12">{t('home.trustedByFarmers')}</h2>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-40">
                        {['Krishi Vigyan', 'AgriTech India', 'National Seeds', 'FPO Alliance', 'NABARD', 'ICAR'].map((p, i) => (
                            <span key={i} className="text-white font-black text-xl md:text-3xl tracking-tighter hover:opacity-100 transition-opacity uppercase">{p}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="py-24 px-4 bg-[#fcfdfb]">
                <div className="container mx-auto">
                    <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/30">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full -ml-24 -mb-24 blur-3xl" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">{t('home.readyToGrow')}</h2>
                            <p className="text-white/90 text-lg mb-12 max-w-2xl mx-auto font-medium">
                                {t('home.ctaDesc')}
                            </p>
                            <Link to="/profile">
                                <Button className="h-16 px-12 rounded-2xl bg-white text-primary hover:bg-slate-50 text-xl font-bold shadow-xl shadow-black/10 transition-all flex items-center gap-3 mx-auto group">
                                    {t('home.getStarted')}
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const ServiceCard = ({ title, desc, icon: Icon, color, link, t, delay }) => (
    <Link to={link}>
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            className="group bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-primary/10 border border-slate-100 hover:border-primary/20 transition-all h-full flex flex-col"
        >
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300", color)}>
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-10 flex-grow">{desc}</p>
            <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all pt-6 border-t border-slate-50">
                {t('home.learnMore')}
                <ArrowRight className="w-5 h-5 ml-auto" />
            </div>
        </motion.div>
    </Link>
);

export default Home;
