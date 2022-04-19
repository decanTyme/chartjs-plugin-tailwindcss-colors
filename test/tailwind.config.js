/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#5a65f6",
        choco: {
          50: "#987654",
          100: "#896a4c",
          200: "#7a5e43",
          300: "#6a533b",
          400: "#5b4732",
          500: "#4c3b2a",
          600: "#3d2f22",
          700: "#2e2319",
          800: "#1e1811",
          900: "#0f0c08",
        },
      },
    },
  },
  plugins: [],
}
