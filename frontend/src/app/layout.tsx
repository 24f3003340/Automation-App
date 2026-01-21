'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

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

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 text-slate-900`} suppressHydrationWarning>
        {isAuthPage ? (
          <div className="min-h-screen flex items-center justify-center bg-slate-100">
            {children}
          </div>
        ) : (
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
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
