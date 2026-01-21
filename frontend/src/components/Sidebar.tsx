'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PenTool, Calendar, MessageSquare, Settings, LogOut } from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Marketing Studio', href: '/marketing', icon: PenTool },
    { name: 'Smart Scheduler', href: '/scheduler', icon: Calendar },
    { name: 'Sales Agent', href: '/chatbot', icon: MessageSquare },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl">
            <div className="p-6 border-b border-slate-800">
                <Link href="/dashboard" className="block">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent tracking-tight">
                        BizMate
                    </h1>
                </Link>
                <p className="text-xs text-slate-500 mt-1 font-medium tracking-wide">YOUR BUSINESS AUTOPILOT</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Icon size={20} className={`mr-3 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <LogOut size={20} className="mr-3" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    );
}
