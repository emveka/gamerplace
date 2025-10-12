// src/components/product/ProductCard.tsx - VERSION AVEC SÉRIALISATION
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SerializedProduct, ProductBadge } from '@/utils/serialization';

interface ProductCardProps {
  product: SerializedProduct;
  priority?: boolean;
  sizes?: string;
}

// Product Badge Component
function ProductBadgeComponent({ badge }: { badge: ProductBadge }) {
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  // Déterminer si c'est un dégradé ou une couleur unie
  const isGradient = badge.backgroundColor.includes('gradient') || 
                    badge.backgroundColor.includes('linear') || 
                    badge.backgroundColor.includes('radial');

  const badgeStyle = isGradient 
    ? { 
        background: badge.backgroundColor,  // Utilise 'background' pour les dégradés
        color: badge.textColor 
      }
    : { 
        backgroundColor: badge.backgroundColor,  // Utilise 'backgroundColor' pour les couleurs unies
        color: badge.textColor 
      };

  return (
    <span
      className={`absolute ${positionClasses[badge.position || 'top-left']} px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-bold z-10 shadow-sm`}
      style={badgeStyle}
      aria-label={`Badge: ${badge.text}`}
    >
      {badge.text}
    </span>
  );
}

// Buy Button Component
function BuyButton({ productId }: { productId: string }) {
  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Achat produit:', productId);
  };

  return (
    <button 
      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1.5 px-2 sm:px-3 transition-colors text-xs sm:text-sm whitespace-nowrap"
      type="button"
      onClick={handleBuyClick}
    >
      ACHETER
    </button>
  );
}

// Fonction pour calculer la date de livraison
function getDeliveryDate(): string {
  const today = new Date();
  const deliveryDate = new Date(today);
  
  deliveryDate.setDate(deliveryDate.getDate() + 1);
  
  if (deliveryDate.getDay() === 0) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }
  
  return deliveryDate.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short'
  }).replace('.', '');
}

export function ProductCard({ 
  product, 
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
}: ProductCardProps) {
  
  // Badges actifs depuis Firebase (tableau) - Force le typage
  const badges = Array.isArray(product.badges) ? product.badges : [];
  const activeBadges = badges
    .filter((badge) => badge && badge.isActive)
    .sort((a, b) => (a.priority || 0) - (b.priority || 0))
    .slice(0, 2);

  // Check if it's a PC Gamer category
  const isPCGamer = product.primaryCategoryName?.toLowerCase().includes('pc gamer') || 
                   product.categoryPath?.some(cat => cat.toLowerCase().includes('pc gamer'));

  // Get specifications for display
  const getDisplaySpecs = () => {
    if (!product.specifications) return [];
    
    if (isPCGamer) {
      const pcGamerOrder = ['Processeur', 'Carte Graphique', 'Carte mère', 'RAM', 'SSD'];
      const specs = Object.entries(product.specifications);
      
      const orderedSpecs: [string, string][] = [];
      
      pcGamerOrder.forEach(key => {
        const spec = specs.find(([k]) => k === key);
        if (spec) {
          orderedSpecs.push(spec);
        }
      });
      
      const remainingSpecs = specs.filter(([key]) => !pcGamerOrder.includes(key));
      orderedSpecs.push(...remainingSpecs);
      
      return orderedSpecs.slice(0, 5);
    }
    
    const specs = Object.entries(product.specifications);
    return specs.slice(0, 2);
  };

  const displaySpecs = getDisplaySpecs();

  return (
    <article 
      className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 group overflow-hidden w-full max-w-sm"
      itemScope 
      itemType="https://schema.org/Product"
    >
      <Link 
        href={`/products/${product.slug}`}
        className="block"
        aria-label={`Voir le produit ${product.title}`}
      >
        {/* Image Container */}
        <div className="aspect-[1000/1000] bg-gray-100 relative overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.imageAlts?.[0] || product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes={sizes}
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              quality={85}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Pas d&apos;image</span>
            </div>
          )}
          
          {/* Badges personnalisés */}
          {activeBadges.map((badge, index) => (
            <ProductBadgeComponent key={badge.id || `badge-${index}`} badge={badge} />
          ))}

          {/* Stock indicator */}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute bottom-2 right-2 bg-orange-500 text-white px-2 py-1 text-xs font-medium z-10">
              Stock limité
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-medium z-10">
              Rupture
            </span>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-2 space-y-1">
          <h3 
            className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm leading-tight line-clamp-2 min-h-[2.5rem]"
            itemProp="name"
            title={product.title}
          >
            {product.title}
          </h3>
          
          {/* Specifications list */}
          {displaySpecs.length > 0 && (
            <ul className="space-y-1">
              {displaySpecs.map(([key, value], index) => (
                <li key={index} className="flex items-start text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 bg-yellow-500 mr-2 flex-shrink-0 mt-1.5"></div>
                  <span className="truncate">{value}</span>
                </li>
              ))}
            </ul>
          )}
          
          {/* Delivery info */}
          <div className="flex items-center gap-1 text-xs">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span className="text-gray-900">Livraison le</span>
            <span className="text-green-600">{getDeliveryDate()}</span>
          </div>
          
          {/* Divider */}
          <hr className="border-gray-200" />
          
          {/* Price and Button container */}
          <div className="flex justify-between items-end gap-2" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            {/* Price section */}
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-400 line-through truncate min-h-[1rem]">
                {product.oldPrice && product.oldPrice > product.price && (
                  <>
                    {product.oldPrice.toLocaleString()} dh
                  </>
                )}
              </div>
              <div
                className="text-xs sm:text-lg font-bold text-red-600 truncate"
                itemProp="price"
                content={product.price.toString()}
              >
                {product.price.toLocaleString()} dh
              </div>
              <meta itemProp="priceCurrency" content="MAD" />
              <meta itemProp="availability" content={product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
            </div>
            
            {/* Buy button */}
            <div className="flex-shrink-0">
              <BuyButton productId={product.id} />
            </div>
          </div>
        </div>
      </Link>
      
      {/* Hidden structured data */}
      <meta itemProp="sku" content={product.sku || product.id} />
      <meta itemProp="category" content={product.primaryCategoryName} />
      {product.images?.[0] && <meta itemProp="image" content={product.images[0]} />}
    </article>
  );
}