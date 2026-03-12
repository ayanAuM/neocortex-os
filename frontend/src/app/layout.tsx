import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'NeoCortex OS',
  description: 'Personal Life Dashboard & Operating System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} font-sans bg-black text-slate-200 antialiased selection:bg-cyan-900 selection:text-cyan-50 min-h-screen`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black -z-10" />
        <div className="neural-grid absolute inset-0 -z-10 bg-[length:50px_50px] opacity-10" />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
