// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "api.moneyswap.online",
//         port: "",
//         pathname: "/media/icons/valute/**",
//       },
//     ],
//     formats: ["image/webp"],
//   },
//   async rewrites() {
//     return [
//       {
//         source: "/crypto-exchangers/exchanger-:exchanger",
//         destination: "/crypto-exchangers/:exchanger",
//       },
//       {
//         source: "/blacklist/exchanger-:exchanger",
//         destination: "/blacklist/:exchanger",
//       },
//     ];
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'strp.moneyswap.online',
//         port: '',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'api.moneyswap.online',
//         port: '',
//         pathname: '/**',
//       },
//       {
//         protocol: "http",
//         hostname: "0.0.0.0",
//         port: "1337",
//         pathname: "/**",
//       },
//     ],
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "strp.moneyswap.online",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.moneyswap.online",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "0.0.0.0",
        port: "1337",
        pathname: "/**",
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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;