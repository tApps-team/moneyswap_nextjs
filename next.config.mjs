/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.moneyswap.online",
        port: "",
        pathname: "/media/icons/valute/**",
      },
    ],
    formats: ["image/webp"],
  },
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