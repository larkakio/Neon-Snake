'use client';

import React, { createContext, useState, useCallback, useRef, useContext } from 'react';
import { GameState, GameContextType, GameActions } from '@/lib/game/types';
import { GAME_CONFIG, Position, Direction } from '@/lib/game/constants';
import { generateFood, checkCollision, checkFoodCollision, calculateSpeedLevel, calculateSpeed } from '@/lib/game/utils';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useScore } from '@/hooks/useScore';
import { useSound } from '@/hooks/useSound';

const GameContext = createContext<(GameContextType & GameActions) | null>(null);

export function GameContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>('menu');
  const [snake, setSnake] = useState<Position[]>([]);
  const [food, setFood] = useState<Position>({ x: 0, y: 0 });
  const [direction, setDirection] = useState<Direction>(GAME_CONFIG.INITIAL_DIRECTION);
  const nextDirectionRef = useRef<Direction>(GAME_CONFIG.INITIAL_DIRECTION);
  const [speed, setSpeed] = useState<number>(GAME_CONFIG.INITIAL_SPEED);
  const [speedLevel, setSpeedLevel] = useState<number>(0);
  const foodsEatenRef = useRef(0);

  const { score, highScore, foodsEaten, addFood, reset: resetScore } = useScore();
  const { playEat, playCollision, playLevelUp } = useSound();

  const initializeGame = useCallback(() => {
    const initialSnake: Position[] = [];
    for (let i = 0; i < GAME_CONFIG.INITIAL_LENGTH; i++) {
      initialSnake.push({
        x: GAME_CONFIG.INITIAL_POSITION.x - i,
        y: GAME_CONFIG.INITIAL_POSITION.y,
      });
    }
    
    setSnake(initialSnake);
    setDirection(GAME_CONFIG.INITIAL_DIRECTION);
    nextDirectionRef.current = GAME_CONFIG.INITIAL_DIRECTION;
    setFood(generateFood(initialSnake, GAME_CONFIG.GRID_SIZE));
    setSpeed(GAME_CONFIG.INITIAL_SPEED);
    setSpeedLevel(0);
    foodsEatenRef.current = 0;
    resetScore();
  }, [resetScore]);

  const updateGame = useCallback(() => {
    if (state !== 'playing') return;

    setDirection(nextDirectionRef.current);

    setSnake((prevSnake) => {
      const newHead: Position = {
        x: prevSnake[0].x + nextDirectionRef.current.x,
        y: prevSnake[0].y + nextDirectionRef.current.y,
      };

      // Clamp head position to prevent going out of bounds
      const clampedHead: Position = {
        x: Math.max(0, Math.min(GAME_CONFIG.GRID_SIZE - 1, newHead.x)),
        y: Math.max(0, Math.min(GAME_CONFIG.GRID_SIZE - 1, newHead.y)),
      };

      // Check collision with clamped position
      if (checkCollision(clampedHead, prevSnake, GAME_CONFIG.GRID_SIZE)) {
        playCollision();
        setState('gameover');
        return prevSnake;
      }

      // Use clamped head for new snake
      const newSnake = [clampedHead, ...prevSnake];

      // Check food collision with clamped head
      if (checkFoodCollision(clampedHead, food)) {
        playEat();
        foodsEatenRef.current += 1;
        const newFoodsEaten = foodsEatenRef.current;
        const newSpeedLevel = calculateSpeedLevel(newFoodsEaten, GAME_CONFIG.FOOD_PER_LEVEL);
        
        if (newSpeedLevel > speedLevel) {
          playLevelUp();
          setSpeedLevel(newSpeedLevel);
          const newSpeed = calculateSpeed(
            GAME_CONFIG.INITIAL_SPEED,
            GAME_CONFIG.MIN_SPEED,
            GAME_CONFIG.SPEED_INCREMENT,
            newSpeedLevel
          );
          setSpeed(newSpeed);
        }
        
        addFood(newSpeedLevel);
        setFood(generateFood(newSnake, GAME_CONFIG.GRID_SIZE));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [state, food, speedLevel, addFood, playEat, playCollision, playLevelUp]);

  useGameLoop(updateGame, speed, state === 'playing');

  const startGame = useCallback(() => {
    initializeGame();
    setState('playing');
  }, [initializeGame]);

  const pauseGame = useCallback(() => {
    if (state === 'playing') {
      setState('paused');
    }
  }, [state]);

  const resumeGame = useCallback(() => {
    if (state === 'paused') {
      setState('playing');
    }
  }, [state]);

  const resetGame = useCallback(() => {
    setState('menu');
    setSnake([]);
    setFood({ x: 0, y: 0 });
    setDirection(GAME_CONFIG.INITIAL_DIRECTION);
    nextDirectionRef.current = GAME_CONFIG.INITIAL_DIRECTION;
    setSpeed(GAME_CONFIG.INITIAL_SPEED);
    setSpeedLevel(0);
    foodsEatenRef.current = 0;
    resetScore();
  }, [resetScore]);

  const handleSetDirection = useCallback((newDirection: Direction) => {
    // Prevent reversing into itself
    const opposite = {
      x: -nextDirectionRef.current.x,
      y: -nextDirectionRef.current.y,
    };
    
    if (newDirection.x !== opposite.x || newDirection.y !== opposite.y) {
      nextDirectionRef.current = newDirection;
    }
  }, []);

  const value: GameContextType & GameActions = {
    state,
    snake,
    food,
    direction,
    score,
    highScore,
    speedLevel,
    foodsEaten,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
    setDirection: handleSetDirection,
    updateGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameContextProvider');
  }
  return context;
}
