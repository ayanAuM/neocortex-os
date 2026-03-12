'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Loader2, Save, Smile, Meh, Frown, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';

interface DailyJournal {
    id: string;
    date: string;
    content: string;
    mood: number;
}

export default function ReflectionModule() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    const [journals, setJournals] = useState<DailyJournal[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Form states (for today's entry)
    const [content, setContent] = useState('');
    const [mood, setMood] = useState(3);
    const [isSaving, setIsSaving] = useState(false);

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
            const journalsRes = await fetchApi('/reflection');
            setJournals(journalsRes);

            // Check if today already has an entry
            const today = new Date().toDateString();
            const todayEntry = journalsRes.find((j: DailyJournal) => new Date(j.date).toDateString() === today);

            if (todayEntry) {
                setContent(todayEntry.content);
                setMood(todayEntry.mood);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingData(false);
        }
    };

    const overrideSave = async () => {
        setIsSaving(true);
        try {
            const journal = await fetchApi('/reflection', {
                method: 'POST',
                body: JSON.stringify({ content, mood })
            });

            // Update local state by replacing the entry with the same ID or adding it
            setJournals(prev => {
                const idx = prev.findIndex(j => j.id === journal.id);
                if (idx !== -1) {
                    const newArr = [...prev];
                    newArr[idx] = journal;
                    return newArr;
                }
                return [journal, ...prev];
            });

        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || loadingData) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" size={48} /></div>;
    }

    const getMoodColor = (m: number) => {
        if (m >= 4) return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/30';
        if (m === 3) return 'text-amber-400 border-amber-500/50 bg-amber-950/30';
        return 'text-rose-400 border-rose-500/50 bg-rose-950/30';
    };

    return (
        <main className="min-h-screen p-8 md:p-16 max-w-5xl mx-auto flex flex-col gap-8">

            <header className="flex items-center gap-6 mb-4">
                <button
                    onClick={() => router.push('/')}
                    className="p-3 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-purple-500/50 transition-colors text-slate-400 group"
                >
                    <ArrowLeft className="group-hover:text-purple-400 transition-colors" />
                </button>
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 neon-text">
                        Personal Reflection
                    </h1>
                    <p className="text-purple-500/60 font-mono mt-1 text-sm uppercase">Consciousness Archive</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Today's Journal Entry */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 rounded-3xl border-purple-900/30 flex flex-col gap-6"
                >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-950/50 rounded-xl text-purple-400 border border-purple-900/50">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-200">Daily Upload</h2>
                                <p className="text-xs font-mono text-slate-500">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <button
                            onClick={overrideSave}
                            disabled={isSaving}
                            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl flex items-center gap-2 p-3 px-5 transition-colors font-bold text-sm"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} SAVE
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-slate-400 text-xs font-mono mb-3 uppercase tracking-wider">Overall Status (Mood)</label>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setMood(1)}
                                    className={`flex-1 py-4 rounded-xl border flex justify-center items-center transition-all ${mood === 1 ? getMoodColor(1) : 'bg-slate-900/40 border-slate-800 text-slate-600 hover:border-slate-700'}`}
                                >
                                    <Frown size={28} />
                                </button>
                                <button
                                    onClick={() => setMood(3)}
                                    className={`flex-1 py-4 rounded-xl border flex justify-center items-center transition-all ${mood === 3 ? getMoodColor(3) : 'bg-slate-900/40 border-slate-800 text-slate-600 hover:border-slate-700'}`}
                                >
                                    <Meh size={28} />
                                </button>
                                <button
                                    onClick={() => setMood(5)}
                                    className={`flex-1 py-4 rounded-xl border flex justify-center items-center transition-all ${mood === 5 ? getMoodColor(5) : 'bg-slate-900/40 border-slate-800 text-slate-600 hover:border-slate-700'}`}
                                >
                                    <Smile size={28} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-xs font-mono mb-3 uppercase tracking-wider">Memory Buffer (Thoughts)</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Log your neural activity..."
                                className="w-full h-64 bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-slate-200 outline-none focus:border-purple-500 transition-colors custom-scrollbar resize-none"
                            ></textarea>
                        </div>
                    </div>
                </motion.section>

                {/* Neural Log Archive */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-4"
                >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <h2 className="text-xl font-bold text-slate-200">Past Imprints</h2>
                        <div className="text-xs font-mono text-purple-500/50 uppercase">{journals.length} ENTRIES</div>
                    </div>

                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                        {journals.map((journal) => (
                            <div
                                key={journal.id}
                                className="p-5 rounded-xl border border-slate-800 bg-slate-900/30 flex flex-col gap-3 group hover:border-slate-700 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono text-slate-500">
                                        {new Date(journal.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                    <div className={`px-3 py-1 rounded-full border text-xs font-bold ${getMoodColor(journal.mood)}`}>
                                        LVL {journal.mood}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                                    {journal.content || <span className="italic opacity-50">Empty log data</span>}
                                </p>
                            </div>
                        ))}
                        {journals.length === 0 && (
                            <div className="text-center py-8 text-slate-600 font-mono text-sm border border-dashed border-slate-800 rounded-xl">
                                NO PAST IMPRINTS FOUND.<br />BEGIN LOGGING TO BUILD ARCHIVE.
                            </div>
                        )}
                    </div>
                </motion.section>

            </div>
        </main>
    );
}
