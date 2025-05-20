import { Product } from "@/@types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: Product[];
  totalItems: number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void; // productId as number to match Product.id type
  isInWishlist: (productId: number) => boolean; // same here
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,

      addToWishlist: (product: Product) =>
        set((state) => {
          // Check if product already in wishlist by id
          if (state.items.some((item) => item.id === product.id)) {
            return state;
          }
          return {
            items: [...state.items, product],
            totalItems: state.totalItems + 1,
          };
        }),

      removeFromWishlist: (productId: number) =>
        set((state) => ({
          // Filter out the product with matching id
          items: state.items.filter((item) => item.id !== productId),
          totalItems: state.totalItems - 1,
        })),

      isInWishlist: (productId: number) => {
        const state = get();
        return state.items.some((item) => item.id === productId);
      },
    }),
    {
      name: "wishlist-storage", // name of item in localStorage
    }
  )
);
