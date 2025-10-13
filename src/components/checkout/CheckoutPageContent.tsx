// components/checkout/CheckoutPageContent.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export function CheckoutPageContent() {
  const { items, totalPrice, totalItems } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Hydratation côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Rediriger si panier vide
  useEffect(() => {
    if (isClient && items.length === 0) {
      router.push('/cart');
    }
  }, [isClient, items.length, router]);

  // Breadcrumb
  const breadcrumbItems = [
    { href: '/', label: 'Accueil' },
    { href: '/cart', label: 'Mon Panier' },
    { href: '/checkout', label: 'Commande', current: true }
  ];

  // Loading state
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 mb-8 w-64"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-96 bg-gray-200"></div>
              </div>
              <div className="h-80 bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si panier vide, ne rien afficher (redirection en cours)
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finaliser ma commande
          </h1>
          <p className="text-gray-600">
            {totalItems()} article{totalItems() > 1 ? 's' : ''} • {totalPrice().toLocaleString()} DH
          </p>
        </div>

        {/* Étapes du checkout */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {/* Étape 1: Panier (terminée) */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="ml-2 text-sm font-medium text-green-600">Panier</span>
              </div>
              
              <div className="w-8 h-0.5 bg-gray-300"></div>
              
              {/* Étape 2: Informations (active) */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-yellow-600">Informations</span>
              </div>
              
              <div className="w-8 h-0.5 bg-gray-300"></div>
              
              {/* Étape 3: Paiement (à venir) */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">Paiement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Formulaire de commande */}
          <div>
            <CheckoutForm />
          </div>

          {/* Résumé de commande */}
          <div>
            <CheckoutSummary />
          </div>
        </div>

        {/* Sécurité et garanties */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-gray-200 text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <h3 className="font-medium text-gray-900 mb-2">Paiement sécurisé</h3>
            <p className="text-sm text-gray-600">Transactions protégées SSL</p>
          </div>

          <div className="bg-white p-6 border border-gray-200 text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
            <h3 className="font-medium text-gray-900 mb-2">Livraison Cathedis</h3>
            <p className="text-sm text-gray-600">Service professionnel partout au Maroc</p>
          </div>

          <div className="bg-white p-6 border border-gray-200 text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="font-medium text-gray-900 mb-2">Garantie produits</h3>
            <p className="text-sm text-gray-600">Garantie constructeur incluse</p>
          </div>
        </div>
      </div>
    </div>
  );
}