import React, { useState } from 'react';
import { 
    HelpCircle, 
    MessageSquare, 
    FileText, 
    Shield, 
    ChevronRight, 
    Phone, 
    Mail, 
    MapPin,
    Clock,
    Search,
    ExternalLink,
    MessageCircle,
    Bot,
    BookOpen,
    Users,
    AlertTriangle,
    CheckCircle,
    Send,
    X,
    Tractor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Support = () => {
    const [activeTab, setActiveTab] = useState('help');
    const [searchQuery, setSearchQuery] = useState('');
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    // Dummy data for FAQ
    const faqCategories = [
        {
            id: 'account',
            name: 'Account & Profile',
            icon: Users,
            faqs: [
                { q: 'How do I reset my password?', a: 'Go to Settings > Security > Reset Password. You will receive an email with reset instructions.' },
                { q: 'How do I update my profile information?', a: 'Navigate to Profile page and click Edit Profile to update your details.' },
                { q: 'How can I delete my account?', a: 'Go to Profile > Settings > Delete Account. Note: This action is irreversible.' },
                { q: 'Can I have multiple accounts?', a: 'No, each phone number/email can only be registered once. Multiple accounts violate our terms.' },
            ]
        },
        {
            id: 'land',
            name: 'Land & Booking',
            icon: MapPin,
            faqs: [
                { q: 'How do I list my land for lease?', a: 'Go to Lands > Add New Land. Fill in details like area, location, soil type, and expected rent.' },
                { q: 'What documents are required for land verification?', a: 'You need to upload FMP (Field Measurement Passbook), Aadhaar card, and land tax receipts.' },
                { q: 'How does the booking process work?', a: 'Browse lands > Select land > Book > Pay security deposit > Start farming. Owner confirms within 48 hours.' },
                { q: 'What is the security deposit refund policy?', a: 'Deposits are refunded within 7 days of lease end, after property verification.' },
            ]
        },
        {
            id: 'equipment',
            name: 'Equipment Rental',
            icon: Tractor,
            faqs: [
                { q: 'How do I rent equipment?', a: 'Browse Equipment category, select item, choose dates, and confirm booking. Payment is made on delivery.' },
                { q: 'What happens if equipment is damaged?', a: 'Damage charges will be deducted from your security deposit based on the assessment report.' },
                { q: 'Can I extend the rental period?', a: 'Yes, request extension before expiry. Subject to availability and additional charges.' },
            ]
        },
        {
            id: 'payments',
            name: 'Payments & Wallet',
            icon: Clock,
            faqs: [
                { q: 'What payment methods are accepted?', a: 'We accept UPI (Google Pay, PhonePe, Paytm), Debit/Credit cards, and Net Banking.' },
                { q: 'How do I get a refund?', a: 'Refunds are processed within 5-7 business days to your original payment method.' },
                { q: 'Where can I view my transaction history?', a: 'Go to Profile > My Bookings > Payment History for complete details.' },
            ]
        }
    ];

    // Dummy data for Help Articles
    const helpArticles = [
        { id: 1, title: 'Getting Started with AgriLink', category: 'Basics', readTime: '3 min', views: 12500 },
        { id: 2, title: 'How to List Your Land', category: 'Land Owners', readTime: '5 min', views: 8900 },
        { id: 3, title: 'Renting Equipment Guide', category: 'Equipment', readTime: '4 min', views: 7200 },
        { id: 4, title: 'Understanding Government Schemes', category: 'Advisory', readTime: '6 min', views: 15600 },
        { id: 5, title: 'Crop Calendar Setup', category: 'Planning', readTime: '4 min', views: 6100 },
        { id: 6, title: 'Weather Updates Explained', category: 'Weather', readTime: '3 min', views: 9800 },
    ];

    // Dummy data for Contact Options
    const contactOptions = [
        { 
            id: 'whatsapp', 
            title: 'WhatsApp Support', 
            description: 'Chat with us on WhatsApp',
            icon: MessageCircle,
            action: () => window.open('https://wa.me/919876543210', '_blank'),
            available: 'Available now',
            color: 'bg-green-500'
        },
        { 
            id: 'email', 
            title: 'Email Support', 
            description: 'Get response within 24 hours',
            icon: Mail,
            action: () => setShowContactForm(true),
            available: 'Response in 24h',
            color: 'bg-blue-500'
        },
        { 
            id: 'phone', 
            title: 'Phone Support', 
            description: 'Mon-Sat, 9AM-6PM',
            icon: Phone,
            action: () => window.open('tel:+919876543210', '_blank'),
            available: 'Available now',
            color: 'bg-purple-500'
        },
        { 
            id: 'community', 
            title: 'Community Forum', 
            description: 'Connect with other farmers',
            icon: Users,
            action: () => navigate('/messages'),
            available: 'Join discussion',
            color: 'bg-orange-500'
        },
    ];

    // Dummy data for Terms sections
    const termsSections = [
        { id: 'acceptance', title: '1. Acceptance of Terms', content: 'By accessing and using AgriLink, you accept and agree to be bound by the terms and provision of this agreement.' },
        { id: 'privacy', title: '2. Privacy Policy', content: 'We collect and process your personal data in accordance with our Privacy Policy. Your data is encrypted and stored securely.' },
        { id: 'accounts', title: '3. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials. All activities under your account are your responsibility.' },
        { id: 'land', title: '4. Land Listing Terms', content: 'Landowners must provide accurate information. False listings will be removed and accounts may be suspended.' },
        { id: 'payments', title: '5. Payment Terms', content: 'All payments are processed through secure gateways. AgriLink charges a 2% service fee on transactions.' },
        { id: 'liability', title: '6. Limitation of Liability', content: 'AgriLink is not liable for any disputes between users. We facilitate connections but do not guarantee outcomes.' },
    ];

    // Dummy data for Privacy sections
    const privacySections = [
        { id: 'collection', title: 'Data We Collect', content: 'We collect personal information (name, phone, email), location data, land details, payment information, and usage data to improve our services.' },
        { id: 'usage', title: 'How We Use Your Data', content: 'Your data is used to provide services, process payments, communicate with you, comply with legal obligations, and improve user experience.' },
        { id: 'sharing', title: 'Data Sharing', content: 'We share data with service providers, government agencies (for scheme verification), and other users as necessary for service delivery. We never sell your data.' },
        { id: 'security', title: 'Data Security', content: 'We implement industry-standard encryption (SSL/TLS), secure servers, and regular security audits to protect your data.' },
        { id: 'cookies', title: 'Cookies & Tracking', content: 'We use cookies to enhance your experience. You can disable cookies in your browser settings.' },
        { id: 'rights', title: 'Your Rights', content: 'You have the right to access, correct, delete your data, and opt-out of marketing communications.' },
    ];

    const handleSubmitContact = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setShowContactForm(false);
            setContactForm({ name: '', email: '', subject: '', message: '' });
            alert('Your message has been submitted! We will respond within 24 hours.');
        }, 1500);
    };

    const filteredFaqs = searchQuery 
        ? faqCategories.map(cat => ({
            ...cat,
            faqs: cat.faqs.filter(faq => 
                faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                faq.a.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(cat => cat.faqs.length > 0)
        : faqCategories;

    return (
        <div className="container mx-auto px-4 pb-20 page-transition">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-darkest via-primary to-emerald-600 p-8 md:p-12 mb-8">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">How can we help you?</h1>
                    <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Find answers, get support, and learn how to make the most of AgriLink</p>
                    
                    {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search for help..." 
                            className="w-full pl-12 pr-4 py-4 rounded-2xl text-base bg-white shadow-xl border-0 focus:ring-4 focus:ring-white/30"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {contactOptions.map((option) => (
                    <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={option.action}
                        className="bg-white p-6 rounded-2xl shadow-card border border-slate-200/40 hover:shadow-elevated transition-all text-left group"
                    >
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", option.color)}>
                            <option.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">{option.title}</h3>
                        <p className="text-xs text-slate-500">{option.available}</p>
                    </motion.button>
                ))}
            </div>

            {/* Main Tabs */}
            <div className="bg-white rounded-[2.5rem] shadow-card border border-slate-200/40 overflow-hidden">
                <div className="flex overflow-x-auto border-b border-slate-100">
                    {[
                        { id: 'help', label: 'Help Center', icon: HelpCircle },
                        { id: 'faq', label: 'FAQs', icon: MessageSquare },
                        { id: 'contact', label: 'Contact Us', icon: Phone },
                        { id: 'terms', label: 'Terms of Service', icon: FileText },
                        { id: 'privacy', label: 'Privacy Policy', icon: Shield },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2",
                                activeTab === tab.id 
                                    ? "text-primary border-primary bg-primary/5" 
                                    : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6 md:p-8">
                    {/* Help Center Tab */}
                    {activeTab === 'help' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Popular Help Articles</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {helpArticles.map((article) => (
                                    <motion.button
                                        key={article.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="p-5 rounded-2xl border border-slate-200 hover:border-primary/30 hover:shadow-lg transition-all text-left bg-white group"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">{article.category}</span>
                                            <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="font-bold text-slate-900 mb-2">{article.title}</h3>
                                        <p className="text-xs text-slate-400">{article.readTime} read • {article.views.toLocaleString()} views</p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* FAQ Tab */}
                    {activeTab === 'faq' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-6">
                                {filteredFaqs.map((category) => (
                                    <div key={category.id} className="bg-slate-50 rounded-2xl p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <category.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <h3 className="font-bold text-slate-900">{category.name}</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {category.faqs.map((faq, idx) => (
                                                <details key={idx} className="group bg-white rounded-xl overflow-hidden">
                                                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                                                        <span className="font-medium text-slate-800 text-sm">{faq.q}</span>
                                                        <ChevronRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition-transform" />
                                                    </summary>
                                                    <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                                                        {faq.a}
                                                    </div>
                                                </details>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Contact Tab */}
                    {activeTab === 'contact' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Get in Touch</h2>
                            
                            {!showContactForm ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-4">Contact Information</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Phone className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">Phone</p>
                                                    <p className="text-sm text-slate-600">+91 98765 43210</p>
                                                    <p className="text-xs text-slate-400">Mon-Sat, 9AM-6PM</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Mail className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">Email</p>
                                                    <p className="text-sm text-slate-600">support@agrilink.in</p>
                                                    <p className="text-xs text-slate-400">Response within 24 hours</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    <MapPin className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">Office Address</p>
                                                    <p className="text-sm text-slate-600">AgriLink Technologies Pvt Ltd</p>
                                                    <p className="text-xs text-slate-400">Hyderabad, Telangana 500001</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-slate-50 rounded-2xl p-6">
                                        <h3 className="font-bold text-slate-900 mb-4">Send us a Message</h3>
                                        <Button variant="premium" className="w-full h-14 rounded-xl" onClick={() => setShowContactForm(true)}>
                                            <MessageCircle className="w-5 h-5 mr-2" />
                                            Fill Contact Form
                                        </Button>
                                        <p className="text-xs text-slate-500 mt-4 text-center">We'll get back to you within 24 hours</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="max-w-2xl mx-auto">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold text-slate-900">Contact Form</h3>
                                        <button onClick={() => setShowContactForm(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                            <X className="w-5 h-5 text-slate-400" />
                                        </button>
                                    </div>
                                    
                                    {!submitted ? (
                                        <form onSubmit={handleSubmitContact} className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                                    <input 
                                                        type="text" 
                                                        required
                                                        className="input-modern w-full"
                                                        value={contactForm.name}
                                                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                                        placeholder="Your name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                                    <input 
                                                        type="email" 
                                                        required
                                                        className="input-modern w-full"
                                                        value={contactForm.email}
                                                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                                        placeholder="your@email.com"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                                <select 
                                                    required
                                                    className="input-modern w-full"
                                                    value={contactForm.subject}
                                                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                                                >
                                                    <option value="">Select a topic</option>
                                                    <option value="account">Account Issue</option>
                                                    <option value="land">Land Booking</option>
                                                    <option value="equipment">Equipment Rental</option>
                                                    <option value="payment">Payment Issue</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                                <textarea 
                                                    required
                                                    rows={5}
                                                    className="input-modern w-full resize-none"
                                                    value={contactForm.message}
                                                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                                    placeholder="Describe your issue in detail..."
                                                />
                                            </div>
                                            <Button type="submit" variant="premium" className="w-full h-14 rounded-xl">
                                                <Send className="w-5 h-5 mr-2" />
                                                Send Message
                                            </Button>
                                        </form>
                                    ) : (
                                        <div className="text-center py-12">
                                            <motion.div 
                                                initial={{ scale: 0 }} 
                                                animate={{ scale: 1 }}
                                                className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                            >
                                                <CheckCircle className="w-10 h-10 text-emerald-500" />
                                            </motion.div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                                            <p className="text-slate-600">We'll get back to you within 24 hours.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Terms Tab */}
                    {activeTab === 'terms' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Terms of Service</h2>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-600 mb-6">Last updated: January 2025</p>
                                <div className="space-y-6">
                                    {termsSections.map((section) => (
                                        <div key={section.id} className="bg-slate-50 rounded-2xl p-6">
                                            <h3 className="font-bold text-slate-900 mb-3">{section.title}</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed">{section.content}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold text-amber-800">Important Notice</p>
                                            <p className="text-sm text-amber-700">By using AgriLink, you agree to these terms. Please read them carefully before using the platform.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Privacy Policy</h2>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-600 mb-6">Last updated: January 2025</p>
                                <div className="space-y-6">
                                    {privacySections.map((section) => (
                                        <div key={section.id} className="bg-slate-50 rounded-2xl p-6">
                                            <h3 className="font-bold text-slate-900 mb-3">{section.title}</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed">{section.content}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold text-emerald-800">Your Data is Secure</p>
                                            <p className="text-sm text-emerald-700">We use industry-standard security measures to protect your personal information. Your trust is our priority.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Support;

