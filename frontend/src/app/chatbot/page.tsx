'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot, MessageSquare, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { format } from 'date-fns';

export default function ChatbotPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [selectedConvId, setSelectedConvId] = useState<number | null>(null);

    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);
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
        fetchHistory(token);
    }, [router]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchHistory = async (token: string) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/chatbot/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data);
            if (res.data.length > 0 && !selectedConvId) {
                selectConversation(res.data[0]);
            } else if (res.data.length === 0) {
                setMessages([{ id: 1, sender: 'bot', content: 'Hello! I am your AI Sales Agent. How can I help you today?' }]);
            }
        } catch (err) {
            console.error("Failed to load history", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const selectConversation = (conv: any) => {
        setSelectedConvId(conv.id);
        const formattedMessages = conv.messages.map((m: any) => ({
            id: m.id,
            sender: m.sender,
            content: m.content
        }));
        setMessages(formattedMessages);
    };

    const startNewChat = () => {
        setSelectedConvId(null);
        setMessages([{ id: Date.now(), sender: 'bot', content: 'Hello! Let\'s start a new simulated conversation. How can I help you?' }]);
    };

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
                platform: 'Web Simulation',
                conversation_id: selectedConvId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const botMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                content: response.data.reply
            };
            setMessages(prev => [...prev, botMessage]);
            
            // If new conversation, we got an ID back
            if (!selectedConvId && response.data.conversation_id) {
                setSelectedConvId(response.data.conversation_id);
                // Background refresh history
                axios.get(`${API_BASE_URL}/chatbot/history`, { headers: { Authorization: `Bearer ${token}` } })
                     .then(res => setHistory(res.data));
            }

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
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
            {/* Sidebar for History */}
            <div className="w-full md:w-80 h-full card-base p-4 flex flex-col bg-white border-0 shadow-lg shrink-0">
                <button
                    onClick={startNewChat}
                    className="w-full btn-primary flex items-center justify-center mb-6"
                >
                    <Plus size={18} className="mr-2" /> New Chat
                </button>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 pl-2">Recent Simulations</div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {historyLoading ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-400" /></div>
                    ) : history.length === 0 ? (
                        <div className="text-sm text-slate-500 p-2 text-center">No history yet.</div>
                    ) : history.map((conv) => (
                        <div 
                            key={conv.id} 
                            onClick={() => selectConversation(conv)}
                            className={`p-3 rounded-xl cursor-pointer transition-colors ${selectedConvId === conv.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center text-sm font-bold text-slate-800 line-clamp-1">
                                <MessageSquare size={14} className="mr-2 text-slate-400 shrink-0" />
                                {conv.customer_name}
                            </div>
                            <div className="text-xs text-slate-500 mt-1 pl-6 truncate">
                                {conv.last_message || "Started..."}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 card-base flex flex-col p-0 overflow-hidden border-0 shadow-xl bg-slate-50 h-full">
                <div className="px-6 py-4 border-b border-slate-200 bg-white">
                    <h2 className="text-lg font-bold text-slate-800">Agent Simulator</h2>
                    <p className="text-xs text-slate-500">Testing your AI sales bot behavior</p>
                </div>

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
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
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

                <div className="p-4 bg-white border-t border-slate-200">
                    <form onSubmit={handleSend} className="flex gap-4">
                        <input
                            className="flex-1 input-field bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                            placeholder="Type a test message (e.g. 'What is the price?')..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="btn-primary w-12 h-12 rounded-xl flex items-center justify-center p-0 shrink-0"
                            disabled={loading}
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
