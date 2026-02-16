import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Configuración para despliegue en hosting tradicional
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'crests.football-data.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
