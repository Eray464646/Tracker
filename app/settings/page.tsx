'use client';

import { useState } from 'react';
import { Bell, Moon, Globe, Lock, HelpCircle, Mail, Smartphone, ChevronRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AppData } from '@/types';

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        // Show a test notification
        new Notification('HabitFlow Benachrichtigungen', {
          body: 'Benachrichtigungen sind jetzt aktiviert! 🎉',
          icon: '/icons/icon-192x192.png',
        });
      }
    }
  };

  const exportData = () => {
    try {
      // Gather all data from localStorage
      const habits = localStorage.getItem('habits');
      const supplements = localStorage.getItem('supplements');
      const waterIntake = localStorage.getItem('water-intake');
      const tasks = localStorage.getItem('tasks') || '[]';

      const appData: AppData = {
        habits: habits ? JSON.parse(habits) : [],
        tasks: tasks ? JSON.parse(tasks) : [],
        supplements: supplements ? JSON.parse(supplements) : [],
        waterIntake: waterIntake ? parseInt(waterIntake) : 0,
        lastUpdated: new Date().toISOString(),
      };

      // Create JSON file
      const dataStr = JSON.stringify(appData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Download file
      const link = document.createElement('a');
      link.href = url;
      link.download = `habitflow-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // TODO: Replace alert with toast notification for better UX
      alert('✅ Daten erfolgreich exportiert!');
    } catch (error) {
      console.error('Export failed:', error);
      // TODO: Replace alert with toast notification for better UX
      alert('❌ Fehler beim Exportieren der Daten');
    }
  };

  const settingsSections = [
    {
      title: 'Einstellungen',
      items: [
        {
          icon: Bell,
          label: 'Benachrichtigungen',
          description: 'Push-Benachrichtigungen für Gewohnheiten',
          type: 'toggle',
          value: notificationsEnabled,
          onChange: requestNotificationPermission,
        },
        {
          icon: Moon,
          label: 'Dunkler Modus',
          description: 'Folgt den Systemeinstellungen',
          type: 'info',
        },
        {
          icon: Globe,
          label: 'Sprache',
          description: 'Deutsch',
          type: 'navigate',
        },
      ],
    },
    {
      title: 'Daten & Datenschutz',
      items: [
        {
          icon: Lock,
          label: 'Datenschutz',
          description: 'Verwalte deine Daten',
          type: 'navigate',
        },
        {
          icon: Download,
          label: 'Daten exportieren',
          description: 'Lade deine Gewohnheiten als JSON herunter',
          type: 'action',
          onChange: exportData,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Hilfe & FAQ',
          description: 'Erhalte Unterstützung',
          type: 'navigate',
        },
        {
          icon: Mail,
          label: 'Kontakt',
          description: 'Sende Feedback',
          type: 'navigate',
        },
      ],
    },
  ];

  return (
    <div className="min-h-full bg-gray-50 dark:bg-black max-w-[430px] mx-auto">
      {/* Header with Large Title */}
      <div className="bg-white dark:bg-gray-900 safe-area-top">
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-4xl font-bold tracking-tight dark:text-white">Einstellungen</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Passe dein Erlebnis an</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* App Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          className="ios-card dark:bg-[#1C1C1E] p-6 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">✨</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">HabitFlow</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Version 1.0.0</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Baue bessere Gewohnheiten auf, Tag für Tag
          </p>
        </motion.div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <div key={section.title}>
            <h3 className="px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="ios-card dark:bg-[#1C1C1E] overflow-hidden divide-y divide-gray-100 dark:divide-gray-800"
            >
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.label}
                    onClick={item.onChange}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 flex items-center gap-3 ios-button text-left"
                    disabled={item.type === 'info'}
                  >
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                      )}
                    </div>
                    {item.type === 'toggle' ? (
                      <div
                        className={`w-12 h-7 rounded-full transition-colors ${
                          ('value' in item && item.value) ? 'bg-success-500' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform mt-0.5 ${
                            ('value' in item && item.value) ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </div>
                    ) : item.type === 'info' ? (
                      <span className="text-xs text-gray-400 dark:text-gray-500">Auto</span>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        ))}

        {/* Install PWA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.98 }}
          className="ios-card dark:bg-[#1C1C1E] p-4"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">App installieren</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Füge HabitFlow zu deinem Startbildschirm hinzu für das beste Erlebnis
          </p>
          <motion.button 
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary-500 text-white font-semibold py-3 rounded-xl ios-button"
          >
            Zum Startbildschirm hinzufügen
          </motion.button>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 pb-4">
          <p>Mit ❤️ für bessere Gewohnheiten gemacht</p>
          <p className="mt-1">© 2024 HabitFlow. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </div>
  );
}
