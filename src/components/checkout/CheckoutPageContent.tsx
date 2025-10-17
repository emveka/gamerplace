// components/checkout/CheckoutPageContent.tsx - OPTIMISÉ POUR ÉCRANS LARGES
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export function CheckoutPageContent() {
  const { 
    items, 
    totalPrice, 
    totalItems, 
    hasPointsProducts, 
    getPointsSummary 
  } = useCartStore();
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

  // Récupérer le résumé des points
  const pointsSummary = isClient ? getPointsSummary() : null;

  // Loading state
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 mb-8 w-80 rounded"></div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-6">
                <div className="h-96 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="h-80 bg-gray-200 rounded-xl"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header hero section */}
      <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-orange-400 text-black">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Header principal */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-3">
                Finaliser ma commande
              </h1>
              <div className="flex items-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="font-semibold">
                    {totalItems()} article{totalItems() > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="font-bold text-xl">
                    {totalPrice().toLocaleString()} DH
                  </span>
                </div>
              </div>
            </div>
            
            {/* Points badge dans le header */}
            {hasPointsProducts() && pointsSummary && (
              <div className="bg-black text-yellow-400 px-6 py-4 rounded-2xl border-2 border-black shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🎁</div>
                  <div>
                    <div className="text-sm font-medium opacity-90">
                      Points à gagner
                    </div>
                    <div className="text-2xl font-bold">
                      {pointsSummary.totalPointsToEarn} points
                    </div>
                    <div className="text-xs opacity-75">
                      Valeur: {(pointsSummary.totalPointsToEarn * 0.05).toFixed(0)} DH
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        
        {/* Section récapitulatif points - Version large écran */}
        {hasPointsProducts() && pointsSummary && (
          <div className="mb-8 bg-white shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500 flex items-center justify-center text-black text-2xl">
                    🎁
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Programme fidélité GP Points
                    </h2>
                    <p className="text-sm text-gray-600">
                      Accumulez des points et économisez sur vos prochains achats
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-black text-yellow-600">
                    {pointsSummary.totalPointsToEarn}
                  </div>
                  <div className="text-sm font-semibold text-yellow-800">
                    points à gagner
                  </div>
                  <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 mt-1">
                    = {(pointsSummary.totalPointsToEarn * 0.05).toFixed(0)} DH de valeur
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Grille des produits avec points */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                {pointsSummary.productsWithPoints.map(product => (
                  <div key={product.productId} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {product.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Quantité: {product.quantity}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-yellow-600">
                          {product.totalPoints} pts
                        </div>
                        {product.quantity > 1 && (
                          <div className="text-xs text-yellow-600">
                            {product.pointsPerUnit} × {product.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Attribution selon paiement - Info discrète */}
              <div className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-200">
                <p>Attribution des points : carte bancaire (immédiat) • paiement à la livraison (après réception)</p>
              </div>
            </div>
          </div>
        )}

        {/* Étapes du checkout - Version améliorée */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-8">
                {/* Étape 1: Panier (terminée) */}
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      ✓
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="ml-3 text-lg font-semibold text-green-600">Panier</span>
                </div>
                
                <div className="w-16 h-1 bg-green-500 rounded"></div>
                
                {/* Étape 2: Informations (active) */}
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-12 h-12 bg-yellow-500 text-black rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      2
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-600 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <span className="ml-3 text-lg font-semibold text-yellow-600">Informations</span>
                </div>
                
                <div className="w-16 h-1 bg-gray-300 rounded"></div>
                
                {/* Étape 3: Paiement (à venir) */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-lg font-bold">
                    3
                  </div>
                  <span className="ml-3 text-lg font-medium text-gray-600">Paiement</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout principal - 3 colonnes sur grand écran */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Colonne principale - Formulaire (2/3 de l'espace) */}
          <div className="xl:col-span-2">
            <CheckoutForm />
          </div>

          {/* Sidebar - Résumé de commande (1/3 de l'espace) */}
          <div className="xl:col-span-1">
            <div className="sticky top-4">
              <CheckoutSummary />
            </div>
          </div>
        </div>

        {/* Section sécurité et garanties - Version améliorée */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Vos garanties Gamerplace.ma
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Paiement sécurisé</h3>
              <p className="text-gray-600 leading-relaxed">
                Toutes vos transactions sont protégées par un cryptage SSL de niveau bancaire
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Livraison Cathedis</h3>
              <p className="text-gray-600 leading-relaxed">
                Service de livraison professionnel avec suivi en temps réel partout au Maroc
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 mx-auto mb-6 bg-yellow-100 rounded-2xl flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Garantie constructeur</h3>
              <p className="text-gray-600 leading-relaxed">
                Tous nos produits bénéficient de la garantie officielle du constructeur
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}