/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        tint: "#3366aa",
        text: {
          DEFAULT: "#11181C",
          dark: "#ECEDEE",
          inverted: "#fff",
        },
        subtext: {
          DEFAULT: "#687076",
          dark: "#878792",
        },
        background: {
          DEFAULT: "#fff",
          dark: "#151718",
        },
        border: {
          DEFAULT: "#ECEDEE",
          dark: "#333333",
          info: "#93c5fd",
          "info-dark": "#3b82f6",
        },
      },
    },
  },
  plugins: [],
};
