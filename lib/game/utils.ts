import { Position, SnakeSegment } from './constants';

export function checkCollision(
  head: Position, 
  snake: SnakeSegment[], 
  gridSize: number
): boolean {
  // Wall collision
  if (
    head.x < 0 || 
    head.x >= gridSize || 
    head.y < 0 || 
    head.y >= gridSize
  ) {
    return true;
  }
  
  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  
  return false;
}

export function checkFoodCollision(head: Position, food: Position): boolean {
  return head.x === food.x && head.y === food.y;
}

export function generateFood(snake: SnakeSegment[], gridSize: number): Position {
  let food: Position;
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loop
  
  // Get all occupied positions
  const occupiedPositions = new Set(
    snake.map(segment => `${segment.x},${segment.y}`)
  );
  
  do {
    // Generate random position strictly within bounds (0 to gridSize-1)
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
    
    // Ensure bounds are correct (should already be, but double-check)
    if (food.x < 0 || food.x >= gridSize) {
      food.x = Math.max(0, Math.min(gridSize - 1, food.x));
    }
    if (food.y < 0 || food.y >= gridSize) {
      food.y = Math.max(0, Math.min(gridSize - 1, food.y));
    }
    
    attempts++;
    
    // If too many attempts, use fallback
    if (attempts > maxAttempts) {
      // Fallback: find first available position
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const posKey = `${x},${y}`;
          if (!occupiedPositions.has(posKey)) {
            return { x, y };
          }
        }
      }
      // Last resort: return a safe position away from snake
      return { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) };
    }
  } while (occupiedPositions.has(`${food.x},${food.y}`));
  
  // Final validation
  if (food.x < 0 || food.x >= gridSize || food.y < 0 || food.y >= gridSize) {
    console.warn('Food position out of bounds, clamping:', food);
    food.x = Math.max(0, Math.min(gridSize - 1, food.x));
    food.y = Math.max(0, Math.min(gridSize - 1, food.y));
  }
  
  return food;
}

export function calculateSpeedLevel(foodsEaten: number, foodPerLevel: number): number {
  return Math.floor(foodsEaten / foodPerLevel);
}

export function calculateSpeed(
  initialSpeed: number,
  minSpeed: number,
  speedIncrement: number,
  speedLevel: number
): number {
  const newSpeed = initialSpeed + (speedIncrement * speedLevel);
  return Math.max(newSpeed, minSpeed);
}

export function calculateScore(
  foodsEaten: number,
  pointsPerFood: number,
  speedLevel: number,
  bonusMultiplier: number
): number {
  const baseScore = foodsEaten * pointsPerFood;
  const bonus = speedLevel * bonusMultiplier;
  return baseScore + bonus;
}
