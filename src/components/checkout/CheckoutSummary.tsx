// components/checkout/CheckoutSummary.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { calculateShippingCost, getDeliveryTime, getShippingInfo } from '@/utils/shipping';

export function CheckoutSummary() {
  const { items, totalPrice, totalItems } = useCartStore();
  const [shippingCity, setShippingCity] = useState('casa');
  const [isClient, setIsClient] = useState(false);

  // Hydratation côté client
  useEffect(() => {
    setIsClient(true);
    // Récupérer la ville de livraison depuis localStorage
    const savedCity = localStorage.getItem('shipping-city') || 'casa';
    setShippingCity(savedCity);

    // Écouter les changements de ville depuis le formulaire
    const handleStorageChange = () => {
      const city = localStorage.getItem('shipping-city') || 'casa';
      setShippingCity(city);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Polling pour détecter les changements dans la même page
    const interval = setInterval(() => {
      const city = localStorage.getItem('shipping-city') || 'casa';
      if (city !== shippingCity) {
        setShippingCity(city);
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [shippingCity]);

  if (!isClient) {
    return (
      <div className="bg-white shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 w-32"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const subtotal = totalPrice();
  const shippingCost = calculateShippingCost(shippingCity);
  const total = subtotal + shippingCost;
  const deliveryTime = getDeliveryTime(shippingCity);
  const cityInfo = getShippingInfo(shippingCity);

  return (
    <div className="bg-white shadow-sm border border-gray-200 p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Résumé de commande
      </h2>

      {/* Liste des articles */}
      <div className="space-y-4 mb-6">
        <h3 className="font-medium text-gray-900">
          Articles ({totalItems()})
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 relative overflow-hidden border border-gray-200 flex-shrink-0">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600">
                  Qté: {item.quantity} × {item.price.toLocaleString()} DH
                </p>
              </div>
              
              <div className="text-sm font-medium text-gray-900">
                {(item.price * item.quantity).toLocaleString()} DH
              </div>
            </div>
          ))}
        </div>
        
        {/* Lien pour modifier le panier */}
        <Link
          href="/cart"
          className="text-sm text-yellow-600 hover:text-yellow-800 transition-colors"
        >
          Modifier le panier
        </Link>
      </div>

      {/* Calculs */}
      <div className="space-y-3 py-4 border-t border-gray-200">
        <div className="flex justify-between">
          <span className="text-gray-600">Sous-total</span>
          <span className="font-medium">{subtotal.toLocaleString()} DH</span>
        </div>
        
        <div className="flex justify-between">
          <div>
            <span className="text-gray-600">Livraison Cathedis</span>
            {cityInfo && (
              <div className="text-xs text-gray-500">
                {cityInfo.name} - {deliveryTime}
              </div>
            )}
          </div>
          <span className="font-medium text-blue-600">{shippingCost.toLocaleString()} DH</span>
        </div>
        
        <hr className="border-gray-200" />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-yellow-600">{total.toLocaleString()} DH</span>
        </div>
      </div>

      {/* Informations de livraison */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">
          Livraison par Cathedis
        </h4>
        <div className="space-y-1 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Livraison {deliveryTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span>Service professionnel avec suivi</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Paiement à la livraison disponible</span>
          </div>
        </div>
      </div>

      {/* Assistance */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">
          Besoin d&apos;aide ?
        </h4>
        <div className="space-y-2">
          <Link
            href="/support/contact"
            className="block text-sm text-yellow-600 hover:text-yellow-800 transition-colors"
          >
            Contactez notre support
          </Link>
          <Link
            href="/support/livraison"
            className="block text-sm text-yellow-600 hover:text-yellow-800 transition-colors"
          >
            Infos livraison Cathedis
          </Link>
          <div className="text-sm text-gray-600 mt-3">
            <strong>Service client :</strong><br />
            📞 +212 XX XX XX XX<br />
            📧 contact@gamerplace.ma
          </div>
        </div>
      </div>
    </div>
  );
}