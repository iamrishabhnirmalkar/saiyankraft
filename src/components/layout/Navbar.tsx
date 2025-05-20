"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function Navbar() {
  const { totalItems: cartItems } = useCartStore();
  const { totalItems: wishlistItems } = useWishlistStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="bg-orange-500 w-full py-3 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link href="/">
            <p className="text-white font-semibold text-lg">Home</p>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/cart" className="relative">
            <p className="text-white font-semibold">Cart</p>
            {isClient && cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItems}
              </span>
            )}
          </Link>
          <Link href="/wishlist" className="relative">
            <p className="text-white font-semibold">Wishlist</p>
            {isClient && wishlistItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlistItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
