'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navItems: Array<{
    label: string;
    path: string;
    icon: string;
    action?: () => void;
  }> = [
    {
      label: 'Home',
      path: '/',
      icon: '🏠',
    },
    {
      label: 'Play',
      path: '/game',
      icon: '🎮',
    },
    {
      label: 'Theme',
      path: '#',
      icon: theme === 'dark' ? '☀️' : '🌙',
      action: toggleTheme,
    },
  ];

  const handleNavigation = (path: string, action?: () => void) => {
    if (action) {
      action();
    } else if (pathname !== path && path !== '#') {
      router.push(path);
    }
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-bg-darker/95 backdrop-blur-md border-t border-neon-cyan/20"
    >
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path, item.action)}
              className={`
                flex flex-col items-center justify-center gap-1
                min-h-[44px] min-w-[44px] px-4 py-2
                transition-all duration-200
                ${isActive ? 'text-neon-cyan' : 'text-white/60'}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-share-tech text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
