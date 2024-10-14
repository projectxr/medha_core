/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "https://medha-cograd.azurewebsites.net/:path*",
      },
      {
        source: "/voicebot/:path*",
        destination: "https://voicebot-server.onrender.com/:path*",
      },
      {
        source: "/api/:path*",
        destination: "https://game.simplem.in/:path*",
      },
      {
        source: "/api/submit-exam-form/",
        destination: "https://game.simplem.in/:path*",
      },
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:5217/:path*",
      },
    ];
  },

  // Remove 'target' as it's deprecated in newer Next.js versions
  async headers() {
    return [
      {
        source: "/(.*)", // Matches all routes
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            // Use your domain or specific origins instead of '*'
            value: "*", // Consider replacing '*' with a specific domain in production
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version",
          },
        ],
      },
    ];
  },
  esmExternals: 'loose',
  experimental: {
    missingSuspenseWithCSRBailout: false,
    serverActions: {},
    serverComponentsExternalPackages: ["mongoose"],
  },

  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};

export default nextConfig;
