'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PenTool, Calendar, MessageSquare, Settings, LogOut, X } from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Marketing Studio', href: '/marketing', icon: PenTool },
    { name: 'Smart Scheduler', href: '/scheduler', icon: Calendar },
    { name: 'Sales Agent', href: '/chatbot', icon: MessageSquare },
    { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white z-50 shadow-xl flex flex-col transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0
            `}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <Link href="/dashboard" className="block" onClick={onClose}>
                            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent tracking-tight">
                                BizMate
                            </h1>
                        </Link>
                        <p className="text-xs text-slate-500 mt-1 font-medium tracking-wide">YOUR BUSINESS AUTOPILOT</p>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose} // Close sidebar on mobile when link clicked
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
        </>
    );
}
