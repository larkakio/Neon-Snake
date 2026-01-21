export const GAME_CONFIG = {
  // Grid
  GRID_SIZE: 20,          // 20x20 grid
  CELL_SIZE: 20,          // 20px per cell
  
  // Snake
  INITIAL_LENGTH: 3,
  INITIAL_POSITION: { x: 10, y: 10 },
  INITIAL_DIRECTION: { x: 1, y: 0 }, // Right
  
  // Speed
  INITIAL_SPEED: 150,     // ms per frame
  MIN_SPEED: 50,          // Maximum speed
  SPEED_INCREMENT: -10,   // Speed increase per level
  FOOD_PER_LEVEL: 5,      // Foods to eat for speed increase
  
  // Scoring
  POINTS_PER_FOOD: 10,
  BONUS_MULTIPLIER: 5,    // speed_level × 5
  
  // Colors
  COLORS: {
    SNAKE_HEAD: '#39FF14',
    SNAKE_BODY: '#20AA00',
    FOOD: '#FFFC00',
    GRID: '#1A1F3A',
    BG_PRIMARY: '#0A0E27',
    BG_SECONDARY: '#05070F',
    NEON_CYAN: '#00F0FF',
    NEON_PINK: '#FF10F0',
  },
  
  // Sound
  SOUND_ENABLED: true,
} as const;

export type Direction = { x: number; y: number };
export type Position = { x: number; y: number };
export type SnakeSegment = Position;

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
} as const;
