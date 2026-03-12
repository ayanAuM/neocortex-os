'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { token, user } = await fetchApi('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password }),
            });
            login(token, user);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 rounded-2xl w-full max-w-md border-purple-900/50 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />

                <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-purple-950/50 rounded-xl border border-purple-800">
                            <Activity className="text-purple-400" size={32} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                        NEW ENTITY
                    </h2>
                    <p className="text-slate-400 text-center text-sm mb-8 font-mono">Register new consciousness to system</p>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-slate-400 text-xs font-mono mb-2 uppercase tracking-wider">Designation (Name)</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                placeholder="Agent Smith"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-xs font-mono mb-2 uppercase tracking-wider">Communication Vector (Email)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                placeholder="smith@matrix.local"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-xs font-mono mb-2 uppercase tracking-wider">Security Cipher (Password)</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center shadow-[0_0_15px_rgba(168,85,247,0.5)] disabled:opacity-50"
                        >
                            {loading ? 'REGISTERING...' : 'INITIALIZE CONSTRUCT'}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-slate-500 text-sm">
                        Existing entity? {' '}
                        <button onClick={() => router.push('/login')} className="text-purple-400 hover:text-purple-300 font-medium">
                            Access System
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
