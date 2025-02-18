'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export const AIChat = ({ isOpen, onClose, lang }: {
    isOpen: boolean;
    onClose: () => void;
    lang: 'zh-TW' | 'en';
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        // 更新消息記錄，只保留最新的 5 筆
        setMessages(prev => {
            const newMessages = [...prev, { role: 'user' as const, content: userMessage }];
            return newMessages.slice(-5); // 只保留最後 5 筆
        });

        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, lang })
            });

            const data = await response.json();

            // 更新消息記錄，只保留最新的 5 筆
            setMessages(prev => {
                const newMessages = [...prev, { role: 'assistant' as const, content: data.response }];
                return newMessages.slice(-5); // 只保留最後 5 筆
            });
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => {
                const newMessages = [...prev, {
                    role: 'assistant' as const,
                    content: lang === 'zh-TW' ? '抱歉，發生錯誤。請稍後再試。' : 'Sorry, an error occurred. Please try again later.'
                }];
                return newMessages.slice(-5); // 只保留最後 5 筆
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed right-8 bottom-28 z-50 w-96 max-h-[600px] bg-blue-950/95 backdrop-blur-md 
                     rounded-2xl border border-blue-500/20 shadow-xl overflow-hidden"
                >
                    {/* 聊天標題 */}
                    <div className="flex items-center justify-between p-4 border-b border-blue-500/20">
                        <h3 className="text-lg font-semibold text-blue-200">
                            {lang === 'zh-TW' ? 'AI 數位分身' : 'AI Digital Avatar'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-blue-500/20 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* 聊天內容 */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.role === 'user'
                                        ? 'bg-blue-600/50 text-white'
                                        : 'bg-blue-800/30 text-blue-200'
                                        }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-blue-800/30 text-blue-200 rounded-2xl px-4 py-2">
                                    <span className="animate-pulse">...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 輸入區域 */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-blue-500/20">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={lang === 'zh-TW' ? '輸入訊息...' : 'Type a message...'}
                                className="flex-1 px-4 py-2 rounded-full bg-blue-900/50 border border-blue-500/20 
                           text-white placeholder-blue-400/50 focus:outline-none focus:border-blue-500/50"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="p-2 rounded-full bg-emerald-600/90 hover:bg-emerald-500/90 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
}; 