import type { Metadata } from 'next';
import { Orbitron, Share_Tech_Mono } from 'next/font/google';
import './globals.css';
import { GameContextProvider } from '@/context/GameContext';
import { FarcasterSDKInit } from '@/components/FarcasterSDKInit';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { ThemeProvider } from '@/components/ThemeProvider';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: false,
});

const shareTech = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech',
  display: 'swap',
  fallback: ['Courier New', 'monospace'],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: 'Neon Snake - Play Now',
  description: 'Classic Snake game reimagined with neon cyberpunk aesthetics. Play Now on Base!',
  openGraph: {
    title: 'Neon Snake - Play Now',
    description: 'Classic Snake game reimagined with neon cyberpunk aesthetics. Play Now!',
    url: 'https://neon-snake-indol.vercel.app',
    siteName: 'Neon Snake',
    images: [
      {
        url: 'https://neon-snake-indol.vercel.app/hero-image.png',
        width: 1200,
        height: 630,
        alt: 'Neon Snake - Play Now',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neon Snake - Play Now',
    description: 'Classic Snake game reimagined with neon cyberpunk aesthetics. Play Now!',
    images: ['https://neon-snake-indol.vercel.app/hero-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Farcaster SDK - Call ready() as early as possible */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function callReady() {
                  // Try new API first
                  if (window.farcaster?.actions?.ready) {
                    try {
                      window.farcaster.actions.ready();
                      console.log('✅ Farcaster SDK ready() called (inline script)');
                      return true;
                    } catch (e) {
                      console.error('Error calling ready():', e);
                    }
                  }
                  // Try legacy API
                  if (window.farcaster?.ready) {
                    try {
                      window.farcaster.ready();
                      console.log('✅ Farcaster SDK ready() called (legacy, inline script)');
                      return true;
                    } catch (e) {
                      console.error('Error calling ready():', e);
                    }
                  }
                  // Try alternative locations
                  if (window.sdk?.actions?.ready) {
                    try {
                      window.sdk.actions.ready();
                      console.log('✅ Farcaster SDK ready() called (alternative location)');
                      return true;
                    } catch (e) {
                      console.error('Error calling ready():', e);
                    }
                  }
                  return false;
                }
                
                // Try immediately
                callReady();
                
                // Try when DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', callReady);
                } else {
                  callReady();
                }
                
                // Also try on window load
                window.addEventListener('load', callReady);
                
                // Poll for SDK if not available - more aggressive polling
                let attempts = 0;
                const maxAttempts = 200; // Increased attempts
                let success = false;
                const pollInterval = setInterval(function() {
                  attempts++;
                  if (callReady()) {
                    success = true;
                    clearInterval(pollInterval);
                    console.log('✅ SDK ready() called successfully after', attempts, 'attempts');
                    return;
                  }
                  if (attempts >= maxAttempts) {
                    clearInterval(pollInterval);
                    if (!success) {
                      console.warn('⚠️ Farcaster SDK not found after', maxAttempts, 'attempts');
                      // Try one more time after a delay
                      setTimeout(callReady, 1000);
                    }
                  }
                }, 25); // Check every 25ms for even faster detection
                
                // Detect Mini App context and prevent external browser redirect
                const isInIframe = window.self !== window.top;
                const isMiniAppContext = isInIframe || 
                  window.location.href.includes('farcaster') || 
                  window.location.href.includes('warpcast') ||
                  window.navigator.userAgent.includes('Farcaster') ||
                  window.farcaster !== undefined;
                
                if (isMiniAppContext) {
                  console.log('✅ Running in Mini App context');
                  
                  // Prevent navigation to external browser
                  window.addEventListener('beforeunload', function(e) {
                    if (!isInIframe) {
                      e.preventDefault();
                      e.returnValue = '';
                    }
                  });
                  
                  // Override window.open to stay in Mini App
                  const originalOpen = window.open;
                  window.open = function(url?: string | URL, target?: string, features?: string) {
                    if (window.farcaster?.openUrl && url) {
                      window.farcaster.openUrl(url.toString());
                      return null;
                    }
                    return originalOpen.call(window, url, target, features);
                  };
                }
              })();
            `,
          }}
        />
        <meta name="base:app_id" content="697094ad5f24b57cc50d32b7" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0A0E27" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Open Graph / Facebook - для правильного preview з кнопкою */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://neon-snake-indol.vercel.app" />
        <meta property="og:title" content="Neon Snake - Play Now" />
        <meta property="og:description" content="Classic Snake game reimagined with neon cyberpunk aesthetics. Play Now!" />
        <meta property="og:image" content="https://neon-snake-indol.vercel.app/hero-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Neon Snake - Play Now" />
        <meta property="og:site_name" content="Neon Snake" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://neon-snake-indol.vercel.app/" />
        <meta name="twitter:title" content="Neon Snake - Play Now" />
        <meta name="twitter:description" content="Classic Snake game reimagined with neon cyberpunk aesthetics. Play Now!" />
        <meta name="twitter:image" content="https://neon-snake-indol.vercel.app/hero-image.png" />
        <meta name="twitter:image:src" content="https://neon-snake-indol.vercel.app/hero-image.png" />
        <meta name="twitter:image:alt" content="Neon Snake - Play Now" />
        
        {/* Farcaster Mini App meta tags - для правильного відкриття як Mini App */}
        <meta name="farcaster:miniapp" content="true" />
        <meta name="farcaster:miniapp:button" content="Play Now" />
        
        {/* Додаткові теги для Base App */}
        <meta name="base:miniapp" content="true" />
        
        {/* Додаткові meta теги для embed preview - важливо для "Preview available" */}
        <meta name="description" content="Classic Snake game reimagined with neon cyberpunk aesthetics. Play Now on Base!" />
        <meta name="application-name" content="Neon Snake" />
        <meta name="apple-mobile-web-app-title" content="Neon Snake" />
        
        
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className={`${orbitron.variable} ${shareTech.variable} bg-bg-dark overflow-hidden`}>
        <FarcasterSDKInit />
        <ThemeProvider>
          <GameContextProvider>
            {children}
            <BottomNavigation />
          </GameContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
