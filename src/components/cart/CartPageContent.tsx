// components/cart/CartPageContent.tsx - VERSION COMPLÈTE AVEC SYSTÈME DE POINTS
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { CartPageItem } from '@/components/cart/CartPageItem';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export function CartPageContent() {
  const { 
    items, 
    totalPrice, 
    totalItems, 
    clearCart,
    hasPointsProducts,
    getPointsSummary
  } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  // Hydratation côté client pour éviter les erreurs SSR
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Breadcrumb pour la page panier
  const breadcrumbItems = [
    { href: '/', label: 'Accueil' },
    { href: '/cart', label: 'Mon Panier', current: true }
  ];

  // Calculs pour l'affichage
  const subtotal = totalPrice();
  const pointsSummary = getPointsSummary();

  const handleClearCart = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
      clearCart();
    }
  };

  // Loading state pendant l'hydratation
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1500px] mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 mb-8 w-48"></div>
            <div className="h-12 bg-gray-200 mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1500px] mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Titre de la page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mon Panier
          </h1>
          <p className="text-gray-600">
            {totalItems() > 0 
              ? `${totalItems()} article${totalItems() > 1 ? 's' : ''} dans votre panier`
              : 'Votre panier est vide'
            }
          </p>
        </div>

        {items.length === 0 ? (
          // Panier vide
          <div className="bg-white shadow-sm border border-gray-200 text-center py-16">
            <svg className="w-24 h-24 mx-auto mb-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Votre panier est vide
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Découvrez nos produits gaming et ajoutez vos articles préférés à votre panier.
            </p>
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 transition-colors"
              >
                Découvrir nos produits
              </Link>
              <div className="text-sm text-gray-500">
                ou
              </div>
              <Link
                href="/categories"
                className="inline-block border-2 border-gray-300 hover:border-yellow-500 text-gray-700 hover:text-yellow-600 font-medium py-2 px-6 transition-colors"
              >
                Parcourir les catégories
              </Link>
            </div>
          </div>
        ) : (
          // Panier avec articles
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            
            {/* Colonne gauche : Articles du panier */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Actions du panier */}
              <div className="bg-white shadow-sm border border-gray-200 p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Articles ({totalItems()})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                  >
                    Vider le panier
                  </button>
                </div>
              </div>

              {/* Section Points Détaillée */}
              {hasPointsProducts() && (
                <div className="bg-white shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-600 text-xl">🎁</span>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Points fidélité
                    </h2>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-semibold text-yellow-800">
                        Total des points à gagner :
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-600">
                          {pointsSummary.totalPointsToEarn} points
                        </div>
                        <div className="text-sm text-yellow-700">
                          Valeur: {(pointsSummary.totalPointsToEarn * 0.05).toFixed(0)} DH
                        </div>
                      </div>
                    </div>

                    {/* Détail par produit */}
                    <div className="space-y-2">
                      {pointsSummary.productsWithPoints.map(product => (
                        <div key={product.productId} className="flex justify-between items-center text-sm">
                          <span className="text-yellow-700">
                            {product.title.substring(0, 40)}
                            {product.title.length > 40 ? '...' : ''}
                          </span>
                          <span className="font-medium text-yellow-800">
                            {product.totalPoints} pts
                            {product.quantity > 1 && (
                              <span className="text-yellow-600 ml-1">
                                ({product.quantity}x{product.pointsPerUnit})
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Alertes offres expirées */}
                    {pointsSummary.hasExpiredOffers && (
                      <div className="mt-3 p-2 bg-orange-100 border border-orange-300 rounded">
                        <div className="flex items-center gap-2 text-orange-700">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">
                            Attention : Certaines offres points ont expirées
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info système de points */}
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <h3 className="font-medium text-blue-900 mb-2">ℹ️ Comment ça marche ?</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 1 point = 0.05 DH de valeur de rachat</li>
                      <li>• Les points sont ajoutés après confirmation de commande</li>
                      <li>• Paiement carte : points immédiats</li>
                      <li>• Paiement livraison : points après réception</li>
                      <li>• Les points expirent 3 mois après le dernier achat</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Liste des articles */}
              <div className="space-y-4">
                {items.map((item) => (
                  <CartPageItem key={item.productId} item={item} />
                ))}
              </div>

              {/* Continuer les achats */}
              <div className="bg-white shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Continuer vos achats
                    </h3>
                    <p className="text-sm text-gray-600">
                      Découvrez d&apos;autres produits gaming
                    </p>
                  </div>
                  <Link
                    href="/"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 transition-colors text-sm"
                  >
                    Voir plus de produits
                  </Link>
                </div>
              </div>
            </div>

            {/* Colonne droite : Résumé de commande avec points */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white shadow-sm border border-gray-200 p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Résumé du panier
                </h2>

                {/* Détails du total */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Sous-total</span>
                    <span className="text-yellow-600">{subtotal.toLocaleString()} DH</span>
                  </div>

                  {/* Résumé Points Compact */}
                  {hasPointsProducts() && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600">🎁</span>
                          <span className="text-sm font-medium text-yellow-800">
                            Points à gagner
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-yellow-600">
                            {pointsSummary.totalPointsToEarn} pts
                          </div>
                          <div className="text-xs text-yellow-600">
                            ≈ {(pointsSummary.totalPointsToEarn * 0.05).toFixed(0)} DH
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-gray-600">
                    Les frais de livraison seront calculés à l&apos;étape suivante
                  </p>
                </div>

                {/* Section mode de paiement et points */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
                  <h3 className="font-medium text-blue-900 mb-3">💳 Attribution des points</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <div>
                        <strong>Paiement par carte :</strong>
                        <br />Points ajoutés immédiatement après paiement
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">⏳</span>
                      <div>
                        <strong>Paiement à la livraison :</strong>
                        <br />Points ajoutés après confirmation de réception
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bouton checkout */}
                <div className="space-y-4">
                  <Link
                    href="/checkout"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-6 text-center block transition-colors"
                  >
                    Passer commande
                  </Link>

                  {/* Info sécurité */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>Commande sécurisée</span>
                    </div>
                  </div>
                </div>

                {/* Informations générales sur la livraison */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Livraison au Maroc
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                      <span>Livraison par Cathedis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Service dans toutes les villes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Paiement à la livraison possible</span>
                    </div>
                  </div>
                </div>

                {/* Aide */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Besoin d&apos;aide ?
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/support/contact"
                      className="block text-sm text-yellow-600 hover:text-yellow-800 transition-colors"
                    >
                      Contactez notre support
                    </Link>
                    <Link
                      href="/support/faq"
                      className="block text-sm text-yellow-600 hover:text-yellow-800 transition-colors"
                    >
                      FAQ - Questions fréquentes
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}