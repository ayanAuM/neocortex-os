'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft, Play, Square, Loader2, Code, FileVideo, Book, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';

interface StudyLog {
    id: string;
    duration: number; // in minutes
    topic: string;
    date: string;
}

const TOPICS = [
    { id: 'coding', name: 'Programming / Code', icon: Code, color: 'text-cyan-400', bg: 'bg-cyan-950/50', border: 'border-cyan-800' },
    { id: 'course', name: 'Online Course', icon: FileVideo, color: 'text-purple-400', bg: 'bg-purple-950/50', border: 'border-purple-800' },
    { id: 'reading', name: 'Reading / Book', icon: Book, color: 'text-emerald-400', bg: 'bg-emerald-950/50', border: 'border-emerald-800' },
    { id: 'other', name: 'Other Skill', icon: Brain, color: 'text-amber-400', bg: 'bg-amber-950/50', border: 'border-amber-800' }
];

export default function StudyModule() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    const [logs, setLogs] = useState<StudyLog[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Timer State
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState(0); // in seconds
    const [selectedTopic, setSelectedTopic] = useState('coding');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            loadLogs();
        }
    }, [user, isLoading]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setTime((time) => time + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const loadLogs = async () => {
        try {
            const data = await fetchApi('/study');
            setLogs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleStop = async () => {
        if (time < 60) {
            alert("Session too short to log (minimum 1 minute).");
            setIsActive(false);
            setTime(0);
            return;
        }

        const durationMinutes = Math.floor(time / 60);

        setIsActive(false);

        try {
            const newLog = await fetchApi('/study', {
                method: 'POST',
                body: JSON.stringify({
                    topic: selectedTopic,
                    duration: durationMinutes
                })
            });
            setLogs([newLog, ...logs]);
            setTime(0);
        } catch (error) {
            console.error(error);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (isLoading || loadingData) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-cyan-500" size={48} /></div>;
    }

    return (
        <main className="min-h-screen p-8 md:p-16 max-w-5xl mx-auto flex flex-col gap-8">

            <header className="flex items-center gap-6">
                <button
                    onClick={() => router.push('/')}
                    className="p-3 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-cyan-500/50 transition-colors text-slate-400 group"
                >
                    <ArrowLeft className="group-hover:text-cyan-400 transition-colors" />
                </button>
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 neon-text">
                        Study & Skills
                    </h1>
                    <p className="text-cyan-500/60 font-mono mt-1 text-sm uppercase">Neural Expansion Protocol</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Active Session Tracker */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 rounded-3xl border-cyan-900/30 flex flex-col items-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-cyan-900/10 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent opacity-50" />

                    <h2 className="text-slate-400 font-mono uppercase tracking-widest text-sm mb-6">Focus Session</h2>

                    <div className={`text-7xl md:text-8xl font-black mb-8 font-mono tracking-tighter ${isActive ? 'text-cyan-400 neon-text' : 'text-slate-500'}`}>
                        {formatTime(time)}
                    </div>

                    <div className="flex gap-4 mb-8 w-full overflow-x-auto pb-4 hide-scrollbar justify-center">
                        {TOPICS.map((t) => {
                            const TIcon = t.icon;
                            return (
                                <button
                                    key={t.id}
                                    disabled={isActive}
                                    onClick={() => setSelectedTopic(t.id)}
                                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 min-w-[80px] transition-all
                    ${selectedTopic === t.id ? `${t.bg} ${t.border} ${t.color}` : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'}
                    ${isActive ? 'cursor-not-allowed opacity-30' : 'hover:border-slate-600 hover:opacity-100'}
                  `}
                                >
                                    <TIcon size={24} />
                                    <span className="text-[10px] font-mono uppercase">{t.name.split(' ')[0]}</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="flex gap-6 w-full max-w-xs">
                        {!isActive ? (
                            <button
                                onClick={() => setIsActive(true)}
                                className="w-full flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                            >
                                <Play size={20} className="fill-current" /> INITIATE LINK
                            </button>
                        ) : (
                            <button
                                onClick={handleStop}
                                className="w-full flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)]"
                            >
                                <Square size={20} className="fill-current" /> SEVER CONNECTION
                            </button>
                        )}
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
                        <h2 className="text-xl font-bold text-slate-200">Neural Archive</h2>
                        <div className="text-xs font-mono text-cyan-500/50 uppercase">{logs.length} RECORDS</div>
                    </div>

                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                        {logs.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 font-mono text-sm border-2 border-dashed border-slate-800 rounded-2xl">
                                NO NEURAL IMPRINTS FOUND.<br />INITIATE A FOCUS SESSION TO BEGIN.
                            </div>
                        ) : (
                            logs.map((log) => {
                                const topicData = TOPICS.find(t => t.id === log.topic) || TOPICS[3];
                                const TIcon = topicData.icon;

                                return (
                                    <div key={log.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between group hover:border-slate-700 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${topicData.bg} ${topicData.color} border ${topicData.border}`}>
                                                <TIcon size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-300 group-hover:text-white transition-colors">{topicData.name}</h4>
                                                <p className="text-xs text-slate-500 font-mono">
                                                    {new Date(log.date).toLocaleDateString()} @ {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-black text-cyan-400">{log.duration}<span className="text-sm font-medium text-cyan-600 ml-1">MIN</span></div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </motion.section>

            </div>
        </main>
    );
}
