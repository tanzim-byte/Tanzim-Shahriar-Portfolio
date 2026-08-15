/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        brick: { DEFAULT: '#975554', deep: '#7c4342' },
        ember: { DEFAULT: '#ff6a3d', deep: '#e2472a' },
        gold: '#f5b942',
        cyan: '#37e0d8',
        violet: '#9b7bff',
      },
      borderRadius: { card: '24px', xl2: '28px' },
      maxWidth: { shell: '1180px' },
    },
  },
  plugins: [],
}
