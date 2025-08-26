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
      {
        source: "/blacklist/exchanger-:exchanger",
        destination: "/blacklist/:exchanger",
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
      {
        protocol: "http",
        hostname: "0.0.0.0",
        port: "1337",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;