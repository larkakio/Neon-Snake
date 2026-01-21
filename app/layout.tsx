import type { Metadata } from 'next'
import { Orbitron, Share_Tech_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const shareTech = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://neon-snake-indol.vercel.app'),
  
  title: 'Neon Snake - Play on Base',
  description: 'Classic Snake game reimagined with neon cyberpunk aesthetics. Play on Base blockchain.',
  
  icons: {
    icon: '/icon.png',
  },
  
  openGraph: {
    title: 'Neon Snake',
    description: 'Classic Snake game reimagined with neon cyberpunk aesthetics',
    url: 'https://neon-snake-indol.vercel.app',
    siteName: 'Neon Snake',
    images: [
      {
        url: '/hero-image.png',
        width: 1200,
        height: 630,
        alt: 'Neon Snake Game',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Neon Snake',
    description: 'Classic Snake game reimagined with neon cyberpunk aesthetics',
    images: ['/hero-image.png'],
  },

  other: {
    // Farcaster Frame v2 (vNext) meta tags
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://neon-snake-indol.vercel.app/hero-image.png',
    'fc:frame:image:aspect_ratio': '1.91:1',
    'fc:frame:button:1': 'Play Now',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://neon-snake-indol.vercel.app',
    
    // Base App ID
    'base:app_id': '697094ad5f24b57cc50d32b7',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${shareTech.variable}`}>
      <body className={`${orbitron.className} antialiased bg-bg-darker text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}