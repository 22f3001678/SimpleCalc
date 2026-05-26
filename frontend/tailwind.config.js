/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        calcBg: '#0f1724',
        glass: 'rgba(255,255,255,0.06)',
        neon: '#14b8a6'
      },
      boxShadow: {
        neon: '0 4px 30px rgba(20,184,166,0.12)'
      }
    }
  },
  plugins: []
}
