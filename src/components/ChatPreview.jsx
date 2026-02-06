import React, { useState, useEffect, useRef } from 'react';
import { useFlow } from '../context/FlowContext';
import { Smartphone, RefreshCcw, Send, Check, X, MapPin, Sliders, Calendar, Clock, Upload, Globe, Image as ImageIcon, Video, ExternalLink } from 'lucide-react';

const ChatPreview = ({ onClose }) => {
    const { steps } = useFlow();
    const [history, setHistory] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Initial Start
    useEffect(() => {
        if (history.length === 0 && steps.length > 0) {
            startChat();
        }
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, [steps]);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isTyping]);

    // Auto-advance for informational steps
    useEffect(() => {
        const lastMsg = history[history.length - 1];
        if (lastMsg?.role === 'bot' && !lastMsg.isSystem) {
            const infoTypes = ['welcome', 'statement', 'image', 'video', 'link-out', 'redirect', 'live-chat', 'ai-response'];

            if (infoTypes.includes(lastMsg.type)) {
                // Determine delay based on reading time (approx)
                const delay = Math.max(1000, (lastMsg.content?.length || 0) * 30);

                const timer = setTimeout(() => {
                    proceedToNextStep(currentStepIndex + 1);
                }, delay > 3000 ? 3000 : delay); // Cap at 3s for preview

                return () => clearTimeout(timer);
            }
        }
    }, [history, currentStepIndex, steps]);

    const startChat = () => {
        if (steps.length === 0) return;
        const firstStep = steps[0];
        addBotMessage(firstStep);
        setCurrentStepIndex(0);
    };

    const resetChat = () => {
        setHistory([]);
        setUserInput('');
        setIsTyping(false);
        // Effect will trigger startChat
    };

    const addBotMessage = (step) => {
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            setHistory(prev => [...prev, {
                role: 'bot',
                content: step.title,
                type: step.type,
                options: step.options,
                stepId: step.id,
                range: step.range
            }]);
            setIsTyping(false);
            typingTimeoutRef.current = null;
        }, 600);
    };

    const proceedToNextStep = (nextIndex) => {
        if (nextIndex < steps.length) {
            setCurrentStepIndex(nextIndex);
            addBotMessage(steps[nextIndex]);
        } else {
            setHistory(prev => [...prev, {
                role: 'bot',
                content: "Chat ended.",
                type: 'end',
                isSystem: true
            }]);
        }
    };

    const handleUserSubmit = (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        // Add user message
        const userMsg = { role: 'user', content: userInput, type: 'text' };
        setHistory(prev => [...prev, userMsg]);
        setUserInput('');

        // Proceed
        proceedToNextStep(currentStepIndex + 1);
    };

    const handleOptionSelect = (option) => {
        const userMsg = { role: 'user', content: option, type: 'option' };
        setHistory(prev => [...prev, userMsg]);
        proceedToNextStep(currentStepIndex + 1);
    };

    const currentBotMsg = history.length > 0 && history[history.length - 1].role === 'bot' ? history[history.length - 1] : null;

    // Determine if input should be blocked
    const inputTypes = ['text', 'email', 'phone', 'name', 'number', 'website', 'date', 'time', 'location', 'range', 'rating', 'file', 'date-time'];
    const isInputEnabled = currentBotMsg && inputTypes.includes(currentBotMsg.type);

    return (
        <div className="w-full h-full flex flex-col bg-white font-sans">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                    <Smartphone size={18} className="text-brand-600" />
                    <span>Preview</span>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={resetChat} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-brand-600">
                        <RefreshCcw size={16} />
                    </button>
                    {onClose && (
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-red-500">
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 bg-gray-50/50 p-4 overflow-y-auto space-y-6">
                {steps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Smartphone size={48} className="mb-4 opacity-10" />
                        <p className="text-sm font-medium">Your flow is empty.</p>
                    </div>
                ) : (
                    <>
                        {history.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                                {msg.role === 'bot' && !msg.isSystem && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mr-2 shadow-md mb-1 self-end">
                                        Bot
                                    </div>
                                )}

                                <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    {/* Main Bubble */}
                                    <div className={`
                                        text-sm p-3.5 shadow-sm leading-relaxed
                                        ${msg.role === 'user'
                                            ? 'bg-brand-600 text-white rounded-2xl rounded-tr-none'
                                            : 'bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100'}
                                        ${msg.isSystem ? 'bg-gray-200 text-gray-500 mx-auto rounded-full text-xs py-1 px-4 w-fit' : ''}
                                    `}>
                                        {msg.type === 'image' ? (
                                            <div className="space-y-2">
                                                <img src="https://images.unsplash.com/photo-1531297461136-8208b501155f?auto=format&fit=crop&w=500&q=60" alt="Preview" className="rounded-lg w-full h-32 object-cover" />
                                                <p>{msg.content}</p>
                                            </div>
                                        ) : (
                                            <p>{msg.content}</p>
                                        )}
                                    </div>

                                    {/* Options (Buttons) */}
                                    {msg === currentBotMsg && ['mcq', 'yesno', 'single-choice'].includes(msg.type) && (
                                        <div className="flex flex-col gap-2 w-full min-w-[200px] animate-fade-in">
                                            {msg.options?.map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleOptionSelect(opt)}
                                                    className="w-full text-left px-4 py-2.5 bg-white border border-brand-100 text-brand-700 hover:bg-brand-50 hover:border-brand-200 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-between group"
                                                >
                                                    {opt}
                                                    <div className="w-4 h-4 rounded-full border border-brand-200 group-hover:border-brand-500"></div>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Rating */}
                                    {msg === currentBotMsg && msg.type === 'rating' && (
                                        <div className="flex bg-white p-2 rounded-xl shadow-sm border border-gray-100 gap-1 justify-center">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button key={star} onClick={() => handleOptionSelect(`${star} Stars`)} className="hover:scale-110 transition-transform text-2xl">⭐</button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0 self-end mb-1">Bot</div>
                                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 flex items-center gap-1.5 shadow-sm">
                                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100">
                <form onSubmit={handleUserSubmit} className="flex gap-2 relative">
                    {/* Dynamic Icons based on required input */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {currentBotMsg?.type === 'email' ? <Globe size={16} /> :
                            currentBotMsg?.type === 'time' ? <Clock size={16} /> :
                                currentBotMsg?.type === 'date' ? <Calendar size={16} /> :
                                    currentBotMsg?.type === 'location' ? <MapPin size={16} /> :
                                        currentBotMsg?.type === 'file' ? <Upload size={16} /> :
                                            <Smartphone size={16} />}
                    </div>

                    <input
                        type={
                            currentBotMsg?.type === 'number' ? 'number' :
                                currentBotMsg?.type === 'time' ? 'time' :
                                    currentBotMsg?.type === 'date' ? 'date' :
                                        'text'
                        }
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={isInputEnabled ? `Type your ${currentBotMsg.type}...` : "Please select an option..."}
                        disabled={!isInputEnabled}
                        className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 rounded-full pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={!isInputEnabled || !userInput.trim()}
                        className="p-2.5 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg active:scale-95 transform duration-100"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPreview;
