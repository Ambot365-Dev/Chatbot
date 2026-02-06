import React, { useState, useEffect, useRef } from 'react';
import { useFlow } from '../context/FlowContext';
import { Smartphone, RefreshCcw, Send, Check, X } from 'lucide-react';

const ChatPreview = ({ onClose }) => {
    const { steps } = useFlow();
    const [history, setHistory] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);

    // Reset chat when flow changes or manually requested
    const resetChat = () => {
        setHistory([{
            role: 'bot',
            content: steps.length > 0 ? steps[0].title : "Hello! I'm your chatbot.",
            type: steps.length > 0 ? steps[0].type : 'welcome',
            options: steps.length > 0 ? steps[0].options : [],
            stepId: steps.length > 0 ? steps[0].id : null
        }]);
        setCurrentStepIndex(0);
        setIsTyping(false);
        setUserInput('');
    };

    // Initial load or steps change (soft reset if empty history)
    useEffect(() => {
        if (history.length === 0 && steps.length > 0) {
            resetChat();
        }
    }, [steps]);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isTyping]);

    const handleNextStep = (answer) => {
        // Add user answer
        const userMsg = { role: 'user', content: answer };
        setHistory(prev => [...prev, userMsg]);
        setIsTyping(true);

        // Find next step
        setTimeout(() => {
            const nextIndex = currentStepIndex + 1;
            if (nextIndex < steps.length) {
                const nextStep = steps[nextIndex];
                setHistory(prev => [...prev, {
                    role: 'bot',
                    content: nextStep.title,
                    type: nextStep.type,
                    options: nextStep.options,
                    stepId: nextStep.id
                }]);
                setCurrentStepIndex(nextIndex);
            } else {
                // End of flow
                setHistory(prev => [...prev, {
                    role: 'bot',
                    content: "Chat ended.",
                    type: 'end',
                    isSystem: true
                }]);
            }
            setIsTyping(false);
        }, 1000); // Simulated delay
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;
        handleNextStep(userInput);
        setUserInput('');
    };

    const handleOptionClick = (option) => {
        handleNextStep(option);
    };

    // Current active bot step
    const currentBotMsg = history.length > 0 && history[history.length - 1].role === 'bot'
        ? history[history.length - 1]
        : null;

    const isInputDisabled = !currentBotMsg || (currentBotMsg.type !== 'text' && currentBotMsg.type !== 'email' && currentBotMsg.type !== 'phone' && currentBotMsg.type !== 'welcome');

    return (
        <div className="w-full h-full flex flex-col bg-white">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <Smartphone size={18} />
                    <span>Preview</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={resetChat}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                        title="Restart Chat"
                    >
                        <RefreshCcw size={16} />
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                            title="Close Preview"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
                {steps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center p-4">
                        <Smartphone size={48} className="mb-2 opacity-20" />
                        <p className="text-sm">Add steps to the flow to test your bot.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <span className="text-xs text-gray-400">Today</span>
                        </div>

                        {history.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                                {msg.role === 'bot' && !msg.isSystem && (
                                    <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mr-2 shadow-sm">
                                        B
                                    </div>
                                )}

                                <div className={`
                          max-w-[85%] text-sm p-3 shadow-sm
                          ${msg.role === 'user'
                                        ? 'bg-brand-600 text-white rounded-2xl rounded-tr-none'
                                        : 'bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100'}
                          ${msg.isSystem ? 'bg-gray-200 text-gray-500 mx-auto rounded-full text-xs py-1 px-3' : ''}
                       `}>
                                    <p>{msg.content}</p>

                                    {/* Options only on the latest message to avoid changing history */}
                                    {msg === currentBotMsg && (msg.type === 'mcq' || msg.type === 'yesno') && (
                                        <div className="mt-3 space-y-2">
                                            {msg.options?.map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleOptionClick(opt)}
                                                    className="w-full text-left px-3 py-2 border border-brand-100 rounded-lg text-xs text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors flex items-center gap-2"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400"></div>
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">B</div>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 w-16 flex items-center justify-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef}></div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={currentBotMsg?.type === 'email' ? 'Enter email...' : 'Type a message...'}
                        disabled={isInputDisabled}
                        className="flex-1 bg-gray-100 border-0 rounded-full px-4 text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={isInputDisabled || !userInput.trim()}
                        className="p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatPreview;
