'use client';

import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';

type FarcasterLikeContext = {
  user?: { displayName?: string; username?: string; pfpUrl?: string };
} | null;

export function useFarcasterSDK() {
  const { address } = useAccount();
  const [context, setContext] = useState<FarcasterLikeContext>(null);

  useEffect(() => {
    if (address) {
      setContext({
        user: {
          displayName: `${address.slice(0, 6)}…${address.slice(-4)}`,
        },
      });
    } else {
      setContext(null);
    }
  }, [address]);

  const user = context?.user
    ? {
        username: context.user.displayName ?? context.user.username,
        displayName: context.user.displayName,
        pfpUrl: context.user.pfpUrl,
      }
    : null;

  return {
    context,
    user,
    isSDKLoaded: true,
    openUrl: (url: string) => window.open(url, '_blank', 'noopener,noreferrer'),
    shareToFarcaster: (url: string) => window.open(url, '_blank', 'noopener,noreferrer'),
  };
}
