import { heroui } from "@heroui/theme";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/**/*.{js,ts,jsx,tsx}"
  ],
  plugins: [heroui()],
};