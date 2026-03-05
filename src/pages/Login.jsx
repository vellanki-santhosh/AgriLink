import React, { useState } from 'react';
import {
    Zap, Mail, Lock, ArrowRight, Smartphone, CheckCircle2, ChevronLeft, Phone, KeyRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [otpMode, setOtpMode] = useState(false);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const [forgotMode, setForgotMode] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

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

    const handleSendOtp = async () => {
        if (!phone || phone.length < 10) return;
        setOtpLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        setOtpLoading(false);
        setOtpSent(true);
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 4) return;
        setOtpLoading(true);
        await new Promise(r => setTimeout(r, 900));
        const user = { email: `${phone}@otp.agrilink.in`, full_name: 'OTP User', role: 'Farmer' };
        localStorage.setItem('agrilink_user', JSON.stringify(user));
        setOtpLoading(false);
        setOtpVerified(true);
        setTimeout(() => { navigate('/dashboard'); window.location.reload(); }, 1200);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!resetEmail) return;
        setResetLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        setResetLoading(false);
        setResetSent(true);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 relative overflow-hidden page-transition">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/8 rounded-full blur-[150px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-full blur-[120px] -z-10"></div>

            <div className="w-full max-w-[1100px] bg-white rounded-[3rem] shadow-elevated border border-slate-200/40 flex flex-col md:flex-row overflow-hidden min-h-[600px]">
                {/* Left Side — Brand */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-primary via-primary-dark to-primary-darkest p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Dot grid pattern */}
                    <div className="absolute inset-0 opacity-[0.05] z-0"
                        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-2 mb-12 group inline-flex">
                            <div className="bg-white/15 p-2 rounded-xl backdrop-blur-md group-hover:bg-white/25 transition-all border border-white/10">
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-white/80 group-hover:text-white transition-colors">Back to Home</span>
                        </Link>
                        <h2 className="text-4xl font-extrabold mb-6 leading-tight tracking-tight">
                            Empowering India's <br />
                            <span className="text-white/60 italic">Next Gen</span> Farmers
                        </h2>
                        <div className="space-y-5">
                            {["Access 15,000+ verified listings", "Connect with skilled workforce nearby", "Get real-time market price alerts", "Advanced AI-driven weather insights"].map((text, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center border border-white/10">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-white/85">{text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div className="relative z-10 p-6 bg-white/8 backdrop-blur-xl rounded-2xl border border-white/10 mt-8">
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-3">Trusted By</p>
                        <div className="flex gap-6 opacity-60">
                            <span className="font-extrabold text-lg">NABARD</span>
                            <span className="font-extrabold text-lg">KRIBHCO</span>
                            <span className="font-extrabold text-lg">IFFCO</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
                    <div className="absolute top-1/2 -left-20 w-64 h-64 rounded-full bg-black/10 blur-3xl"></div>
                </div>

                {/* Right Side — Form */}
                <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-slate-50/30">
                    <div className="max-w-md mx-auto w-full">
                        <AnimatePresence mode="wait">

                            {/* Forgot Password Flow */}
                            {forgotMode && (
                                <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <button onClick={() => { setForgotMode(false); setResetSent(false); setResetEmail(''); }}
                                        className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-8 hover:text-primary transition-colors">
                                        <ChevronLeft className="w-4 h-4" /> Back to Login
                                    </button>
                                    {resetSent ? (
                                        <div className="text-center py-8">
                                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                                                <CheckCircle2 className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Email Sent!</h3>
                                            <p className="text-slate-500 mb-6">We've sent a password reset link to <b>{resetEmail}</b>. Check your inbox.</p>
                                            <Button variant="outline" className="rounded-2xl" onClick={() => { setForgotMode(false); setResetSent(false); }}>Back to Login</Button>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="text-3xl font-extrabold text-slate-900 mb-2">Forgot Password?</h3>
                                            <p className="text-slate-500 font-medium mb-10">Enter your email and we'll send you a reset link.</p>
                                            <form onSubmit={handleForgotPassword} className="space-y-5">
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                    <input type="email" placeholder="Email Address" required value={resetEmail}
                                                        onChange={e => setResetEmail(e.target.value)}
                                                        className="input-modern w-full" />
                                                </div>
                                                <Button type="submit" variant="premium" className="w-full h-14 rounded-2xl shadow-xl text-lg" disabled={resetLoading}>
                                                    {resetLoading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Send Reset Link'}
                                                </Button>
                                            </form>
                                        </>
                                    )}
                                </motion.div>
                            )}

                            {/* OTP Login Flow */}
                            {!forgotMode && otpMode && (
                                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <button onClick={() => { setOtpMode(false); setOtpSent(false); setOtp(''); setPhone(''); }}
                                        className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-8 hover:text-primary transition-colors">
                                        <ChevronLeft className="w-4 h-4" /> Back to Login
                                    </button>
                                    {otpVerified ? (
                                        <div className="text-center py-8">
                                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                                                <CheckCircle2 className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Verified! Redirecting…</h3>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="text-3xl font-extrabold text-slate-900 mb-2">OTP Login</h3>
                                            <p className="text-slate-500 font-medium mb-10">Login securely with your mobile number.</p>
                                            <div className="space-y-5">
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                    <input type="tel" placeholder="Mobile Number (+91)" value={phone}
                                                        onChange={e => setPhone(e.target.value)} disabled={otpSent}
                                                        maxLength={10}
                                                        className="input-modern w-full disabled:opacity-60" />
                                                </div>
                                                {!otpSent ? (
                                                    <Button variant="premium" className="w-full h-14 rounded-2xl shadow-xl text-lg"
                                                        disabled={phone.length < 10 || otpLoading} onClick={handleSendOtp}>
                                                        {otpLoading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Send OTP'}
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <p className="text-sm text-emerald-600 font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> OTP sent to +91 {phone}</p>
                                                        <div className="relative">
                                                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                            <input type="text" placeholder="Enter 4-digit OTP" value={otp}
                                                                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                                className="input-modern w-full tracking-[0.5em] text-center text-xl" />
                                                        </div>
                                                        <Button variant="premium" className="w-full h-14 rounded-2xl shadow-xl text-lg"
                                                            disabled={otp.length < 4 || otpLoading} onClick={handleVerifyOtp}>
                                                            {otpLoading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Verify & Login'}
                                                        </Button>
                                                        <button className="text-sm text-primary font-bold hover:underline" onClick={() => { setOtpSent(false); setOtp(''); }}>Resend OTP</button>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )}

                            {/* Normal Login / Signup */}
                            {!forgotMode && !otpMode && (
                                <motion.div key={isLogin ? 'login' : 'signup'} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                                    <div className="mb-10">
                                        <h3 className="text-3xl font-extrabold text-slate-900 mb-2">{isLogin ? 'Welcome Back!' : 'Join AgriLink'}</h3>
                                        <p className="text-slate-500 font-medium">{isLogin ? 'Login to access your agricultural dashboard.' : 'Start your journey as a farmer or provider.'}</p>
                                    </div>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {!isLogin && (
                                            <div className="relative">
                                                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                                <input type="text" placeholder="Full Name" value={fullName}
                                                    onChange={e => setFullName(e.target.value)}
                                                    className="input-modern w-full" />
                                            </div>
                                        )}
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input type="email" placeholder="Email Address" required value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="input-modern w-full" />
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input type="password" placeholder="Password" required value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                className="input-modern w-full" />
                                        </div>
                                        {isLogin && (
                                            <div className="text-right">
                                                <button type="button" onClick={() => setForgotMode(true)}
                                                    className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">Forgot Password?</button>
                                            </div>
                                        )}
                                        <Button type="submit" variant="premium" className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 group text-lg" disabled={loading}>
                                            {loading ? <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : (
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
                                            <button onClick={() => setOtpMode(true)}
                                                className="flex-grow h-14 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-primary/30 transition-all font-bold text-slate-700 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                                                <Smartphone className="w-5 h-5" />
                                                OTP Login
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                                        <button onClick={() => setIsLogin(!isLogin)} className="text-slate-500 font-medium">
                                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                                            <span className="text-primary font-extrabold hover:underline">{isLogin ? 'Sign Up' : 'Login'}</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
