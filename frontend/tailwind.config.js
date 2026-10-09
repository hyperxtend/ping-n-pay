/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fbf1f3',
          100: '#f5dde1',
          500: '#a33a4d',
          600: '#912F40',
          700: '#702632',
        },
      },
    },
  },
  plugins: [],
}
