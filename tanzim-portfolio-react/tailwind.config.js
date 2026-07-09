/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brick: { DEFAULT: '#975554', deep: '#7c4342' },
      },
      borderRadius: { card: '22px' },
    },
  },
  plugins: [],
}
