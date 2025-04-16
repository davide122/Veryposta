/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Client-side: ignore Node.js specific modules
            config.resolve.fallback = {
                fs: false,
                net: false,
                tls: false,
                dns: false,
                pg: false,
                'pg-native': false
            };
        }
        return config;
    },
    // Skip static generation for dynamic routes during build
    output: 'standalone',
    experimental: {
        serverActions: true
    }
};

export default nextConfig;
