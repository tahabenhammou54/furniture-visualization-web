/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        // Primary — warm amber/orange (buttons, CTAs, active states)
        primary:       '#E8983A',
        'primary-shade': '#D4872C',
        'primary-tint':  '#F0A84E',

        // Forest — dark green (tab bar, dark sections)
        forest:        '#1B3220',
        'forest-light':  '#2A4A30',

        // Cream — warm off-white (page backgrounds)
        cream:         '#F5EFE0',
        'cream-dark':    '#EDE4D0',

        // Sage — light green accent
        sage:          '#C8DDB8',
        'sage-dark':     '#A8C490',
      },
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'fade-in':       'fadeIn 0.3s ease-out both',
        'slide-up':      'slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        'card-entrance': 'cardEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        fadeIn:       { '0%': { opacity: '0', transform: 'translateY(6px)' },           '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideUp:      { '0%': { opacity: '0', transform: 'translateY(24px)' },          '100%': { opacity: '1', transform: 'translateY(0)' } },
        cardEntrance: { '0%': { opacity: '0', transform: 'translateY(16px) scale(0.97)' }, '100%': { opacity: '1', transform: 'translateY(0) scale(1)' } },
      },
    },
  },
  plugins: [],
}
