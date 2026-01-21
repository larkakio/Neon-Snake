'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { useFarcasterSDK } from '@/hooks/useFarcasterSDK';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const router = useRouter();
  const { highScore, startGame } = useGame();
  const { user } = useFarcasterSDK();

  const handleStart = () => {
    startGame();
    router.push('/game');
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center gap-8 px-4"
      >
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="font-orbitron text-6xl md:text-8xl neon-green mb-4"
        >
          NEON SNAKE
        </motion.h1>

        {highScore > 0 && (
          <motion.div className="flex flex-col items-center gap-2 mt-4">
            <div className="font-share-tech text-sm text-neon-pink opacity-80">
              HIGH SCORE
            </div>
            <div className="font-orbitron text-4xl neon-pink">
              {highScore.toLocaleString()}
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={handleStart}
          className="px-8 py-4 text-lg font-orbitron border-2 border-neon-green text-neon-green rounded-full min-h-[44px] hover:bg-neon-green/10 transition-all"
        >
          🎮 START GAME
        </motion.button>

        {user && (
          <div className="mt-4 flex items-center gap-3 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5">
            {user.username && (
              <>
                <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                  <span className="text-neon-cyan text-sm font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-share-tech text-sm text-neon-cyan">
                  {user.username}
                </span>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
