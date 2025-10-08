// utils/serialization.ts
import { Product } from '@/types/product';

export function serializeProduct(product: Product) {
  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
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
    specifications: product.specifications,
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