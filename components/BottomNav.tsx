'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListTodo, Calendar, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Heute' },
  { href: '/habits', icon: ListTodo, label: 'Gewohnheiten' },
  { href: '/planner', icon: Calendar, label: 'Planer' },
  { href: '/settings', icon: Settings, label: 'Einstellungen' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="ios-nav-item flex-1 py-1"
            >
              <motion.div
                className="relative"
                whileTap={{ scale: 0.9 }}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-100 dark:bg-primary-500/20 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </motion.div>
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
