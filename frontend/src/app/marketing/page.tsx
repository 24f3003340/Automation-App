'use client';

import { useState } from 'react';
import axios from 'axios';
import { PenTool, Image as ImageIcon, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

export default function MarketingPage() {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<any>(null);
    const router = useRouter();

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }
            const response = await axios.post(`${API_BASE_URL}/marketing/generate`, {
                topic: topic
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGeneratedContent(response.data);
        } catch (err) {
            console.error("Generation failed", err);
            if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
                localStorage.removeItem('token');
                router.push('/auth/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSavePost = async (status: 'draft' | 'scheduled') => {
        if (!generatedContent) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            await axios.post(`${API_BASE_URL}/scheduler/posts`, {
                title: generatedContent.title,
                content: generatedContent.content,
                platform: "Instagram", // Defaulting to Instagram for now
                status: status,
                scheduled_time: status === 'scheduled' ? new Date().toISOString() : null // Default to now for test
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(`Post ${status === 'draft' ? 'saved to drafts' : 'scheduled'} successfully!`);
        } catch (err) {
            console.error("Save failed", err);
            if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
                localStorage.removeItem('token');
                router.push('/auth/login');
            } else {
                alert("Failed to save post");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Marketing Studio</h1>
                <p className="text-slate-500 mt-1">Generate viral content with AI</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Section */}
                <div className="card-base h-fit lg:col-span-1">
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">What is this post about?</label>
                            <textarea
                                rows={4}
                                className="input-field py-3 resize-none"
                                placeholder="e.g. Diwali Sale on Sneakers..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !topic}
                            className="w-full btn-primary flex items-center justify-center"
                        >
                            <PenTool size={18} className="mr-2" />
                            {loading ? 'Generating...' : 'Generate Content'}
                        </button>
                    </form>
                </div>

                {/* Preview Section */}
                <div className="lg:col-span-2 space-y-6">
                    {generatedContent ? (
                        <>
                            <div className="card-base border-blue-100 bg-blue-50/50">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">{generatedContent.title}</h3>
                                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{generatedContent.content}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {generatedContent.hashtags.map((tag: string, i: number) => (
                                        <span key={i} className="text-blue-600 text-sm font-medium bg-blue-100 px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="card-base flex items-start">
                                <div className="p-3 bg-slate-100 rounded-lg mr-4">
                                    <ImageIcon size={24} className="text-slate-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Image Prompt</h4>
                                    <p className="text-slate-500 text-sm mt-1">{generatedContent.image_prompt}</p>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => handleSavePost('draft')}
                                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Save Draft
                                </button>
                                <button
                                    onClick={() => handleSavePost('scheduled')}
                                    className="btn-primary flex items-center"
                                >
                                    <Send size={18} className="mr-2" />
                                    Schedule Post
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <PenTool size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">Ready to create?</h3>
                            <p className="text-slate-500 mt-2">Enter a topic on the left to get started with AI-powered content.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
