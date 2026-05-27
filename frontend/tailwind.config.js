export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        surface: '#111827',
        panel: '#1f2937',
        border: '#374151',
        accent: '#38bdf8',
        muted: '#9ca3af',
      },
      boxShadow: {
        soft: '0 16px 40px rgba(15, 23, 42, 0.15)',
      },
    },
  },
  plugins: [],
};
