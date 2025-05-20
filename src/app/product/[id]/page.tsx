"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Product } from "@/@types";

// Remove the local Product interface and import the shared Product type
// Update the import path below to the actual location of your Product type

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);

  // Zustand stores for cart and wishlist
  const addToCart = useCartStore((state) => state.addToCart);
  const isInWishlist = useWishlistStore((state) =>
    product ? state.isInWishlist(product.id) : false
  );
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Replace this with your actual API call
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProduct();
  }, [params.id]);

  const toggleWishlist = () => {
    if (!product) return;
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (!product) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const priceDisplay =
    product.sale_price && +product.sale_price > 0 ? (
      <div className="flex gap-2 text-lg font-semibold">
        <span className="line-through text-muted-foreground">
          ₹{product.price}
        </span>
        <span className="text-red-500">₹{product.sale_price}</span>
      </div>
    ) : (
      <div className="text-lg font-semibold">₹{product.price}</div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image */}
        <div className="relative w-full md:w-1/2 h-96 rounded-lg overflow-hidden">
          <Image
            src={product.images?.[0]?.src || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between md:w-1/2">
          <div className="mb-4">
            <p className="whitespace-pre-line text-gray-700">
              {product.description}
            </p>
          </div>

          {priceDisplay}

          <div className="flex items-center gap-4 mt-4">
            <Button
              onClick={() => addToCart(product)}
              className="flex items-center gap-2"
              size="lg"
            >
              <ShoppingCart /> Add to Cart
            </Button>
            <Button
              onClick={toggleWishlist}
              variant={isInWishlist ? "default" : "outline"}
              size="lg"
              className="flex items-center gap-2"
            >
              <Heart
                className={`h-5 w-5 ${
                  isInWishlist ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
