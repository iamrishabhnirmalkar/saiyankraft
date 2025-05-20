"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const cartItems = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const router = useRouter();

  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.sale_price
      ? Number(item.sale_price)
      : Number(item.price);
    return total + price * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Shopping Cart</h1>
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-6 border-b pb-4">
            <Image
              src={item.images?.[0]?.src || "/placeholder.jpg"}
              alt={item.name}
              width={100}
              height={100}
              className="rounded-lg object-cover"
            />
            <div className="flex-1">
              <Link href={`/product/${item.id}`}>
                <h2 className="text-lg font-medium hover:underline cursor-pointer">
                  {item.name}
                </h2>
              </Link>
              <p className="text-sm text-muted-foreground">
                Price: ₹{item.sale_price || item.price}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Button
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  –
                </Button>
                <span className="text-lg">{item.quantity}</span>
                <Button
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <p className="text-xl font-semibold">Total: ₹{totalPrice.toFixed(2)}</p>
        <Button onClick={() => router.push("/checkout")} className="px-8 py-3">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
