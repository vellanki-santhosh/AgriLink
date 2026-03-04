import React, { useState } from 'react';
import {
    Zap,
    Mail,
    Lock,
    ArrowRight,
    Smartphone,
    CheckCircle2,
    ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await base44.auth.login(email, password);
            setTimeout(() => {
                setLoading(false);
                navigate('/dashboard');
                window.location.reload();
            }, 1000);
        } catch (err) {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-[100px] -z-10"></div>

            <div className="w-full max-w-[1100px] bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row overflow-hidden min-h-[600px]">
                {/* Left Side: Branding/Info */}
                <div className="w-full md:w-1/2 bg-primary p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-2 mb-12 group inline-flex">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md group-hover:bg-white/30 transition-all">
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold">Back to Home</span>
                        </Link>

                        <h2 className="text-4xl font-black mb-6 leading-tight">
                            Empowering India's <br />
                            <span className="text-white/70 italic">Next Gen</span> Farmers
                        </h2>

                        <div className="space-y-6">
                            {[
                                "Access 15,000+ verified listings",
                                "Connect with skilled workforce nearby",
                                "Get real-time market price alerts",
                                "Advanced AI-driven weather insights"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-white/90">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
                        <p className="text-xs font-medium text-white/70 uppercase tracking-widest mb-2">Trusted By</p>
                        <div className="flex gap-4 opacity-70 grayscale brightness-200">
                            <span className="font-black text-lg">NABARD</span>
                            <span className="font-black text-lg">KRIBHCO</span>
                            <span className="font-black text-lg">IFFCO</span>
                        </div>
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute top-1/2 -left-20 w-64 h-64 rounded-full bg-black/10 blur-3xl"></div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-slate-50/50">
                    <div className="max-w-md mx-auto w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? 'login' : 'signup'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mb-10">
                                    <h3 className="text-3xl font-black text-slate-900 mb-2">
                                        {isLogin ? 'Welcome Back!' : 'Join AgriLink'}
                                    </h3>
                                    <p className="text-slate-500 font-medium">
                                        {isLogin ? 'Login to access your agricultural dashboard.' : 'Start your journey as a farmer or provider.'}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {!isLogin && (
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700"
                                            />
                                        </div>
                                    )}

                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700"
                                        />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700"
                                        />
                                    </div>

                                    {isLogin && (
                                        <div className="text-right">
                                            <button type="button" className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">Forgot Password?</button>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="premium"
                                        className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 group text-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                {isLogin ? 'Login Now' : 'Create Account'}
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        )}
                                    </Button>
                                </form>

                                <div className="mt-12 text-center">
                                    <p className="text-slate-500 font-medium mb-6">Or continue with</p>
                                    <div className="flex gap-4">
                                        <button className="flex-grow h-14 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all font-black text-slate-700 flex items-center justify-center gap-2">
                                            <Smartphone className="w-5 h-5" />
                                            OTP Login
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                                    <button
                                        onClick={() => setIsLogin(!isLogin)}
                                        className="text-slate-500 font-medium"
                                    >
                                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                                        <span className="text-primary font-black hover:underline">
                                            {isLogin ? 'Sign Up' : 'Login'}
                                        </span>
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
