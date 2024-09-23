import withPWA from "next-pwa";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "5unjgljkawvoq9sv.public.blob.vercel-storage.com",
        port: "",
        pathname:
          "/leaderboard-40a3-78225-2839-z9uxehi38bx0ythc09f-HKS65ddkaUc4KunJaUTVZIYjYQvhAX",
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default withPWA({
  dest: "public", // destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // disable PWA in the development environment
  register: true, // register the PWA service worker
  skipWaiting: true, // skip waiting for service worker activation
})(nextConfig);
