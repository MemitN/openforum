/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2563eb',
        'primary-dark': '#1e40af',
        'secondary': '#6366f1',
        'accent': '#10b981',
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
        'dark-border': '#334155'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Monaco', 'monospace']
      }
    }
  },
  plugins: []
}
