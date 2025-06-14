/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2D3748', // A dark gray shade between gray-700 and gray-800
        },
      },
    },
  },
  plugins: [],
};
