"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function WishlistDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const wishlist = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="p-4 max-w-md ml-auto">
        <DrawerHeader>
          <DrawerTitle>Wishlist</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-4 max-h-[70vh] overflow-auto">
          {wishlist.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Your wishlist is empty.
            </p>
          ) : (
            wishlist.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 border-b pb-3"
              >
                <Image
                  src={product.images?.[0]?.src || "/placeholder.jpg"}
                  alt={product.name}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{product.sale_price || product.price}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    addToCart(product);
                    removeFromWishlist(product.id);
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            ))
          )}
        </div>
        {wishlist.length > 0 && (
          <div className="pt-4">
            <Button className="w-full" onClick={() => router.push("/checkout")}>
              Go to Checkout
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
