'use client';

import { GameContextProvider } from '@/context/GameContext';
import { FarcasterSDKInit } from '@/components/FarcasterSDKInit';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GameContextProvider>
      <FarcasterSDKInit />
      {children}
    </GameContextProvider>
  );
}
