'use client';

import { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  type: 'habit' | 'todo';
  time?: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('today-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Default tasks for demo
      const defaultTasks: Task[] = [
        { id: '1', title: 'Morning meditation', completed: false, type: 'habit', time: '08:00' },
        { id: '2', title: 'Drink water', completed: false, type: 'habit', time: '09:00' },
        { id: '3', title: 'Read for 30 minutes', completed: false, type: 'habit', time: '20:00' },
        { id: '4', title: 'Review project goals', completed: false, type: 'todo', time: '10:00' },
      ];
      setTasks(defaultTasks);
      localStorage.setItem('today-tasks', JSON.stringify(defaultTasks));
    }
  }, []);

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('today-tasks', JSON.stringify(updatedTasks));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header with Large Title */}
      <div className="bg-white safe-area-top">
        <div className="px-6 pt-6 pb-4">
          <p className="text-sm text-gray-500 font-medium">
            {formatDate(currentDate)}
          </p>
          <h1 className="text-4xl font-bold tracking-tight mt-1">Today</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="ios-card p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Daily Progress</h2>
            <span className="text-sm text-gray-500">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          {progress === 100 && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm text-success-500 font-medium mt-3"
            >
              🎉 Great job! All tasks completed!
            </motion.p>
          )}
        </motion.div>

        {/* Tasks List */}
        <div className="ios-card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Tasks</h2>
          </div>
          <AnimatePresence>
            {tasks.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <p>No tasks for today</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-4 py-3 ios-button cursor-pointer"
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className="flex items-center gap-3">
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-success-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium ${
                            task.completed
                              ? 'line-through text-gray-400'
                              : 'text-gray-900'
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.time && (
                          <p className="text-sm text-gray-500">{task.time}</p>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          task.type === 'habit'
                            ? 'bg-primary-50 text-primary-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {task.type}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="ios-card p-4"
        >
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="ios-button flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-3 rounded-xl font-medium">
              <Plus className="w-5 h-5" />
              Add Habit
            </button>
            <button className="ios-button flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium">
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
