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
            };
        }
        return config;
    },
};

export default nextConfig;
