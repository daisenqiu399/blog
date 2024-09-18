/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./docs/.vitepress/**/*.{vue,js}', './docs/**/*.md'],
  theme: {
    extend: {
      colors: {
        VPLight: '#3451b2',
        VPDark: '#a8b1ff'
      },
      animation: {
        'scale-in-center': 'scale-in-center 0.8s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both'
      },
      keyframes: {
        'scale-in-center': {
          '0%': {
            transform: 'scale(0)',
            opacity: '1'
          },
          to: {
            transform: 'scale(1)',
            opacity: '1'
          }
        }
      }
    }
  },
  plugins: [],
  darkMode: 'class'
}
