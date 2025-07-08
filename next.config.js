/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  // Optimize bundle size
  experimental: {
    outputFileTracingRoot: process.cwd(),
    // Exclude unnecessary files from standalone build
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@next/swc-*',
        'node_modules/typescript',
        'node_modules/@types/**/*',
        'node_modules/tailwindcss/**/*',
        'node_modules/autoprefixer/**/*',
      ],
    },
  },
  
  // This allows us to use env vars in Docker build
  publicRuntimeConfig: {
    // Will be available on both server and client
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Tree shaking and bundle optimization
  swcMinify: true,
  
  webpack: (config, { isServer, webpack }) => {
    // SQLite and better-sqlite3 are only used on the server side
    if (isServer) {
      // When the server bundles, we need to include native addons
      config.externals = [...config.externals, 'better-sqlite3'];
    }

    // For client-side, we need to ignore these modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        'better-sqlite3': false,
      };
    }

    // Optimize chunks and reduce bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };

    return config;
  },
};

module.exports = nextConfig;