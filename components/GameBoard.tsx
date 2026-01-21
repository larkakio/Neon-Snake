'use client';

import React, { useEffect, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { GAME_CONFIG, DIRECTIONS, Position } from '@/lib/game/constants';

export function GameBoard() {
  const { snake, food, state, setDirection, score, speedLevel, pauseGame, resumeGame } = useGame();

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (state !== 'playing') return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setDirection(DIRECTIONS.UP);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setDirection(DIRECTIONS.DOWN);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setDirection(DIRECTIONS.LEFT);
        break;
      case 'ArrowRight':
        e.preventDefault();
        setDirection(DIRECTIONS.RIGHT);
        break;
      case ' ':
      case 'Escape':
        e.preventDefault();
        if (state === 'playing') {
          pauseGame();
        } else if (state === 'paused') {
          resumeGame();
        }
        break;
    }
  }, [state, setDirection, pauseGame, resumeGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Touch/swipe handling for mobile
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || state !== 'playing') return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          setDirection(DIRECTIONS.RIGHT);
        } else {
          setDirection(DIRECTIONS.LEFT);
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          setDirection(DIRECTIONS.DOWN);
        } else {
          setDirection(DIRECTIONS.UP);
        }
      }
    }

    touchStartRef.current = null;
  }, [state, setDirection]);

  const renderCell = (x: number, y: number) => {
    const isSnakeHead = snake.length > 0 && snake[0].x === x && snake[0].y === y;
    const isSnakeBody = snake.some((segment, index) => index > 0 && segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;

    let cellContent = null;
    let cellClass = '';

    if (isSnakeHead) {
      cellClass = 'bg-neon-green shadow-[0_0_10px_#39FF14]';
    } else if (isSnakeBody) {
      cellClass = 'bg-[#20AA00]';
    } else if (isFood) {
      cellClass = 'bg-[#FFFC00] shadow-[0_0_15px_#FFFC00] rounded-full';
    }

    return (
      <div
        key={`${x}-${y}`}
        className={`w-full h-full border border-[#1A1F3A]/30 ${cellClass}`}
        style={{
          width: `${GAME_CONFIG.CELL_SIZE}px`,
          height: `${GAME_CONFIG.CELL_SIZE}px`,
        }}
      />
    );
  };

  const gridSize = GAME_CONFIG.GRID_SIZE;
  const boardSize = gridSize * GAME_CONFIG.CELL_SIZE;

  return (
    <div className="relative flex flex-col items-center gap-4 w-full h-full justify-center">
      {/* Score and Info */}
      <div className="flex items-center gap-6 font-orbitron">
        <div className="flex flex-col items-center">
          <div className="text-xs text-neon-cyan opacity-80">SCORE</div>
          <div className="text-2xl text-neon-cyan">{score.toLocaleString()}</div>
        </div>
        {speedLevel > 0 && (
          <div className="flex flex-col items-center">
            <div className="text-xs text-neon-pink opacity-80">LEVEL</div>
            <div className="text-2xl text-neon-pink">{speedLevel}</div>
          </div>
        )}
      </div>

      {/* Game Board */}
      <div
        className="relative bg-[#0A0E27] border-2 border-neon-green/30 shadow-[0_0_30px_rgba(57,255,20,0.3)]"
        style={{
          width: `${boardSize}px`,
          height: `${boardSize}px`,
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {Array.from({ length: gridSize * gridSize }, (_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          return renderCell(x, y);
        })}
      </div>

      {/* Game State Overlay */}
      {state === 'paused' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
          <div className="text-3xl font-orbitron text-neon-cyan">PAUSED</div>
        </div>
      )}

      {/* Mobile Controls Hint */}
      {state === 'playing' && (
        <div className="text-xs text-neon-cyan/60 font-share-tech text-center px-4">
          Swipe to control • Tap pause button
        </div>
      )}
    </div>
  );
}
