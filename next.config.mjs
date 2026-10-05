/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Command Center was renamed Acquia Source; keep old links working.
      {
        source: "/case-studies/acquia-unification",
        destination: "/case-studies/acquia-source",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
