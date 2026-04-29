const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
    outputFileTracingIncludes: {
      '/api/**/*': ['./prisma/**/*'],
    },
  },
};

export default nextConfig;
