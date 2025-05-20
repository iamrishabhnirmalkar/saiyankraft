"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const cartItems = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const router = useRouter();

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="p-4 max-w-md ml-auto">
        <DrawerHeader>
          <DrawerTitle>Shopping Cart</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-4 max-h-[70vh] overflow-auto">
          {cartItems.length === 0 ? (
            <p className="text-muted-foreground text-sm">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border-b pb-3"
              >
                <Image
                  src={item.images?.[0]?.src || "/placeholder.jpg"}
                  alt={item.name}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{item.sale_price || item.price}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      –
                    </Button>
                    <span className="text-sm">{item.quantity}</span>
                    <Button
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
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
