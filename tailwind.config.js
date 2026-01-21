/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#39FF14',
        'neon-cyan': '#00F0FF',
        'neon-pink': '#FF10F0',
        'electric-yellow': '#FFFC00',
        'bg-dark': '#0A0E27',
        'bg-darker': '#05070F',
        'grid-color': '#1A1F3A',
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
        'share-tech': ['var(--font-share-tech)', 'monospace'],
      },
    },
  },
  plugins: [],
}
