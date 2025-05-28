import { Product } from "@/@types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: Product[];
  totalItems: number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,

      addToWishlist: (product) =>
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) return state;
          const updated = [...state.items, product];
          return { items: updated, totalItems: updated.length };
        }),

      removeFromWishlist: (productId) =>
        set((state) => {
          const updated = state.items.filter((item) => item.id !== productId);
          return { items: updated, totalItems: updated.length };
        }),

      isInWishlist: (productId) => {
        const state = get();
        return state.items.some((item) => item.id === productId);
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);
