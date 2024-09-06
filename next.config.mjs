/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/crypto-exchangers/exchanger-:exchanger",
        destination: "/crypto-exchangers/:exchanger",
      },
    ];
  },
};

export default nextConfig;
