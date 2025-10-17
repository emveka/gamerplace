// types/serialized.ts - VERSION CORRIGÉE AVEC TYPES HARMONISÉS
import { Category } from '@/types/category';

// Types sérialisés pour les marques
export interface SerializedBrand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

// Types sérialisés pour les catégories avec enfants
export interface SerializedCategoryWithChildren {
  id: string;
  name: string;
  slug: string;
  description: string;
  descriptionLongue?: string;
  imageUrl?: string;
  
  parentId?: string; // Converti de string | null vers optionnel
  level: number;
  path: string[];
  
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  
  isActive: boolean;
  order: number;
  
  createdAt: string | null; // Timestamps convertis en strings
  updatedAt: string | null;
  children: SerializedCategoryWithChildren[];
}

// Interface pour les badges de produits
export interface ProductBadge {
  id: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  priority?: number;
}

// Interface pour les descriptions de produits
export interface ProductDescription {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  order: number;
}

// Interface pour les informations techniques - Compatible avec les autres fichiers
export interface TechnicalInfo {
  [key: string]: string | number | boolean;
}

// 🔧 INTERFACE CORRIGÉE: SerializedProduct avec types harmonisés
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
  
  // 🎯 CHAMPS POINTS - TYPES HARMONISÉS AVEC serialization.ts
  points?: number | null;
  pointsValidUntil?: string | null; // ✅ CORRIGÉ: Toujours string ISO ou null après sérialisation
  
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

// Interface pour les catégories avec hiérarchie (interne)
export interface CategoryWithHierarchy {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
  [key: string]: unknown;
}

// Interface pour une catégorie avec ses enfants (interne)
export interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

// 🔧 TYPES UTILITAIRES POUR LA CONVERSION DES TIMESTAMPS

// Type pour les timestamps Firebase avant sérialisation
export type FirebaseTimestamp = 
  | string 
  | { toDate?: () => Date; seconds?: number; nanoseconds?: number }
  | Date 
  | null 
  | undefined;

// Type pour les produits avant sérialisation (avec timestamps Firebase)
export interface ProductBeforeSerialization extends Omit<SerializedProduct, 'pointsValidUntil' | 'createdAt' | 'updatedAt'> {
  pointsValidUntil?: FirebaseTimestamp;
  createdAt?: FirebaseTimestamp;
  updatedAt?: FirebaseTimestamp;
}

// 🔧 FONCTIONS UTILITAIRES DE TYPE GUARDS

/**
 * Vérifie si une valeur est un timestamp Firebase avec la méthode toDate
 */
export function isFirebaseTimestampWithToDate(value: unknown): value is { toDate: () => Date } {
  return value !== null && 
         value !== undefined && 
         typeof value === 'object' && 
         'toDate' in value && 
         typeof (value as { toDate?: unknown }).toDate === 'function';
}

/**
 * Vérifie si une valeur est un timestamp Firebase avec seconds
 */
export function isFirebaseTimestampWithSeconds(value: unknown): value is { seconds: number } {
  return value !== null && 
         value !== undefined && 
         typeof value === 'object' && 
         'seconds' in value && 
         typeof (value as { seconds?: unknown }).seconds === 'number';
}

/**
 * Convertit n'importe quel type de timestamp Firebase en string ISO
 */
export function normalizeTimestampToISO(timestamp: FirebaseTimestamp): string | null {
  if (!timestamp) return null;

  // String déjà au format ISO
  if (typeof timestamp === 'string') {
    // Format date simple "2025-10-31" -> ajouter l'heure de fin de journée
    if (timestamp.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return `${timestamp}T23:59:59.999Z`;
    }
    // Déjà au format ISO ou autre format string
    try {
      return new Date(timestamp).toISOString();
    } catch {
      console.warn('Format de date non reconnu:', timestamp);
      return null;
    }
  }

  // Date JavaScript
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }

  // Firebase Timestamp avec toDate
  if (isFirebaseTimestampWithToDate(timestamp)) {
    return timestamp.toDate().toISOString();
  }

  // Firebase Timestamp avec seconds
  if (isFirebaseTimestampWithSeconds(timestamp)) {
    return new Date(timestamp.seconds * 1000).toISOString();
  }

  console.warn('Type de timestamp non géré:', typeof timestamp, timestamp);
  return null;
}