/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
   basePath: '/panda-words',
  assetPrefix: '/panda-words/',  
};

export default nextConfig;
