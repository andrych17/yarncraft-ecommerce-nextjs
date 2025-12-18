import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // Set explicit workspace root to silence warning
  outputFileTracingRoot: path.join(__dirname),
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Improve image quality
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Higher quality for better clarity
    minimumCacheTTL: 60,
  },
}

export default nextConfig
