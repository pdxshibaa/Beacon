import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cursor Preview hits the app at 127.0.0.1 while Next serves from localhost.
  // Without this, the browser never loads client JS, so the search box cannot submit.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
