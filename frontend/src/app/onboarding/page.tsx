'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Building2, MapPin, Target } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        business_name: '',
        niche: '',
        products: '',
        tone_of_voice: 'Professional',
        location: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/business/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            router.push('/dashboard');
        } catch (err) {
            console.error('Onboarding failed', err);
            // Handle error gracefully
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="card-base w-full max-w-2xl shadow-xl">
                <div className="mb-8 ">
                    <h1 className="text-2xl font-bold text-slate-800">Tell us about your Business</h1>
                    <p className="text-slate-500 mt-2">We'll train your AI agent based on these details.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                            <input
                                name="business_name"
                                required
                                className="input-field"
                                placeholder="e.g. Rahul's Shoe Shop"
                                value={formData.business_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Niche / Category</label>
                            <input
                                name="niche"
                                required
                                className="input-field"
                                placeholder="e.g. Footwear, cafe, gym"
                                value={formData.niche}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Products / Services</label>
                        <textarea
                            name="products"
                            required
                            rows={3}
                            className="input-field py-3"
                            placeholder="List your main products or services..."
                            value={formData.products}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tone of Voice</label>
                            <select
                                name="tone_of_voice"
                                className="input-field"
                                value={formData.tone_of_voice}
                                onChange={handleChange}
                            >
                                <option value="Professional">Professional</option>
                                <option value="Friendly">Friendly</option>
                                <option value="Exciting">Exciting</option>
                                <option value="Luxury">Luxury</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Location (Optional)</label>
                            <input
                                name="location"
                                className="input-field"
                                placeholder="e.g. Mumbai, India"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary px-8"
                        >
                            {loading ? 'Setting up...' : 'Complete Setup'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
