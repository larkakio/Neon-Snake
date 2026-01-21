import { Position, SnakeSegment, Direction } from './constants';

export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';

export interface GameContextType {
  state: GameState;
  snake: SnakeSegment[];
  food: Position;
  direction: Direction;
  score: number;
  highScore: number;
  speedLevel: number;
  foodsEaten: number;
}

export interface GameActions {
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  setDirection: (direction: Direction) => void;
  updateGame: () => void;
}
