import React, { useState, useEffect } from 'react';
import {
    Search,
    Send,
    MoreVertical,
    User,
    CheckCheck,
    Circle,
    Phone,
    Video,
    Info,
    ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        // Mock conversations
        setConversations(mockConversations);
        setActiveChat(mockConversations[0]);
        setMessages(mockMessages);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMsg = {
            id: Date.now(),
            sender: 'me',
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
        };

        setMessages([...messages, newMsg]);
        setMessage('');
    };

    const mockConversations = [
        { id: 1, name: 'Raghav Kumar', role: 'Tractor Driver', image: 'https://images.unsplash.com/photo-1540560522866-da2270928e4a?w=100', lastMessage: 'Okay, I will reach by 7 AM tomorrow.', time: '10:45 AM', unread: 2, online: true },
        { id: 2, name: 'Suresh Rao', role: 'Landowner', image: 'https://ui-avatars.com/api/?name=SR&background=059669&color=fff', lastMessage: 'The borewell is working fine now.', time: 'Yesterday', unread: 0, online: false },
        { id: 3, name: 'AgriRental Hub', role: 'Equipment Provider', image: 'https://ui-avatars.com/api/?name=AH&background=0284c7&color=fff', lastMessage: 'Your booking for the harvester is confirmed.', time: 'Monday', unread: 0, online: true },
    ];

    const mockMessages = [
        { id: 1, sender: 'them', content: 'Hello, I saw your request for land leasing.', timestamp: '09:00 AM', read: true },
        { id: 2, sender: 'me', content: 'Hi! Yes, I am interested in the 5-acre plot in Khammam.', timestamp: '09:15 AM', read: true },
        { id: 3, sender: 'them', content: 'Great. The soil is recently tilled and ready for sowing.', timestamp: '10:30 AM', read: true },
        { id: 4, sender: 'them', content: 'Okay, I will reach by 7 AM tomorrow.', timestamp: '10:45 AM', read: false },
    ];

    return (
        <div className="container mx-auto px-4 pb-20">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row h-[700px]">

                {/* Conversations List */}
                <div className="w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col">
                    <div className="p-6 border-b border-slate-50">
                        <h2 className="text-2xl font-black text-slate-900 mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium" />
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto overflow-x-hidden p-2 space-y-1">
                        {conversations.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setActiveChat(chat)}
                                className={cn(
                                    "w-full p-4 rounded-3xl flex items-center gap-4 transition-all relative group",
                                    activeChat?.id === chat.id ? "bg-primary/10" : "hover:bg-slate-50"
                                )}
                            >
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                                        <img src={chat.image} className="w-full h-full object-cover" />
                                    </div>
                                    {chat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>}
                                </div>

                                <div className="flex-grow text-left">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h4 className="font-bold text-slate-900 text-sm">{chat.name}</h4>
                                        <span className="text-[10px] text-slate-400 font-bold">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate w-40">{chat.lastMessage}</p>
                                </div>

                                {chat.unread > 0 && (
                                    <div className="bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                                        {chat.unread}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-grow flex flex-col bg-slate-50/30">
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button className="md:hidden p-2 text-slate-400" onClick={() => setActiveChat(null)}>
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative">
                                        <img src={activeChat.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 leading-none mb-1">{activeChat.name}</h3>
                                        <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                            {activeChat.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="rounded-xl text-slate-400"><Phone className="w-5 h-5" /></Button>
                                    <Button variant="ghost" size="icon" className="rounded-xl text-slate-400"><Video className="w-5 h-5" /></Button>
                                    <Button variant="ghost" size="icon" className="rounded-xl text-slate-400"><Info className="w-5 h-5" /></Button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-grow overflow-y-auto p-6 space-y-4">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={cn("flex", msg.sender === 'me' ? "justify-end" : "justify-start")}>
                                        <div className={cn(
                                            "max-w-[70%] p-4 rounded-3xl relative shadow-sm",
                                            msg.sender === 'me'
                                                ? "bg-primary text-white rounded-tr-none"
                                                : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                                        )}>
                                            <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                            <div className={cn(
                                                "flex items-center gap-1 mt-2 text-[10px] font-bold",
                                                msg.sender === 'me' ? "text-white/70 justify-end" : "text-slate-400"
                                            )}>
                                                {msg.timestamp}
                                                {msg.sender === 'me' && <CheckCheck className="w-3 h-3" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100">
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Type your message here..."
                                        className="flex-grow bg-slate-50 border-none outline-none p-4 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <Button type="submit" className="bg-primary hover:bg-primary-dark text-white rounded-2xl px-6 h-14 shadow-lg shadow-primary/20">
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
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Your Conversations</h3>
                            <p className="text-slate-500 max-w-sm">Select a contact from the list to start chatting with landowners, farmers, or providers.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

const MessageCircle = ({ className }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    );
};

export default Messages;
