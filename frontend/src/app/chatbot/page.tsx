'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

export default function ChatbotPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([
        { id: 1, sender: 'bot', content: 'Hello! I am your AI Sales Agent. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }
        scrollToBottom();
    }, [messages, router]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), sender: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(`${API_BASE_URL}/chatbot/send`, {
                content: userMessage.content,
                platform: 'Web Simulation'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const botMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                content: response.data.reply
            };
            setMessages(prev => [...prev, botMessage]);

        } catch (err: any) {
            console.error("Chat error", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                alert("Session expired. Please login again.");
                localStorage.removeItem('token');
                router.push('/auth/login');
                return;
            }
            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', content: 'Sorry, I am having trouble connecting right now.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Sales Agent Simulator</h1>
                <p className="text-slate-500 mt-1">Test how your AI replies to customers</p>
            </div>

            <div className="card-base flex-1 flex flex-col p-0 overflow-hidden border-0 shadow-xl bg-slate-50">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.sender === 'bot' && (
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                                    <Bot size={16} className="text-blue-600" />
                                </div>
                            )}

                            <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm
                ${msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-sm'
                                    : 'bg-white text-slate-700 rounded-bl-sm border border-slate-100'}
              `}>
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>

                            {msg.sender === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center ml-3 flex-shrink-0">
                                    <User size={16} className="text-slate-500" />
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200">
                    <form onSubmit={handleSend} className="flex gap-4">
                        <input
                            className="flex-1 input-field bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            placeholder="Type a test message (e.g. 'What is the price?')..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="btn-primary w-12 h-12 rounded-xl flex items-center justify-center p-0"
                            disabled={loading}
                        >
                            <Send size={20} className={loading ? 'opacity-50' : ''} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
