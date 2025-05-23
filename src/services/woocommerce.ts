import axios from "axios";

const siteUrl = process.env.NEXT_PUBLIC_WC_SITE_URL || "https://saiyankraft.in";
const apiNamespace = process.env.NEXT_PUBLIC_WC_API_NAMESPACE || "wc";
const apiVersion = process.env.NEXT_PUBLIC_WC_API_VERSION || "v3";
const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || "";
const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || "";
const jwtUrl = `${siteUrl}/wp-json/jwt-auth/v1`;

// Create Axios instance
const wooCommerceClient = axios.create({
  baseURL: `${siteUrl}/wp-json/${apiNamespace}/${apiVersion}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 seconds timeout
  params: {
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
  },
  maxRedirects: 5,
  maxContentLength: 2000000,
  maxBodyLength: 2000000,
  responseType: "json",
  proxy: false,
  validateStatus: (status) => status >= 200 && status < 300,
});

// Add interceptor to ensure credentials are present
wooCommerceClient.interceptors.request.use((config) => {
  if (!consumerKey || !consumerSecret) {
    console.error("WooCommerce API credentials are not configured");
    throw new Error("WooCommerce API credentials are not configured");
  }

  // Ensure credentials are always in query parameters
  config.params = {
    ...config.params,
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
  };

  return config;
});

const authClient = axios.create({
  baseURL: jwtUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export { wooCommerceClient, authClient };
