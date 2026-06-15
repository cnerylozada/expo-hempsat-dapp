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
          info: "#3b82f6",
          "info-dark": "#93c5fd",
          danger: "#ef4444",
          "danger-dark": "#f87171",
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
