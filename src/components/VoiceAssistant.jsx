import React, { useState, useEffect, useRef } from 'react';
import { 
    Mic, 
    MicOff, 
    Volume2, 
    VolumeX, 
    X, 
    Send, 
    Loader2,
    Sparkles,
    Bot,
    MapPin,
    CloudSun,
    Sprout,
    Tractor,
    Calendar,
    TrendingUp,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Voice Assistant Component
const VoiceAssistant = ({ isOpen, onClose }) => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [textMode, setTextMode] = useState(false);
    const recognitionRef = useRef(null);
    const synthRef = useRef(null);
    const messagesEndRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Initialize Speech Recognition
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onresult = (event) => {
                    const current = event.resultIndex;
                    const result = event.results[current]
                    const transcriptText = result[0].transcript;
                    setTranscript(transcriptText);
                    
                    if (result.isFinal) {
                        handleVoiceInput(transcriptText);
                    }
                };

                recognitionRef.current.onerror = (event) => {
                    setError('Voice recognition error. Please try again.');
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }

            // Initialize Speech Synthesis
            synthRef.current = window.speechSynthesis;
        }

        // Add welcome message
        setMessages([{
            id: 1,
            role: 'assistant',
            content: "Namaste! I'm your AgriLink Voice Assistant. I can help you with farming advice, weather updates, crop recommendations, market prices, and more. Just ask me!",
            timestamp: new Date()
        }]);

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
    }, []);

    useEffect(() => {
        // Scroll to bottom when messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const startListening = () => {
        setError('');
        if (recognitionRef.current) {
            setTranscript('');
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                setError('Could not start voice recognition. Please try again.');
            }
        } else {
            setError('Voice recognition is not supported in your browser.');
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const speak = (text) => {
        if (synthRef.current) {
            synthRef.current.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            
            synthRef.current.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    const handleVoiceInput = async (text) => {
        if (!text.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: text,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setTranscript('');

        // Process the input and generate response
        await generateResponse(text);
    };

    const generateResponse = async (input) => {
        setIsLoading(true);
        
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = generateAIResponse(input);
        
        // Add assistant message
        const assistantMessage = {
            id: Date.now() + 1,
            role: 'assistant',
            content: response.text,
            suggestions: response.suggestions,
            actions: response.actions,
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);

        // Speak the response
        speak(response.text);
    };

    const generateAIResponse = (input) => {
        const inputLower = input.toLowerCase();
        
        // Weather related queries
        if (inputLower.includes('weather') || inputLower.includes('rain') || inputLower.includes('temperature')) {
            return {
                text: "Based on current weather data, expect moderate rainfall this week. Ideal for paddy cultivation. Temperature ranges from 24°C to 32°C with 65% humidity. Don't forget to check soil moisture before irrigation.",
                suggestions: ["Check 7-day forecast", "Weather-based irrigation advice"],
                actions: [
                    { label: 'View Weather', icon: CloudSun, action: () => navigate('/dashboard') },
                    { label: 'Crop Calendar', icon: Calendar, action: () => navigate('/calendar') }
                ]
            };
        }

        // Crop related queries
        if (inputLower.includes('crop') || inputLower.includes('plant') || inputLower.includes('sow') || inputLower.includes('paddy') || inputLower.includes('cotton')) {
            return {
                text: "For this season, I recommend paddy if you have access to irrigation. For rain-fed areas, consider cotton or maize. The optimal sowing time for paddy is June-July. Make sure to use certified seeds for better yield.",
                suggestions: ["Paddy cultivation guide", "Cotton farming tips", "View Crop Calendar"],
                actions: [
                    { label: 'Crop Calendar', icon: Calendar, action: () => navigate('/calendar') },
                    { label: 'AI Advisor', icon: Sparkles, action: () => navigate('/dashboard') }
                ]
            };
        }

        // Market prices
        if (inputLower.includes('price') || inputLower.includes('market') || inputLower.includes('sell') || inputLower.includes('rate')) {
            return {
                text: "Today's market prices: Paddy ₹2,183 per quintal, Cotton ₹7,020 per quintal, Wheat ₹2,275 per quintal, Maize ₹1,960 per quintal. Prices are expected to remain stable this week.",
                suggestions: ["Detailed market prices", "Sell your produce"],
                actions: [
                    { label: 'Market Prices', icon: TrendingUp, action: () => navigate('/dashboard') },
                    { label: 'Transport', icon: Tractor, action: () => navigate('/transport') }
                ]
            };
        }

        // Land/Rent queries
        if (inputLower.includes('land') || inputLower.includes('rent') || inputLower.includes('lease')) {
            return {
                text: "We have 150+ verified land listings available. Most popular are black soil farms in Telangana and Andhra Pradesh. Average rental price is ₹25,000-45,000 per acre per year.",
                suggestions: ["Browse Lands", "List Your Land"],
                actions: [
                    { label: 'View Lands', icon: MapPin, action: () => navigate('/lands') },
                    { label: 'Add Listing', icon: Sprout, action: () => navigate('/profile') }
                ]
            };
        }

        // Equipment queries
        if (inputLower.includes('tractor') || inputLower.includes('equipment') || inputLower.includes('machine') || inputLower.includes('rent')) {
            return {
                text: "We have tractors, harvesters, and drones available for rent. John Deere 5310 is available at ₹800/hour. Combine harvesters at ₹2,500/hour. Would you like to book one?",
                suggestions: ["Tractors", "Harvesters", "Drones"],
                actions: [
                    { label: 'Equipment', icon: Tractor, action: () => navigate('/equipment') }
                ]
            };
        }

        // Worker/Labor queries
        if (inputLower.includes('worker') || inputLower.includes('labor') || inputLower.includes('hire') || inputLower.includes('driver')) {
            return {
                text: "We have 200+ verified skilled workers available. Tractor drivers start at ₹600/day, irrigation specialists at ₹450/day. Average rating is 4.7 stars.",
                suggestions: ["Hire Worker", "Post a Job"],
                actions: [
                    { label: 'Find Workers', icon: Sprout, action: () => navigate('/workers') }
                ]
            };
        }

        // Help/Navigation
        if (inputLower.includes('help') || inputLower.includes('what can you do')) {
            return {
                text: "I can help you with: Weather updates and forecasts, Crop recommendations and farming advice, Market prices for your produce, Renting land or equipment, Hiring skilled workers, Booking transport, and General farming guidance. Just ask!",
                suggestions: ["How to use app", "Contact support"],
                actions: [
                    { label: 'Dashboard', icon: Sparkles, action: () => navigate('/dashboard') },
                    { label: 'Help', icon: Bot, action: () => alert('Help Center Coming Soon!') }
                ]
            };
        }

        // Default response
        return {
            text: "I understand you're asking about '" + input + "'. For specific farming advice, I recommend visiting our Dashboard for AI-powered recommendations. You can also check the Crop Calendar for seasonal guidance or browse our marketplace for equipment and workers.",
            suggestions: ["Go to Dashboard", "View Crop Calendar", "Browse Lands"],
            actions: [
                { label: 'Dashboard', icon: Sparkles, action: () => navigate('/dashboard') },
                { label: 'Lands', icon: MapPin, action: () => navigate('/lands') },
                { label: 'Equipment', icon: Tractor, action: () => navigate('/equipment') }
            ]
        };
    };

    const handleSendText = (e) => {
        e.preventDefault();
        if (transcript.trim()) {
            handleVoiceInput(transcript);
        }
    };

    const quickActions = [
        { label: 'Weather', icon: CloudSun, query: 'weather update' },
        { label: 'Crops', icon: Sprout, query: 'crop recommendations' },
        { label: 'Prices', icon: TrendingUp, query: 'market prices' },
        { label: 'Lands', icon: MapPin, query: 'land for rent' },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 md:p-4">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Assistant Panel */}
            <motion.div 
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.9 }}
                className="relative w-full md:w-[420px] md:max-h-[80vh] bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="premium-gradient p-4 md:p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">AgriVoice Assistant</h3>
                                <p className="text-xs text-white/70">AI-Powered Farming Advisor</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setTextMode(!textMode)}
                                className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                                title="Text Mode"
                            >
                                {textMode ? <Mic className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                            </button>
                            <button 
                                onClick={onClose}
                                className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                        {quickActions.map((action, i) => (
                            <button
                                key={i}
                                onClick={() => handleVoiceInput(action.query)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
                            >
                                <action.icon className="w-3 h-3" />
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[50vh] md:max-h-[400px] bg-slate-50">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className={cn(
                                "max-w-[85%] p-4 rounded-3xl",
                                msg.role === 'user' 
                                    ? "bg-primary text-white rounded-br-md" 
                                    : "bg-white border border-slate-100 shadow-sm rounded-bl-md"
                            )}>
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                
                                {/* Action Buttons */}
                                {msg.actions && msg.actions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {msg.actions.map((action, i) => (
                                            <button
                                                key={i}
                                                onClick={action.action}
                                                className={cn(
                                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                                                    msg.role === 'user' 
                                                        ? "bg-white/20 hover:bg-white/30 text-white" 
                                                        : "bg-primary/10 hover:bg-primary/20 text-primary"
                                                )}
                                            >
                                                <action.icon className="w-3 h-3" />
                                                {action.label}
                                                <ChevronRight className="w-3 h-3" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    
                    {/* Loading */}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-3xl rounded-bl-md">
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    <span className="text-sm text-slate-500">Analyzing...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    {/* Voice Wave Animation */}
                    <AnimatePresence>
                        {isListening && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-3 p-3 bg-primary/10 rounded-2xl"
                            >
                                <div className="flex items-center justify-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-1 bg-primary rounded-full"
                                            animate={{
                                                height: [10, 24, 16, 28, 12],
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                repeat: Infinity,
                                                delay: i * 0.1,
                                            }}
                                        />
                                    ))}
                                </div>
                                <p className="text-center text-sm text-primary font-medium">
                                    {transcript || "Listening..."}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <div className="mb-3 p-3 bg-red-50 text-red-600 text-sm rounded-2xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSendText} className="flex items-center gap-2">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={transcript}
                                onChange={(e) => setTranscript(e.target.value)}
                                placeholder={textMode ? "Type your question..." : "Tap microphone to speak..."}
                                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                                disabled={!textMode && !isListening}
                            />
                        </div>
                        
                        {isSpeaking ? (
                            <button
                                type="button"
                                onClick={stopSpeaking}
                                className="w-12 h-12 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl flex items-center justify-center transition-colors"
                            >
                                <VolumeX className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                type={textMode ? "submit" : "button"}
                                onClick={textMode ? undefined : (isListening ? stopListening : startListening)}
                                className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                    isListening 
                                        ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                                        : "bg-primary hover:bg-primary-dark text-white"
                                )}
                            >
                                {textMode ? (
                                    <Send className="w-5 h-5" />
                                ) : isListening ? (
                                    <MicOff className="w-5 h-5" />
                                ) : (
                                    <Mic className="w-5 h-5" />
                                )}
                            </button>
                        )}
                    </form>
                    
                    <p className="text-center text-xs text-slate-400 mt-2">
                        Press the mic and speak in English
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default VoiceAssistant;

