// utils/serialization.ts
import { Product, TechnicalInfo } from '@/types/product';

/**
 * Type pour un produit sérialisé (utilisé côté client)
 */
export interface SerializedProduct {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  
  brandId: string;
  brandName: string;
  
  categoryIds: string[];
  categoryPath: string[];
  primaryCategoryId: string;
  primaryCategoryName: string;
  
  price: number;
  oldPrice?: number; // 🔧 Pas de null, seulement undefined
  costPrice?: number;
  
  images: string[];
  imageAlts?: string[];
  
  stock: number;
  sku?: string;
  barcode?: string;
  order?: number;
  
  specifications?: {
    [key: string]: string;
  };
  
  // 🆕 Informations techniques sérialisées
  technicalInfo?: TechnicalInfo;
  
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
  
  // 🔧 Timestamps convertis en strings
  createdAt: string | null;
  updatedAt: string | null;
}

// Re-export des interfaces nécessaires
export interface ProductBadge {
  id: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  priority?: number;
}

export interface ProductDescription {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  order: number;
}

/**
 * 🔧 Sérialise un produit Firebase pour l'utilisation côté client
 * 
 * Cette fonction convertit les Timestamps Firebase en strings ISO
 * et s'assure que toutes les propriétés sont sérialisables.
 * 
 * @param product - Le produit à sérialiser
 * @returns Le produit sérialisé
 */
export function serializeProduct(product: Product): SerializedProduct {
  return {
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
    oldPrice: product.oldPrice || undefined, // 🔧 Convertir null en undefined
    costPrice: product.costPrice,
    images: product.images,
    imageAlts: product.imageAlts,
    stock: product.stock,
    sku: product.sku,
    barcode: product.barcode,
    order: product.order,
    specifications: product.specifications,
    // 🆕 Sérialisation des informations techniques
    technicalInfo: product.technicalInfo || {},
    tags: product.tags,
    badges: product.badges,
    productDescriptions: product.productDescriptions,
    videoUrl: product.videoUrl,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    keywords: product.keywords,
    canonicalUrl: product.canonicalUrl,
    isActive: product.isActive,
    isNewArrival: product.isNewArrival,
    // Convertir les Timestamps en strings
    createdAt: product.createdAt?.toDate().toISOString() || null,
    updatedAt: product.updatedAt?.toDate().toISOString() || null
  };
}

/**
 * 🧹 Fonction utilitaire pour nettoyer les informations techniques
 * avant l'affichage (supprime les valeurs vides ou nulles)
 * 
 * @param technicalInfo - Les informations techniques à nettoyer
 * @returns Les informations techniques nettoyées
 */
export function cleanTechnicalInfoForDisplay(technicalInfo: any): any {
  if (!technicalInfo || typeof technicalInfo !== 'object') {
    return {};
  }

  const cleaned: any = {};

  Object.entries(technicalInfo).forEach(([sectionKey, sectionData]) => {
    if (sectionData && typeof sectionData === 'object') {
      const cleanedSection: any = {};
      
      Object.entries(sectionData).forEach(([fieldKey, fieldValue]) => {
        // Garder seulement les valeurs non vides
        if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
          cleanedSection[fieldKey] = fieldValue;
        }
      });

      // Ajouter la section seulement si elle contient des données
      if (Object.keys(cleanedSection).length > 0) {
        cleaned[sectionKey] = cleanedSection;
      }
    }
  });

  return cleaned;
}

/**
 * ✅ Fonction pour valider la structure des informations techniques
 * 
 * @param technicalInfo - Les informations techniques à valider
 * @returns true si la structure est valide, false sinon
 */
export function validateTechnicalInfoStructure(technicalInfo: any): boolean {
  if (!technicalInfo) return true; // Optionnel

  if (typeof technicalInfo !== 'object') return false;

  // Vérifier que chaque section est un objet
  for (const [sectionKey, sectionData] of Object.entries(technicalInfo)) {
    if (sectionData !== null && typeof sectionData !== 'object') {
      console.warn(`Section ${sectionKey} n'est pas un objet:`, sectionData);
      return false;
    }
  }

  return true;
}

/**
 * 🔄 Fonction pour convertir un produit sérialisé en objet Product
 * (Utile pour les formulaires d'édition)
 * 
 * @param serializedProduct - Le produit sérialisé à convertir
 * @returns Le produit au format Product (sans les Timestamps reconvertis)
 */
export function deserializeProduct(serializedProduct: SerializedProduct): Omit<Product, 'createdAt' | 'updatedAt'> {
  return {
    id: serializedProduct.id,
    title: serializedProduct.title,
    slug: serializedProduct.slug,
    shortDescription: serializedProduct.shortDescription || '',
    brandId: serializedProduct.brandId,
    brandName: serializedProduct.brandName,
    categoryIds: serializedProduct.categoryIds,
    categoryPath: serializedProduct.categoryPath,
    primaryCategoryId: serializedProduct.primaryCategoryId,
    primaryCategoryName: serializedProduct.primaryCategoryName,
    price: serializedProduct.price,
    oldPrice: serializedProduct.oldPrice || null,
    costPrice: serializedProduct.costPrice,
    images: serializedProduct.images,
    imageAlts: serializedProduct.imageAlts,
    stock: serializedProduct.stock,
    sku: serializedProduct.sku,
    barcode: serializedProduct.barcode,
    order: serializedProduct.order,
    specifications: serializedProduct.specifications,
    technicalInfo: serializedProduct.technicalInfo,
    tags: serializedProduct.tags,
    badges: serializedProduct.badges,
    productDescriptions: serializedProduct.productDescriptions,
    videoUrl: serializedProduct.videoUrl,
    metaTitle: serializedProduct.metaTitle,
    metaDescription: serializedProduct.metaDescription,
    keywords: serializedProduct.keywords,
    canonicalUrl: serializedProduct.canonicalUrl,
    isActive: serializedProduct.isActive,
    isNewArrival: serializedProduct.isNewArrival,
  };
}