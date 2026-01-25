'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Share2, MessageCircle, TrendingUp } from 'lucide-react';

const data = [
    { name: 'Mon', posts: 4, messages: 24 },
    { name: 'Tue', posts: 3, messages: 18 },
    { name: 'Wed', posts: 5, messages: 32 },
    { name: 'Thu', posts: 2, messages: 15 },
    { name: 'Fri', posts: 6, messages: 45 },
    { name: 'Sat', posts: 4, messages: 30 },
    { name: 'Sun', posts: 3, messages: 20 },
];

import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';

// ... (keep data constant)

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
        } else {
            // Fetch User/Business Name
            axios.get(`${API_BASE_URL}/business/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    if (res.data && res.data.business_name) {
                        setUserName(res.data.business_name);
                    }
                })
                .catch(() => {
                    // If 404 or fails, just keep "User"
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [router]);

    if (loading) {
        return null; // Or a loading spinner
    }
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Welcome to BizMate, {userName}!</h1>
                <p className="text-slate-500 mt-1">Overview of your business automation</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-base flex items-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm mr-5">
                        <Share2 size={24} className="text-white" />
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm font-medium">Scheduled Posts</p>
                        <h3 className="text-3xl font-bold mt-1">12</h3>
                    </div>
                </div>

                <div className="card-base flex items-center p-6">
                    <div className="p-3 bg-emerald-100 rounded-lg mr-5">
                        <MessageCircle size={24} className="text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Messages Handled</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-1 text-emerald-600">184</h3>
                    </div>
                </div>

                <div className="card-base flex items-center p-6">
                    <div className="p-3 bg-violet-100 rounded-lg mr-5">
                        <TrendingUp size={24} className="text-violet-600" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Engagement Rate</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-1 text-violet-600">+24%</h3>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="card-base">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Activity Overview</h3>
                <div className="h-96 w-full overflow-x-auto">
                    <div className="min-w-[600px] h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="posts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="messages" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
