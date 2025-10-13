// components/cart/CartItem.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore, CartItem as CartItemType } from '@/stores/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const incrementQuantity = () => {
    if (item.quantity < item.stock) {
      updateQuantity(item.productId, item.quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(item.productId);
  };

  return (
    <div className="flex gap-3 bg-white p-3 border border-gray-200 hover:shadow-sm transition-shadow">
      
      {/* Image */}
      <Link href={`/products/${item.slug}`} className="flex-shrink-0">
        <div className="w-16 h-16 bg-gray-100 relative overflow-hidden">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Infos produit */}
      <div className="flex-1 min-w-0">
        <Link 
          href={`/products/${item.slug}`}
          className="block"
        >
          <h3 className="font-medium text-sm text-gray-900 line-clamp-2 hover:text-yellow-600 transition-colors">
            {item.title}
          </h3>
        </Link>
        
        <div className="mt-1 space-y-2">
          {/* Prix */}
          <div className="text-sm font-bold text-gray-900">
            {item.price.toLocaleString()} DH
          </div>
          
          {/* Contrôles quantité */}
          <div className="flex items-center justify-between">
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={decrementQuantity}
                disabled={item.quantity <= 1}
                className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Diminuer la quantité"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <span className="px-2 py-1 text-sm font-medium min-w-[30px] text-center">
                {item.quantity}
              </span>
              
              <button
                onClick={incrementQuantity}
                disabled={item.quantity >= item.stock}
                className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Augmenter la quantité"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            {/* Bouton supprimer */}
            <button
              onClick={handleRemove}
              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
              aria-label="Supprimer du panier"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Sous-total */}
          <div className="text-sm text-gray-600">
            Sous-total: <span className="font-medium text-gray-900">{(item.price * item.quantity).toLocaleString()} DH</span>
          </div>

          {/* Info stock si faible */}
          {item.stock <= 5 && item.stock > 0 && (
            <div className="text-xs text-orange-600">
              Plus que {item.stock} en stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}