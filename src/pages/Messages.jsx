import React, { useState, useEffect } from 'react';
import {
    Search, Send, MoreVertical, User, CheckCheck, Circle,
    Phone, Video, Info, ChevronLeft, X, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const { toasts, toast } = useToast();

    useEffect(() => {
        setConversations(mockConversations);
        setActiveChat(mockConversations[0]);
        setMessages(mockMessages);
    }, []);

    const mockConversations = [
        { id: 1, name: 'Raghav Kumar', role: 'Tractor Driver', image: 'https://images.unsplash.com/photo-1540560522866-da2270928e4a?w=100', lastMessage: 'Okay, I will reach by 7 AM tomorrow.', time: '10:45 AM', unread: 2, online: true, phone: '+91 98765 43210', district: 'Khammam' },
        { id: 2, name: 'Suresh Rao', role: 'Landowner', image: 'https://ui-avatars.com/api/?name=SR&background=059669&color=fff', lastMessage: 'The borewell is working fine now.', time: 'Yesterday', unread: 0, online: false, phone: '+91 87654 32109', district: 'Guntur' },
        { id: 3, name: 'AgriRental Hub', role: 'Equipment Provider', image: 'https://ui-avatars.com/api/?name=AH&background=0284c7&color=fff', lastMessage: 'Your booking for the harvester is confirmed.', time: 'Monday', unread: 0, online: true, phone: '+91 76543 21098', district: 'Hyderabad' },
    ];

    const mockMessages = [
        { id: 1, sender: 'them', content: 'Hello, I saw your request for land leasing.', timestamp: '09:00 AM', read: true },
        { id: 2, sender: 'me', content: 'Hi! Yes, I am interested in the 5-acre plot in Khammam.', timestamp: '09:15 AM', read: true },
        { id: 3, sender: 'them', content: 'Great. The soil is recently tilled and ready for sowing.', timestamp: '10:30 AM', read: true },
        { id: 4, sender: 'them', content: 'Okay, I will reach by 7 AM tomorrow.', timestamp: '10:45 AM', read: false },
    ];

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        const newMsg = {
            id: Date.now(), sender: 'me', content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false
        };
        setMessages([...messages, newMsg]);
        setMessage('');
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1, sender: 'them',
                content: 'Got it! I will get back to you shortly.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false
            }]);
        }, 1500);
    };

    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            <div className="bg-white rounded-[2.5rem] shadow-elevated border border-slate-200/40 overflow-hidden flex flex-col md:flex-row h-[700px]">
                {/* Conversations List */}
                <div className="w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col bg-white">
                    <div className="p-6 border-b border-slate-100/80">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search chats..."
                                className="input-modern w-full pl-10 pr-4 py-3 text-sm"
                                value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto overflow-x-hidden p-2 space-y-1">
                        {filteredConversations.map((chat) => (
                            <button key={chat.id} onClick={() => { setActiveChat(chat); setShowInfo(false); }}
                                className={cn("w-full p-4 rounded-2xl flex items-center gap-4 transition-all relative group",
                                    activeChat?.id === chat.id ? "bg-primary/8 border border-primary/15" : "hover:bg-slate-50 border border-transparent")}>
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                                        <img src={chat.image} className="w-full h-full object-cover" />
                                    </div>
                                    {chat.online && <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>}
                                </div>
                                <div className="flex-grow text-left min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h4 className="font-bold text-slate-900 text-sm">{chat.name}</h4>
                                        <span className="text-[10px] text-slate-400 font-bold shrink-0 ml-2">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 animate-pulse">
                                        {chat.unread}
                                    </div>
                                )}
                            </button>
                        ))}
                        {filteredConversations.length === 0 && (
                            <p className="text-center text-slate-400 text-sm py-8">No conversations found</p>
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-grow flex flex-col bg-slate-50/40">
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-5 bg-white/95 backdrop-blur-lg border-b border-slate-100/80 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button className="md:hidden p-2 text-slate-400" onClick={() => setActiveChat(null)}>
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-100 shadow-sm relative avatar-glow">
                                        <img src={activeChat.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-slate-900 leading-none mb-1 text-sm">{activeChat.name}</h3>
                                        <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", activeChat.online ? "bg-emerald-500" : "bg-slate-300")}></div>
                                            {activeChat.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1.5">
                                    <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                                        onClick={() => toast(`📞 Calling ${activeChat.name}…`)}>
                                        <Phone className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-purple-500 hover:bg-purple-50"
                                        onClick={() => toast(`🎥 Starting video call with ${activeChat.name}…`)}>
                                        <Video className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className={cn("rounded-xl transition-all", showInfo ? "bg-primary/10 text-primary" : "text-slate-400")}
                                        onClick={() => setShowInfo(!showInfo)}>
                                        <Info className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-grow overflow-hidden">
                                {/* Messages Area */}
                                <div className="flex-grow overflow-y-auto p-6 space-y-4">
                                    {messages.map((msg, index) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className={cn("flex", msg.sender === 'me' ? "justify-end" : "justify-start")}
                                        >
                                            <div className={cn("max-w-[70%] p-4 rounded-3xl relative shadow-sm transition-shadow hover:shadow-md",
                                                msg.sender === 'me'
                                                    ? "bg-gradient-to-br from-primary to-primary-dark text-white rounded-tr-lg"
                                                    : "bg-white text-slate-700 rounded-tl-lg border border-slate-100")}>
                                                <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                                <div className={cn("flex items-center gap-1 mt-2 text-[10px] font-bold",
                                                    msg.sender === 'me' ? "text-white/60 justify-end" : "text-slate-400")}>
                                                    {msg.timestamp}
                                                    {msg.sender === 'me' && <CheckCheck className="w-3 h-3" />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Info Panel */}
                                <AnimatePresence>
                                    {showInfo && (
                                        <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 220, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
                                            className="bg-white border-l border-slate-100 overflow-hidden flex-shrink-0">
                                            <div className="p-5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-extrabold text-slate-900 text-sm">Contact Info</h4>
                                                    <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-50 transition-colors"><X className="w-4 h-4" /></button>
                                                </div>
                                                <img src={activeChat.image} className="w-16 h-16 rounded-2xl mx-auto mb-3 object-cover avatar-glow" />
                                                <p className="font-extrabold text-slate-900 text-center text-sm mb-1">{activeChat.name}</p>
                                                <p className="text-xs text-primary font-bold text-center mb-4">{activeChat.role}</p>
                                                <div className="space-y-3 text-xs text-slate-600">
                                                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                                        <Phone className="w-3 h-3 text-slate-400" />
                                                        <span className="font-medium">{activeChat.phone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                                        <Circle className={cn("w-3 h-3", activeChat.online ? "text-emerald-500 fill-emerald-500" : "text-slate-300 fill-slate-300")} />
                                                        <span className="font-medium">{activeChat.online ? 'Online now' : 'Last seen yesterday'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-5 bg-white/95 backdrop-blur-lg border-t border-slate-100/80">
                                <div className="flex gap-3">
                                    <input type="text" placeholder="Type your message here..."
                                        className="input-modern flex-grow py-3.5 pl-4 pr-4 text-sm"
                                        value={message} onChange={(e) => setMessage(e.target.value)} />
                                    <Button type="submit" className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl px-6 h-13 shadow-lg shadow-primary/20 hover:shadow-xl transition-shadow">
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
                            <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mb-6 text-slate-200">
                                <MessageCircle className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Your Conversations</h3>
                            <p className="text-slate-500 max-w-sm">Select a contact from the list to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
