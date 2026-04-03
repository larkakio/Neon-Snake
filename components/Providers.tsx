'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { DailyCheckIn } from '@/components/DailyCheckIn';
import { WrongNetworkBanner } from '@/components/WrongNetworkBanner';
import { wagmiConfig } from '@/app/wagmi.config';
import { GameContextProvider } from '@/context/GameContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <GameContextProvider>
          <WrongNetworkBanner />
          {children}
          <DailyCheckIn />
        </GameContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
