import { heroui } from "@heroui/react";
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: [
    "./src/**/*.tsx",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xl: { max: "1280px" },
      lg: { min: "1024px" },
      md: { min: "768px" },
      sm: { min: "640px" },
      dxl: { max: "1280px" },
      dlg: { max: "1024px" },
      dmd: { max: "768px" },
      dsm: { max: "640px" },
      "h-md": { raw: "(max-height: 768px)" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [heroui()],
} satisfies Config;
