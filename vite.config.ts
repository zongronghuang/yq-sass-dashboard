import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
  base: "/yq-sass-dashboard/",
  plugins: [
    react(),
    tailwindcss(),
    checker({
      eslint: {
        lintCommand: "eslint .",
        useFlatConfig: true,
      },
    }),
  ],
});
