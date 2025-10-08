import { Timestamp } from "firebase/firestore";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type BrandFormData = Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>;