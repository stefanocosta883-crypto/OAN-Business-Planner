/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        ink: '#1a180f',
        paper: '#f5f0e8',
        parchment: '#ede5d0',
        cream: '#faf7f1',
        border: '#d9d0bc',
        muted: '#6e6551',
        moss: {
          DEFAULT: '#2b4a1c',
          mid: '#3a6227',
          light: '#527a38',
          pale: '#cfe0b8',
          faint: '#eaf3de',
        },
        terra: {
          DEFAULT: '#7d3418',
          light: '#b85030',
          pale: '#f3ddd4',
        },
        gold: {
          DEFAULT: '#8c6008',
          light: '#c49020',
          pale: '#f7ead4',
        },
        sky: {
          DEFAULT: '#1e4f7a',
          pale: '#d8ecfa',
        },
      },
      boxShadow: {
        sm: '0 1px 4px rgba(26,24,15,.07)',
        DEFAULT: '0 3px 14px rgba(26,24,15,.09)',
        lg: '0 8px 32px rgba(26,24,15,.13)',
      },
    },
  },
  plugins: [],
}
