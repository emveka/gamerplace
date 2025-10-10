// types/product.ts

import { Timestamp } from "firebase/firestore";

export interface ProductDescription {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  order: number;
}

// 🆕 Type pour les informations techniques
export interface TechnicalInfo {
  [sectionId: string]: {
    [fieldId: string]: string | number | boolean;
  };
}

// 🆕 Interface pour un champ technique
export interface TechnicalField {
  id: string;
  label: string;
  value: string | number | boolean;
  type: 'text' | 'combo' | 'select' | 'number' | 'boolean';
  section: string;
  sectionName: string;
  required?: boolean;
  unit?: string;
}

// 🆕 Interface pour une section technique
export interface TechnicalSection {
  id: string;
  name: string;
  icon?: string;
  order: number;
  fields: TechnicalField[];
}

export interface Product {
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
  
  specifications?: {
    [key: string]: string;
  };
  
  // 🆕 Informations techniques dynamiques
  technicalInfo?: TechnicalInfo;
  
  tags?: string[];
  badges?: ProductBadge[];
  productDescriptions?: ProductDescription[];
  
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
  
  isActive: boolean;
  isNewArrival: boolean;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
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