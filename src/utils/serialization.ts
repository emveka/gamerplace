// utils/serialization.ts - VERSION COMPLÈTE CORRIGÉE AVEC POINTS

import { Product, ProductBadge, ProductDescription, TechnicalInfo } from '@/types/product';
import { Timestamp } from 'firebase/firestore';

export type { ProductBadge };

// Interface pour le produit sérialisé - AVEC POINTS CORRIGÉS
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
  
  // Spécifications
  specificationCard?: { [key: string]: string | number | boolean };
  specificationTech?: { [key: string]: string | number | boolean };
  specifications?: { [key: string]: string | number | boolean };
  technicalInfo?: TechnicalInfo;
  
  // CHAMPS POINTS - FORMAT CORRIGÉ
  points?: number | null;
  pointsValidUntil?: string | null; // Toujours string ISO ou null
  
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

// Fonction utilitaire pour normaliser les dates de points
function normalizePointsValidUntil(pointsValidUntil: string | Timestamp | { toDate?: () => Date; seconds?: number } | null | undefined): string | null {
  if (!pointsValidUntil) {
    return null;
  }

  // Firebase Timestamp
  if (pointsValidUntil instanceof Timestamp) {
    return pointsValidUntil.toDate().toISOString();
  }

  // String
  if (typeof pointsValidUntil === 'string') {
    // Déjà au format ISO
    if (pointsValidUntil.includes('T')) {
      return pointsValidUntil;
    }
    // Format date simple "2025-10-31" -> ajouter l'heure de fin de journée
    if (pointsValidUntil.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return `${pointsValidUntil}T23:59:59.999Z`;
    }
    // Autre format string, essayer de parser
    try {
      return new Date(pointsValidUntil).toISOString();
    } catch {
      console.warn('Format de date pointsValidUntil non reconnu:', pointsValidUntil);
      return null;
    }
  }

  // Object avec toDate (Firebase dans certains contextes)
  if (pointsValidUntil && typeof pointsValidUntil.toDate === 'function') {
    return pointsValidUntil.toDate().toISOString();
  }

  // Object avec seconds (Firebase Timestamp déstructuré)
  if (pointsValidUntil && typeof pointsValidUntil.seconds === 'number') {
    return new Date(pointsValidUntil.seconds * 1000).toISOString();
  }

  console.warn('Type pointsValidUntil non géré:', typeof pointsValidUntil, pointsValidUntil);
  return null;
}

// Fonction principale de sérialisation - CORRIGÉE
export function serializeProduct(product: Product): SerializedProduct {
  console.log('🔄 SERIALIZATION DEBUG - Input Product:', {
    id: product.id,
    title: product.title,
    points: product.points,
    pointsValidUntil: product.pointsValidUntil,
    pointsValidUntilType: typeof product.pointsValidUntil
  });

  // Normaliser les points
  const normalizedPoints = product.points || null;
  const normalizedPointsValidUntil = normalizePointsValidUntil(product.pointsValidUntil);

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
    
    // Spécifications
    specificationCard: product.specificationCard || {},
    specificationTech: product.specificationTech || {},
    specifications: product.specifications || {},
    technicalInfo: product.technicalInfo || {},
    
    // POINTS CORRIGÉS
    points: normalizedPoints,
    pointsValidUntil: normalizedPointsValidUntil,
    
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
    points: serialized.points,
    pointsValidUntil: serialized.pointsValidUntil,
    pointsValidUntilParsed: serialized.pointsValidUntil ? new Date(serialized.pointsValidUntil) : null
  });

  return serialized;
}

// Fonction de test pour les points
export function testPointsSerialization() {
  console.log('🧪 TEST DE SÉRIALISATION DES POINTS');
  
  const testCases = [
    { input: '2025-10-31', expected: '2025-10-31T23:59:59.999Z' },
    { input: '2025-10-31T23:59:59.999Z', expected: '2025-10-31T23:59:59.999Z' },
    { input: null, expected: null },
    { input: undefined, expected: null }
  ];

  testCases.forEach(test => {
    const result = normalizePointsValidUntil(test.input);
    console.log(`Input: ${test.input} -> Output: ${result} -> Expected: ${test.expected}`);
    console.log(`✅ ${result === test.expected ? 'PASS' : 'FAIL'}`);
  });
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