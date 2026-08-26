/** @type {import('next').NextConfig} */
const isExport = process.env.EXPORT_MODE === "1";

const nextConfig = {
  output: isExport ? "export" : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;
