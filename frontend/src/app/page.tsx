'use client';

import { motion } from 'framer-motion';
import { Brain, Activity, BookOpen, Clock, Target, Calendar } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

const MODULES = [
  { id: 'islamic', title: 'Islamic Practices', icon: BookOpen, color: 'text-emerald-400', border: 'border-emerald-500/30' },
  { id: 'study', title: 'Study & Skills', icon: Brain, color: 'text-cyan-400', border: 'border-cyan-500/30' },
  { id: 'fitness', title: 'Fitness & Health', icon: Activity, color: 'text-rose-400', border: 'border-rose-500/30' },
  { id: 'productivity', title: 'Productivity', icon: Target, color: 'text-amber-400', border: 'border-amber-500/30' },
  { id: 'reflection', title: 'Reflection', icon: Calendar, color: 'text-purple-400', border: 'border-purple-500/30' },
  { id: 'analytics', title: 'Analytics', icon: Clock, color: 'text-blue-400', border: 'border-blue-500/30' },
];

export default function Home() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState([
    { label: 'Focus Time', value: '--', trend: '+0%' },
    { label: 'Tasks Done', value: '--/--', trend: '0%' },
    { label: 'Spiritual Score', value: '--/100', trend: 'Stable' },
    { label: 'Consistency', value: '--', trend: 'Streak' },
  ]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user) {
      // Fetch dynamic analytics
      fetchApi('/analytics/summary').then((data) => {
        setStats([
          { label: 'Focus Time', value: data.focusTime, trend: 'Total' },
          { label: 'Goals Reached', value: data.tasksDone, trend: 'Completed' },
          { label: 'Spiritual Score', value: data.spiritualScore, trend: 'Weekly %' },
          { label: 'Consistency', value: data.consistency, trend: 'Status' },
        ]);
      }).catch(console.error);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center font-mono text-cyan-500 neon-text">INITIALIZING CONSTRUCT...</div>;
  }

  return (
    <main className="min-h-screen p-8 md:p-16 max-w-7xl mx-auto flex flex-col gap-12">

      {/* Header Section */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 neon-text">
            NeoCortex OS
          </h1>
          <p className="text-slate-400 mt-2 text-lg tracking-wide uppercase">
            SYSTEM INITIALIZED. WELCOME BACK, {user.name || 'USER'}.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={logout}
            className="text-xs font-mono text-slate-500 hover:text-rose-400 transition-colors mr-2"
          >
            DISCONNECT
          </button>
          <div className="h-10 w-10 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center">
            <span className="text-cyan-400 font-bold">OS</span>
          </div>
        </div>
      </motion.header>

      {/* Main Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <Link href={`/${mod.id}`} key={mod.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className={`glass-panel rounded-2xl p-6 flex flex-col gap-4 cursor-pointer hover:neon-glow transition-all group ${mod.border} h-full`}
              >
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-lg bg-slate-900/50 group-hover:bg-slate-800/80 transition-colors ${mod.color}`}>
                    <Icon size={28} />
                  </div>
                  <div className="px-2 py-1 text-xs font-mono rounded-full bg-slate-900 text-slate-500 group-hover:text-cyan-400 transition-colors">
                    SYSLOG.ACTIVE
                  </div>
                </div>

                <div className="mt-4">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-100 group-hover:text-white transition-colors">
                    {mod.title}
                  </h2>
                  <div className="w-full h-1 bg-slate-800 mt-4 rounded-full overflow-hidden">
                    <div className={`h-full w-1/3 bg-current ${mod.color} opacity-70`} />
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </section>

      {/* Today's Overview Widget */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="glass-panel rounded-2xl p-8 border-slate-800"
      >
        <h3 className="text-xl font-bold mb-6 text-slate-300">System Activity Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-slate-200">{stat.value}</span>
                <span className="text-xs text-cyan-400 mb-1">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

    </main>
  );
}
