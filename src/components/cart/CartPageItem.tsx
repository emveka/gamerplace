// components/cart/CartPageItem.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore, CartItem as CartItemType } from '@/stores/cartStore';

interface CartPageItemProps {
  item: CartItemType;
}

export function CartPageItem({ item }: CartPageItemProps) {
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

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 1;
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      updateQuantity(item.productId, newQuantity);
    }
  };

  const handleRemove = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      removeItem(item.productId);
    }
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="bg-white shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Image du produit */}
        <div className="flex-shrink-0">
          <Link href={`/products/${item.slug}`}>
            <div className="w-32 h-32 bg-gray-100 relative overflow-hidden border border-gray-200">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="128px"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Informations du produit */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            
            {/* Détails produit */}
            <div className="flex-1">
              <Link 
                href={`/products/${item.slug}`}
                className="block group"
              >
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </Link>
              
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  Prix unitaire: <span className="font-medium text-gray-900">{item.price.toLocaleString()} DH</span>
                </p>
                
                {/* Info stock */}
                {item.stock <= 5 && item.stock > 0 && (
                  <p className="text-sm text-orange-600">
                    ⚠️ Plus que {item.stock} en stock
                  </p>
                )}
                
                {item.stock === 0 && (
                  <p className="text-sm text-red-600">
                    ❌ Rupture de stock
                  </p>
                )}
              </div>
            </div>

            {/* Contrôles et prix */}
            <div className="flex flex-col md:items-end gap-4">
              
              {/* Contrôles quantité */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Quantité:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={decrementQuantity}
                    disabled={item.quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Diminuer la quantité"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={handleQuantityChange}
                    className="w-16 px-2 py-2 text-center border-none focus:ring-0 focus:outline-none"
                  />
                  
                  <button
                    onClick={incrementQuantity}
                    disabled={item.quantity >= item.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Augmenter la quantité"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Sous-total */}
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {subtotal.toLocaleString()} DH
                </p>
                {item.quantity > 1 && (
                  <p className="text-sm text-gray-600">
                    {item.quantity} × {item.price.toLocaleString()} DH
                  </p>
                )}
              </div>

              {/* Bouton supprimer */}
              <button
                onClick={handleRemove}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides sur mobile */}
      <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link
            href={`/products/${item.slug}`}
            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium transition-colors"
          >
            Voir le produit
          </Link>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {subtotal.toLocaleString()} DH
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}