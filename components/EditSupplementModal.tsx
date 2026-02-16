'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Supplement } from '@/types';
import CustomAlert from './CustomAlert';

interface EditSupplementModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplement: Supplement | null;
  onUpdate: (id: string, updates: Partial<Supplement>) => void;
  onDelete: (id: string) => void;
}

const COMMON_ICONS = [
  '💊', '💉', '🧪', '⚗️', '🩺', '🌿', '🍃', '🌱',
  '☀️', '🐟', '🥛', '🫐', '🥕', '🍊', '🥗', '🍎',
  '💪', '🧠', '❤️', '🦴', '👁️', '🫀', '🫁', '💚',
];

export default function EditSupplementModal({
  isOpen,
  onClose,
  supplement,
  onUpdate,
  onDelete,
}: EditSupplementModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💊');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [reminderTime, setReminderTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 0]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Update state when supplement changes
  useEffect(() => {
    if (supplement) {
      setName(supplement.name);
      setIcon(supplement.icon);
      setFrequency(supplement.frequency || 'daily');
      setReminderTime(supplement.reminderTime || '');
      setSelectedDays(supplement.weekDays || [1, 2, 3, 4, 5, 6, 0]);
    }
  }, [supplement]);

  const handleUpdate = () => {
    if (!supplement || !name.trim()) return;

    onUpdate(supplement.id, {
      name: name.trim(),
      icon,
      frequency,
      reminderTime: reminderTime || undefined,
      weekDays: frequency === 'weekly' ? selectedDays : undefined,
    });

    setIsEditing(false);
    onClose();
  };

  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
  };

  const handleDeleteConfirm = () => {
    if (!supplement) return;
    onDelete(supplement.id);
    setShowDeleteAlert(false);
    onClose();
  };

  const handleDeleteCancel = () => {
    setShowDeleteAlert(false);
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  if (!supplement) return null;

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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Supplement bearbeiten' : 'Supplement verwalten'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 ios-button"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            {!isEditing ? (
              <div className="px-6 py-4">
                {/* Supplement Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl">{supplement.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{supplement.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {supplement.frequency === 'daily' ? 'Täglich' : 'Wöchentlich'}
                      {supplement.reminderTime && ` • ${supplement.reminderTime}`}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-purple-500 text-white rounded-xl font-semibold ios-button"
                  >
                    <Edit3 className="w-5 h-5" />
                    Bearbeiten
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-xl font-semibold ios-button"
                  >
                    <Trash2 className="w-5 h-5" />
                    Löschen
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold ios-button"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <>
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

                  {/* Week Days Selection */}
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
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                  <button
                    onClick={handleUpdate}
                    disabled={!name.trim()}
                    className={`w-full py-3 rounded-xl font-semibold ios-button ${
                      name.trim()
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}
                  >
                    Änderungen speichern
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold ios-button"
                  >
                    Abbrechen
                  </button>
                </div>
              </>
            )}
            </motion.div>
          </motion.div>

          {/* Delete Confirmation Alert */}
          <CustomAlert
            isOpen={showDeleteAlert}
            title="Supplement löschen"
            message={`Möchten Sie "${supplement?.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`}
            confirmText="Löschen"
            cancelText="Abbrechen"
            variant="destructive"
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
          />
        </>
      )}
    </AnimatePresence>
  );
}
