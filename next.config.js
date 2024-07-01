/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    domains: ["assets.vercel.com", "images.unsplash.com", "pbs.twimg.com"],
  },
  experimental: {
    instrumentationHook: true,
  },
};

module.exports = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    domains: ["assets.vercel.com", "images.unsplash.com", "pbs.twimg.com"],
  },
  experimental: {
    instrumentationHook: true,
  },
  async headers() {
    return [
      {
        source: "/api/1/conversation/interview",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Authorization, x-api-key, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};