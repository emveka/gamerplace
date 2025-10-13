// stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interface simple pour un item du cart
export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  slug: string;
  stock: number; // Pour vérifier les limites
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Computed values
  totalItems: () => number;
  totalPrice: () => number;
  getItem: (productId: string) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find(item => item.productId === product.productId);

        if (existingItem) {
          // Vérifier si on peut ajouter plus (stock)
          if (existingItem.quantity < product.stock) {
            set({
              items: items.map(item =>
                item.productId === product.productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            });
          }
        } else {
          // Ajouter un nouveau produit
          set({
            items: [...items, { ...product, quantity: 1 }]
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.productId !== productId)
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const { items } = get();
        const item = items.find(item => item.productId === productId);
        
        // Vérifier le stock disponible
        if (item && quantity > item.stock) {
          return;
        }

        set({
          items: items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          )
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItem: (productId) => {
        return get().items.find(item => item.productId === productId);
      },
    }),
    {
      name: 'gamerplace-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);