export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        panel: "rgba(10, 23, 43, 0.72)",
        cyanline: "#21d4fd",
        electric: "#7c5cff",
        signal: "#00f5a0",
        warning: "#f6c85f",
        danger: "#ff4d6d",
      },
      boxShadow: {
        glow: "0 0 28px rgba(33, 212, 253, 0.22)",
        panel: "0 18px 60px rgba(0, 0, 0, 0.35)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Arial"],
      },
    },
  },
  plugins: [],
};
