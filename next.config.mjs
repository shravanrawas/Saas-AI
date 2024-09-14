/** @type {import('next').NextConfig} */
export default {
  async rewrites() {
    return [
      {
        source: '/api/videogen/:path*',
        destination: 'https://api.replicate.com/v1/predictions/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/videogen/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
    ];
  },
};
