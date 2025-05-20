"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/@types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamically import drawers (no SSR)
const WishlistDrawer = dynamic(() => import("./WishlistDrawer"), {
  ssr: false,
});
const CartDrawer = dynamic<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>(() => import("./CartDrawer"), { ssr: false });

export default function Productcard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id)
  );
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );

  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const toggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.error("Removed from Wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to Wishlist", {
        description: `${product.name} saved to wishlist`,
      });
      setWishlistOpen(true);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Added to Cart", {
      description: `${product.name} added to cart`,
    });
    setCartOpen(true);
  };

  const getPrice = () => {
    const hasDiscount = product.sale_price && +product.sale_price > 0;
    return hasDiscount ? (
      <div className="flex gap-2 text-sm">
        <span className="text-muted-foreground line-through">
          ₹{product.price}
        </span>
        <span className="text-red-500 font-semibold">
          ₹{product.sale_price}
        </span>
      </div>
    ) : (
      <div className="text-sm">₹{product.price}</div>
    );
  };

  return (
    <>
      <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all">
        <CardHeader className="p-2 pb-0">
          <Link href={`/product/${product.id}`}>
            <div className="relative h-48 w-full overflow-hidden rounded-xl">
              <Image
                src={product.images?.[0]?.src || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </Link>
        </CardHeader>

        <CardContent className="p-2 pt-3 space-y-1">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-base font-medium leading-tight line-clamp-2">
              {product.name}
            </h3>
          </Link>
          {getPrice()}
        </CardContent>

        <CardFooter className="p-2 flex items-center justify-between gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            size="icon"
            variant={isInWishlist ? "default" : "outline"}
            onClick={toggleWishlist}
          >
            <Heart
              className={`h-4 w-4 ${
                isInWishlist ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </CardFooter>
      </Card>

      {/* Wishlist Drawer Popup */}
      <WishlistDrawer open={wishlistOpen} onOpenChange={setWishlistOpen} />

      {/* Cart Drawer Popup */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
