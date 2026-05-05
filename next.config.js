/** @type {import('next').NextConfig} */
const nextConfig = {
  // Middleware runs at the Edge — no special config needed.
  // Just ensure ADMIN_PASSWORD and ADMIN_SESSION_TOKEN are set
  // in your deployment environment variables.
};

module.exports = nextConfig;
