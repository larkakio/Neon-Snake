'use client';

import { useState, useCallback } from 'react';
import { getHighScore, setHighScore } from '@/lib/storage';
import { GAME_CONFIG } from '@/lib/game/constants';
import { calculateScore } from '@/lib/game/utils';

export function useScore() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScoreState] = useState(() => {
    // Initialize only on client side
    if (typeof window === 'undefined') return 0;
    return getHighScore();
  });
  const [foodsEaten, setFoodsEaten] = useState(0);

  const addFood = useCallback((speedLevel: number) => {
    setFoodsEaten((prev) => {
      const newFoodsEaten = prev + 1;
      const newScore = calculateScore(
        newFoodsEaten,
        GAME_CONFIG.POINTS_PER_FOOD,
        speedLevel,
        GAME_CONFIG.BONUS_MULTIPLIER
      );
      setScore(newScore);

      // Update high score
      if (newScore > highScore) {
        const newHighScore = newScore;
        setHighScoreState(newHighScore);
        setHighScore(newHighScore);
      }

      return newFoodsEaten;
    });
  }, [highScore]);

  const reset = useCallback(() => {
    setScore(0);
    setFoodsEaten(0);
  }, []);

  return {
    score,
    highScore,
    foodsEaten,
    addFood,
    reset,
  };
}
