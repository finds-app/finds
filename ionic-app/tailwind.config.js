/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,js}'],
  corePlugins: {
    // Ionic has its own CSS reset — preflight conflicts with it
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        forest: '#1A3C34',
        moss: '#2D6A4F',
        sage: '#52B788',
        mint: '#D8F3DC',
        cream: '#F8F4EF',
        sand: '#E8DDD0',
        ember: '#E07A5F',
        gold: '#F2CC60',
        charcoal: '#1C1C1E',
        app: '#0E1F1A',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
}
