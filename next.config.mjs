const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : "*.supabase.co";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === "1", // local QA only (sandbox cannot resolve remote hosts from Node)
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: supabaseHost }, { protocol: "https", hostname: "**.supabase.co" }, { protocol: "https", hostname: "images.unsplash.com" }],
  },
  poweredByHeader: false,
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
};
export default nextConfig;
