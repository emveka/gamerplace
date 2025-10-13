// components/cart/CartIcon.tsx - VERSION CORRIGÉE
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';

export function CartIcon() {
  const [isClient, setIsClient] = useState(false);
  const toggleCart = useCartStore(state => state.toggleCart);
  
  // Éviter l'hydration mismatch en s'assurant que le rendu est identique
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Calculer le total seulement côté client
  const totalItems = isClient ? useCartStore.getState().totalItems() : 0;

  return (
    <button
      onClick={toggleCart}
      className="relative flex flex-col items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
      aria-label="Mon Panier"
      title="Mon Panier"
    >
      <div className="relative" suppressHydrationWarning>
        <Image
          src="/icons/cart.svg"
          alt="Mon Panier"
          width={24}
          height={24}
          className="h-4 sm:h-5 lg:h-6 w-4 sm:w-5 lg:w-6"
        />
        {/* Badge quantité - seulement côté client pour éviter hydration mismatch */}
        {isClient && totalItems > 0 && (
          <span className="absolute -right-2 -top-2 rounded-full bg-yellow-400 px-1 py-0.5 text-xs font-semibold text-black min-w-[18px] text-center flex items-center justify-center">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </div>
      
      {/* Texte responsive */}
      <span className="text-xs font-medium text-white whitespace-nowrap hidden sm:block">
        Mon Panier
      </span>
      <span className="text-[8px] font-medium text-white sm:hidden">
        Panier
      </span>
    </button>
  );
}