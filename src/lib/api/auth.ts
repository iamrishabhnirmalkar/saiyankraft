import { authClient, wooCommerceClient } from "@/services/woocommerce";
import Cookies from "js-cookie";

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await authClient.post("/token", {
      username,
      password,
    });
    return response.data; // includes token
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response
    ) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw { message: "Login failed" };
  }
};

export const registerUser = async (
  email: string,
  username: string,
  password: string
) => {
  try {
    const response = await wooCommerceClient.post("/customers", {
      email,
      username,
      password,
    });
    return response.data;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response
    ) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw { message: "Registration failed" };
  }
};

export const whoAmI = async (token: string) => {
  try {
    const response = await authClient.post(
      "/token/validate",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Returns true if valid
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response
    ) {
      throw (error as { response: { data: unknown } }).response.data;
    }
    throw { message: "Token validation failed" };
  }
};

export const logoutUser = () => {
  Cookies.remove("auth_token");
};
