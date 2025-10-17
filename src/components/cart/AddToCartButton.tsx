// components/cart/AddToCartButton.tsx - Mise à jour avec points
'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { SerializedProduct } from '@/utils/serialization';

interface AddToCartButtonProps {
  product: SerializedProduct;
  quantity?: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'small';
  showIcon?: boolean;
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className = '',
  variant = 'primary',
  showIcon = true,
  disabled = false
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, openCart, getItem } = useCartStore();

  const isOutOfStock = product.stock <= 0;
  const existingItem = getItem(product.id);
  const wouldExceedStock = existingItem && (existingItem.quantity + quantity) > product.stock;

  const handleAddToCart = async () => {
    if (isOutOfStock || disabled || wouldExceedStock) return;

    setIsAdding(true);

    // Simulation d'un petit délai pour l'UX
    await new Promise(resolve => setTimeout(resolve, 200));

    // Ajouter au panier avec les informations de points
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        productId: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.images[0],
        slug: product.slug,
        stock: product.stock,
        // 🆕 AJOUT DES CHAMPS POINTS
        points: product.points || null,
        pointsValidUntil: typeof product.pointsValidUntil === 'string' 
          ? product.pointsValidUntil 
          : null
      });
    }

    setIsAdding(false);
    setJustAdded(true);

    // Ouvrir le panier après un court délai
    setTimeout(() => {
      openCart();
    }, 300);

    // Reset l'état après 2 secondes
    setTimeout(() => {
      setJustAdded(false);
    }, 2000);
  };

  // Styles selon la variante
  const getVariantClasses = () => {
    if (isOutOfStock || disabled) {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    }

    if (justAdded) {
      return 'bg-green-500 text-white';
    }

    switch (variant) {
      case 'primary':
        return 'bg-yellow-500 hover:bg-yellow-600 text-black font-bold';
      case 'secondary':
        return 'bg-gray-800 hover:bg-gray-700 text-white font-medium';
      case 'small':
        return 'bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs px-2 py-1';
      default:
        return 'bg-yellow-500 hover:bg-yellow-600 text-black font-bold';
    }
  };

  // Texte du bouton
  const getButtonText = () => {
    if (isOutOfStock) return 'Rupture de stock';
    if (wouldExceedStock) return 'Stock insuffisant';
    if (justAdded) return 'Ajouté !';
    if (isAdding) return 'Ajout...';
    if (variant === 'small') return 'ACHETER';
    return 'Ajouter au panier';
  };

  // Icône à afficher
  const getIcon = () => {
    if (justAdded) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }

    if (isAdding) {
      return (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
      </svg>
    );
  };

  const baseClasses = variant === 'small' 
    ? 'transition-all duration-200'
    : 'py-3 px-4 transition-all duration-200 transform hover:scale-105 shadow-lg';

  return (
    <button
      onClick={handleAddToCart}
      disabled={isOutOfStock || disabled || wouldExceedStock || isAdding}
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      aria-label={getButtonText()}
    >
      <div className="flex items-center justify-center gap-2">
        {showIcon && getIcon()}
        <span className={variant === 'small' ? 'text-xs' : 'text-sm'}>
          {getButtonText()}
        </span>
      </div>
    </button>
  );
}