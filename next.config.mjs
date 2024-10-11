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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'strp.moneyswap.online',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.moneyswap.online',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;