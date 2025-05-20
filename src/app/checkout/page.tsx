"use client";
import React, { useState } from "react";
// import { checkout } from "@/services/checkout"; // your checkout API function
import { Billing, CheckoutLineItem, Shipping } from "@/@types";
import type { CheckoutCart } from "@/@types";

const sampleProducts = [
  { id: 101, name: "Product A", price: "10.00" },
  { id: 102, name: "Product B", price: "20.00" },
];

export default function CheckoutPage() {
  // Cart state
  const [cartItems] = useState<CheckoutLineItem[]>([
    { product_id: 101, quantity: 1 },
    { product_id: 102, quantity: 1 },
  ]);

  // Billing info state
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

  // Shipping info state (same as billing by default)
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
  // Replace 'Order' with the actual type returned by your checkout API if available
  interface Order {
    id: number;
    // add other fields as needed
  }
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle input change helpers
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  // Submit checkout
  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare the payload
    const payload: CheckoutCart = {
      payment_method: paymentMethod,
      payment_method_title: paymentMethodTitle,
      billing,
      shipping,
      line_items: cartItems,
      set_paid: setPaid,
    };

    try {
      const order = await checkout(payload);
      setOrderSuccess(order);
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

      <h2>Cart Items</h2>
      <ul>
        {cartItems.map(({ product_id, quantity }) => {
          const product = sampleProducts.find((p) => p.id === product_id);
          return (
            <li key={product_id}>
              {product?.name} - Qty: {quantity} - Price: ${product?.price}
            </li>
          );
        })}
      </ul>

      <form onSubmit={handleCheckout}>
        <h3>Billing Information</h3>
        <input
          name="first_name"
          placeholder="First Name"
          value={billing.first_name}
          onChange={handleBillingChange}
          required
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={billing.last_name}
          onChange={handleBillingChange}
          required
        />
        <input
          name="address_1"
          placeholder="Address"
          value={billing.address_1}
          onChange={handleBillingChange}
          required
        />
        <input
          name="city"
          placeholder="City"
          value={billing.city}
          onChange={handleBillingChange}
          required
        />
        <input
          name="state"
          placeholder="State"
          value={billing.state}
          onChange={handleBillingChange}
          required
        />
        <input
          name="postcode"
          placeholder="Postal Code"
          value={billing.postcode}
          onChange={handleBillingChange}
          required
        />
        <input
          name="country"
          placeholder="Country"
          value={billing.country}
          onChange={handleBillingChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={billing.email}
          onChange={handleBillingChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={billing.phone}
          onChange={handleBillingChange}
          required
        />

        <h3>Shipping Information</h3>
        <input
          name="first_name"
          placeholder="First Name"
          value={shipping.first_name}
          onChange={handleShippingChange}
          required
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={shipping.last_name}
          onChange={handleShippingChange}
          required
        />
        <input
          name="address_1"
          placeholder="Address"
          value={shipping.address_1}
          onChange={handleShippingChange}
          required
        />
        <input
          name="city"
          placeholder="City"
          value={shipping.city}
          onChange={handleShippingChange}
          required
        />
        <input
          name="state"
          placeholder="State"
          value={shipping.state}
          onChange={handleShippingChange}
          required
        />
        <input
          name="postcode"
          placeholder="Postal Code"
          value={shipping.postcode}
          onChange={handleShippingChange}
          required
        />
        <input
          name="country"
          placeholder="Country"
          value={shipping.country}
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
        <div
          style={{
            marginTop: 20,
            padding: 10,
            background: "#d4edda",
            color: "#155724",
          }}
        >
          Order successfully created! Order ID: {orderSuccess.id}
        </div>
      )}
      {error && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            background: "#f8d7da",
            color: "#721c24",
          }}
        >
          Error: {error}
        </div>
      )}
    </div>
  );
}
