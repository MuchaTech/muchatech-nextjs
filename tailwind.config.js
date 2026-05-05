/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: { DEFAULT: "#2BE9F0", dim: "#1ABCC2" },
        magenta: { DEFAULT: "#FC21D1", dim: "#C919A6" },
        charcoal: { DEFAULT: "#4D4B4B", dim: "#3A3838" },
        bg: {
          0: "#06080C",
          1: "#0A0D13",
          2: "#0E1119",
          card: "#111520",
        },
        border: { DEFAULT: "#1C2030", bright: "#2A3048" },
        text: {
          0: "#F2F6FF",
          1: "#A8B2CC",
          2: "#606880",
          3: "#3A4058",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "monospace"],
        display: ["Syne", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-grad": "linear-gradient(135deg, #2BE9F0 0%, #FC21D1 100%)",
        "brand-grad-r": "linear-gradient(135deg, #FC21D1 0%, #2BE9F0 100%)",
        "radial-cyan":
          "radial-gradient(ellipse 60% 50% at 20% 10%, rgba(43,233,240,0.14) 0%, transparent 60%)",
        "radial-mag":
          "radial-gradient(ellipse 50% 40% at 80% 90%, rgba(252,33,209,0.12) 0%, transparent 60%)",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
        "spin-slow": "spin-slow 8s linear infinite",
        "glow-pulse": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
