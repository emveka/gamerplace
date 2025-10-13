// components/cart/CartIcon.tsx
'use client';

import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';

export function CartIcon() {
  const totalItems = useCartStore(state => state.totalItems());
  const toggleCart = useCartStore(state => state.toggleCart);

  return (
    <button
      onClick={toggleCart}
      className="relative flex flex-col items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
      aria-label="Mon Panier"
      title="Mon Panier"
    >
      <div className="relative">
        <Image
          src="/icons/cart.svg"
          alt="Mon Panier"
          width={24}
          height={24}
          className="h-4 sm:h-5 lg:h-6 w-4 sm:w-5 lg:w-6"
        />
        {/* Badge quantité avec animation */}
        {totalItems > 0 && (
          <span className="absolute -right-1 sm:-right-1.5 lg:-right-2 -top-1 sm:-top-1.5 lg:-top-2 rounded-full bg-yellow-400 px-0.5 sm:px-1 lg:px-1.5 py-0.5 text-[7px] sm:text-[8px] lg:text-[10px] font-semibold text-black min-w-[12px] sm:min-w-[14px] lg:min-w-[18px] text-center animate-pulse">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-white whitespace-nowrap hidden sm:block">
        Mon Panier
      </span>
      {/* Version ultra-compacte pour très petit écrans */}
      <span className="text-[8px] sm:text-[9px] font-medium text-white sm:hidden">
        Panier
      </span>
    </button>
  );
}