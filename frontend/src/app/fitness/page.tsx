'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, Loader2, Dumbbell, Apple, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';

interface Exercise {
    name: string;
    sets: number;
    reps: number;
    weight: number;
}

interface WorkoutLog {
    id: string;
    exercises: Exercise[];
}

interface Meal {
    type: string;
    food: string;
    calories: number;
}

interface DietLog {
    id: string;
    meals: Meal[];
}

export default function FitnessModule() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    const [workout, setWorkout] = useState<WorkoutLog | null>(null);
    const [diet, setDiet] = useState<DietLog | null>(null);
    const [loadingData, setLoadingData] = useState(true);

    // Form states
    const [newExercise, setNewExercise] = useState({ name: '', sets: 3, reps: 10, weight: 0 });
    const [newMeal, setNewMeal] = useState({ type: 'Breakfast', food: '', calories: 0 });

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
            const [workoutRes, dietRes] = await Promise.all([
                fetchApi('/fitness/workout/today'),
                fetchApi('/fitness/diet/today')
            ]);
            setWorkout(workoutRes);
            setDiet(dietRes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingData(false);
        }
    };

    const addExercise = async () => {
        if (!newExercise.name || !workout) return;

        const updatedExercises = [...workout.exercises, newExercise];
        const updatedWorkout = { ...workout, exercises: updatedExercises };

        setWorkout(updatedWorkout);
        setNewExercise({ name: '', sets: 3, reps: 10, weight: 0 });

        try {
            await fetchApi(`/fitness/workout/${workout.id}`, {
                method: 'PUT',
                body: JSON.stringify({ exercises: updatedExercises })
            });
        } catch (error) {
            console.error(error);
        }
    };

    const removeExercise = async (index: number) => {
        if (!workout) return;

        const updatedExercises = workout.exercises.filter((_, i) => i !== index);
        const updatedWorkout = { ...workout, exercises: updatedExercises };

        setWorkout(updatedWorkout);

        try {
            await fetchApi(`/fitness/workout/${workout.id}`, {
                method: 'PUT',
                body: JSON.stringify({ exercises: updatedExercises })
            });
        } catch (error) {
            console.error(error);
        }
    };

    const addMeal = async () => {
        if (!newMeal.food || !diet) return;

        const updatedMeals = [...diet.meals, newMeal];
        const updatedDiet = { ...diet, meals: updatedMeals };

        setDiet(updatedDiet);
        setNewMeal({ type: 'Breakfast', food: '', calories: 0 });

        try {
            await fetchApi(`/fitness/diet/${diet.id}`, {
                method: 'PUT',
                body: JSON.stringify({ meals: updatedMeals })
            });
        } catch (error) {
            console.error(error);
        }
    };

    const removeMeal = async (index: number) => {
        if (!diet) return;

        const updatedMeals = diet.meals.filter((_, i) => i !== index);
        const updatedDiet = { ...diet, meals: updatedMeals };

        setDiet(updatedDiet);

        try {
            await fetchApi(`/fitness/diet/${diet.id}`, {
                method: 'PUT',
                body: JSON.stringify({ meals: updatedMeals })
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading || loadingData) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-rose-500" size={48} /></div>;
    }

    const totalCalories = diet?.meals.reduce((acc, meal) => acc + (Number(meal.calories) || 0), 0) || 0;

    return (
        <main className="min-h-screen p-8 md:p-16 max-w-6xl mx-auto flex flex-col gap-8">

            <header className="flex items-center gap-6">
                <button
                    onClick={() => router.push('/')}
                    className="p-3 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-rose-500/50 transition-colors text-slate-400 group"
                >
                    <ArrowLeft className="group-hover:text-rose-400 transition-colors" />
                </button>
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500 neon-text">
                        Fitness & Health
                    </h1>
                    <p className="text-rose-500/60 font-mono mt-1 text-sm uppercase">Physical Vessel Optimization</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Workout Tracker */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 rounded-3xl border-rose-900/30 flex flex-col gap-6"
                >
                    <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                        <div className="p-3 bg-rose-950/50 rounded-xl text-rose-400 border border-rose-900/50">
                            <Dumbbell size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-200">Daily Workout</h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-12 gap-2">
                            <input
                                placeholder="Exercise (e.g. Bench Press)"
                                value={newExercise.name}
                                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                                className="col-span-12 md:col-span-5 bg-slate-900/50 border border-slate-700/50 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-rose-500"
                            />
                            <input
                                type="number" placeholder="Sets"
                                value={newExercise.sets || ''}
                                onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                                className="col-span-4 md:col-span-2 bg-slate-900/50 border border-slate-700/50 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-rose-500"
                            />
                            <input
                                type="number" placeholder="Reps"
                                value={newExercise.reps || ''}
                                onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) })}
                                className="col-span-4 md:col-span-2 bg-slate-900/50 border border-slate-700/50 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-rose-500"
                            />
                            <input
                                type="number" placeholder="Lbs/Kg"
                                value={newExercise.weight || ''}
                                onChange={(e) => setNewExercise({ ...newExercise, weight: parseInt(e.target.value) })}
                                className="col-span-4 md:col-span-2 bg-slate-900/50 border border-slate-700/50 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-rose-500"
                            />
                            <button
                                onClick={addExercise}
                                className="col-span-12 md:col-span-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg flex items-center justify-center p-2 transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2 mt-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {workout?.exercises.map((ex, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-900/40 border border-slate-800 rounded-xl group hover:border-slate-700">
                                    <div>
                                        <h3 className="font-bold text-slate-200">{ex.name}</h3>
                                        <p className="text-slate-500 text-sm font-mono mt-1">
                                            {ex.sets} SETS × {ex.reps} REPS <span className="text-rose-500/50 mx-2">|</span> {ex.weight} LBS
                                        </p>
                                    </div>
                                    <button onClick={() => removeExercise(i)} className="text-slate-600 hover:text-rose-500 transition-colors p-2">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {workout?.exercises.length === 0 && (
                                <div className="text-center py-8 text-slate-600 font-mono text-sm border border-dashed border-slate-800 rounded-xl">
                                    NO EXERCISES LOGGED TODAY
                                </div>
                            )}
                        </div>
                    </div>
                </motion.section>

                {/* Diet & Nutrition */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-3xl border-orange-900/30 flex flex-col gap-6"
                >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-950/50 rounded-xl text-orange-400 border border-orange-900/50">
                                <Apple size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-200">Nutrition</h2>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">
                                {totalCalories}
                            </div>
                            <p className="text-xs font-mono uppercase text-slate-500">KCAL INTAKE</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-12 gap-2">
                            <select
                                value={newMeal.type}
                                onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
                                className="col-span-12 md:col-span-3 bg-slate-900/50 border border-slate-700/50 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-orange-500"
                            >
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Dinner</option>
                                <option>Snack</option>
                            </select>
                            <input
                                placeholder="Food items..."
                                value={newMeal.food}
                                onChange={(e) => setNewMeal({ ...newMeal, food: e.target.value })}
                                className="col-span-8 md:col-span-5 bg-slate-900/50 border border-slate-700/50 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-orange-500"
                            />
                            <input
                                type="number"
                                placeholder="Kcal"
                                value={newMeal.calories || ''}
                                onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value) })}
                                className="col-span-4 md:col-span-3 bg-slate-900/50 border border-slate-700/50 rounded-lg p-2 text-sm text-slate-200 outline-none focus:border-orange-500"
                            />
                            <button
                                onClick={addMeal}
                                className="col-span-12 md:col-span-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg flex items-center justify-center p-2 transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2 mt-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {diet?.meals.map((meal, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-900/40 border border-slate-800 rounded-xl group hover:border-slate-700">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-orange-400">{meal.type}</span>
                                            <h3 className="font-medium text-slate-200">{meal.food}</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-slate-300 font-bold">{meal.calories} <span className="text-xs text-slate-500">kcal</span></span>
                                        <button onClick={() => removeMeal(i)} className="text-slate-600 hover:text-orange-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {diet?.meals.length === 0 && (
                                <div className="text-center py-8 text-slate-600 font-mono text-sm border border-dashed border-slate-800 rounded-xl">
                                    NO MEALS LOGGED TODAY
                                </div>
                            )}
                        </div>
                    </div>
                </motion.section>

            </div>
        </main>
    );
}
