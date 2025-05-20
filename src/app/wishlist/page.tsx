"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlistStore";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const wishlistItems = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your Wishlist is Empty</h2>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Your Wishlist</h1>
      <div className="space-y-6">
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-6 border-b pb-4"
          >
            <Image
              src={product.images?.[0]?.src || "/placeholder.jpg"}
              alt={product.name}
              width={100}
              height={100}
              className="rounded-lg object-cover"
            />
            <div className="flex-1">
              <Link href={`/product/${product.id}`}>
                <h2 className="text-lg font-medium hover:underline cursor-pointer">
                  {product.name}
                </h2>
              </Link>
              <p className="text-sm text-muted-foreground">
                Price: ₹{product.sale_price || product.price}
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => removeFromWishlist(product.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
