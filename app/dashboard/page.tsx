'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Droplet, Flame, Pill, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { Habit, Supplement, Task } from '@/types';
import AddHabitModal from '@/components/AddHabitModal';
import AddTaskModal from '@/components/AddTaskModal';
import EditHabitModal from '@/components/EditHabitModal';
import AddSupplementModal from '@/components/AddSupplementModal';
import EditSupplementModal from '@/components/EditSupplementModal';
import SwipeableCard from '@/components/SwipeableCard';
import CustomAlert from '@/components/CustomAlert';

export default function DashboardPage() {
  const DEFAULT_WATER_TARGET = 2500; // ml
  const DEFAULT_WATER_SIZES = [200, 250, 1000]; // ml
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [waterIntake, setWaterIntake] = useState(0);
  const [selectedWaterSize, setSelectedWaterSize] = useState(250); // Default 250ml
  const [waterTarget, setWaterTarget] = useState(DEFAULT_WATER_TARGET);
  const [waterSizes, setWaterSizes] = useState<number[]>(DEFAULT_WATER_SIZES);
  const [customWaterSize, setCustomWaterSize] = useState('');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddSupplementModal, setShowAddSupplementModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editingSupplement, setEditingSupplement] = useState<Supplement | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
  const [undoTimer, setUndoTimer] = useState<number | null>(null);
  const [lastTakenSupplement, setLastTakenSupplement] = useState<string | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [showWaterSettings, setShowWaterSettings] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if it's a new day and reset completion status
    const checkAndResetDaily = () => {
      const today = new Date().toDateString();
      const lastOpenedDate = localStorage.getItem('lastOpenedDate');
      
      if (lastOpenedDate !== today) {
        // It's a new day, reset all completion statuses
        const savedHabits = localStorage.getItem('habits');
        const savedSupplements = localStorage.getItem('supplements');
        
        if (savedHabits) {
          const habits = JSON.parse(savedHabits);
          const resetHabits = habits.map((habit: Habit) => ({
            ...habit,
            completedToday: false,
          }));
          localStorage.setItem('habits', JSON.stringify(resetHabits));
          setHabits(resetHabits);
        }
        
        if (savedSupplements) {
          const supplements = JSON.parse(savedSupplements);
          const resetSupplements = supplements.map((supplement: Supplement) => ({
            ...supplement,
            takenToday: false,
          }));
          localStorage.setItem('supplements', JSON.stringify(resetSupplements));
          setSupplements(resetSupplements);
        }
        
        // Reset water intake
        setWaterIntake(0);
        localStorage.setItem('water-intake', '0');
        
        // Update last opened date
        localStorage.setItem('lastOpenedDate', today);
      }
    };
    
    checkAndResetDaily();
    
    // Load data from localStorage
    const savedWater = localStorage.getItem('water-intake');
    const savedWaterSize = localStorage.getItem('water-size');
    const savedWaterTarget = localStorage.getItem('water-target');
    const savedWaterSizes = localStorage.getItem('water-sizes');
    const savedHabits = localStorage.getItem('habits');
    const savedSupplements = localStorage.getItem('supplements');
    
    if (savedWater) {
      setWaterIntake(parseInt(savedWater));
    }
    
    if (savedWaterSize) {
      setSelectedWaterSize(parseInt(savedWaterSize));
    }
    
    if (savedWaterTarget) {
      setWaterTarget(parseInt(savedWaterTarget));
    }
    
    if (savedWaterSizes) {
      setWaterSizes(JSON.parse(savedWaterSizes));
    }
    
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      // Default habits with new structure - all start with 0 streak
      const defaultHabits: Habit[] = [
        { id: '1', name: 'Morgenmeditation', icon: '🧘', completedToday: false, rhythm: 'daily', createdAt: new Date().toISOString() },
        { id: '2', name: '30 Minuten lesen', icon: '📚', completedToday: false, rhythm: 'daily', createdAt: new Date().toISOString() },
        { id: '3', name: 'Training', icon: '💪', completedToday: false, rhythm: 'daily', createdAt: new Date().toISOString() },
        { id: '4', name: 'Gesund essen', icon: '🥗', completedToday: false, rhythm: 'daily', createdAt: new Date().toISOString() },
      ];
      setHabits(defaultHabits);
      localStorage.setItem('habits', JSON.stringify(defaultHabits));
    }
    
    if (savedSupplements) {
      setSupplements(JSON.parse(savedSupplements));
    } else {
      // No mock data - start empty
      const defaultSupplements: Supplement[] = [];
      setSupplements(defaultSupplements);
      localStorage.setItem('supplements', JSON.stringify(defaultSupplements));
    }

    // Schedule all notifications for habits and supplements with reminder times
    if (savedHabits) {
      const habits = JSON.parse(savedHabits);
      habits.forEach((habit: Habit) => {
        if (habit.reminderTime && 'Notification' in window && Notification.permission === 'granted') {
          scheduleNotification(habit);
        }
      });
    }
    
    if (savedSupplements) {
      const supplements = JSON.parse(savedSupplements);
      supplements.forEach((supplement: Supplement) => {
        if (supplement.reminderTime && 'Notification' in window && Notification.permission === 'granted') {
          scheduleSupplementNotification(supplement);
        }
      });
    }

    // Handle scroll event for sticky header
    const handleScroll = () => {
      if (mainContentRef.current) {
        setIsScrolled(mainContentRef.current.scrollTop > 20);
      }
    };

    const container = mainContentRef.current;
    container?.addEventListener('scroll', handleScroll);

    // Listen for service worker messages
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CHECK_WATER_REMINDER') {
        const lastWaterTime = localStorage.getItem('last-water-time');
        if (lastWaterTime) {
          const timeSinceLastWater = Date.now() - new Date(lastWaterTime).getTime();
          const twoHours = 2 * 60 * 60 * 1000;
          
          if (timeSinceLastWater > twoHours && 'Notification' in window && Notification.permission === 'granted') {
            // Vibrate before showing notification
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
            new Notification('HabitFlow Wassererinnerung', {
              body: 'Zeit für ein Glas Wasser! 💧',
              icon: '/icons/icon-192x192.png',
              tag: 'water-reminder',
            });
          }
        }
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      container?.removeEventListener('scroll', handleScroll);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, []);

  const addWater = () => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    // Allow unlimited tracking - remove the cap
    const newAmount = waterIntake + selectedWaterSize;
    setWaterIntake(newAmount);
    localStorage.setItem('water-intake', newAmount.toString());
    localStorage.setItem('last-water-time', new Date().toISOString());
    
    // Notify service worker of water intake update
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'WATER_INTAKE_UPDATE',
        timestamp: new Date().toISOString(),
      });
    }
    
    // Celebrate if target just reached (not if already at or past target)
    if (newAmount >= waterTarget && waterIntake < waterTarget) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const changeWaterSize = (size: number) => {
    setSelectedWaterSize(size);
    localStorage.setItem('water-size', size.toString());
  };

  const updateWaterTarget = (newTarget: number) => {
    setWaterTarget(newTarget);
    localStorage.setItem('water-target', newTarget.toString());
  };

  const addCustomWaterSize = (size: number) => {
    if (size > 0 && !waterSizes.includes(size)) {
      const newSizes = [...waterSizes, size].sort((a, b) => a - b);
      setWaterSizes(newSizes);
      localStorage.setItem('water-sizes', JSON.stringify(newSizes));
    }
  };

  const removeWaterSize = (size: number) => {
    if (waterSizes.length > 1) {
      const newSizes = waterSizes.filter(s => s !== size);
      setWaterSizes(newSizes);
      localStorage.setItem('water-sizes', JSON.stringify(newSizes));
      if (selectedWaterSize === size) {
        setSelectedWaterSize(newSizes[0]);
        localStorage.setItem('water-size', newSizes[0].toString());
      }
    }
  };

  const toggleHabit = (id: string) => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
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

    // Schedule notification if reminder time is set
    if (newHabit.reminderTime && 'Notification' in window && Notification.permission === 'granted') {
      scheduleNotification(newHabit);
    }
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

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    // For now, just close the modal
    // In a real implementation, you would add the task to state
    console.log('Task added:', taskData);
  };

  const scheduleNotification = (habit: Habit) => {
    if (!habit.reminderTime) return;

    const [hours, minutes] = habit.reminderTime.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('HabitFlow Erinnerung', {
          body: `Zeit für: ${habit.name} ${habit.icon}`,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
        });
      }
    }, delay);
  };

  const scheduleSupplementNotification = (supplement: Supplement) => {
    if (!supplement.reminderTime) return;

    const [hours, minutes] = supplement.reminderTime.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();
    setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('HabitFlow Erinnerung', {
          body: `Zeit für: ${supplement.name} ${supplement.icon}`,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
        });
      }
    }, delay);
  };

  const handleLongPressStart = (habit: Habit) => {
    const timer = setTimeout(() => {
      setEditingHabit(habit);
      // Vibrate if available (haptic feedback simulation)
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, 500) as unknown as number; // 500ms for long press
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const takeSupplement = (id: string) => {
    const updatedSupplements = supplements.map((supplement) => {
      if (supplement.id === id) {
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }
        
        // Toggle functionality
        if (supplement.takenToday) {
          // Untake the supplement
          return {
            ...supplement,
            takenToday: false,
            streak: Math.max(0, supplement.streak - 1),
            lastTakenAt: undefined,
          };
        } else {
          // Take the supplement
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          // Set up undo timer (5 seconds)
          setLastTakenSupplement(id);
          const timer = setTimeout(() => {
            setLastTakenSupplement(null);
          }, 5000) as unknown as number;
          setUndoTimer(timer);
          
          return {
            ...supplement,
            takenToday: true,
            streak: supplement.streak + 1,
            lastTakenAt: new Date().toISOString(),
          };
        }
      }
      return supplement;
    });
    setSupplements(updatedSupplements);
    localStorage.setItem('supplements', JSON.stringify(updatedSupplements));
  };

  const undoTakeSupplement = (id: string) => {
    if (undoTimer) {
      clearTimeout(undoTimer);
      setUndoTimer(null);
    }
    
    const updatedSupplements = supplements.map((supplement) => {
      if (supplement.id === id) {
        return {
          ...supplement,
          takenToday: false,
          streak: Math.max(0, supplement.streak - 1),
          lastTakenAt: undefined,
        };
      }
      return supplement;
    });
    setSupplements(updatedSupplements);
    localStorage.setItem('supplements', JSON.stringify(updatedSupplements));
    setLastTakenSupplement(null);
  };

  const addSupplement = (supplementData: Omit<Supplement, 'id' | 'streak' | 'takenToday'>) => {
    const newSupplement: Supplement = {
      ...supplementData,
      id: Date.now().toString(),
      streak: 0,
      takenToday: false,
    };
    const updatedSupplements = [...supplements, newSupplement];
    setSupplements(updatedSupplements);
    localStorage.setItem('supplements', JSON.stringify(updatedSupplements));

    // Schedule notification if reminder time is set
    if (newSupplement.reminderTime && 'Notification' in window && Notification.permission === 'granted') {
      scheduleSupplementNotification(newSupplement);
    }
  };

  const updateSupplement = (id: string, updates: Partial<Supplement>) => {
    const updatedSupplements = supplements.map((supplement) =>
      supplement.id === id ? { ...supplement, ...updates } : supplement
    );
    setSupplements(updatedSupplements);
    localStorage.setItem('supplements', JSON.stringify(updatedSupplements));
  };

  const deleteSupplement = (id: string) => {
    const updatedSupplements = supplements.filter((supplement) => supplement.id !== id);
    setSupplements(updatedSupplements);
    localStorage.setItem('supplements', JSON.stringify(updatedSupplements));
  };

  const handleSupplementLongPress = (supplement: Supplement) => {
    const timer = setTimeout(() => {
      setEditingSupplement(supplement);
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, 500) as unknown as number;
    setLongPressTimer(timer);
  };

  const completedHabits = habits.filter((h) => h.completedToday).length;
  const totalHabits = habits.length;
  const habitProgress = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
  const waterProgress = Math.min((waterIntake / waterTarget) * 100, 100); // Cap at 100% for ring display

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-black max-w-[430px] mx-auto">
      {/* Sticky Header */}
      <div className={`sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b transition-all duration-300 safe-area-top ${
        isScrolled ? 'border-gray-200 dark:border-gray-800 py-2' : 'border-transparent py-6'
      }`}>
        <div className="px-6">
          <p className={`text-sm text-gray-500 dark:text-gray-400 font-medium transition-all duration-300 ${
            isScrolled ? 'text-xs' : ''
          }`}>
            {formatDate(currentDate)}
          </p>
          <h1 className={`font-bold tracking-tight dark:text-white transition-all duration-300 ${
            isScrolled ? 'text-2xl' : 'text-4xl mt-1'
          }`}>
            Heute
          </h1>
        </div>
      </div>

      <div ref={mainContentRef} className="overflow-y-auto px-4 py-6 space-y-4">
        {/* Apple Watch Style Rings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          className="ios-card dark:bg-[#1C1C1E] p-6"
        >
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Fortschritt</h2>
          <div className="flex items-center justify-center gap-8">
            {/* Habits Ring (Green) */}
            <div className="relative flex flex-col items-center">
              <svg width="120" height="120" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#3A3A3C"
                  className="dark:stroke-[#3A3A3C] stroke-[#E5E5EA]"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#34C759"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                  animate={{ 
                    strokeDashoffset: 2 * Math.PI * 50 * (1 - habitProgress / 100)
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedHabits}/{totalHabits}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Gewohnheiten</p>
            </div>

            {/* Water Ring (Blue) */}
            <div className="relative flex flex-col items-center">
              <svg width="120" height="120" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  className="dark:stroke-[#3A3A3C] stroke-[#E5E5EA]"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#007AFF"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                  animate={{ 
                    strokeDashoffset: 2 * Math.PI * 50 * (1 - waterProgress / 100)
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="text-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white block">
                    {waterIntake}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    / {waterTarget}ml
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Wasser</p>
            </div>
          </div>
        </motion.div>

        {/* Water Tracker Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileTap={{ scale: 0.98 }}
          className="ios-card dark:bg-[#1C1C1E] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-semibold dark:text-white">Wasser-Tracker</h2>
            </div>
            <button
              onClick={() => setShowWaterSettings(true)}
              className="text-xs text-primary-500 dark:text-primary-400 font-medium ios-button"
            >
              Einstellungen
            </button>
          </div>

          {/* Water Size Selection */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Glasgröße wählen:</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {waterSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => changeWaterSize(size)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ios-button ${
                    selectedWaterSize === size
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {size}ml
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={addWater}
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg bg-primary-500"
            >
              <Plus className="w-8 h-8" />
            </motion.button>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">+{selectedWaterSize}ml pro Klick</p>
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${waterProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
          
          {waterIntake >= waterTarget && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm text-success-500 font-medium mt-3"
            >
              🎉 Tägliches Ziel {waterIntake > waterTarget ? 'übertroffen' : 'erreicht'}! ({waterIntake}ml / {waterTarget}ml)
            </motion.p>
          )}
        </motion.div>

        {/* Habits Section */}
        <div className="ios-card dark:bg-[#1C1C1E] overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold dark:text-white">Gewohnheiten</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {habits.map((habit, index) => (
              <SwipeableCard
                key={habit.id}
                onSwipeRight={() => toggleHabit(habit.id)}
                onSwipeLeft={() => handleHabitSwipeLeft(habit)}
                onLongPress={() => setEditingHabit(habit)}
                onClick={() => toggleHabit(habit.id)}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{habit.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${
                          habit.completedToday
                            ? 'line-through text-gray-400 dark:text-gray-500'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {habit.name}
                      </p>
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
        </div>

        {/* Supplements Section */}
        <div className="ios-card dark:bg-[#1C1C1E] overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold dark:text-white">Nahrungsergänzung</h2>
            </div>
            <button
              onClick={() => setShowAddSupplementModal(true)}
              className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-500/20 ios-button"
            >
              <Plus className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            </button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {supplements.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Noch keine Supplements hinzugefügt
                </p>
                <button
                  onClick={() => setShowAddSupplementModal(true)}
                  className="mt-3 text-purple-500 dark:text-purple-400 text-sm font-medium"
                >
                  Erstes Supplement hinzufügen
                </button>
              </div>
            ) : (
              supplements.map((supplement, index) => (
                <motion.div
                  key={supplement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="px-4 py-3"
                  onMouseDown={() => handleSupplementLongPress(supplement)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={() => handleSupplementLongPress(supplement)}
                  onTouchEnd={handleLongPressEnd}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{supplement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white">{supplement.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span className="text-xs text-orange-500">{supplement.streak} Tage</span>
                      </div>
                    </div>
                    {supplement.takenToday && lastTakenSupplement === supplement.id ? (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => undoTakeSupplement(supplement.id)}
                        className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-500 text-white"
                      >
                        Rückgängig
                      </motion.button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => takeSupplement(supplement.id)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          supplement.takenToday
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                            : 'bg-purple-500 text-white'
                        }`}
                      >
                        {supplement.takenToday ? 'Erledigt ✓' : 'Eingenommen'}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.98 }}
          className="ios-card dark:bg-[#1C1C1E] p-4"
        >
          <h2 className="text-lg font-semibold mb-3 dark:text-white">Schnellaktionen</h2>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setShowAddHabitModal(true)}
              className="ios-button flex items-center gap-2 bg-primary-50 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 px-4 py-3 rounded-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Gewohnheit
            </button>
            <button 
              onClick={() => setShowAddTaskModal(true)}
              className="ios-button flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl font-medium"
            >
              <Plus className="w-5 h-5" />
              Aufgabe
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AddHabitModal
        isOpen={showAddHabitModal}
        onClose={() => setShowAddHabitModal(false)}
        onAdd={addHabit}
      />
      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onAdd={addTask}
      />
      <EditHabitModal
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        habit={editingHabit}
        onUpdate={updateHabit}
        onDelete={deleteHabit}
      />
      <AddSupplementModal
        isOpen={showAddSupplementModal}
        onClose={() => setShowAddSupplementModal(false)}
        onAdd={addSupplement}
      />
      <EditSupplementModal
        isOpen={!!editingSupplement}
        onClose={() => setEditingSupplement(null)}
        supplement={editingSupplement}
        onUpdate={updateSupplement}
        onDelete={deleteSupplement}
      />

      {/* Delete Habit Confirmation */}
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

      {/* Water Settings Modal */}
      <AnimatePresence>
        {showWaterSettings && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWaterSettings(false)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
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
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Wasser-Einstellungen</h2>
                  <button
                    onClick={() => setShowWaterSettings(false)}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 ios-button"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 max-h-[calc(80vh-140px)] overflow-y-auto">
                  {/* Water Target */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tägliches Ziel (ml)
                    </label>
                    <input
                      type="number"
                      value={waterTarget}
                      onChange={(e) => updateWaterTarget(Math.max(100, parseInt(e.target.value) || DEFAULT_WATER_TARGET))}
                      min="100"
                      step="100"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-0 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Empfohlen: 2000-3000ml pro Tag
                    </p>
                  </div>

                  {/* Glass Sizes */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Glasgrößen
                    </label>
                    <div className="space-y-2 mb-3">
                      {waterSizes.map((size) => (
                        <div key={size} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                          <span className="text-gray-900 dark:text-white font-medium">{size}ml</span>
                          {waterSizes.length > 1 && (
                            <button
                              onClick={() => removeWaterSize(size)}
                              className="text-red-500 text-sm font-medium ios-button"
                            >
                              Entfernen
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Custom Size */}
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={customWaterSize}
                        onChange={(e) => setCustomWaterSize(e.target.value)}
                        placeholder="z.B. 500"
                        min="1"
                        step="50"
                        className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border-0 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        onClick={() => {
                          const size = parseInt(customWaterSize);
                          if (size > 0) {
                            addCustomWaterSize(size);
                            setCustomWaterSize('');
                          }
                        }}
                        className="px-4 py-2 bg-primary-500 text-white rounded-xl font-medium ios-button"
                      >
                        Hinzufügen
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setShowWaterSettings(false)}
                    className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold ios-button"
                  >
                    Fertig
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
