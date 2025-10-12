// utils/firebase-helpers.ts
import { Timestamp } from 'firebase/firestore';
import { Brand } from '@/types/brand';
import { SerializedBrand, SerializedCategoryWithChildren, CategoryWithChildren } from '@/types/serialized';
import { serializeProduct } from '@/utils/serialization';

// Fonction utilitaire pour convertir en Timestamp
export const toTimestamp = (ts: unknown): Timestamp => {
  if (ts instanceof Timestamp) return ts;

  return ts && typeof ts === 'object' && 'seconds' in ts && 'nanoseconds' in ts
    // @ts-expect-error constructeur (seconds, nanoseconds) accepté
    ? new Timestamp(ts.seconds, ts.nanoseconds)
    : Timestamp.fromMillis(0);
};

// Fonction pour sérialiser une marque
export function serializeBrand(brand: Brand): SerializedBrand {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    description: brand.description,
    logoUrl: brand.logoUrl,
    metaTitle: brand.metaTitle,
    metaDescription: brand.metaDescription,
    keywords: brand.keywords,
    isActive: brand.isActive,
    createdAt: brand.createdAt ? brand.createdAt.toDate().toISOString() : null,
    updatedAt: brand.updatedAt ? brand.updatedAt.toDate().toISOString() : null,
  };
}

// Fonction pour sérialiser une catégorie avec enfants
export function serializeCategoryWithChildren(category: CategoryWithChildren): SerializedCategoryWithChildren {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    descriptionLongue: category.descriptionLongue,
    parentId: category.parentId || undefined, 
    imageUrl: category.imageUrl,
    metaTitle: category.metaTitle,
    metaDescription: category.metaDescription,
    keywords: category.keywords,
    isActive: category.isActive,
    order: category.order,
    level: category.level,
    path: category.path,
    createdAt: category.createdAt ? category.createdAt.toDate().toISOString() : null,
    updatedAt: category.updatedAt ? category.updatedAt.toDate().toISOString() : null,
    children: category.children.map(serializeCategoryWithChildren),
  };
}

// Re-export de serializeProduct pour la cohérence
export { serializeProduct } from '@/utils/serialization';