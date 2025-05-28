"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const { totalItems: cartItems } = useCartStore();
  const { totalItems: wishlistItems } = useWishlistStore();
  const { token, logout } = useAuthStore();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="bg-orange-500 w-full py-3 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <p className="text-white font-semibold text-lg">Home</p>
        </Link>

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

          {!token ? (
            <Link href="/auth">
              <p className="text-white font-semibold cursor-pointer">Login</p>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-white font-semibold cursor-pointer bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
