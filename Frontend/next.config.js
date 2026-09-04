/** @type {import('next').NextConfig} */
const backendUrl = (process.env.BACKEND_URL || "http://localhost:3000").replace(/\/$/, "");

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Vercel proxies browser requests to Render, keeping cookies and API
        // calls same-origin from the frontend's perspective.
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
