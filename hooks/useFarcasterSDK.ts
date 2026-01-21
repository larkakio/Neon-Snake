'use client';

import { useEffect, useState } from 'react';

// Farcaster SDK automatically injected by client (Warpcast)
// Using window.farcaster API
declare global {
  interface Window {
    farcaster?: {
      ready: () => void;
      openUrl: (url: string) => void;
      actions?: {
        ready: () => void;
      };
      context?: {
        user?: {
          fid: number;
          username: string;
        };
      };
    };
  }
}

export function useFarcasterSDK() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    const checkSDK = () => {
      if (typeof window !== 'undefined' && window.farcaster) {
        setIsSDKLoaded(true);
        setContext(window.farcaster.context);
        
        // Try both API formats for compatibility
        if (window.farcaster.actions?.ready) {
          window.farcaster.actions.ready(); // New API format
        } else if (window.farcaster.ready) {
          window.farcaster.ready(); // Legacy API format
        }
      } else {
        // Fallback for regular browser
        setIsSDKLoaded(false);
      }
    };

    // Check on mount
    checkSDK();

    // Check with multiple delays (SDK might be loading)
    const timeout1 = setTimeout(checkSDK, 100);
    const timeout2 = setTimeout(checkSDK, 500);
    const timeout3 = setTimeout(checkSDK, 1000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  const openUrl = (url: string) => {
    if (isSDKLoaded && window.farcaster) {
      window.farcaster.openUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const shareScore = async (score: number, highScore: number) => {
    const text = `🐍 I scored ${score} in Neon Snake! 🎮✨\n${score === highScore ? '🏆 NEW HIGH SCORE! ' : ''}Can you beat me?`;
    const url = window.location.href;
    
    if (isSDKLoaded && window.farcaster) {
      window.farcaster.openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(url)}`
      );
    } else if (navigator.share) {
      try {
        await navigator.share({ 
          title: 'Neon Snake', 
          text, 
          url 
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert('Score copied to clipboard!');
    }
  };

  return { 
    isSDKLoaded, 
    context, 
    openUrl, 
    shareScore,
    user: context?.user 
  };
}
