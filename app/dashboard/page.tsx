'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Droplet, Flame, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Habit {
  id: string;
  name: string;
  icon: string;
  completedToday: boolean;
}

interface Supplement {
  id: string;
  name: string;
  icon: string;
  streak: number;
  takenToday: boolean;
}

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [waterIntake, setWaterIntake] = useState(0);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  const WATER_TARGET = 2500; // ml
  const WATER_INCREMENT = 250; // ml

  useEffect(() => {
    // Load data from localStorage
    const savedWater = localStorage.getItem('water-intake');
    const savedHabits = localStorage.getItem('habits-today');
    const savedSupplements = localStorage.getItem('supplements');
    
    if (savedWater) {
      setWaterIntake(parseInt(savedWater));
    }
    
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      // Default habits
      const defaultHabits: Habit[] = [
        { id: '1', name: 'Morgenmeditation', icon: '🧘', completedToday: false },
        { id: '2', name: '30 Minuten lesen', icon: '📚', completedToday: false },
        { id: '3', name: 'Training', icon: '💪', completedToday: false },
        { id: '4', name: 'Gesund essen', icon: '🥗', completedToday: false },
      ];
      setHabits(defaultHabits);
      localStorage.setItem('habits-today', JSON.stringify(defaultHabits));
    }
    
    if (savedSupplements) {
      setSupplements(JSON.parse(savedSupplements));
    } else {
      // Default supplements
      const defaultSupplements: Supplement[] = [
        { id: '1', name: 'Magnesium', icon: '💊', streak: 7, takenToday: false },
        { id: '2', name: 'Vitamin D', icon: '☀️', streak: 12, takenToday: false },
        { id: '3', name: 'Omega 3', icon: '🐟', streak: 5, takenToday: false },
      ];
      setSupplements(defaultSupplements);
      localStorage.setItem('supplements', JSON.stringify(defaultSupplements));
    }

    // Handle scroll event for sticky header
    const handleScroll = () => {
      if (mainContentRef.current) {
        setIsScrolled(mainContentRef.current.scrollTop > 20);
      }
    };

    const container = mainContentRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const addWater = () => {
    const newAmount = Math.min(waterIntake + WATER_INCREMENT, WATER_TARGET);
    setWaterIntake(newAmount);
    localStorage.setItem('water-intake', newAmount.toString());
    
    // Celebrate if target just reached (not if already at target)
    if (newAmount === WATER_TARGET && waterIntake < WATER_TARGET) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const toggleHabit = (id: string) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, completedToday: !habit.completedToday } : habit
    );
    setHabits(updatedHabits);
    localStorage.setItem('habits-today', JSON.stringify(updatedHabits));
  };

  const takeSupplement = (id: string) => {
    const updatedSupplements = supplements.map((supplement) => {
      if (supplement.id === id && !supplement.takenToday) {
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        return {
          ...supplement,
          takenToday: true,
          streak: supplement.streak + 1,
        };
      }
      return supplement;
    });
    setSupplements(updatedSupplements);
    localStorage.setItem('supplements', JSON.stringify(updatedSupplements));
  };

  const completedHabits = habits.filter((h) => h.completedToday).length;
  const totalHabits = habits.length;
  const habitProgress = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
  const waterProgress = (waterIntake / WATER_TARGET) * 100;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="min-h-full bg-gray-50 max-w-[430px] mx-auto">
      {/* Sticky Header */}
      <div className={`sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b transition-all duration-300 safe-area-top ${
        isScrolled ? 'border-gray-200 py-2' : 'border-transparent py-6'
      }`}>
        <div className="px-6">
          <p className={`text-sm text-gray-500 font-medium transition-all duration-300 ${
            isScrolled ? 'text-xs' : ''
          }`}>
            {formatDate(currentDate)}
          </p>
          <h1 className={`font-bold tracking-tight transition-all duration-300 ${
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
          className="ios-card p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Fortschritt</h2>
          <div className="flex items-center justify-center gap-8">
            {/* Habits Ring (Green) */}
            <div className="relative flex flex-col items-center">
              <svg width="120" height="120" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#E5E5EA"
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
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {completedHabits}/{totalHabits}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Gewohnheiten</p>
            </div>

            {/* Water Ring (Blue) */}
            <div className="relative flex flex-col items-center">
              <svg width="120" height="120" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#E5E5EA"
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
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {Math.round(waterProgress)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Wasser</p>
            </div>
          </div>
        </motion.div>

        {/* Water Tracker Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileTap={{ scale: 0.98 }}
          className="ios-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-primary-500" />
              <h2 className="text-lg font-semibold">Wasser-Tracker</h2>
            </div>
            <span className="text-sm text-gray-500">
              {waterIntake}ml / {WATER_TARGET}ml
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={addWater}
              disabled={waterIntake >= WATER_TARGET}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ${
                waterIntake >= WATER_TARGET ? 'bg-gray-300' : 'bg-primary-500'
              }`}
            >
              <Plus className="w-8 h-8" />
            </motion.button>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">+{WATER_INCREMENT}ml pro Klick</p>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${waterProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
          
          {waterIntake >= WATER_TARGET && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm text-success-500 font-medium mt-3"
            >
              🎉 Tägliches Ziel erreicht!
            </motion.p>
          )}
        </motion.div>

        {/* Habits Section */}
        <div className="ios-card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Gewohnheiten</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-3 ios-button cursor-pointer"
                onClick={() => toggleHabit(habit.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{habit.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${
                        habit.completedToday
                          ? 'line-through text-gray-400'
                          : 'text-gray-900'
                      }`}
                    >
                      {habit.name}
                    </p>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      habit.completedToday
                        ? 'bg-success-500 border-success-500'
                        : 'border-gray-300'
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
            ))}
          </div>
        </div>

        {/* Supplements Section */}
        <div className="ios-card overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Pill className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold">Nahrungsergänzung</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {supplements.map((supplement, index) => (
              <motion.div
                key={supplement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{supplement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{supplement.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-orange-500">{supplement.streak} Tage</span>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => takeSupplement(supplement.id)}
                    disabled={supplement.takenToday}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      supplement.takenToday
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-purple-500 text-white'
                    }`}
                  >
                    {supplement.takenToday ? 'Erledigt ✓' : 'Eingenommen'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.98 }}
          className="ios-card p-4"
        >
          <h2 className="text-lg font-semibold mb-3">Schnellaktionen</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="ios-button flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-3 rounded-xl font-medium">
              <Plus className="w-5 h-5" />
              Gewohnheit
            </button>
            <button className="ios-button flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium">
              <Plus className="w-5 h-5" />
              Aufgabe
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
