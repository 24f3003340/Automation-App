'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Save, Building2, MapPin, Target, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        business_name: '',
        niche: '',
        products: '',
        tone_of_voice: '',
        location: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/business/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // If profile exists, pre-fill form
            if (response.data) {
                setFormData({
                    business_name: response.data.business_name || '',
                    niche: response.data.niche || '',
                    products: response.data.products || '',
                    tone_of_voice: response.data.tone_of_voice || '',
                    location: response.data.location || ''
                });
            }
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                // Profile not found, which is expected for new users
                return;
            }
            console.error(err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                localStorage.removeItem('token');
                router.push('/auth/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            await axios.post(`${API_BASE_URL}/business/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Settings saved successfully!');
        } catch (err: any) {
            console.error(err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                alert("Session expired. Please login again.");
                localStorage.removeItem('token');
                router.push('/auth/login');
            } else {
                alert('Failed to save settings. Please try again.');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading settings...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your business profile and preferences</p>
            </div>

            <div className="card-base p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center space-x-2 text-xl font-bold text-slate-800 mb-6 border-b pb-2">
                        <Building2 className="text-blue-500" />
                        <h2>Business Profile</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Business Name</label>
                            <input
                                type="text"
                                name="business_name"
                                value={formData.business_name}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g. TechSoluitons Inc."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Industry / Niche</label>
                            <input
                                type="text"
                                name="niche"
                                value={formData.niche}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g. Digital Marketing, Real Estate"
                                required
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Products / Services</label>
                            <textarea
                                name="products"
                                value={formData.products}
                                onChange={handleChange}
                                className="input-field h-24"
                                placeholder="Briefly describe what you sell or offer..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-slate-700">
                                <Target className="w-4 h-4 mr-1 text-slate-400" />
                                Tone of Voice
                            </label>
                            <select
                                name="tone_of_voice"
                                value={formData.tone_of_voice}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="Professional">Professional</option>
                                <option value="Friendly">Friendly</option>
                                <option value="Witty">Witty</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Luxury">Luxury</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-slate-700">
                                <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                                Location (Optional)
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g. Mumbai, India"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary flex items-center shadow-lg shadow-blue-500/30 px-8"
                        >
                            <Save size={18} className="mr-2" />
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
