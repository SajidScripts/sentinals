const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    outputFileTracingRoot: path.join(__dirname, '../../'),
    experimental: {
        outputFileTracingExcludes: {
            '*': [
                'node_modules/@swc/core-win32-x64-msvc',
                'node_modules/@swc/core-linux-x64-gnu',
                'node_modules/@nestjs',
                'node_modules/prisma',
                'node_modules/@prisma/engines',
                'node_modules/typescript'
            ],
        },
        optimizePackageImports: ['lucide-react', 'framer-motion'],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

module.exports = nextConfig;
