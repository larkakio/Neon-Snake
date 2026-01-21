'use client';

import { useEffect } from 'react';

export function FarcasterSDKInit() {
  useEffect(() => {
    // Function to call ready() when SDK is available
    const initSDK = () => {
      if (typeof window === 'undefined') return false;
      
      const win = window as any;
      
      // Check for Farcaster SDK in multiple possible locations
      let sdk: any = null;
      
      // Try window.farcaster.actions (new API)
      if (win.farcaster?.actions) {
        sdk = win.farcaster.actions;
      }
      // Try window.farcaster directly (legacy API)
      else if (win.farcaster) {
        sdk = win.farcaster;
      }
      // Try window.sdk (alternative location)
      else if (win.sdk?.actions) {
        sdk = win.sdk.actions;
      }
      
      if (sdk?.ready) {
        try {
          sdk.ready();
          console.log('✅ Farcaster SDK ready() called successfully');
          return true; // Success
        } catch (error) {
          console.error('❌ Error calling SDK ready():', error);
        }
      }
      return false;
    };

    // Try immediately
    if (initSDK()) {
      // SDK was available immediately, no need for retries
      return;
    }

    // Try with delays in case SDK loads asynchronously
    const timeouts: NodeJS.Timeout[] = [];
    const delays = [50, 100, 200, 500, 1000, 2000];
    
    delays.forEach((delay) => {
      timeouts.push(
        setTimeout(() => {
          if (initSDK()) {
            // Stop retrying once successful
            timeouts.forEach(clearTimeout);
          }
        }, delay)
      );
    });

    // Also listen for SDK injection with MutationObserver
    const observer = new MutationObserver(() => {
      if (initSDK()) {
        observer.disconnect();
        timeouts.forEach(clearTimeout);
      }
    });

    // Observe document for SDK injection
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      timeouts.forEach(clearTimeout);
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}
