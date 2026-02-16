'use client';

import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Flame, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  streak: number;
  completedToday: boolean;
  frequency: 'daily' | 'weekly';
  targetDays?: number;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    // Load habits from localStorage
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      // Default habits for demo
      const defaultHabits: Habit[] = [
        {
          id: '1',
          name: 'Morgenmeditation',
          icon: '🧘',
          color: '#34C759',
          streak: 7,
          completedToday: false,
          frequency: 'daily',
        },
        {
          id: '2',
          name: '30 Minuten lesen',
          icon: '📚',
          color: '#007AFF',
          streak: 12,
          completedToday: false,
          frequency: 'daily',
        },
        {
          id: '3',
          name: 'Training',
          icon: '💪',
          color: '#FF3B30',
          streak: 5,
          completedToday: false,
          frequency: 'weekly',
          targetDays: 4,
        },
        {
          id: '4',
          name: '2L Wasser trinken',
          icon: '💧',
          color: '#5AC8FA',
          streak: 15,
          completedToday: false,
          frequency: 'daily',
        },
      ];
      setHabits(defaultHabits);
      localStorage.setItem('habits', JSON.stringify(defaultHabits));
    }
  }, []);

  const toggleHabit = (id: string) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const newCompleted = !habit.completedToday;
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1),
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const totalStreak = habits.reduce((acc, habit) => acc + habit.streak, 0);
  const completedToday = habits.filter((h) => h.completedToday).length;

  return (
    <div className="min-h-full bg-gray-50 max-w-[430px] mx-auto">
      {/* Header with Large Title */}
      <div className="bg-white safe-area-top">
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-4xl font-bold tracking-tight">Gewohnheiten</h1>
          <p className="text-sm text-gray-500 mt-1">
            Baue bessere Gewohnheiten auf, Tag für Tag
          </p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            className="ios-card p-4 text-center"
          >
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalStreak}</p>
            <p className="text-xs text-gray-500 mt-1">Serie gesamt</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            whileTap={{ scale: 0.95 }}
            className="ios-card p-4 text-center"
          >
            <Target className="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
            <p className="text-xs text-gray-500 mt-1">Heute erledigt</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileTap={{ scale: 0.95 }}
            className="ios-card p-4 text-center"
          >
            <TrendingUp className="w-6 h-6 text-success-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{habits.length}</p>
            <p className="text-xs text-gray-500 mt-1">Aktive Gewohnheiten</p>
          </motion.div>
        </div>

        {/* Habits List */}
        <div className="space-y-3">
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              className="ios-card p-4 ios-button cursor-pointer"
              onClick={() => toggleHabit(habit.id)}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: habit.color + '20' }}
                >
                  {habit.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 capitalize">
                      {habit.frequency === 'daily' ? 'Täglich' : 'Wöchentlich'}
                      {habit.targetDays && ` • ${habit.targetDays}x/Woche`}
                    </span>
                    <span className="text-xs text-orange-500 flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {habit.streak} Tage
                    </span>
                  </div>
                </div>
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    habit.completedToday
                      ? 'bg-success-500 border-success-500'
                      : 'border-gray-300'
                  }`}
                >
                  {habit.completedToday && (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Habit Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
          className="w-full ios-card p-4 flex items-center justify-center gap-2 text-primary-500 font-semibold ios-button"
        >
          <Plus className="w-5 h-5" />
          Gewohnheit hinzufügen
        </motion.button>

        {/* Habit Templates */}
        <div className="ios-card p-4">
          <h2 className="text-lg font-semibold mb-3">Vorgeschlagene Gewohnheiten</h2>
          <div className="space-y-2">
            {[
              { name: 'Tagebuch schreiben', icon: '✍️' },
              { name: 'Sprache lernen', icon: '🗣️' },
              { name: 'Yoga', icon: '🧘‍♀️' },
              { name: 'Gesund essen', icon: '🥗' },
            ].map((template, index) => (
              <motion.button
                key={template.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 ios-button text-left"
              >
                <span className="text-2xl">{template.icon}</span>
                <span className="font-medium text-gray-700">{template.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
