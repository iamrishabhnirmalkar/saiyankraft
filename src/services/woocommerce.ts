import axios from "axios";

const wooCommerceClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_WC_SITE_URL}/wp-json/wc/v3`
    : "",
});

// Add request interceptor to add authentication headers
wooCommerceClient.interceptors.request.use((config) => {
  const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
  const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    console.error("WooCommerce API credentials are not configured");
    throw new Error("WooCommerce API credentials are not configured");
  }

  // Add query parameters for authentication instead of Basic Auth
  config.params = {
    ...config.params,
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
  };

  return config;
});

export default wooCommerceClient;
