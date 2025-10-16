// utils/serialization.ts - VERSION CORRIGÉE SANS ANY

import { Product, ProductBadge, ProductDescription, TechnicalInfo } from '@/types/product';
import { Timestamp } from 'firebase/firestore';

export type { ProductBadge };

// Interface pour le produit sérialisé - TYPES CORRIGÉS
export interface SerializedProduct {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  
  brandId: string;
  brandName: string;
  
  categoryIds: string[];
  categoryPath: string[];
  primaryCategoryId: string;
  primaryCategoryName: string;
  
  price: number;
  oldPrice?: number | null;
  costPrice?: number;
  
  images: string[];
  imageAlts?: string[];
  
  stock: number;
  sku?: string;
  barcode?: string;
  order?: number;
  
  // 🔧 NOUVEAUX CHAMPS - Types mixtes acceptés
  specificationCard?: { [key: string]: string | number | boolean };
  specificationTech?: { [key: string]: string | number | boolean };
  
  // Ancien champ pour rétrocompatibilité - TYPE CORRIGÉ
  specifications?: { [key: string]: string | number | boolean };
  technicalInfo?: TechnicalInfo; // ✅ CORRIGÉ: Type spécifique au lieu de any
  
  tags?: string[];
  badges?: ProductBadge[];
  productDescriptions?: ProductDescription[];
  
  videoUrl?: string;
  
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
  
  isActive: boolean;
  isNewArrival: boolean;
  
  createdAt: string | null;
  updatedAt: string | null;
}

// Fonction principale de sérialisation
export function serializeProduct(product: Product): SerializedProduct {
  console.log('🔄 SERIALIZATION DEBUG - Input Product:', {
    id: product.id,
    title: product.title,
    specificationCard: product.specificationCard,
    specificationTech: product.specificationTech,
    specifications: product.specifications,
    technicalInfo: product.technicalInfo
  });

  const serialized = {
    id: product.id,
    title: product.title,
    slug: product.slug,
    shortDescription: product.shortDescription,
    
    brandId: product.brandId,
    brandName: product.brandName,
    
    categoryIds: product.categoryIds,
    categoryPath: product.categoryPath,
    primaryCategoryId: product.primaryCategoryId,
    primaryCategoryName: product.primaryCategoryName,
    
    price: product.price,
    oldPrice: product.oldPrice,
    costPrice: product.costPrice,
    
    images: product.images,
    imageAlts: product.imageAlts,
    
    stock: product.stock,
    sku: product.sku,
    barcode: product.barcode,
    order: product.order,
    
    // 🔧 NOUVEAUX CHAMPS - Sérialisation directe
    specificationCard: product.specificationCard || {},
    specificationTech: product.specificationTech || {},
    
    // Anciens champs pour compatibilité
    specifications: product.specifications || {},
    technicalInfo: product.technicalInfo || {},
    
    tags: product.tags || [],
    badges: product.badges || [],
    productDescriptions: product.productDescriptions || [],
    
    videoUrl: product.videoUrl,
    
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    keywords: product.keywords,
    canonicalUrl: product.canonicalUrl,
    
    isActive: product.isActive,
    isNewArrival: product.isNewArrival,
    
    createdAt: product.createdAt instanceof Timestamp 
      ? product.createdAt.toDate().toISOString() 
      : null,
    updatedAt: product.updatedAt instanceof Timestamp 
      ? product.updatedAt.toDate().toISOString() 
      : null,
  };

  console.log('✅ SERIALIZATION DEBUG - Output Serialized:', {
    id: serialized.id,
    title: serialized.title,
    specificationCard: serialized.specificationCard,
    specificationTech: serialized.specificationTech,
    specifications: serialized.specifications,
    cardCount: Object.keys(serialized.specificationCard).length,
    techCount: Object.keys(serialized.specificationTech).length,
    legacyCount: Object.keys(serialized.specifications).length
  });

  return serialized;
}

// Fonction utilitaire pour obtenir les spécifications par catégorie
export function getCategorizedSpecifications(product: SerializedProduct) {
  const result = {
    card: product.specificationCard || {},
    technical: product.specificationTech || {},
    legacy: product.specifications || {},
    merged: {
      ...product.technicalInfo || {},
      ...product.specifications || {},
      ...product.specificationTech || {}
    }
  };

  console.log('📊 CATEGORIZED SPECS DEBUG:', {
    productId: product.id,
    title: product.title,
    cardSpecs: result.card,
    technicalSpecs: result.technical,
    legacySpecs: result.legacy,
    counts: {
      card: Object.keys(result.card).length,
      technical: Object.keys(result.technical).length,
      legacy: Object.keys(result.legacy).length,
      merged: Object.keys(result.merged).length
    }
  });

  return result;
}

// Fonction utilitaire pour merger toutes les spécifications
export function getAllSpecifications(product: SerializedProduct): { [key: string]: string | number | boolean } {
  return {
    ...(product.specifications || {}),
    ...(product.specificationCard || {}),
    ...(product.specificationTech || {}),
  };
}

// Fonction utilitaire pour les stats des spécifications
export function getSpecificationStats(product: SerializedProduct) {
  const stats = getCategorizedSpecifications(product);
  
  return {
    legacy: Object.keys(stats.legacy).length,
    card: Object.keys(stats.card).length,
    technical: Object.keys(stats.technical).length,
    total: Object.keys(stats.merged).length,
    hasMultipleSources: [
      Object.keys(stats.legacy).length > 0,
      Object.keys(stats.card).length > 0,
      Object.keys(stats.technical).length > 0
    ].filter(Boolean).length > 1
  };
}