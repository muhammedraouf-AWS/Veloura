import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/types';

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, variantId?: number) => void;
  updateQuantity: (productId: number, variantId: number | undefined, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

function sameItem(a: CartItem, b: { productId: number; variantId?: number }) {
  return a.productId === b.productId && a.variantId === b.variantId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const idx = state.items.findIndex((i) => sameItem(i, item));
          if (idx !== -1) {
            const existing = state.items[idx];
            if (!existing) return { items: state.items };
            const updated = [...state.items];
            updated[idx] = { ...existing, quantity: existing.quantity + item.quantity };
            return { items: updated };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter((i) => !sameItem(i, { productId, variantId })),
        })),

      updateQuantity: (productId, variantId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => !sameItem(i, { productId, variantId }))
              : state.items.map((i) =>
                  sameItem(i, { productId, variantId }) ? { ...i, quantity: qty } : i
                ),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'veloura-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // never persist drawer state
    }
  )
);

// Derived selectors
export const cartTotalItems = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);

export const cartSubtotal = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
