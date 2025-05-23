import { Customer } from "@/@types";
import { wooCommerceClient } from "@/services/woocommerce";

export const postCustomers = async (
  customerData: Partial<Customer>
): Promise<Customer> => {
  try {
    const response = await wooCommerceClient.post("/customers", customerData);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Unknown error";
    interface ErrorWithResponse {
      response?: {
        data?: string;
      };
    }

    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      (error as ErrorWithResponse).response &&
      typeof (error as ErrorWithResponse).response === "object" &&
      "data" in (error as ErrorWithResponse).response!
    ) {
      errorMessage =
        (error as ErrorWithResponse).response!.data ?? "Unknown error";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Failed to create customer:", errorMessage);
    throw new Error("Unable to create customer");
  }
};
