/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true, // builds /nhl as nhl/index.html so GitHub Pages serves it
  reactCompiler: true,
  images: {
    unoptimized: true, // Required for static exports (GitHub Pages)
  },
};

export default nextConfig;