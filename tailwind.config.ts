import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        
      },
      colors: {
        "primary-dark": "#633CFF",
        "primary-medium": "#BEADFF",
        "primary-light": "#EFEBFF",
        accent: "#FF3939",
        "grey-500": "#333333",
        "grey-400": "#737373",
        "grey-300": "#d9d9d9",
        "grey-200": "#fafafa",
        "grey-100": "#ffffff",
      },
    },
  },
  plugins: [],
};
export default config;
