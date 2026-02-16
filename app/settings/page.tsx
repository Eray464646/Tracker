'use client';

import { useState } from 'react';
import { Bell, Moon, Globe, Lock, HelpCircle, Mail, Smartphone, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Push notifications for habits',
          type: 'toggle',
          value: notificationsEnabled,
          onChange: requestNotificationPermission,
        },
        {
          icon: Moon,
          label: 'Dark Mode',
          description: 'Coming soon',
          type: 'navigate',
        },
        {
          icon: Globe,
          label: 'Language',
          description: 'English',
          type: 'navigate',
        },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        {
          icon: Lock,
          label: 'Privacy',
          description: 'Manage your data',
          type: 'navigate',
        },
        {
          icon: Smartphone,
          label: 'Export Data',
          description: 'Download your habits',
          type: 'navigate',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & FAQ',
          description: 'Get support',
          type: 'navigate',
        },
        {
          icon: Mail,
          label: 'Contact Us',
          description: 'Send feedback',
          type: 'navigate',
        },
      ],
    },
  ];

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header with Large Title */}
      <div className="bg-white safe-area-top">
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Customize your experience</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* App Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ios-card p-6 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">✨</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">HabitFlow</h2>
          <p className="text-sm text-gray-500 mt-1">Version 1.0.0</p>
          <p className="text-xs text-gray-400 mt-2">
            Build better habits, one day at a time
          </p>
        </motion.div>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <div key={section.title}>
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="ios-card overflow-hidden divide-y divide-gray-100"
            >
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.onChange}
                    className="w-full px-4 py-3 flex items-center gap-3 ios-button text-left"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{item.label}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500">{item.description}</p>
                      )}
                    </div>
                    {item.type === 'toggle' ? (
                      <div
                        className={`w-12 h-7 rounded-full transition-colors ${
                          item.value ? 'bg-success-500' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform mt-0.5 ${
                            item.value ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </div>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
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
          className="ios-card p-4"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Install App</h3>
          <p className="text-sm text-gray-500 mb-4">
            Add HabitFlow to your home screen for the best experience
          </p>
          <button className="w-full bg-primary-500 text-white font-semibold py-3 rounded-xl ios-button">
            Add to Home Screen
          </button>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pb-4">
          <p>Made with ❤️ for better habits</p>
          <p className="mt-1">© 2024 HabitFlow. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
