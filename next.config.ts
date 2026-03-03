/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/panda-words',
  assetPrefix: '/panda-words/',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: '/panda-words',
  },
};

module.exports = nextConfig;
