'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Task } from '@/types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
}

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      priority,
      dueDate: dueDate || undefined,
    });

    // Reset form
    setTitle('');
    setPriority('medium');
    setDueDate('');
    onClose();
  };

  const priorityColors = {
    low: 'bg-blue-500',
    medium: 'bg-orange-500',
    high: 'bg-red-500',
  };

  const priorityLabels = {
    low: 'Niedrig',
    medium: 'Mittel',
    high: 'Hoch',
  };

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          />

          {/* Modal - Centered on screen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="w-[90%] max-w-[400px] mx-auto max-h-[85vh] bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl pointer-events-auto"
            >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Neue Aufgabe</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 ios-button"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              {/* Title Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="z.B. Einkaufen gehen"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-0 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              </div>

              {/* Priority Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priorität
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`py-3 px-4 rounded-xl font-medium ios-button ${
                        priority === p
                          ? `${priorityColors[p]} text-white`
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {priorityLabels[p]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fälligkeitsdatum (Optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-0 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={handleSubmit}
                disabled={!title.trim()}
                className={`w-full py-3 rounded-xl font-semibold ios-button ${
                  title.trim()
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}
              >
                Aufgabe hinzufügen
              </button>
            </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
