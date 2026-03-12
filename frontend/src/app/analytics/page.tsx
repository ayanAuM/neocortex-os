'use client';

import { motion } from 'framer-motion';
import { Clock, ArrowLeft, BarChart3, TrendingUp, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AnalyticsModule() {
    const router = useRouter();

    // A comprehensive version of this page would pull all historical data and graph it.
    // For this prototype, we're building a placeholder representing what the Analytics hub would look like.

    return (
        <main className="min-h-screen p-8 md:p-16 max-w-5xl mx-auto flex flex-col gap-8">

            <header className="flex items-center gap-6 mb-4">
                <button
                    onClick={() => router.push('/')}
                    className="p-3 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-blue-500/50 transition-colors text-slate-400 group"
                >
                    <ArrowLeft className="group-hover:text-blue-400 transition-colors" />
                </button>
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 neon-text">
                        Analytics & Progress
                    </h1>
                    <p className="text-blue-500/60 font-mono mt-1 text-sm uppercase">Global Aggregation Matrix</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Placeholder charts */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="col-span-1 md:col-span-2 glass-panel p-8 rounded-3xl border-blue-900/30 min-h-[400px] flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-200 flex items-center gap-3">
                            <BarChart3 className="text-blue-400" /> Focus Time Trends
                        </h2>
                        <div className="text-xs font-mono px-3 py-1 bg-blue-950/50 text-blue-400 rounded-full border border-blue-900/50">
                            LAST 30 DAYS
                        </div>
                    </div>

                    <div className="flex-1 border-b-2 border-l-2 border-slate-800 relative flex items-end px-4 gap-2 pb-0 pt-8">
                        {/* Mock Chart Bars */}
                        {[40, 60, 30, 80, 50, 90, 100, 70, 60, 85, 45, 95].map((height, i) => (
                            <div key={i} className="flex-1 flex justify-center h-full items-end group">
                                <div
                                    className="w-full max-w-[20px] bg-gradient-to-t from-blue-900 to-blue-500 rounded-t-sm opacity-50 group-hover:opacity-100 transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                                    style={{ height: `${height}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs font-mono text-slate-500">
                        <span>WEEK 1</span>
                        <span>WEEK 2</span>
                        <span>WEEK 3</span>
                        <span>WEEK 4</span>
                    </div>
                </motion.div>

                {/* System Vitals */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-1 flex flex-col gap-6"
                >
                    <div className="glass-panel p-6 rounded-3xl border-slate-800 flex-1">
                        <h3 className="text-slate-400 text-sm font-mono uppercase mb-4 flex items-center gap-2"><Zap size={16} /> Velocity</h3>
                        <div className="text-5xl font-black text-white">84<span className="text-xl text-slate-500">%</span></div>
                        <p className="text-emerald-400 text-sm mt-2">+12% vs last week</p>
                    </div>
                    <div className="glass-panel p-6 rounded-3xl border-slate-800 flex-1">
                        <h3 className="text-slate-400 text-sm font-mono uppercase mb-4 flex items-center gap-2"><TrendingUp size={16} /> Consistency</h3>
                        <div className="text-5xl font-black text-white">14<span className="text-xl text-slate-500">d</span></div>
                        <p className="text-blue-400 text-sm mt-2">Current streak active</p>
                    </div>
                </motion.div>

            </div>
        </main>
    );
}
