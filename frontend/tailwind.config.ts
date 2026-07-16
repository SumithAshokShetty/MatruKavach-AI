import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2E5C55", 
          light: "#4A8F85",
          dark: "#1A3833",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#D4A373", 
          light: "#E3C2A0",
          dark: "#A67C52",
          foreground: "#2E5C55",
        },
        alert: {
          DEFAULT: "#E76F51", 
          light: "#F09A85",
          dark: "#B3462B",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "rgba(255, 255, 255, 0.8)",
          dark: "rgba(30, 41, 59, 0.8)",
        }
      },
      fontFamily: {
        heading: ["var(--font-bricolage)", "sans-serif"],
        serif: ["var(--font-dm-serif)", "serif"],
        body: ["var(--font-geist-sans)", "sans-serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'subtle-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232e5c55' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
};
export default config;
