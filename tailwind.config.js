/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { 'neon-green': '#00ff41', 'matrix-black': '#0a0a0a' }
    }
  },
  plugins: []
}
