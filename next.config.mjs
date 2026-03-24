import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
          unoptimized: true,
    },
    eslint: {
          ignoreDuringBuilds: true,
    },
    typescript: {
          ignoreBuildErrors: true,
    },
};

// Configure the Cloudflare development platform bindings in dev mode
if (process.env.NODE_ENV === "development") {
    await setupDevPlatform();
}

export default nextConfig;
