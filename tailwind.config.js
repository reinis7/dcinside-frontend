/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dc: {
          nav: '#3b4890',
          link: '#6f8cce',
        },
      },
      maxWidth: {
        site: '1180px',
      },
    },
  },
  plugins: [],
}
