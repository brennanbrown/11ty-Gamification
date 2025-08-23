/**** Tailwind Config ****/
module.exports = {
  content: [
    './src/**/*.{njk,html,md}',
    '../../packages/**/src/**/*.{ts,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Literata"', 'serif'],
      },
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7c3aed 0%, #22c55e 100%)',
        'gradient-accent': 'linear-gradient(135deg, #06b6d4 0%, #f59e0b 100%)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
};
