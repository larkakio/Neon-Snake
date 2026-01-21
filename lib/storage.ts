const HIGH_SCORE_KEY = 'neon-snake-high-score';

export function getHighScore(): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const score = localStorage.getItem(HIGH_SCORE_KEY);
    return score ? parseInt(score, 10) : 0;
  } catch (error) {
    console.error('Error reading high score:', error);
    return 0;
  }
}

export function setHighScore(score: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch (error) {
    console.error('Error saving high score:', error);
  }
}
