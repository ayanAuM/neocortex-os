'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';

export default function LoginPage() {
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
            const { token, user } = await fetchApi('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            login(token, user);
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-2xl w-full max-w-md border-cyan-900/50 relative overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />

                <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-cyan-950/50 rounded-xl border border-cyan-800">
                            <Brain className="text-cyan-400" size={32} />
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        SYSTEM LOGIN
                    </h2>
                    <p className="text-slate-400 text-center text-sm mb-8 font-mono">Authenticate to access NeoCortex OS</p>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-slate-400 text-xs font-mono mb-2 uppercase tracking-wider">Email Override</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                placeholder="commander@system.local"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-xs font-mono mb-2 uppercase tracking-wider">Passcode</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center neon-glow disabled:opacity-50"
                        >
                            {loading ? 'AUTHENTICATING...' : 'INITIALIZE LINK'}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-slate-500 text-sm">
                        Unregistered entity? {' '}
                        <button onClick={() => router.push('/register')} className="text-cyan-400 hover:text-cyan-300 font-medium">
                            Create Profile
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
