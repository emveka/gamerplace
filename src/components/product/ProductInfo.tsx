// components/product/ProductInfo.tsx - SOLUTION ULTIME SANS CONFLIT DE TYPES
'use client';

import { useState } from 'react';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { 
  ProductBadge, 
  SerializedProduct
} from '@/types/serialized';

// 🔧 FONCTION UTILITAIRE POUR VÉRIFIER LA VALIDITÉ DES POINTS
const isPointsOfferValid = (pointsValidUntil: string | null | undefined): boolean => {
  if (!pointsValidUntil) return true; // Pas de date limite = toujours valide
  
  try {
    const expirationDate = new Date(pointsValidUntil);
    return expirationDate > new Date();
  } catch {
    return true; // En cas d'erreur de parsing, considérer comme valide
  }
};

// 🔧 FONCTION UTILITAIRE POUR FORMATER LA DATE D'EXPIRATION
const formatExpirationDate = (pointsValidUntil: string | null | undefined): string => {
  if (!pointsValidUntil) return '';
  
  try {
    const date = new Date(pointsValidUntil);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  } catch {
    return '';
  }
};

// Le modal WhatsApp reste inchangé
interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    title: string;
    price: number;
    slug: string;
  };
}

function WhatsAppShareModal({ isOpen, onClose, product }: WhatsAppShareModalProps) {
  if (!isOpen) return null;

  const productUrl = `${window.location.origin}/products/${product.slug}`;
  const shopWhatsApp = "212600000000"; 
  
  const handleShareOffer = () => {
    const message = `Salut ! 👋\n\nRegarde cette offre sur Gamerplace.ma :\n\n🎮 ${product.title}\n💰 ${product.price.toLocaleString()} DH\n\n🔗 ${productUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleContactUs = () => {
    const message = `Salut ! 👋\n\nJ'ai une question concernant ce produit :\n\n🎮 ${product.title}\n💰 ${product.price.toLocaleString()} DH\n🔗 ${productUrl}\n\nMa question : `;
    const whatsappUrl = `https://wa.me/${shopWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-4 border-yellow-500 shadow-2xl max-w-lg w-full mx-4 relative">
        <div className="bg-yellow-500 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-black">📱 Partager via WhatsApp</h3>
          <button onClick={onClose} className="text-black hover:text-gray-700 transition-colors bg-white rounded-full p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleShareOffer} className="flex flex-col items-center gap-3 p-4 border-2 border-green-400 bg-white hover:bg-green-50 hover:border-green-500 transition-all group rounded-lg">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <div className="text-center">
                <div className="font-bold text-black text-sm group-hover:text-green-700">Envoyer l&lsquo;offre</div>
                <div className="text-xs text-gray-600 mt-1">Partager avec amis</div>
              </div>
            </button>

            <button onClick={handleContactUs} className="flex flex-col items-center gap-3 p-4 border-2 border-yellow-400 bg-white hover:bg-yellow-50 hover:border-yellow-500 transition-all group rounded-lg">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="text-center">
                <div className="font-bold text-black text-sm group-hover:text-yellow-700">Nous contacter</div>
                <div className="text-xs text-gray-600 mt-1">Poser une question</div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-3 border-t-2 border-yellow-500">
          <p className="text-xs text-gray-600 text-center">🚀 Redirection rapide vers WhatsApp</p>
        </div>
      </div>
    </div>
  );
}

interface ProductInfoProps {
  product: SerializedProduct;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);

  // 🔍 DEBUG AMÉLIORÉ - Logs avec types corrects
  console.log('🎯 DEBUG ProductInfo - Product reçu:', {
    title: product.title,
    points: product.points,
    pointsType: typeof product.points,
    pointsValidUntil: product.pointsValidUntil,
    pointsValidUntilType: typeof product.pointsValidUntil,
    hasPoints: product.points && product.points > 0,
    isValidOffer: isPointsOfferValid(product.pointsValidUntil)
  });

  const isInStock = product.stock > 0;
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountAmount = hasDiscount ? product.oldPrice! - product.price : 0;

  // ✅ VÉRIFICATION CORRIGÉE - Types harmonisés
  const hasValidPoints = product.points && 
                        product.points > 0 && 
                        isPointsOfferValid(product.pointsValidUntil);

  // 🔍 DEBUG - Log du résultat final
  console.log('🎯 DEBUG hasValidPoints:', hasValidPoints);

  const badges = Array.isArray(product.badges) ? product.badges : [];
  const activeBadges = badges
    .filter((badge) => badge && badge.isActive)
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));

  const getBadgeStyle = (badge: ProductBadge) => {
    const isGradient = badge.backgroundColor.includes('gradient') || 
                      badge.backgroundColor.includes('linear') || 
                      badge.backgroundColor.includes('radial');

    return isGradient 
      ? { background: badge.backgroundColor, color: badge.textColor }
      : { backgroundColor: badge.backgroundColor, color: badge.textColor };
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  return (
    <div className="space-y-4">
      
      {/* Badges */}
      {activeBadges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {activeBadges.map((badge, index) => (
            <span
              key={badge.id || `badge-${index}`}
              className="px-3 py-1 text-sm font-semibold shadow-sm"
              style={getBadgeStyle(badge)}
            >
              {badge.text}
            </span>
          ))}
        </div>
      )}

      {/* Titre et informations de base */}
      <div className="space-y-1">
        <h1 className="text-xl lg:text-2xl font-bold text-black leading-tight">
          {product.title}
        </h1>
        
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Marque:</span>
            <span className="font-semibold text-yellow-600 bg-yellow-50 px-2 py-1">
              {product.brandName}
            </span>
          </div>
          {product.sku && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">SKU:</span>
              <span className="font-mono text-black">{product.sku}</span>
            </div>
          )}
        </div>
      </div>

      {/* Prix */}
      <div className="bg-white border-2 border-yellow-500 p-2 shadow-sm">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-2xl font-bold text-black">
            {product.price.toLocaleString()} DH
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg text-gray-500 line-through">
                {product.oldPrice!.toLocaleString()} DH
              </span>
              <span className="bg-yellow-500 text-black px-2 py-1 text-xs font-bold">
                -{discountAmount.toLocaleString()} DH
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-gray-600 mb-2">Prix TTC, livraison non comprise</p>
        
        {/* ✅ SECTION POINTS CORRIGÉE */}
        {hasValidPoints && (
          <div className="mb-2 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-yellow-600">🎁</span>
              <span className="text-sm font-semibold text-yellow-800">
                Gagnez {product.points} GP points
              </span>
              <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                Valeur: {(product.points! * 0.05).toFixed(0)} DH
              </span>
            </div>
            {product.pointsValidUntil && (
              <p className="text-xs text-yellow-700 mt-1">
                ⏰ Offre limitée jusqu&apos;au {formatExpirationDate(product.pointsValidUntil)}
              </p>
            )}
          </div>
        )}
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isInStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`font-medium text-sm ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
              {isInStock ? 'En stock' : 'Rupture de stock'}
            </span>
          </div>
          
          {isInStock && (
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">Livraison express sous 24-48h</span>
            </div>
          )}
        </div>
      </div>

      {/* Description courte */}
      {product.shortDescription && (
        <div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {product.shortDescription}
          </p>
        </div>
      )}

      {/* Section Montage Professionnel */}
      <div className="bg-gray-100 p-4 min-h-[80px]">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <img 
              src="/images/grizzlypate.jpg" 
              alt="Thermal Grizzly - Pâte thermique premium" 
              className="w-24 h-12 object-contain"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-black text-sm mb-1">
             Montage Professionnel Gaming
            </h3>
            <p className="text-xs text-gray-700 text-justify leading-relaxed">
              Nos PC Gamer sont assemblés par des <strong>professionnels spécialisés dans le gaming</strong> et montés minutieusement. 
              Pour optimiser les performances thermiques, nous utilisons exclusivement la <strong>pâte thermique Thermal Grizzly</strong>, 
              reconnue comme l&apos;une des meilleures du marché.
            </p>
          </div>
        </div>
      </div>

      {/* Sélecteur quantité et actions */}
      {isInStock && (
        <div className="space-y-4 bg-gray-50 p-4">
          
          {/* Quantité */}
          <div className="flex items-center gap-3">
            <span className="font-medium text-black text-sm">Quantité:</span>
            <div className="flex items-center border-2 border-yellow-500 bg-white">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="p-2 hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="px-4 py-2 font-bold text-black min-w-[45px] text-center">{quantity}</span>
              <button
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                className="p-2 hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Aperçu points pour la quantité sélectionnée */}
          {hasValidPoints && quantity > 1 && (
            <div className="bg-yellow-50 border border-yellow-200 p-2 rounded">
              <p className="text-xs text-yellow-700">
                💡 Avec {quantity} unités, vous gagnerez <span className="font-semibold">{product.points! * quantity} points</span> 
                <span className="text-yellow-600"> (valeur: {(product.points! * quantity * 0.05).toFixed(0)} DH)</span>
              </p>
            </div>
          )}

          {/* Boutons d'action - VERSION CORRIGÉE SANS ANY */}
          <div className="flex gap-2">
            <AddToCartButton 
              product={product as unknown as Parameters<typeof AddToCartButton>[0]['product']}
              quantity={quantity}
              className="flex-1"
              variant="primary"
              showIcon={true}
            />
            
            <button
              onClick={handleShare}
              className="p-3 border-2 border-gray-300 text-gray-600 hover:border-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 transition-all duration-200 relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-black">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-white border-2 border-yellow-500 text-black px-2 py-1 text-xs font-medium hover:bg-yellow-50 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Modal WhatsApp */}
      <WhatsAppShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={{
          title: product.title,
          price: product.price,
          slug: product.slug
        }}
      />
    </div>
  );
}