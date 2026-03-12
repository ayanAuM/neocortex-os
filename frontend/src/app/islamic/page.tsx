'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Check, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';

interface PrayerLog {
    id: string;
    fajr: boolean;
    zuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
}

interface QuranLog {
    id: string;
    versesRead: number;
    pagesRead: number;
}

export default function IslamicPractices() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    const [prayers, setPrayers] = useState<PrayerLog | null>(null);
    const [quran, setQuran] = useState<QuranLog | null>(null);
    const [dhikr, setDhikr] = useState(0); // We'll just manage this in state for now, or could save it to localstorage

    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            loadData();
        }
    }, [user, isLoading]);

    const loadData = async () => {
        try {
            const [prayerRes, quranRes] = await Promise.all([
                fetchApi('/islamic-practices/prayers/today'),
                fetchApi('/islamic-practices/quran/today')
            ]);
            setPrayers(prayerRes);
            setQuran(quranRes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingData(false);
        }
    };

    const togglePrayer = async (prayer: keyof Omit<PrayerLog, 'id'>) => {
        if (!prayers) return;

        const updatedPrayers = { ...prayers, [prayer]: !prayers[prayer] };
        setPrayers(updatedPrayers);

        try {
            await fetchApi(`/islamic-practices/prayers/${prayers.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedPrayers),
            });
        } catch (error) {
            console.error(error);
            // Revert on error
            setPrayers(prayers);
        }
    };

    const updateQuran = async (field: 'versesRead' | 'pagesRead', value: string) => {
        if (!quran) return;

        const numValue = parseInt(value) || 0;
        const updatedQuran = { ...quran, [field]: numValue };
        setQuran(updatedQuran);

        try {
            await fetchApi(`/islamic-practices/quran/${quran.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedQuran),
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading || loadingData) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={48} /></div>;
    }

    return (
        <main className="min-h-screen p-8 md:p-16 max-w-5xl mx-auto flex flex-col gap-8">

            <header className="flex items-center gap-6">
                <button
                    onClick={() => router.push('/')}
                    className="p-3 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-emerald-500/50 transition-colors text-slate-400 group"
                >
                    <ArrowLeft className="group-hover:text-emerald-400 transition-colors" />
                </button>
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600 neon-text">
                        Islamic Practices
                    </h1>
                    <p className="text-emerald-500/60 font-mono mt-1 text-sm uppercase">Track & Reflect on Daily Duties</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prayer Tracker */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 rounded-2xl border-emerald-900/30"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-emerald-950/50 rounded-xl text-emerald-400">
                            <BookOpen size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-200">Daily Salah</h2>
                    </div>

                    <div className="flex flex-col gap-3">
                        {['fajr', 'zuhr', 'asr', 'maghrib', 'isha'].map((p) => {
                            const prayer = p as keyof Omit<PrayerLog, 'id'>;
                            const isDone = prayers?.[prayer];

                            return (
                                <div
                                    key={prayer}
                                    onClick={() => togglePrayer(prayer)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${isDone
                                            ? 'bg-emerald-900/20 border-emerald-500/50'
                                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-600'
                                        }`}
                                >
                                    <span className={`font-medium capitalize ${isDone ? 'text-emerald-400' : 'text-slate-300'}`}>
                                        {prayer}
                                    </span>
                                    <div className={`h-6 w-6 rounded-md border flex items-center justify-center transition-colors ${isDone ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-slate-600'
                                        }`}>
                                        {isDone && <Check size={16} strokeWidth={3} />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.section>

                <div className="flex flex-col gap-6">
                    {/* Quran Tracker */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-6 rounded-2xl border-teal-900/30"
                    >
                        <h2 className="text-xl font-bold text-slate-200 mb-6">Quran Recitation</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-400 text-xs font-mono mb-2 uppercase">Pages Read</label>
                                <input
                                    type="number"
                                    value={quran?.pagesRead || ''}
                                    onChange={(e) => updateQuran('pagesRead', e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 text-2xl font-bold text-teal-400 text-center focus:border-teal-500 outline-none"
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs font-mono mb-2 uppercase">Verses Read</label>
                                <input
                                    type="number"
                                    value={quran?.versesRead || ''}
                                    onChange={(e) => updateQuran('versesRead', e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 text-2xl font-bold text-teal-400 text-center focus:border-teal-500 outline-none"
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                        </div>
                    </motion.section>

                    {/* Dhikr Counter */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-6 rounded-2xl border-emerald-900/30 flex-1 flex flex-col justify-center items-center relative overflow-hidden group cursor-pointer"
                        onClick={() => setDhikr(prev => prev + 1)}
                    >
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-slate-400 text-sm font-mono uppercase mb-2">Daily Dhikr Counter</p>
                        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                            {dhikr}
                        </div>
                        <p className="text-emerald-500/50 text-xs mt-4 font-mono">TAP ANYWHERE TO COUNT</p>
                        <button
                            onClick={(e) => { e.stopPropagation(); setDhikr(0); }}
                            className="absolute top-4 right-4 text-xs font-mono text-slate-500 hover:text-rose-400 transition-colors"
                        >
                            RESET
                        </button>
                    </motion.section>
                </div>
            </div>

        </main>
    );
}
