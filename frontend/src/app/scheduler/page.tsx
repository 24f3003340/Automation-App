'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Plus, Sparkles, X, Loader2, Edit2, Trash2 } from 'lucide-react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

const localizer = momentLocalizer(moment);

export default function SchedulerPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Generation State
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('LinkedIn');
    const [tone, setTone] = useState('Professional');
    const [generating, setGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }
        fetchPosts(token);
    }, [router]);

    const fetchPosts = async (token: string) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/scheduler/posts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(response.data);
        } catch (err) {
            console.error("Failed to fetch posts", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!topic) return;
        setGenerating(true);
        try {
            const token = localStorage.getItem('token');
            // Since we moved generation to marketing, we use it to get a quick post
            const response = await axios.post(`${API_BASE_URL}/marketing/generate`, {
                topic,
                tone
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGeneratedContent(response.data.content);
        } catch (err) {
            console.error("Generation failed", err);
            alert("Failed to generate post. Check API key.");
        } finally {
            setGenerating(false);
        }
    };

    const handleSavePost = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/scheduler/posts`, {
                title: topic || "Generated Post",
                content: generatedContent,
                platform: platform,
                status: "scheduled",
                scheduled_time: new Date().toISOString()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            fetchPosts(token || '');
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Failed to save scheduled post.");
        }
    };

    const handleDelete = async (id: number) => {
        if(!confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/scheduler/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(posts.filter(p => p.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // Close modal and reset
    const closeModal = () => {
        setIsModalOpen(false);
        setTopic('');
        setGeneratedContent('');
    };

    // Map posts to calendar events
    const calendarEvents = posts
        .filter(p => p.status === 'scheduled' || p.scheduled_time)
        .map(p => ({
            id: p.id,
            title: `[${p.platform}] ${p.title}`,
            start: new Date(p.scheduled_time || p.created_at),
            end: new Date(new Date(p.scheduled_time || p.created_at).getTime() + 60 * 60 * 1000), // 1 hour duration
            allDay: false,
            resource: p
        }));

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Smart Scheduler</h1>
                    <p className="text-slate-500 mt-1">Manage your content calendar visually</p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center shadow-lg shadow-blue-500/30 cursor-pointer relative z-50 hover:scale-105 active:scale-95"
                >
                    <Plus size={20} className="mr-2" />
                    Create Post
                </button>
            </div>

            {/* Main view container */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <style>{`
                    .rbc-calendar { font-family: inherit; }
                    .rbc-event { background-color: #3b82f6; border: none; border-radius: 6px; }
                    .rbc-today { background-color: #eff6ff; }
                    .rbc-toolbar button { border-radius: 6px; padding: 6px 12px; }
                    .rbc-toolbar button.rbc-active { background-color: #3b82f6; color: white; border-color: #3b82f6; box-shadow: none; }
                `}</style>
                <div style={{ height: 600 }}>
                    <BigCalendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        views={['month', 'week', 'day', 'agenda']}
                        defaultView="month"
                        onSelectEvent={(event: any) => {
                            if(confirm(`Would you like to delete "${event.title}"?`)) {
                                handleDelete(event.id);
                            }
                        }}
                        tooltipAccessor={(event: any) => event.resource.content}
                    />
                </div>
            </div>

            {/* Create Post Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800">Create AI Post</h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Topic / Idea</label>
                                <textarea
                                    className="input-field h-24 resize-none"
                                    placeholder="e.g. 5 tips for productivity..."
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                                    <select
                                        className="input-field"
                                        value={platform}
                                        onChange={(e) => setPlatform(e.target.value)}
                                    >
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="Twitter">Twitter</option>
                                        <option value="Instagram">Instagram</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tone</label>
                                    <select
                                        className="input-field"
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                    >
                                        <option value="Professional">Professional</option>
                                        <option value="Funny">Funny</option>
                                        <option value="Viral">Viral</option>
                                        <option value="Casual">Casual</option>
                                    </select>
                                </div>
                            </div>

                            {!generatedContent ? (
                                <button
                                    onClick={handleGenerate}
                                    disabled={generating || !topic}
                                    className={`w-full btn-primary flex items-center justify-center py-3 mt-4
                                        ${generating ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 size={20} className="mr-2 animate-spin" />
                                            Writing Magic...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={20} className="mr-2" />
                                            Generate with AI
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                                    <label className="block text-sm font-medium text-emerald-600 mb-2 flex items-center">
                                        <Sparkles size={16} className="mr-1" /> AI Result:
                                    </label>
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-slate-700 text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                                        {generatedContent}
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={handleSavePost}
                                            className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700 border-none"
                                        >
                                            Schedule To Calendar
                                        </button>
                                        <button
                                            onClick={() => setGeneratedContent('')}
                                            className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium text-sm"
                                        >
                                            Discard
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
