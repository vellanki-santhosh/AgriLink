import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    MapPin,
    Phone,
    Briefcase,
    Edit3,
    Camera,
    Save,
    Trash2,
    Plus,
    Settings,
    Shield,
    Clock,
    ExternalLink,
    PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [listings, setListings] = useState({ lands: [], equipment: [] });
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const u = await base44.auth.me();
        setUser(u);
        setFormData(u);

        // Load user's listings
        const userLands = await base44.entities.Land.filter({ owner_email: u.email }, "-created_date", 20);
        const userEquip = await base44.entities.Equipment.filter({ owner_email: u.email }, "-created_date", 20);
        setListings({
            lands: userLands.length > 0 ? userLands : mockUserLands,
            equipment: userEquip.length > 0 ? userEquip : []
        });
    };

    const mockUserLands = [
        { id: 'l1', title: 'Ancestral Farm Land', land_type: 'Black', total_area: 8, area_unit: 'Acres', status: 'Available', rental_price: 30000 },
    ];

    const handleSave = async () => {
        // In a real app, update user via SDK
        setUser(formData);
        setEditing(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const { url } = await base44.integrations.Core.UploadFile(file);
            setFormData({ ...formData, profile_image: url });
        } catch (e) {
            console.error("Upload failed", e);
        }
    };

    if (!user) return <div className="p-20 text-center">Loading profile...</div>;

    return (
        <div className="container mx-auto px-4 pb-20">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar */}
                <div className="lg:w-1/3">
                    <Card className="overflow-hidden border-none shadow-xl">
                        <div className="h-32 premium-gradient w-full relative">
                            <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-all" onClick={() => setEditing(!editing)}>
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>
                        <CardContent className="px-8 pb-8 -mt-16 text-center">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                                    {formData.profile_image ? (
                                        <img src={formData.profile_image} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-slate-300" />
                                    )}
                                </div>
                                {editing && (
                                    <label className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-2xl shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                                        <Camera className="w-4 h-4" />
                                        <input type="file" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 mb-1">{user.full_name}</h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest mb-6">
                                <Shield className="w-3 h-3" />
                                Verified {user.role}
                            </div>

                            <div className="space-y-4 text-left">
                                <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-slate-400">Email</span>
                                        <span className="font-semibold text-slate-700">{user.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-slate-400">Phone</span>
                                        <span className="font-semibold text-slate-700">+91 98765 43210</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-8 space-y-2">
                        <ProfileNavItem active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Profile Settings" />
                        <ProfileNavItem active={activeTab === 'listings'} onClick={() => setActiveTab('listings')} icon={Briefcase} label="My Listings" />
                        <ProfileNavItem active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Shield} label="Account Security" />
                        <ProfileNavItem active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} icon={Clock} label="Recent Activity" />
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:w-2/3">
                    {activeTab === 'profile' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="border-none shadow-sm overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl">Personal Information</CardTitle>
                                            <CardDescription>Update your personal details and preferences</CardDescription>
                                        </div>
                                        {!editing ? (
                                            <Button variant="outline" className="rounded-xl" onClick={() => setEditing(true)}>
                                                <Edit3 className="w-4 h-4 mr-2" />
                                                Edit Profile
                                            </Button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Button variant="ghost" onClick={() => { setEditing(false); setFormData(user); }}>Cancel</Button>
                                                <Button variant="premium" className="px-6" onClick={handleSave}>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <ProfileInput label="Full Name" value={formData.full_name} disabled={!editing} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                                        <ProfileInput label="Email Address" value={formData.email} disabled={true} />
                                        <ProfileInput label="Phone Number" value="+91 98765 43210" disabled={!editing} />
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Primary Language</label>
                                            <select className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70 transition-all font-semibold text-slate-700" disabled={!editing}>
                                                <option>English</option>
                                                <option>Telugu</option>
                                                <option>Hindi</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Address / Region</label>
                                            <textarea className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70 transition-all font-semibold text-slate-700 h-32" disabled={!editing} defaultValue="Village Nandi, Wyra Road, Khammam District, Telangana - 507002" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === 'listings' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-slate-900">Your Listings</h3>
                                <Button variant="premium" className="rounded-2xl">
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    Add New Listing
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-500 text-xs uppercase tracking-widest pl-2">Lands</h4>
                                {listings.lands.map(land => (
                                    <ListingItem key={land.id} title={land.title} type="Land" status={land.status} price={`₹${land.rental_price.toLocaleString()}/yr`} details={`${land.total_area} ${land.area_unit}`} />
                                ))}

                                <h4 className="font-bold text-slate-500 text-xs uppercase tracking-widest pl-2 mt-8">Equipment</h4>
                                {listings.equipment.length === 0 ? (
                                    <div className="bg-slate-50 rounded-3xl p-12 text-center border border-dashed border-slate-200">
                                        <p className="text-slate-400 font-medium">No equipment listed yet.</p>
                                    </div>
                                ) : (
                                    listings.equipment.map(eq => (
                                        <ListingItem key={eq.id} title={eq.name} type="Equipment" status={eq.status} price={eq.hourly_rate} />
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProfileNavItem = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-left",
            active ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50"
        )}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
);

const ProfileInput = ({ label, value, disabled, onChange }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-70 transition-all font-semibold text-slate-700"
        />
    </div>
);

const ListingItem = ({ title, type, status, price, details }) => (
    <Card className="hover:shadow-md transition-shadow border-slate-100 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center p-4 gap-6">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl shrink-0 flex items-center justify-center">
                {type === 'Land' ? <MapPin className="text-primary w-8 h-8" /> : <Settings className="text-blue-500 w-8 h-8" />}
            </div>
            <div className="flex-grow text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                    <h5 className="font-bold text-slate-900 text-lg">{title}</h5>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
                        {status}
                    </span>
                </div>
                <p className="text-slate-500 text-sm">{details ? `${details} • ` : ''}{price}</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-xl border-slate-200">
                    <Edit3 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-xl border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-100">
                    <Trash2 className="w-4 h-4" />
                </Button>
                <Button size="icon" className="rounded-xl bg-slate-900 text-white">
                    <ExternalLink className="w-4 h-4" />
                </Button>
            </div>
        </div>
    </Card>
);

export default Profile;
