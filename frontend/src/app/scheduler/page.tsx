'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, Clock, MoreVertical, Edit2, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

export default function SchedulerPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // If no token, mock empty or redirect? Let's redirect for consistency or show empty.
                // For now, let's just return to avoid error, the auth check in layout/effect usually handles this.
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/scheduler/posts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(response.data);
        } catch (err: any) {
            console.error(err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                // alert("Session expired. Please login again."); 
                localStorage.removeItem('token');
                router.push('/auth/login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Smart Scheduler</h1>
                    <p className="text-slate-500 mt-1">Manage your content calendar</p>
                </div>
                <button className="btn-primary flex items-center shadow-lg shadow-blue-500/30">
                    <Plus size={20} className="mr-2" />
                    Create Post
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg">Upcoming Posts</h3>

                    {posts.map((post) => (
                        <div key={post.id} className="card-base p-5 flex items-start hover:shadow-md transition-shadow cursor-pointer">
                            <div className={`w-2 h-full rounded-full mr-4 self-stretch
                ${post.status === 'scheduled' ? 'bg-blue-500' :
                                    post.status === 'published' ? 'bg-emerald-500' : 'bg-slate-300'}
              `}></div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-800">{post.title}</h4>
                                        <span className="inline-flex items-center text-xs font-medium text-slate-500 mt-1 bg-slate-100 px-2 py-0.5 rounded">
                                            {post.platform}
                                        </span>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>

                                <p className="text-slate-600 text-sm mt-2 line-clamp-2">{post.content}</p>

                                <div className="flex items-center mt-4 text-xs text-slate-500 font-medium">
                                    {post.scheduled_time ? (
                                        <>
                                            <Clock size={14} className="mr-1.5" />
                                            {format(new Date(post.scheduled_time), 'MMM d, yyyy • h:mm a')}
                                        </>
                                    ) : (
                                        <span className="text-slate-400 italic">Draft - Not scheduled</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <div className="card-base bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                        <h3 className="font-bold text-lg mb-4">Calendar View</h3>
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <CalendarIcon size={48} className="mx-auto text-blue-400 mb-2 opacity-50" />
                            <p className="text-sm text-slate-300">Calendar widget placeholder</p>
                        </div>
                        <div className="mt-6 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Scheduled</span>
                                <span className="font-bold">8 posts</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Drafts</span>
                                <span className="font-bold">3 posts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
