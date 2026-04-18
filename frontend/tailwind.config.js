/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        cyber: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          500: '#2563EB',
          400: '#3B82F6',
          900: '#1E3A8A',
        },
        cyber: {
          dark: '#09090b',
          darker: '#050505',
          card: 'rgba(15, 23, 42, 0.7)',
          primary: '#00f0ff',
          secondary: '#bc13fe',
          border: 'rgba(0, 240, 255, 0.2)'
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'float': '0 20px 40px -10px rgba(0, 0, 0, 0.08)',
        'cyber': '0 0 10px rgba(0, 240, 255, 0.3)',
        'cyber-hover': '0 0 20px rgba(0, 240, 255, 0.6)',
        'cyber-card': '0 4px 20px rgba(0, 0, 0, 0.8)',
      }
    },
  },
  plugins: [],
}
