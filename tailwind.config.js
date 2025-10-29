/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Master Brand Colors
        'skypath-blue': '#77BEF0',
        'morning-gold': '#F9D88C',
        'earth-green': '#4A7C59',
        'mist-grey': '#E5E1DC',
        // Accent Colors
        'river-teal': '#2D7D7D',
        'deep-earth': '#3A3A3A',
        // Sub-Brand Colors (Phase 2)
        'heart-rose': '#EA5B6F',
        'journey-coral': '#FF894F',
        'soft-stone': '#D4C5B0',
        'loop-purple': '#8B7AB8',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
