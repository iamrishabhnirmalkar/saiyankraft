/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["https://saiyankraft.in/"], // Add your WooCommerce domain for images
  },
  env: {
    WC_CONSUMER_KEY: process.env.WC_CONSUMER_KEY,
    WC_CONSUMER_SECRET: process.env.WC_CONSUMER_SECRET,
  },
};

module.exports = nextConfig;
