/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3498db", // Blue
        secondary: "#2ecc71", // Green
        background: "#1f1f1f", // Dark background
        text: "#ffffff", // White text
        accent: "#ff9800", // Orange accent color
      },
      fontFamily: {
        body: ["Roboto Mono", "monospace"], // Use a monospaced font for a techy feel
        heading: ["Space Mono", "monospace"], // Another monospaced font for headings
      },
      fontSize: {
        base: "16px",
        heading: "28px", // Larger headings for a geeky touch
        button: "14px",
      },
    },
  },
  plugins: [],
};
