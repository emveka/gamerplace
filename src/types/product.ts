// types/product.ts - Version mise à jour avec types corrects

import { Timestamp } from "firebase/firestore";

// Interface pour une description de produit individuelle
export interface ProductDescription {
  id: string;          // ID unique pour chaque description
  title: string;       // Titre de la section (ex: "6 CŒURS NATIFS ET 12 CŒURS LOGIQUES")
  description: string; // Description détaillée
  imageUrl: string;    // URL de l'image
  imageAlt: string;    // Texte alternatif pour l'accessibilité
  order: number;       // Ordre d'affichage (0, 1, 2, etc.)
}

export interface Product {
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
  oldPrice?: number;
  costPrice?: number;
  
  images: string[];
  imageAlts?: string[];
  
  stock: number;
  sku?: string;
  barcode?: string;
  
  specifications?: {
    [key: string]: string;
  };
  
  tags?: string[];
  
  // Badge singulier au lieu de badges pluriel
  badges?: ProductBadge[];
  
  // Tableau de descriptions (maximum 5)
  productDescriptions?: ProductDescription[];
  
  // NOUVEAU: URL de vidéo YouTube
  videoUrl?: string;
  
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
  
  isActive: boolean;
  isNewArrival: boolean;
  
  // CORRECTION: Permettre null pour ces champs
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export interface ProductBadge {
  id: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  priority?: number;
}