import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#010BCC", deep: "#08086F", soft: "#E8E8FD" },
        ink: { DEFAULT: "#101113", 2: "#191A1D" },
        paper: "#F5F7FC",
        text: { DEFAULT: "#151A29", 2: "#697386" },
        line: "#E5E8F0",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Craftwork Grotesk", "Space Grotesk Variable", "system-ui", "sans-serif"],
        body: ["Inter Variable", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["clamp(2.5rem,6vw,4.75rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        h2: ["clamp(2rem,4.2vw,3.25rem)", { lineHeight: "1", letterSpacing: "-0.025em" }],
        h3: ["clamp(1.5rem,2.6vw,2.125rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        h4: ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
        h5: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
      },
      boxShadow: { glow: "0 0 0 1px rgba(1,11,204,.35), 0 30px 80px -20px rgba(1,11,204,.45)", card: "0 1px 2px rgba(16,24,40,.04), 0 12px 32px -12px rgba(16,24,40,.12)" },
      keyframes: { float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } }, marquee: { to: { transform: "translateX(-50%)" } } },
      animation: { float: "float 7s ease-in-out infinite", marquee: "marquee 40s linear infinite" },
    },
  },
  plugins: [],
};
export default config;
