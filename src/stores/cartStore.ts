// stores/cartStore.ts - VERSION COMPLÈTE AVEC SYSTÈME DE POINTS
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interface mise à jour pour un item du cart avec les points
export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  slug: string;
  stock: number; // Pour vérifier les limites
  
  // 🆕 NOUVEAUX CHAMPS POUR LES POINTS
  points?: number | null; // Points par unité (null si pas d'offre)
  pointsValidUntil?: string | null; // Date d'expiration de l'offre points (ISO string)
}

// Interface pour le résumé des points
export interface PointsSummary {
  totalPointsToEarn: number;
  hasExpiredOffers: boolean;
  productsWithPoints: Array<{
    productId: string;
    title: string;
    quantity: number;
    pointsPerUnit: number;
    totalPoints: number;
    isExpired: boolean;
  }>;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions existantes
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Computed values existants
  totalItems: () => number;
  totalPrice: () => number;
  getItem: (productId: string) => CartItem | undefined;
  
  // 🆕 NOUVELLES MÉTHODES POUR LES POINTS
  hasPointsProducts: () => boolean;
  getTotalPointsToEarn: () => number;
  getPointsSummary: () => PointsSummary;
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
          // Ajouter un nouveau produit avec tous les champs, y compris points
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

      // 🆕 NOUVELLES MÉTHODES POUR LES POINTS

      /**
       * Vérifie s'il y a des produits avec des points dans le panier
       */
      hasPointsProducts: () => {
        const { items } = get();
        return items.some(item => item.points && item.points > 0);
      },

      /**
       * Calcule le total des points à gagner (uniquement les offres valides)
       */
      getTotalPointsToEarn: () => {
        const { items } = get();
        const now = new Date();
        
        return items.reduce((total, item) => {
          // Vérifier si le produit a des points
          if (!item.points || item.points <= 0) {
            return total;
          }
          
          // Vérifier si l'offre n'est pas expirée
          if (item.pointsValidUntil) {
            const expirationDate = new Date(item.pointsValidUntil);
            if (now > expirationDate) {
              return total; // Offre expirée, ne pas compter les points
            }
          }
          
          return total + (item.points * item.quantity);
        }, 0);
      },

      /**
       * Retourne un résumé détaillé des points
       */
      getPointsSummary: () => {
        const { items } = get();
        const now = new Date();
        
        const productsWithPoints = items
          .filter(item => item.points && item.points > 0)
          .map(item => {
            const isExpired = item.pointsValidUntil 
              ? now > new Date(item.pointsValidUntil)
              : false;
            
            return {
              productId: item.productId,
              title: item.title,
              quantity: item.quantity,
              pointsPerUnit: item.points || 0,
              totalPoints: isExpired ? 0 : (item.points || 0) * item.quantity,
              isExpired
            };
          });
        
        const totalPointsToEarn = productsWithPoints.reduce(
          (total, product) => total + product.totalPoints, 
          0
        );
        
        const hasExpiredOffers = productsWithPoints.some(product => product.isExpired);
        
        return {
          totalPointsToEarn,
          hasExpiredOffers,
          productsWithPoints
        };
      },
    }),
    {
      name: 'gamerplace-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);