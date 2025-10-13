// components/cart/CartDrawer.tsx
'use client';

import { useCartStore } from '@/stores/cartStore';
import { CartItem } from './CartItem';
import { useEffect } from 'react';
import Link from 'next/link';

export function CartDrawer() {
  const { items, isOpen, closeCart, totalPrice, totalItems } = useCartStore();

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-opacity-50 z-50"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
            Mon Panier ({totalItems()})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Fermer le panier"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenu */}
        <div className="flex flex-col h-full">
          
          {/* Liste des produits */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                </svg>
                <p className="text-lg font-medium mb-2">Votre panier est vide</p>
                <p className="text-sm text-gray-400 mb-4">Découvrez nos produits gaming</p>
                <Link
                  href="/categories"
                  onClick={closeCart}
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 transition-colors"
                >
                  Voir nos produits
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer avec total et actions */}
          {items.length > 0 && (
            <div className="border-t bg-gray-50 p-4 space-y-4">
              
              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-yellow-600">{totalPrice().toLocaleString()} DH</span>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 text-center block transition-colors"
                >
                  Finaliser la commande
                </Link>
                
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 text-center block transition-colors text-sm"
                >
                  Voir le panier complet
                </Link>
              </div>

              {/* Info livraison */}
              <div className="text-xs text-gray-600 text-center">
                <div className="flex items-center justify-center gap-1">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  <span>Livraison express 24-48h</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}