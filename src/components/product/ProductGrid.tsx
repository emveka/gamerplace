// src/components/product/ProductGrid.tsx - VERSION AVEC DEBUG
'use client';

import { SerializedProduct } from '@/utils/serialization';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: SerializedProduct[];
}

// Back Button Component - maintenant Client Component
function BackButton() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <button 
      onClick={handleGoBack}
      className="text-blue-600 hover:text-blue-700 font-medium"
      type="button"
    >
      Retour aux catégories
    </button>
  );
}

export function ProductGrid({ products }: ProductGridProps) {
  // 🔍 DEBUG: Vérifier les données qui arrivent dans ProductGrid
  console.log('🔍 PRODUCTGRID DEBUG:', {
    productsCount: products.length,
    firstProduct: products[0] ? {
      id: products[0].id,
      title: products[0].title,
      specificationCard: products[0].specificationCard,
      specificationTech: products[0].specificationTech,
      specifications: products[0].specifications,
      cardSpecsCount: Object.keys(products[0].specificationCard || {}).length,
      techSpecsCount: Object.keys(products[0].specificationTech || {}).length,
      legacySpecsCount: Object.keys(products[0].specifications || {}).length
    } : 'No products',
    allProductsSpecs: products.slice(0, 3).map(p => ({
      id: p.id,
      title: p.title,
      hasSpecCard: Object.keys(p.specificationCard || {}).length > 0,
      hasSpecTech: Object.keys(p.specificationTech || {}).length > 0,
      hasSpecLegacy: Object.keys(p.specifications || {}).length > 0,
      cardKeys: Object.keys(p.specificationCard || {}),
      techKeys: Object.keys(p.specificationTech || {}),
      legacyKeys: Object.keys(p.specifications || {})
    }))
  });

  if (products.length === 0) {
    return (
      <div className="p-6 mb-6">
        <div className="text-center py-12">
          <div className="mb-4">
            <svg 
              className="w-16 h-16 text-gray-300 mx-auto" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-500 mb-4">
            Aucun produit ne correspond à vos critères de recherche dans cette catégorie.
          </p>
          <BackButton />
        </div>
      </div>
    );
  }

  return (
    <section className="mb-8">
      <div 
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
        role="list"
        aria-label={`${products.length} produits trouvés`}
      >
        {products.map((product, index) => (
          <div key={product.id} role="listitem">
            <ProductCard 
              product={product} 
              priority={index < 8}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}