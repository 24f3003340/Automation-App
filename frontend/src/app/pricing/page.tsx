'use client';

import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const router = useRouter();

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Simple, transparent pricing</h1>
                <p className="mt-4 text-xl text-slate-500">Pick the plan that best suits your business needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Starter Plan */}
                <div className="card-base p-8 border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900">Starter</h3>
                    <p className="text-slate-500 mt-2 text-sm">Perfect for individuals starting out.</p>
                    <div className="mt-6">
                        <span className="text-4xl font-extrabold text-slate-900">$0</span>
                        <span className="text-slate-500 font-medium ml-1">/mo</span>
                    </div>
                    <ul className="mt-8 space-y-4">
                        {['5 AI Posts per month', 'Basic Scheduling', '1 Social Account', 'Standard Support'].map((feature, i) => (
                            <li key={i} className="flex items-center text-slate-700">
                                <CheckCircle size={20} className="text-emerald-500 mr-3 shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => router.push('/dashboard')} className="mt-8 w-full btn-primary bg-slate-100 text-slate-900 hover:bg-slate-200 border-none">
                        Get Started
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="card-base p-8 border-2 border-blue-500 relative transform md:-translate-y-4 shadow-xl shadow-blue-500/10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Most Popular</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Pro</h3>
                    <p className="text-slate-500 mt-2 text-sm">Best for growing small businesses.</p>
                    <div className="mt-6">
                        <span className="text-4xl font-extrabold text-slate-900">$29</span>
                        <span className="text-slate-500 font-medium ml-1">/mo</span>
                    </div>
                    <ul className="mt-8 space-y-4">
                        {['Unlimited AI Posts', 'Advanced Scheduling Calendar', '5 Social Accounts', 'AI Sales Chatbot', 'Priority Support'].map((feature, i) => (
                            <li key={i} className="flex items-center text-slate-700">
                                <CheckCircle size={20} className="text-blue-500 mr-3 shrink-0" />
                                <span className="font-medium">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => router.push('/dashboard')} className="mt-8 w-full btn-primary bg-blue-600 hover:bg-blue-700">
                        Subscribe Now
                    </button>
                </div>

                {/* Enterprise Plan */}
                <div className="card-base p-8 border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900">Enterprise</h3>
                    <p className="text-slate-500 mt-2 text-sm">For agencies and large teams.</p>
                    <div className="mt-6">
                        <span className="text-4xl font-extrabold text-slate-900">$99</span>
                        <span className="text-slate-500 font-medium ml-1">/mo</span>
                    </div>
                    <ul className="mt-8 space-y-4">
                        {['Everything in Pro', 'Custom AI Tone Training', 'Unlimited Accounts', 'API Access', '24/7 Phone Support'].map((feature, i) => (
                            <li key={i} className="flex items-center text-slate-700">
                                <CheckCircle size={20} className="text-violet-500 mr-3 shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => router.push('/dashboard')} className="mt-8 w-full btn-primary bg-slate-900 text-white hover:bg-slate-800 border-none">
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>
    );
}
