import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFFDF5",
          100: "#FFF9E0",
          200: "#FFF2B8",
          300: "#FFE88A",
          400: "#FFD700",
          500: "#F5A623",
          600: "#D4911E",
          700: "#B37A19",
          800: "#8A5E13",
          900: "#6B490F",
        },
        dark: {
          50: "#2A2A2A",
          100: "#1F1F1F",
          200: "#1A1A1A",
          300: "#151515",
          400: "#111111",
          500: "#0D0D0D",
          600: "#0A0A0A",
          700: "#070707",
          800: "#050505",
          900: "#020202",
        },
        gold: {
          light: "#FFE88A",
          DEFAULT: "#FFD700",
          dark: "#D4911E",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#0F0F0F",
          card: "#1A1A1A",
          "card-hover": "#222222",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "luxury-sm": "0 2px 8px rgba(245, 166, 35, 0.08)",
        "luxury-md": "0 4px 16px rgba(245, 166, 35, 0.12)",
        "luxury-lg": "0 8px 32px rgba(245, 166, 35, 0.16)",
        "luxury-xl": "0 16px 48px rgba(245, 166, 35, 0.2)",
        glow: "0 0 20px rgba(255, 215, 0, 0.3)",
        "glow-lg": "0 0 40px rgba(255, 215, 0, 0.4)",
        "inner-glow": "inset 0 0 20px rgba(255, 215, 0, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in-down": "fadeInDown 0.6s ease-out forwards",
        "fade-in-left": "fadeInLeft 0.6s ease-out forwards",
        "fade-in-right": "fadeInRight 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-down": "slideDown 0.5s ease-out forwards",
        spin: "spin 1s linear infinite",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 215, 0, 0.4)" },
          "50%": { boxShadow: "0 0 20px 10px rgba(255, 215, 0, 0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #FFD700 0%, #F5A623 100%)",
        "gradient-gold-dark":
          "linear-gradient(135deg, #D4911E 0%, #8A5E13 100%)",
        "gradient-dark":
          "linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)",
        "gradient-hero":
          "linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.5) 100%)",
        "gradient-card":
          "linear-gradient(145deg, #1A1A1A 0%, #111111 100%)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
