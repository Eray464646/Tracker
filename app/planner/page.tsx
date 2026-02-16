'use client';

import { useState } from 'react';
import { Calendar, Plus, Clock, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface Event {
  id: string;
  title: string;
  time: string;
  date: string;
  type: 'meeting' | 'task' | 'reminder';
  color: string;
}

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Team Standup',
      time: '09:00',
      date: new Date().toISOString().split('T')[0],
      type: 'meeting',
      color: '#007AFF',
    },
    {
      id: '2',
      title: 'PR überprüfen',
      time: '11:00',
      date: new Date().toISOString().split('T')[0],
      type: 'task',
      color: '#34C759',
    },
    {
      id: '3',
      title: 'Mittagspause',
      time: '12:30',
      date: new Date().toISOString().split('T')[0],
      type: 'reminder',
      color: '#FF9500',
    },
  ]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate);
  const monthName = selectedDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  const exportToCalendar = () => {
    // Create ICS file content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HabitFlow//DE',
      ...events.map(event => {
        const eventDate = new Date(event.date + 'T' + event.time);
        const dtstart = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        return [
          'BEGIN:VEVENT',
          `DTSTART:${dtstart}`,
          `SUMMARY:${event.title}`,
          `UID:${event.id}@habitflow.app`,
          'END:VEVENT',
        ].join('\r\n');
      }),
      'END:VCALENDAR',
    ].join('\r\n');

    // Create blob and download
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'habitflow-termine.ics';
    link.click();
    URL.revokeObjectURL(url);
  };

  const typeLabels: Record<string, string> = {
    meeting: 'Termin',
    task: 'Aufgabe',
    reminder: 'Erinnerung'
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-black max-w-[430px] mx-auto">
      {/* Header with Large Title */}
      <div className="bg-white dark:bg-gray-900 safe-area-top">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight dark:text-white">Planer</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Plane und organisiere deinen Tag</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={exportToCalendar}
              className="ios-button p-2 rounded-full bg-primary-50"
            >
              <Download className="w-5 h-5 text-primary-500" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Mini Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          className="ios-card dark:bg-[#1C1C1E] p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold dark:text-white">{monthName}</h2>
            <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                {day}
              </div>
            ))}
            
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const isToday = day === new Date().getDate() &&
                selectedDate.getMonth() === new Date().getMonth() &&
                selectedDate.getFullYear() === new Date().getFullYear();
              
              return (
                <motion.button
                  key={day}
                  whileTap={{ scale: 0.9 }}
                  className={`aspect-square rounded-full flex items-center justify-center text-sm font-medium ios-button ${
                    isToday
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {day}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Today's Schedule */}
        <div className="ios-card dark:bg-[#1C1C1E] overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold dark:text-white">Heutiger Zeitplan</h2>
            <button className="ios-button text-primary-500 text-sm font-medium">
              Alle anzeigen
            </button>
          </div>
          
          {events.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <p>Keine Termine geplant</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-3 flex items-center gap-3"
                >
                  <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">{event.time}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {typeLabels[event.type]}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Add */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full ios-card dark:bg-[#1C1C1E] p-4 flex items-center justify-center gap-2 text-primary-500 font-semibold ios-button"
        >
          <Plus className="w-5 h-5" />
          Termin hinzufügen
        </motion.button>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileTap={{ scale: 0.98 }}
            className="ios-card dark:bg-[#1C1C1E] p-4 ios-button text-left"
          >
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-500/20 rounded-full flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-primary-500" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">Erinnerung setzen</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Verpasse keine wichtigen Aufgaben</p>
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.98 }}
            className="ios-card dark:bg-[#1C1C1E] p-4 ios-button text-left"
          >
            <div className="w-10 h-10 bg-success-50 dark:bg-success-500/20 rounded-full flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-success-500" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">Wochenansicht</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Plane effektiv im Voraus</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
