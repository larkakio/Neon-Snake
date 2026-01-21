'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';

export default function GamePage() {
  const router = useRouter();
  const { state, startGame, resetGame } = useGame();

  useEffect(() => {
    if (state === 'menu') {
      startGame();
    }
  }, [state, startGame]);

  const handleBackToMenu = () => {
    resetGame();
    router.push('/');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden pb-16">
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="text-white">Game Board Placeholder</div>
        <button
          onClick={handleBackToMenu}
          className="absolute top-4 right-4 px-4 py-2 border border-neon-cyan text-neon-cyan rounded min-h-[44px]"
        >
          ← Menu
        </button>
      </div>
    </div>
  );
}
