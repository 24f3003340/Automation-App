'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "BizMate - Your Business Autopilot",
//   description: "AI-powered automation for small businesses",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 text-slate-900`} suppressHydrationWarning>
        {isAuthPage ? (
          <div className="min-h-screen flex items-center justify-center bg-slate-100">
            {children}
          </div>
        ) : (
          <div className="flex min-h-screen relative">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Mobile Header / Hamburger */}
            <div className="fixed top-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md z-30 md:hidden flex items-center border-b border-slate-200">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                <Menu size={24} />
              </button>
              <span className="ml-3 font-bold text-lg text-slate-800">BizMate</span>
            </div>

            <main className="flex-1 w-full md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto min-h-screen transition-all duration-300">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        )}
      </body>
    </html>
  );
}
