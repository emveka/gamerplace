// types/category.ts

import { Timestamp } from "firebase/firestore";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  descriptionLongue?: string;
  imageUrl?: string;
  
  parentId: string | null;
  level: number;
  path: string[];
  
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  
  isActive: boolean;
  order: number;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CategoryFormData = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;