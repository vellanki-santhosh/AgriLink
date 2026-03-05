import React, { useState, useEffect } from 'react';
import {
    User, Mail, MapPin, Phone, Briefcase, Edit3, Camera, Save,
    Trash2, Plus, Settings, Shield, Clock, ExternalLink, PlusCircle, X, Check, Copy, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const toast = (msg) => {
        const id = Date.now();
        setToasts(t => [...t, { id, msg }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
    };
    return { toasts, toast };
};

const Profile = () => {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [listings, setListings] = useState({ lands: [], equipment: [] });
    const [activeTab, setActiveTab] = useState('profile');
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [editingListing, setEditingListing] = useState(null);
    const { toasts, toast } = useToast();

    useEffect(() => { loadUser(); }, []);

    const loadUser = async () => {
        try {
            const u = await base44.auth.me();
            setUser(u);
            setFormData(u);
            const userLands = await base44.entities.Land.filter({ owner_email: u.email }, "-created_date", 20);
            const userEquip = await base44.entities.Equipment.filter({ owner_email: u.email }, "-created_date", 20);
            setListings({
                lands: userLands.length > 0 ? userLands : mockUserLands,
                equipment: userEquip.length > 0 ? userEquip : []
            });
        } catch (e) {
            setUser({ full_name: 'Farmer User', email: 'farmer@agrilink.in', role: 'Farmer' });
            setFormData({ full_name: 'Farmer User', email: 'farmer@agrilink.in', role: 'Farmer' });
            setListings({ lands: mockUserLands, equipment: [] });
        }
    };

    const mockUserLands = [
        { id: 'l1', title: 'Ancestral Farm Land', land_type: 'Black', total_area: 8, area_unit: 'Acres', status: 'Available', rental_price: 30000 },
    ];

    const handleSave = async () => { setUser(formData); setEditing(false); toast('Profile updated successfully!'); };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const { url } = await base44.integrations.Core.UploadFile(file);
            setFormData({ ...formData, profile_image: url });
        } catch (e) { console.error("Upload failed", e); }
    };

    const handleShare = (listing) => {
        const url = `${window.location.origin}/lands?id=${listing.id}`;
        navigator.clipboard.writeText(url).then(() => toast('📋 Listing link copied to clipboard!')).catch(() => toast('📋 Link: ' + url));
    };

    const handleDeleteListing = (id) => {
        setListings(prev => ({ ...prev, lands: prev.lands.filter(l => l.id !== id) }));
        setDeleteId(null);
        toast('Listing removed successfully.');
    };

    const handleAddListing = (newListing) => {
        setListings(prev => ({ ...prev, lands: [...prev.lands, { ...newListing, id: `l${Date.now()}`, status: 'Available' }] }));
        setShowAddModal(false);
        toast('New listing added!');
    };

    const handleSaveListing = (updated) => {
        setListings(prev => ({ ...prev, lands: prev.lands.map(l => l.id === updated.id ? updated : l) }));
        setEditingListing(null);
        toast('Listing updated!');
    };

    if (!user) return <div className="p-20 text-center page-transition"><div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div></div>;

    return (
        <div className="container mx-auto px-4 pb-20 page-transition">
            {/* Toasts */}
            <div className="fixed top-24 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div key={t.id} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
                            className="px-5 py-3 rounded-2xl shadow-xl text-sm font-bold bg-slate-900 text-white">
                            {t.msg}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar */}
                <div className="lg:w-1/3">
                    <Card className="overflow-hidden border border-slate-200/40 shadow-elevated rounded-[2.5rem]">
                        <div className="h-32 bg-gradient-to-br from-primary via-primary-dark to-primary-darkest w-full relative">
                            {/* Dot pattern */}
                            <div className="absolute inset-0 opacity-[0.06]"
                                style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                            <button className="absolute top-4 right-4 p-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-white backdrop-blur-sm transition-all border border-white/10" onClick={() => setEditing(!editing)}>
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>
                        <CardContent className="px-8 pb-8 -mt-16 text-center">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center avatar-glow">
                                    {formData.profile_image ? <img src={formData.profile_image} className="w-full h-full object-cover" /> : <User className="w-16 h-16 text-slate-300" />}
                                </div>
                                {editing && (
                                    <label className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-2xl shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform">
                                        <Camera className="w-4 h-4" />
                                        <input type="file" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                )}
                            </div>
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{user.full_name || 'Farmer'}</h2>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.1), rgba(16,185,129,0.06))', border: '1px solid rgba(5,150,105,0.2)' }}>
                                <Shield className="w-3 h-3 text-primary" />
                                <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Verified {user.role || 'Farmer'}</span>
                            </div>
                            <div className="space-y-3 text-left">
                                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400"><Mail className="w-5 h-5" /></div>
                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email</span>
                                        <span className="font-semibold text-slate-700 text-sm">{user.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400"><Phone className="w-5 h-5" /></div>
                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Phone</span>
                                        <span className="font-semibold text-slate-700 text-sm">+91 98765 43210</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 space-y-1.5">
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
                            <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6 px-8 pt-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl font-extrabold">Personal Information</CardTitle>
                                            <CardDescription>Update your personal details and preferences</CardDescription>
                                        </div>
                                        {!editing ? (
                                            <Button variant="outline" className="rounded-xl" onClick={() => setEditing(true)}>
                                                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                                            </Button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Button variant="ghost" onClick={() => { setEditing(false); setFormData(user); }}>Cancel</Button>
                                                <Button variant="premium" className="px-6" onClick={handleSave}>
                                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ProfileInput label="Full Name" value={formData.full_name || ''} disabled={!editing} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                                        <ProfileInput label="Email Address" value={formData.email || ''} disabled={true} />
                                        <ProfileInput label="Phone Number" value="+91 98765 43210" disabled={!editing} />
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Language</label>
                                            <select className="input-modern w-full pl-4 disabled:opacity-70" disabled={!editing}>
                                                <option>English</option><option>Telugu</option><option>Hindi</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address / Region</label>
                                            <textarea className="input-modern w-full pl-4 h-32 resize-none" disabled={!editing} defaultValue="Village Nandi, Wyra Road, Khammam District, Telangana - 507002" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === 'listings' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-extrabold text-slate-900">Your Listings</h3>
                                <Button variant="premium" className="rounded-2xl" onClick={() => setShowAddModal(true)}>
                                    <PlusCircle className="w-4 h-4 mr-2" /> Add New Listing
                                </Button>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-500 text-xs uppercase tracking-widest pl-2">Lands</h4>
                                {listings.lands.map(land => (
                                    <ListingItem key={land.id} title={land.title} type="Land" status={land.status}
                                        price={`₹${land.rental_price.toLocaleString()}/yr`} details={`${land.total_area} ${land.area_unit}`}
                                        onEdit={() => setEditingListing(land)} onDelete={() => setDeleteId(land.id)} onShare={() => handleShare(land)} />
                                ))}
                                {listings.lands.length === 0 && (
                                    <div className="bg-slate-50 rounded-3xl p-8 text-center border border-dashed border-slate-200"><p className="text-slate-400 font-medium">No land listings yet.</p></div>
                                )}
                                <h4 className="font-bold text-slate-500 text-xs uppercase tracking-widest pl-2 mt-8">Equipment</h4>
                                {listings.equipment.length === 0 ? (
                                    <div className="bg-slate-50 rounded-3xl p-12 text-center border border-dashed border-slate-200"><p className="text-slate-400 font-medium">No equipment listed yet.</p></div>
                                ) : listings.equipment.map(eq => (
                                    <ListingItem key={eq.id} title={eq.name} type="Equipment" status={eq.status} price={eq.hourly_rate}
                                        onEdit={() => { }} onDelete={() => { }} onShare={() => handleShare(eq)} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 pt-8">
                                    <CardTitle className="text-xl font-extrabold">Account Security</CardTitle>
                                    <CardDescription>Manage your password and two-factor authentication</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 space-y-5">
                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                        <div>
                                            <p className="font-bold text-slate-900 mb-1">Password</p>
                                            <p className="text-sm text-slate-500">Last changed 30 days ago</p>
                                        </div>
                                        <Button variant="outline" className="rounded-xl" onClick={() => toast('Password reset email sent!')}>Change Password</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                        <div>
                                            <p className="font-bold text-slate-900 mb-1">Two-Factor Authentication</p>
                                            <p className="text-sm text-slate-500">Add extra security with OTP verification</p>
                                        </div>
                                        <Button variant="premium" className="rounded-xl" onClick={() => toast('2FA setup email sent!')}>Enable 2FA</Button>
                                    </div>
                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-rose-50/80 border border-rose-100">
                                        <div>
                                            <p className="font-bold text-rose-700 mb-1">Delete Account</p>
                                            <p className="text-sm text-rose-400">This action is permanent and cannot be undone</p>
                                        </div>
                                        <Button variant="outline" className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => toast('Please contact support to delete your account.')}>Request Deletion</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === 'activity' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="border border-slate-200/40 shadow-card rounded-[2rem] overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 pt-8">
                                    <CardTitle className="text-xl font-extrabold">Recent Activity</CardTitle>
                                    <CardDescription>A log of your recent actions on AgriLink</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="space-y-3">
                                        {[
                                            { action: 'Viewed land listing: Fertile Black Soil Land', time: '2 hours ago', icon: MapPin },
                                            { action: 'Sent booking request for John Deere Tractor', time: 'Yesterday at 3:15 PM', icon: Briefcase },
                                            { action: 'Messaged Raghav Kumar (Tractor Driver)', time: 'Yesterday at 10:45 AM', icon: User },
                                            { action: 'Updated profile information', time: '3 days ago', icon: Edit3 },
                                            { action: 'Listed Ancestral Farm Land for rent', time: '5 days ago', icon: Plus },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                                                    <item.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 text-sm">{item.action}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation */}
            <AnimatePresence>
                {deleteId && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="relative bg-white w-full max-w-sm rounded-[2rem] shadow-2xl p-8 z-10">
                            <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 text-center mb-2">Remove Listing?</h3>
                            <p className="text-slate-500 text-center text-sm mb-8">This will remove the listing from the marketplace. This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <Button variant="ghost" className="flex-1 rounded-2xl" onClick={() => setDeleteId(null)}>Cancel</Button>
                                <Button className="flex-1 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white" onClick={() => handleDeleteListing(deleteId)}>Remove</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Listing Modal */}
            <AnimatePresence>
                {editingListing && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setEditingListing(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 z-10">
                            <button onClick={() => setEditingListing(null)} className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5 text-slate-500" /></button>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-6">Edit Listing</h3>
                            <div className="space-y-4">
                                <ProfileInput label="Title" value={editingListing.title} disabled={false} onChange={e => setEditingListing({ ...editingListing, title: e.target.value })} />
                                <ProfileInput label="Rental Price (₹/yr)" value={String(editingListing.rental_price)} disabled={false} onChange={e => setEditingListing({ ...editingListing, rental_price: Number(e.target.value) || 0 })} />
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                                    <select value={editingListing.status} onChange={e => setEditingListing({ ...editingListing, status: e.target.value })}
                                        className="input-modern w-full pl-4">
                                        <option>Available</option><option>Rented</option><option>Maintenance</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <Button variant="ghost" className="flex-1 rounded-2xl" onClick={() => setEditingListing(null)}>Cancel</Button>
                                <Button variant="premium" className="flex-1 rounded-2xl" onClick={() => handleSaveListing(editingListing)}>Save Changes</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Listing Modal */}
            <AnimatePresence>
                {showAddModal && <AddListingModal onClose={() => setShowAddModal(false)} onAdd={handleAddListing} />}
            </AnimatePresence>
        </div>
    );
};

const AddListingModal = ({ onClose, onAdd }) => {
    const [form, setForm] = useState({ title: '', land_type: 'Black', total_area: '', area_unit: 'Acres', rental_price: '' });
    const handleSubmit = () => {
        if (!form.title || !form.rental_price || !form.total_area) return;
        onAdd({ ...form, rental_price: Number(form.rental_price), total_area: Number(form.total_area) });
    };
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 z-10">
                <button onClick={onClose} className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-xl"><X className="w-5 h-5 text-slate-500" /></button>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-6">Add New Listing</h3>
                <div className="space-y-4">
                    <ProfileInput label="Title" value={form.title} disabled={false} onChange={e => setForm({ ...form, title: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <ProfileInput label="Area" value={form.total_area} disabled={false} onChange={e => setForm({ ...form, total_area: e.target.value })} />
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unit</label>
                            <select value={form.area_unit} onChange={e => setForm({ ...form, area_unit: e.target.value })}
                                className="input-modern w-full pl-4">
                                <option>Acres</option><option>Hectares</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Soil Type</label>
                        <select value={form.land_type} onChange={e => setForm({ ...form, land_type: e.target.value })}
                            className="input-modern w-full pl-4">
                            <option>Black</option><option>Red</option><option>Wet</option><option>Dry</option>
                        </select>
                    </div>
                    <ProfileInput label="Rental Price (₹/yr)" value={form.rental_price} disabled={false} onChange={e => setForm({ ...form, rental_price: e.target.value })} />
                </div>
                <div className="flex gap-3 mt-8">
                    <Button variant="ghost" className="flex-1 rounded-2xl" onClick={onClose}>Cancel</Button>
                    <Button variant="premium" className="flex-1 rounded-2xl" onClick={handleSubmit}>Add Listing</Button>
                </div>
            </motion.div>
        </div>
    );
};

const ProfileNavItem = ({ active, onClick, icon: Icon, label }) => (
    <button onClick={onClick} className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-left relative overflow-hidden",
        active ? "bg-primary/8 text-primary border border-primary/15" : "text-slate-500 hover:bg-slate-50 border border-transparent"
    )}>
        {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />}
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
);

const ProfileInput = ({ label, value, disabled, onChange }) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
        <input type="text" value={value || ''} onChange={onChange} disabled={disabled}
            className="input-modern w-full pl-4 disabled:opacity-60" />
    </div>
);

const ListingItem = ({ title, type, status, price, details, onEdit, onDelete, onShare }) => (
    <Card className="hover:shadow-md transition-shadow border-slate-200/40 overflow-hidden rounded-2xl">
        <div className="flex flex-col md:flex-row items-center p-5 gap-5">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl shrink-0 flex items-center justify-center border border-slate-100">
                {type === 'Land' ? <MapPin className="text-primary w-7 h-7" /> : <Settings className="text-blue-500 w-7 h-7" />}
            </div>
            <div className="flex-grow text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                    <h5 className="font-bold text-slate-900 text-lg">{title}</h5>
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100')}>
                        {status}
                    </span>
                </div>
                <p className="text-slate-500 text-sm">{details ? `${details} • ` : ''}{price}</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-xl border-slate-200" title="Edit listing" onClick={onEdit}><Edit3 className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" className="rounded-xl border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-100" title="Remove listing" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
                <Button size="icon" className="rounded-xl bg-slate-900 text-white hover:bg-slate-800" title="Copy listing link" onClick={onShare}><ExternalLink className="w-4 h-4" /></Button>
            </div>
        </div>
    </Card>
);

export default Profile;
