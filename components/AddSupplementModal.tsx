'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Supplement } from '@/types';

interface AddSupplementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (supplement: Omit<Supplement, 'id' | 'streak' | 'takenToday'>) => void;
}

const COMMON_ICONS = [
  '💊', '💉', '🧪', '⚗️', '🩺', '🌿', '🍃', '🌱',
  '☀️', '🐟', '🥛', '🫐', '🥕', '🍊', '🥗', '🍎',
  '💪', '🧠', '❤️', '🦴', '👁️', '🫀', '🫁', '💚',
];

export default function AddSupplementModal({ isOpen, onClose, onAdd }: AddSupplementModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💊');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [reminderTime, setReminderTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 0]); // All days

  useEffect(() => {
    if (isOpen && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    onAdd({
      name: name.trim(),
      icon,
      frequency,
      reminderTime: reminderTime || undefined,
      weekDays: frequency === 'weekly' ? selectedDays : undefined,
    });

    // Reset form
    setName('');
    setIcon('💊');
    setFrequency('daily');
    setReminderTime('');
    setSelectedDays([1, 2, 3, 4, 5, 6, 0]);
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            {/* Modal - Fixed and Centered */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[90%] max-w-[400px] mx-auto max-h-[80vh] bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl"
            >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Neues Supplement</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 ios-button"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 max-h-[calc(85vh-140px)] overflow-y-auto">
              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="z.B. Vitamin D"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-0 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
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
                          ? 'bg-purple-500 ring-2 ring-purple-500'
                          : 'bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequenz
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFrequency('daily')}
                    className={`py-3 px-4 rounded-xl font-medium ios-button ${
                      frequency === 'daily'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Täglich
                  </button>
                  <button
                    onClick={() => setFrequency('weekly')}
                    className={`py-3 px-4 rounded-xl font-medium ios-button ${
                      frequency === 'weekly'
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Wöchentlich
                  </button>
                </div>
              </div>

              {/* Week Days Selection (for weekly frequency) */}
              {frequency === 'weekly' && (
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
                            ? 'bg-purple-500 text-white'
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
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-0 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
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
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}
              >
                Supplement hinzufügen
              </button>
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
