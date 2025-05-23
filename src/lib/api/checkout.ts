import { wooCommerceClient } from "@/services/woocommerce";
import { CheckoutCart } from "@/@types";

export async function checkout(cartData: CheckoutCart) {
  try {
    // Create customer
    const customerRes = await wooCommerceClient.post("/customers", {
      email: cartData.billing.email,
      first_name: cartData.billing.first_name,
      last_name: cartData.billing.last_name,
      billing: cartData.billing,
      shipping: cartData.shipping,
    });

    const customer = customerRes.data;

    // Create order
    const orderPayload = {
      payment_method: cartData.payment_method,
      payment_method_title: cartData.payment_method_title,
      set_paid: cartData.set_paid || false,
      billing: cartData.billing,
      shipping: cartData.shipping,
      customer_id: customer.id,
      line_items: cartData.line_items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        variation_id: item.variation_id || undefined,
      })),
    };

    const orderRes = await wooCommerceClient.post("/orders", orderPayload);
    const order = orderRes.data;

    // If payment required, redirect to gateway
    if (!order.set_paid) {
      return {
        order,
        payment_gateway: {
          url: `https://your-payment-gateway.com/pay/${order.id}`,
        },
      };
    }

    return { order };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      "message" in error
    ) {
      console.error(
        "Checkout error:",
        // @ts-expect-error: error might not have response
        error.response?.data || error.message || error
      );
    } else {
      console.error("Checkout error:", error);
    }
    throw error;
  }
}
