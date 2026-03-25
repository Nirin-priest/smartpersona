/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.1.34"],
  /* config options here */
  reactCompiler: true,
  transpilePackages: ['swagger-ui-react'],
};

export default nextConfig;
