import axios, { AxiosResponse } from "axios";
import CryptoJS from "crypto-js";
import {
  Product,
  Order,
  Customer,
  CheckoutCart,
  CheckoutLineItem,
  OAuthParams,
  CartItem,
  UserRegistrationData,
  JWTTokenResponse,
  UserLoginData,
} from "@/@types/index"; // Adjust the import path as needed

// Environment Variables
const SITE_URL = process.env.NEXT_PUBLIC_WC_SITE_URL;
const API_URL = `${SITE_URL}/wp-json/wc/v3`;
const WP_USER_API_URL = `${SITE_URL}/wp-json/wp/v2/users`;

// API Response Wrapper

// Generate OAuth Signature for WooCommerce REST API
const generateOAuthSignature = (
  url: string,
  method: string = "GET",
  extraParams: Record<string, string | number> = {}
): OAuthParams => {
  const nonce = Math.random().toString(36).substring(2);
  const timestamp = Math.floor(Date.now() / 1000);

  const oauthParams = {
    oauth_consumer_key: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY!,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_version: "1.0",
  };

  const allParams: Record<string, string | number> = {
    ...oauthParams,
    ...extraParams,
  };

  const paramString = Object.keys(allParams)
    .sort()
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(
          String(allParams[key])
        )}`
    )
    .join("&");

  const baseUrl = url.split("?")[0];
  const baseString = `${method.toUpperCase()}&${encodeURIComponent(
    baseUrl
  )}&${encodeURIComponent(paramString)}`;

  const signingKey = `${encodeURIComponent(
    process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET!
  )}&`;

  const signature = CryptoJS.HmacSHA1(baseString, signingKey).toString(
    CryptoJS.enc.Base64
  );

  return { ...oauthParams, oauth_signature: signature };
};

// Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// ============================ API FUNCTIONS ============================ //

// ✅ Get All Products
export const getAllProducts = async (): Promise<Product[] | null> => {
  try {
    const url = `${API_URL}/products`;
    const oauthParams = generateOAuthSignature(url);
    const response: AxiosResponse<Product[]> = await api.get("/products", {
      params: oauthParams,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return null;
  }
};

// ✅ Get Single Product by ID
export const getSingleProductData = async (
  productID: number
): Promise<Product | null> => {
  try {
    const url = `${API_URL}/products/${productID}`;
    const oauthParams = generateOAuthSignature(url);
    const response: AxiosResponse<Product> = await api.get(
      `/products/${productID}`,
      {
        params: oauthParams,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// ✅ Register User
export const registerStoreUser = async (
  userInfo: UserRegistrationData
): Promise<Customer | null> => {
  try {
    const response: AxiosResponse<Customer> = await axios.post(
      WP_USER_API_URL,
      userInfo,
      {
        headers: {
          Authorization: "Basic " + btoa("username:password"), // Replace with actual credentials or token
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("User registration failed:", error);
    return null;
  }
};

// ✅ Login User
export const loginUser = async (
  userInfo: UserLoginData
): Promise<JWTTokenResponse | null> => {
  try {
    const response: AxiosResponse<JWTTokenResponse> = await axios.post(
      `${SITE_URL}/wp-json/jwt-auth/v1/token`,
      userInfo,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

// ✅ Create Order
export const createAnOrder = async (
  userInfo: Omit<CheckoutCart, "line_items">
): Promise<Order | null> => {
  try {
    // Note: In a real application, you should use React state or a state management solution
    // instead of localStorage. This is kept for compatibility with the original code.
    const cartItemsString =
      typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    const cartItems: CartItem[] = cartItemsString
      ? JSON.parse(cartItemsString)
      : [];

    if (!cartItems.length) {
      console.log("Cart is empty");
      return null;
    }

    const lineItems: CheckoutLineItem[] = cartItems.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const orderData: CheckoutCart = {
      ...userInfo,
      line_items: lineItems,
    };

    const url = `${API_URL}/orders`;
    const oauthParams = generateOAuthSignature(url, "POST");

    const oauthHeader = Object.keys(oauthParams)
      .map(
        (key) =>
          `${key}="${encodeURIComponent(
            oauthParams[key as keyof OAuthParams]
          )}"`
      )
      .join(", ");

    const response: AxiosResponse<Order> = await api.post(
      "/orders",
      orderData,
      {
        headers: {
          Authorization: `OAuth ${oauthHeader}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Order creation failed:", error);
    return null;
  }
};

// ✅ Get Logged-In User Data
export const getLoggedInUserData = async (
  token: string
): Promise<Customer | null> => {
  try {
    const response: AxiosResponse<Customer> = await axios.get(
      `${WP_USER_API_URL}/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
};

// ✅ Get Orders by User ID
export const getOrdersByUserId = async (
  userId: number
): Promise<Order[] | null> => {
  try {
    const url = `${API_URL}/orders`;
    const oauthParams = generateOAuthSignature(url, "GET", {
      customer: userId,
    });

    const response: AxiosResponse<Order[]> = await api.get("/orders", {
      params: {
        ...oauthParams,
        customer: userId,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Fetching user orders failed:", error);
    return null;
  }
};

// ✅ Get Single Order
export const getSingleOrderData = async (
  orderId: number
): Promise<Order | null> => {
  try {
    const url = `${API_URL}/orders/${orderId}`;
    const oauthParams = generateOAuthSignature(url);

    const response: AxiosResponse<Order> = await api.get(`/orders/${orderId}`, {
      params: oauthParams,
    });

    return response.data;
  } catch (error) {
    console.error("Fetching order failed:", error);
    return null;
  }
};

// ✅ Delete Order by ID
export const deleteOrderById = async (
  orderId: number
): Promise<Order | null> => {
  try {
    const url = `${API_URL}/orders/${orderId}`;
    const oauthParams = generateOAuthSignature(url, "DELETE");

    const oauthHeader = Object.keys(oauthParams)
      .map(
        (key) =>
          `${key}="${encodeURIComponent(
            oauthParams[key as keyof OAuthParams]
          )}"`
      )
      .join(", ");

    const response: AxiosResponse<Order> = await api.delete(
      `/orders/${orderId}`,
      {
        headers: {
          Authorization: `OAuth ${oauthHeader}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Order deletion failed:", error);
    return null;
  }
};

// ✅ Additional utility functions for better type safety

// Get Products with pagination
export const getProductsPaginated = async (
  page: number = 1,
  perPage: number = 10
): Promise<Product[] | null> => {
  try {
    const url = `${API_URL}/products`;
    const oauthParams = generateOAuthSignature(url, "GET", {
      page,
      per_page: perPage,
    });

    const response: AxiosResponse<Product[]> = await api.get("/products", {
      params: {
        ...oauthParams,
        page,
        per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    return null;
  }
};

// Update Order Status
export const updateOrderStatus = async (
  orderId: number,
  status: string
): Promise<Order | null> => {
  try {
    const url = `${API_URL}/orders/${orderId}`;
    const oauthParams = generateOAuthSignature(url, "PUT");

    const oauthHeader = Object.keys(oauthParams)
      .map(
        (key) =>
          `${key}="${encodeURIComponent(
            oauthParams[key as keyof OAuthParams]
          )}"`
      )
      .join(", ");

    const response: AxiosResponse<Order> = await api.put(
      `/orders/${orderId}`,
      { status },
      {
        headers: {
          Authorization: `OAuth ${oauthHeader}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Order status update failed:", error);
    return null;
  }
};
