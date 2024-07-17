/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/exchanger-:exchanger",
        destination: "/exchanger/:exchanger",
      },
    ];
  },
};

export default nextConfig;
