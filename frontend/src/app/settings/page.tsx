'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Settings, User, Save, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [form, setForm] = useState({
        business_name: '',
        niche: '',
        products: '',
        tone_of_voice: '',
        location: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        axios.get(`${API_BASE_URL}/business/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (res.data) {
                    setForm({
                        business_name: res.data.business_name || '',
                        niche: res.data.niche || '',
                        products: res.data.products || '',
                        tone_of_voice: res.data.tone_of_voice || '',
                        location: res.data.location || ''
                    });
                }
            })
            .catch(err => {
                if(err.response && err.response.status === 404) {
                    // Profile not created yet, perfectly normal
                    return;
                }
                console.error("Failed to fetch profile", err);
            })
            .finally(() => setLoading(false));

    }, [router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/business/profile`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <Settings size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                    <p className="text-slate-500 mt-1">Manage your account and AI business profile</p>
                </div>
            </div>

            <div className="card-base p-8">
                <div className="flex items-center border-b border-slate-100 pb-4 mb-6">
                    <User className="text-slate-400 mr-3" size={24} />
                    <h2 className="text-xl font-bold text-slate-800">Business Profile</h2>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Business Name</label>
                            <input
                                required
                                className="input-field"
                                value={form.business_name}
                                onChange={e => setForm({ ...form, business_name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Niche / Industry</label>
                            <input
                                required
                                className="input-field"
                                value={form.niche}
                                onChange={e => setForm({ ...form, niche: e.target.value })}
                                placeholder="e.g. Fitness, Real Estate, E-commerce"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Core Products/Services</label>
                        <textarea
                            required
                            className="input-field"
                            rows={3}
                            value={form.products}
                            onChange={e => setForm({ ...form, products: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Tone of Voice</label>
                            <select
                                className="input-field"
                                value={form.tone_of_voice}
                                onChange={e => setForm({ ...form, tone_of_voice: e.target.value })}
                            >
                                <option value="Professional">Professional</option>
                                <option value="Casual & Friendly">Casual & Friendly</option>
                                <option value="Humorous / Funny">Humorous / Funny</option>
                                <option value="Authoritative">Authoritative</option>
                                <option value="Exciting / Hype">Exciting / Hype</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Location (Optional)</label>
                            <input
                                className="input-field"
                                value={form.location}
                                onChange={e => setForm({ ...form, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <span className={`text-sm font-medium ${message.includes('successfully') ? 'text-emerald-500' : 'text-red-500'}`}>
                            {message}
                        </span>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary flex items-center px-8"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
