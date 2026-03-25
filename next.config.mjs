/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // เพิ่มบรรทัดนี้เพื่อแก้ Error Swagger
  allowedDevOrigins: ["192.168.1.34"],
  reactCompiler: true,
  transpilePackages: ["swagger-ui-react"],
};

export default nextConfig;
