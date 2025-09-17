// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'theater-dark': '#1F1F1F',
        'theater-light': '#2A2A2A',
        'theater-accent': '#FFD700', // Example gold accent
        'theater-hover': '#27AAE1',
      },
      fontFamily: {
        // If you want custom fonts later
        'theater': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}