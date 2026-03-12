'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowLeft, Loader2, CheckCircle2, Circle, Plus, Trash2, Calendar, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';

interface Habit {
    id: string;
    habitName: string;
    schedule: string;
    isCompletedToday?: boolean; // Mock property for UI
}

interface Goal {
    id: string;
    title: string;
    deadline: string | null;
    status: string;
}

export default function ProductivityModule() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    const [habits, setHabits] = useState<Habit[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Form states
    const [newHabitName, setNewHabitName] = useState('');
    const [newGoalTitle, setNewGoalTitle] = useState('');

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
            const [habitsRes, goalsRes] = await Promise.all([
                fetchApi('/productivity/habits'),
                fetchApi('/productivity/goals')
            ]);
            setHabits(habitsRes);
            setGoals(goalsRes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingData(false);
        }
    };

    /* ----- Habits ----- */
    const addHabit = async () => {
        if (!newHabitName) return;
        try {
            const habit = await fetchApi('/productivity/habits', {
                method: 'POST',
                body: JSON.stringify({ habitName: newHabitName, schedule: 'daily' })
            });
            setHabits([habit, ...habits]);
            setNewHabitName('');
        } catch (error) {
            console.error(error);
        }
    };

    const deleteHabit = async (id: string) => {
        try {
            await fetchApi(`/productivity/habits/${id}`, { method: 'DELETE' });
            setHabits(habits.filter(h => h.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleHabitCompletion = (id: string) => {
        // Optimistic UI toggle for today (doesn't persist to DB in this simple version)
        setHabits(habits.map(h => h.id === id ? { ...h, isCompletedToday: !h.isCompletedToday } : h));
    };


    /* ----- Goals ----- */
    const addGoal = async () => {
        if (!newGoalTitle) return;
        try {
            const goal = await fetchApi('/productivity/goals', {
                method: 'POST',
                body: JSON.stringify({ title: newGoalTitle, deadline: null })
            });
            setGoals([goal, ...goals]);
            setNewGoalTitle('');
        } catch (error) {
            console.error(error);
        }
    };

    const toggleGoalStatus = async (goal: Goal) => {
        const newStatus = goal.status === 'in_progress' ? 'achieved' : 'in_progress';
        try {
            await fetchApi(`/productivity/goals/${goal.id}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            });
            setGoals(goals.map(g => g.id === goal.id ? { ...g, status: newStatus } : g));
        } catch (error) {
            console.error(error);
        }
    };

    // --------------------------------

    if (isLoading || loadingData) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" size={48} /></div>;
    }

    const completedGoals = goals.filter(g => g.status === 'achieved').length;

    return (
        <main className="min-h-screen p-8 md:p-16 max-w-6xl mx-auto flex flex-col gap-8">

            <header className="flex items-center gap-6 mb-4">
                <button
                    onClick={() => router.push('/')}
                    className="p-3 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-amber-500/50 transition-colors text-slate-400 group"
                >
                    <ArrowLeft className="group-hover:text-amber-400 transition-colors" />
                </button>
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 neon-text">
                        Productivity System
                    </h1>
                    <p className="text-amber-500/60 font-mono mt-1 text-sm uppercase">Habit & Trajectory Optimization</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Habit Tracker */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 rounded-3xl border-amber-900/30 flex flex-col gap-6"
                >
                    <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                        <div className="p-3 bg-amber-950/50 rounded-xl text-amber-400 border border-amber-900/50">
                            <Calendar size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-200">Daily Habits</h2>
                    </div>

                    <div className="flex gap-2">
                        <input
                            placeholder="New habit (e.g. Read 10 pages)"
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
                            className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-amber-500"
                        />
                        <button
                            onClick={addHabit}
                            className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl flex items-center justify-center p-3 px-5 transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 mt-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {habits.map((habit) => (
                            <div
                                key={habit.id}
                                onClick={() => toggleHabitCompletion(habit.id)}
                                className={`flex justify-between items-center p-4 rounded-xl border cursor-pointer group transition-all
                  ${habit.isCompletedToday ? 'bg-amber-900/20 border-amber-500/50' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}
                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`transition-colors ${habit.isCompletedToday ? 'text-amber-400' : 'text-slate-600'}`}>
                                        {habit.isCompletedToday ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                    </div>
                                    <h3 className={`font-medium transition-colors ${habit.isCompletedToday ? 'text-slate-200 line-through opacity-70' : 'text-slate-200'}`}>
                                        {habit.habitName}
                                    </h3>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id); }}
                                    className="text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-2"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {habits.length === 0 && (
                            <div className="text-center py-8 text-slate-600 font-mono text-sm border border-dashed border-slate-800 rounded-xl">
                                NO HABITS DEFINED.<br />SYSTEM ATROPHY DETECTED.
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* Goals & Trajectory */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-3xl border-orange-900/30 flex flex-col gap-6"
                >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-950/50 rounded-xl text-orange-400 border border-orange-900/50">
                                <Target size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-200">Active Goals</h2>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                                {completedGoals}/{goals.length}
                            </div>
                            <p className="text-xs font-mono uppercase text-slate-500">ACHIEVED</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <input
                            placeholder="Define new trajectory (e.g. Master React)"
                            value={newGoalTitle}
                            onChange={(e) => setNewGoalTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                            className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-orange-500"
                        />
                        <button
                            onClick={addGoal}
                            className="bg-orange-600 hover:bg-orange-500 text-white rounded-xl flex items-center justify-center p-3 px-5 transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 mt-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {goals.map((goal) => {
                            const isAchieved = goal.status === 'achieved';
                            return (
                                <div
                                    key={goal.id}
                                    className={`flex flex-col p-4 rounded-xl border group transition-all
                    ${isAchieved ? 'bg-orange-900/10 border-orange-500/30' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}
                  `}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className={`font-medium transition-colors ${isAchieved ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                                                {goal.title}
                                            </h3>
                                            {goal.deadline && (
                                                <p className="text-xs font-mono text-slate-500 mt-1">DEADLINE: {new Date(goal.deadline).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => toggleGoalStatus(goal)}
                                            className={`p-2 rounded-lg border transition-colors ${isAchieved
                                                    ? 'bg-orange-500 border-orange-400 text-black'
                                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-orange-400 hover:border-orange-500/50'
                                                }`}
                                        >
                                            <Trophy size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {goals.length === 0 && (
                            <div className="text-center py-8 text-slate-600 font-mono text-sm border border-dashed border-slate-800 rounded-xl">
                                NO ACTIVE GOALS.<br />DEFINE MISSION PARAMETERS.
                            </div>
                        )}
                    </div>
                </motion.section>

            </div>
        </main>
    );
}
