'use client';

import { useRef, useCallback } from 'react';
import { GAME_CONFIG } from '@/lib/game/constants';

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!GAME_CONFIG.SOUND_ENABLED) return null;
    if (audioContextRef.current) return audioContextRef.current;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      return audioContextRef.current;
    } catch (error) {
      console.warn('AudioContext not supported:', error);
      return null;
    }
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!GAME_CONFIG.SOUND_ENABLED) return;

    const ctx = initAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [initAudioContext]);

  const playEat = useCallback(() => {
    playTone(800, 0.1, 'square');
  }, [playTone]);

  const playCollision = useCallback(() => {
    playTone(200, 0.3, 'sawtooth');
  }, [playTone]);

  const playLevelUp = useCallback(() => {
    playTone(600, 0.1, 'square');
    setTimeout(() => playTone(800, 0.1, 'square'), 100);
    setTimeout(() => playTone(1000, 0.2, 'square'), 200);
  }, [playTone]);

  return { playEat, playCollision, playLevelUp };
}
