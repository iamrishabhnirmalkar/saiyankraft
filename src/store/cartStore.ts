import { Product } from "@/@types";
import { StateCreator, create } from "zustand";
import { PersistOptions, persist } from "zustand/middleware";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const getItemPrice = (item: CartItem | Product): number => {
  if (typeof item.sale_price === "number" && item.sale_price > 0) {
    return item.sale_price;
  }
  return typeof item.price === "number" ? item.price : parseFloat(item.price);
};

type CartPersist = (
  config: StateCreator<CartState>,
  options: PersistOptions<CartState>
) => StateCreator<CartState>;

export const useCartStore = create<CartState>()(
  (persist as CartPersist)(
    (set) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      addToCart: (product: Product, quantity: number = 1) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            const updatedItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
            return {
              items: updatedItems,
              totalItems: updatedItems.reduce(
                (acc, item) => acc + item.quantity,
                0
              ),
              totalAmount: updatedItems.reduce(
                (acc, item) => acc + getItemPrice(item) * item.quantity,
                0
              ),
            };
          }

          const newItem = { ...product, quantity };
          return {
            items: [...state.items, newItem],
            totalItems: state.totalItems + quantity,
            totalAmount: state.totalAmount + getItemPrice(product) * quantity,
          };
        }),
      removeFromCart: (productId: number) =>
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item.id !== productId
          );
          return {
            items: updatedItems,
            totalItems: updatedItems.reduce(
              (acc, item) => acc + item.quantity,
              0
            ),
            totalAmount: updatedItems.reduce(
              (acc, item) => acc + getItemPrice(item) * item.quantity,
              0
            ),
          };
        }),
      updateQuantity: (productId: number, quantity: number) =>
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.max(0, quantity) }
              : item
          );
          const filteredItems = updatedItems.filter(
            (item) => item.quantity > 0
          );
          return {
            items: filteredItems,
            totalItems: filteredItems.reduce(
              (acc, item) => acc + item.quantity,
              0
            ),
            totalAmount: filteredItems.reduce(
              (acc, item) => acc + getItemPrice(item) * item.quantity,
              0
            ),
          };
        }),
      clearCart: () =>
        set({
          items: [],
          totalItems: 0,
          totalAmount: 0,
        }),
    }),
    {
      name: "cart-storage",
      version: 1,
      migrate: (persistedState: unknown, version: number): CartState => {
        const state = persistedState as Partial<CartState>;
        // If old version is 0 or undefined (no version), migrate here:
        if (!version || version === 0) {
          // You can modify or normalize the persistedState if needed
          return {
            items: state?.items || [],
            totalItems: state?.totalItems || 0,
            totalAmount: state?.totalAmount || 0,
            addToCart: () => {},
            removeFromCart: () => {},
            updateQuantity: () => {},
            clearCart: () => {},
          };
        }
        // If version matches current, return as is
        return {
          items: state?.items || [],
          totalItems: state?.totalItems || 0,
          totalAmount: state?.totalAmount || 0,
          addToCart: () => {},
          removeFromCart: () => {},
          updateQuantity: () => {},
          clearCart: () => {},
        };
      },
    }
  )
);
