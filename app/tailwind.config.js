/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        reddit: {
          orange: '#FF4500',
          blue: '#0079D3',
        }
      }
    },
  },
  plugins: [],
}