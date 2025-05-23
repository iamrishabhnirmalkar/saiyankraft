import { Product } from "@/@types";
import { wooCommerceClient } from "@/services/woocommerce";

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await wooCommerceClient.get("/products", {
      params: {
        per_page: 100,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};
