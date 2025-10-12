// types/serialized.ts
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