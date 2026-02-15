/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0f1c3f",
        "navy-soft": "#142a56",
        accent: "#cce7ff",
      },
    },
  },
  plugins: [],
};
