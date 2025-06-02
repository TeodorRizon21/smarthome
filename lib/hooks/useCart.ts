import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StateCreator } from 'zustand';

interface CartItem {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

type CartPersist = (
  config: StateCreator<CartStore>,
  options: unknown
) => StateCreator<CartStore>;

export const useCart = create<CartStore>()(
  (persist as CartPersist)(
    (set) => ({
      items: [],
      addToCart: (newItem: CartItem) =>
        set((state: CartStore) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.variantId === newItem.variantId
          );

          if (existingItemIndex > -1) {
            // Dacă produsul există deja, incrementăm cantitatea
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += newItem.quantity;
            return { items: newItems };
          }

          // Dacă produsul nu există, îl adăugăm
          return { items: [...state.items, newItem] };
        }),
      removeFromCart: (variantId: string) =>
        set((state: CartStore) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        })),
      updateQuantity: (variantId: string, quantity: number) =>
        set((state: CartStore) => ({
          items: state.items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'shopping-cart',
    }
  )
); 