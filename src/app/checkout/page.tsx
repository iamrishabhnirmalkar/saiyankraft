"use client";
import React, { useState } from "react";
import { Billing, CheckoutLineItem, Shipping } from "@/@types";
import type { CheckoutCart } from "@/@types";
import { checkout } from "@/lib/api/checkout";

export default function CheckoutPage() {
  const [cartItems] = useState<CheckoutLineItem[]>([
    { product_id: 101, quantity: 1 },
    { product_id: 102, quantity: 1 },
  ]);

  const [billing, setBilling] = useState<Billing>({
    first_name: "",
    last_name: "",
    company: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    email: "",
    phone: "",
  });

  const [shipping, setShipping] = useState<Shipping>({
    first_name: "",
    last_name: "",
    company: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    email: "",
  });

  const [setPaid, setSetPaid] = useState(false);
  const [paymentMethod] = useState("cod");
  const [paymentMethodTitle] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ id: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: CheckoutCart = {
      payment_method: paymentMethod,
      payment_method_title: paymentMethodTitle,
      billing,
      shipping,
      line_items: cartItems,
      set_paid: setPaid,
    };

    try {
      const response = await checkout(payload);

      if (response.payment_gateway) {
        window.location.href = response.payment_gateway.url;
      } else {
        setOrderSuccess(response.order);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1>Checkout</h1>
      <form onSubmit={handleCheckout}>
        <h3>Billing Info</h3>
        <input
          name="first_name"
          placeholder="First Name"
          onChange={handleBillingChange}
          required
        />
        <input
          name="last_name"
          placeholder="Last Name"
          onChange={handleBillingChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleBillingChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleBillingChange}
          required
        />
        <input
          name="address_1"
          placeholder="Address"
          onChange={handleBillingChange}
          required
        />
        <input
          name="city"
          placeholder="City"
          onChange={handleBillingChange}
          required
        />
        <input
          name="state"
          placeholder="State"
          onChange={handleBillingChange}
          required
        />
        <input
          name="postcode"
          placeholder="Postcode"
          onChange={handleBillingChange}
          required
        />
        <input
          name="country"
          placeholder="Country"
          onChange={handleBillingChange}
          required
        />

        <h3>Shipping Info</h3>
        <input
          name="first_name"
          placeholder="First Name"
          onChange={handleShippingChange}
          required
        />
        <input
          name="last_name"
          placeholder="Last Name"
          onChange={handleShippingChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleShippingChange}
          required
        />
        <input
          name="address_1"
          placeholder="Address"
          onChange={handleShippingChange}
          required
        />
        <input
          name="city"
          placeholder="City"
          onChange={handleShippingChange}
          required
        />
        <input
          name="state"
          placeholder="State"
          onChange={handleShippingChange}
          required
        />
        <input
          name="postcode"
          placeholder="Postcode"
          onChange={handleShippingChange}
          required
        />
        <input
          name="country"
          placeholder="Country"
          onChange={handleShippingChange}
          required
        />

        <label>
          <input
            type="checkbox"
            checked={setPaid}
            onChange={(e) => setSetPaid(e.target.checked)}
          />{" "}
          Set Paid
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>

      {orderSuccess && (
        <div style={{ marginTop: 20, background: "#d4edda", padding: 10 }}>
          Order placed! ID: {orderSuccess.id}
        </div>
      )}

      {error && (
        <div style={{ marginTop: 20, background: "#f8d7da", padding: 10 }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}
