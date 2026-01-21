'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {

            await axios.post(`${API_BASE_URL}/auth/signup`, {
                email,
                password
            });
            // Auto login or redirect to login
            router.push('/auth/login?registered=true');
        } catch (err: any) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.detail);
            } else {
                setError(`Signup failed: ${err.message || 'Unknown error'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-base w-full max-w-md p-8 shadow-xl border-t-4 border-blue-600">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Join BizMate</h1>
                <p className="text-slate-500 mt-2">Start automating your business today</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        required
                        className="input-field"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        className="input-field"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full btn-primary mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign In
                </Link>
            </div>
        </div>
    );
}
