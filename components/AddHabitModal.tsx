'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Habit } from '@/types';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id' | 'completedToday' | 'createdAt'>) => void;
}

const COMMON_ICONS = [
  '🧘', '📚', '💪', '🥗', '🏃', '🚴', '🧘‍♀️', '💧',
  '☕', '🛌', '🎨', '✍️', '🎵', '🧹', '💼', '🎯',
  '🌅', '🌙', '⏰', '📱', '🧠', '❤️', '🌟', '✨',
];

export default function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('✨');
  const [rhythm, setRhythm] = useState<'daily' | 'weekly'>('daily');
  const [reminderTime, setReminderTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri

  const handleSubmit = () => {
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      icon,
      rhythm,
      reminderTime: reminderTime || undefined,
      weekDays: rhythm === 'weekly' ? selectedDays : undefined,
    });

    // Reset form
    setName('');
    setIcon('✨');
    setRhythm('daily');
    setReminderTime('');
    setSelectedDays([1, 2, 3, 4, 5]);
    onClose();
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white dark:bg-gray-900 rounded-t-3xl z-50 safe-area-bottom"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Neue Gewohnheit</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 ios-button"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="z.B. Morgenmeditation"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-0 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              </div>

              {/* Icon Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {COMMON_ICONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setIcon(emoji)}
                      className={`aspect-square rounded-xl flex items-center justify-center text-2xl ios-button ${
                        icon === emoji
                          ? 'bg-primary-500 ring-2 ring-primary-500'
                          : 'bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rhythm Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rhythmus
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setRhythm('daily')}
                    className={`py-3 px-4 rounded-xl font-medium ios-button ${
                      rhythm === 'daily'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Täglich
                  </button>
                  <button
                    onClick={() => setRhythm('weekly')}
                    className={`py-3 px-4 rounded-xl font-medium ios-button ${
                      rhythm === 'weekly'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Wöchentlich
                  </button>
                </div>
              </div>

              {/* Week Days Selection (for weekly rhythm) */}
              {rhythm === 'weekly' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Wochentage
                  </label>
                  <div className="flex gap-2">
                    {weekDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => toggleDay(index)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium ios-button ${
                          selectedDays.includes(index)
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reminder Time */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Erinnerung (Optional)
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-0 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className={`w-full py-3 rounded-xl font-semibold ios-button ${
                  name.trim()
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}
              >
                Gewohnheit hinzufügen
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
