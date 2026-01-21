'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { GameBoard } from '@/components/GameBoard';

export const dynamic = 'force-dynamic';

export default function GamePage() {
  const router = useRouter();
  const { state, startGame, resetGame, pauseGame, resumeGame, score } = useGame();

  useEffect(() => {
    if (state === 'menu') {
      startGame();
    }
  }, [state, startGame]);

  const handleBackToMenu = () => {
    resetGame();
    router.push('/');
  };

  const handlePauseToggle = () => {
    if (state === 'playing') {
      pauseGame();
    } else if (state === 'paused') {
      resumeGame();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden pb-16 bg-bg-darker">
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
        <button
          onClick={handleBackToMenu}
          className="px-4 py-2 border border-neon-cyan text-neon-cyan rounded min-h-[44px] font-share-tech text-sm hover:bg-neon-cyan/10 transition-all"
        >
          ← Menu
        </button>
        {state === 'playing' || state === 'paused' ? (
          <button
            onClick={handlePauseToggle}
            className="px-4 py-2 border border-neon-green text-neon-green rounded min-h-[44px] font-share-tech text-sm hover:bg-neon-green/10 transition-all"
          >
            {state === 'playing' ? '⏸ Pause' : '▶ Resume'}
          </button>
        ) : null}
      </div>

      {/* Game Board */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pt-20">
        <GameBoard />
      </div>

      {/* Game Over Overlay */}
      {state === 'gameover' && (
        <>
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-4xl font-orbitron text-neon-pink mb-4">GAME OVER</div>
              <div className="text-xl font-orbitron text-neon-cyan mb-8">Score: {score.toLocaleString()}</div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleBackToMenu}
                  className="px-6 py-3 border-2 border-neon-pink text-neon-pink rounded-full min-h-[44px] font-orbitron hover:bg-neon-pink/10 transition-all"
                >
                  Back to Menu
                </button>
                <button
                  onClick={() => startGame()}
                  className="px-6 py-3 border-2 border-neon-green text-neon-green rounded-full min-h-[44px] font-orbitron hover:bg-neon-green/10 transition-all"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
