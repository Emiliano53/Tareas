/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {}, // Cambiado de `true` a objeto (requerido en Next.js 14+)
    optimizeCss: false, // Opcional: solo si usas CSS no estándar
  },
  // Reemplaza 'serverComponentsExternalPackages' y 'transpilePackages' por:
  serverExternalPackages: ['@prisma/client'], // Nueva clave unificada
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false,
      child_process: false,
      dns: false
    };
    return config;
  },
  output: 'standalone' // Recomendado para Vercel
};

module.exports = nextConfig;