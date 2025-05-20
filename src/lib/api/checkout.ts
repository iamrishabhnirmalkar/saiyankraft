import { CheckoutCart } from "@/@types";
import wooCommerceClient from "@/services/woocommerce";

export async function checkout(cartData: CheckoutCart) {
  try {
    const response = await wooCommerceClient.post("/orders", cartData);
    return response.data;
  } catch (error) {
    console.error("Checkout error:", error);
    throw error;
  }
}
