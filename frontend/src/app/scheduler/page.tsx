'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, Clock, MoreVertical, Edit2, Trash2, Plus, Sparkles, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

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
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            // Fetch from our new endpoint
            const response = await axios.get(`${API_BASE_URL}/posts`);
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
            const response = await axios.post(`${API_BASE_URL}/generate-post`, {
                topic,
                platform,
                tone
            });
            setGeneratedContent(response.data.content);
            // Refresh posts list to show the new one immediately
            fetchPosts();
        } catch (err) {
            console.error("Generation failed", err);
            alert("Failed to generate post");
        } finally {
            setGenerating(false);
        }
    };

    // Close modal and reset
    const closeModal = () => {
        setIsModalOpen(false);
        setTopic('');
        setGeneratedContent('');
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Smart Scheduler</h1>
                    <p className="text-slate-500 mt-1">Manage your content calendar</p>
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

            {/* Posts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg">Upcoming Posts</h3>

                    {loading ? (
                        <div className="text-center py-10 text-slate-400">Loading...</div>
                    ) : posts.length === 0 ? (
                        <div className="card-base p-10 text-center text-slate-500 bg-slate-50 border-dashed">
                            No posts yet. Click "Create Post" to start!
                        </div>
                    ) : (
                        posts.map((post: any) => (
                            <div key={post.id} className="card-base p-5 flex items-start hover:shadow-md transition-shadow cursor-pointer">
                                <div className={`w-2 h-full rounded-full mr-4 self-stretch
                                    ${post.status === 'scheduled' ? 'bg-blue-500' : 'bg-slate-300'}`}
                                ></div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-800 line-clamp-1">{post.title}</h4>
                                            <span className="inline-flex items-center text-xs font-medium text-slate-500 mt-1 bg-slate-100 px-2 py-0.5 rounded">
                                                {post.platform}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-slate-600 text-sm mt-2 line-clamp-3 whitespace-pre-wrap">{post.content}</p>

                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">Draft</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Calendar Placeholder */}
                <div>
                    <div className="card-base bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                        <h3 className="font-bold text-lg mb-4">Calendar View</h3>
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <CalendarIcon size={48} className="mx-auto text-blue-400 mb-2 opacity-50" />
                            <p className="text-sm text-slate-300">Calendar widget coming soon</p>
                        </div>
                    </div>
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
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-slate-700 text-sm whitespace-pre-wrap">
                                        {generatedContent}
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={closeModal}
                                            className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700 border-none"
                                        >
                                            Save & Close
                                        </button>
                                        <button
                                            onClick={() => setGeneratedContent('')}
                                            className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium text-sm"
                                        >
                                            Try Again
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
