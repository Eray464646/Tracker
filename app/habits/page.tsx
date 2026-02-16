'use client';

import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Flame, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Habit } from '@/types';
import AddHabitModal from '@/components/AddHabitModal';
import EditHabitModal from '@/components/EditHabitModal';
import SwipeableCard from '@/components/SwipeableCard';
import CustomAlert from '@/components/CustomAlert';

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  useEffect(() => {
    // Load habits from localStorage
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  const toggleHabit = (id: string) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, completedToday: !habit.completedToday } : habit
    );
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'completedToday' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      completedToday: false,
      createdAt: new Date().toISOString(),
    };
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, ...updates } : habit
    );
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const deleteHabit = (id: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    setHabits(updatedHabits);
    localStorage.setItem('habits', JSON.stringify(updatedHabits));
    setHabitToDelete(null);
  };

  const handleHabitSwipeLeft = (habit: Habit) => {
    setHabitToDelete(habit);
  };

  const completedToday = habits.filter((h) => h.completedToday).length;
  const totalHabits = habits.length;

  return (
    <div className="min-h-full bg-gray-50 dark:bg-black max-w-[430px] mx-auto">
      {/* Header with Large Title */}
      <div className="bg-white dark:bg-gray-900 safe-area-top">
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-4xl font-bold tracking-tight dark:text-white">Gewohnheiten</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
            className="ios-card dark:bg-[#1C1C1E] p-4 text-center"
          >
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedToday}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Heute abgeschlossen</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            whileTap={{ scale: 0.95 }}
            className="ios-card dark:bg-[#1C1C1E] p-4 text-center"
          >
            <Target className="w-6 h-6 text-primary-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round((completedToday / totalHabits) * 100) || 0}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Fortschritt</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileTap={{ scale: 0.95 }}
            className="ios-card dark:bg-[#1C1C1E] p-4 text-center"
          >
            <TrendingUp className="w-6 h-6 text-success-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalHabits}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aktive Gewohnheiten</p>
          </motion.div>
        </div>

        {/* Habits List */}
        <div className="space-y-3">
          {habits.map((habit, index) => (
            <SwipeableCard
              key={habit.id}
              onSwipeRight={() => toggleHabit(habit.id)}
              onSwipeLeft={() => handleHabitSwipeLeft(habit)}
              onLongPress={() => setEditingHabit(habit)}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="ios-card dark:bg-[#1C1C1E] p-4 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {habit.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold ${habit.completedToday ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                      {habit.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {habit.rhythm === 'daily' ? 'Täglich' : 'Wöchentlich'}
                        {habit.reminderTime && ` • ${habit.reminderTime}`}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      habit.completedToday
                        ? 'bg-success-500 border-success-500'
                        : 'border-gray-300 dark:border-gray-600'
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
            </SwipeableCard>
          ))}
        </div>

        {/* Add Habit Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddHabitModal(true)}
          className="w-full ios-card dark:bg-[#1C1C1E] p-4 flex items-center justify-center gap-2 text-primary-500 dark:text-primary-400 font-semibold ios-button"
        >
          <Plus className="w-5 h-5" />
          Gewohnheit hinzufügen
        </motion.button>

        {/* Habit Templates */}
        <div className="ios-card dark:bg-[#1C1C1E] p-4">
          <h2 className="text-lg font-semibold dark:text-white mb-3">Vorgeschlagene Gewohnheiten</h2>
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
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 ios-button text-left"
              >
                <span className="text-2xl">{template.icon}</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{template.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddHabitModal
        isOpen={showAddHabitModal}
        onClose={() => setShowAddHabitModal(false)}
        onAdd={addHabit}
      />
      <EditHabitModal
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        habit={editingHabit}
        onUpdate={updateHabit}
        onDelete={deleteHabit}
      />

      {/* Delete Confirmation */}
      <CustomAlert
        isOpen={!!habitToDelete}
        title="Gewohnheit löschen"
        message={`Möchten Sie "${habitToDelete?.name}" wirklich löschen?`}
        confirmText="Löschen"
        cancelText="Abbrechen"
        variant="destructive"
        onConfirm={() => habitToDelete && deleteHabit(habitToDelete.id)}
        onCancel={() => setHabitToDelete(null)}
      />
    </div>
  );
}
