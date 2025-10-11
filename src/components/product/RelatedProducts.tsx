// components/product/RelatedProducts.tsx - Version corrigée avec sérialisation
import { collection, query, where, getDocs, limit, DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product/ProductCard';

interface RelatedProductsProps {
  categoryIds: string[];
  currentProductId: string;
  brandId?: string;
}

// Interface pour les données produit Firebase
interface FirebaseProductData extends DocumentData {
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  brandId?: string;
  brandName?: string;
  categoryIds?: string[];
  categoryPath?: string[];
  primaryCategoryId?: string;
  primaryCategoryName?: string;
  price?: number;
  oldPrice?: number;
  costPrice?: number;
  images?: string[];
  imageAlts?: string[];
  stock?: number;
  sku?: string;
  barcode?: string;
  specifications?: { [key: string]: string };
  tags?: string[];
  badges?: Array<{
    id: string;
    text: string;
    backgroundColor: string;
    textColor: string;
    isActive: boolean;
    priority?: number;
  }>;
  productDescriptions?: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    order: number;
  }>;
  videoUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  isActive?: boolean;
  isNewArrival?: boolean;
  createdAt?: {
    toDate?: () => Date;
    seconds?: number;
    nanoseconds?: number;
  };
  updatedAt?: {
    toDate?: () => Date;
    seconds?: number;
    nanoseconds?: number;
  };
}

const toTimestamp = (ts: unknown): Timestamp => {
  if (ts instanceof Timestamp) return ts;

  return ts && typeof ts === 'object' && 'seconds' in ts && 'nanoseconds' in ts
    // @ts-expect-error constructeur (seconds, nanoseconds)
    ? new Timestamp(ts.seconds, ts.nanoseconds)
    : Timestamp.fromMillis(0);
};


// Fonction pour sérialiser un produit Firebase en Product complet
function serializeFirebaseProduct(doc: QueryDocumentSnapshot<FirebaseProductData>): Product {
  const data = doc.data();

  return {
    id: doc.id,
    title: data.title || '',
    slug: data.slug || '',
    shortDescription: data.shortDescription || '',
    brandId: data.brandId || '',
    brandName: data.brandName || '',
    categoryIds: data.categoryIds || [],
    categoryPath: data.categoryPath || [],
    primaryCategoryId: data.primaryCategoryId || '',
    primaryCategoryName: data.primaryCategoryName || '',
    price: data.price || 0,
    oldPrice: data.oldPrice,
    costPrice: data.costPrice,
    images: data.images || [],
    imageAlts: data.imageAlts || [],
    stock: data.stock || 0,
    sku: data.sku,
    barcode: data.barcode,
    specifications: data.specifications || {},
    tags: data.tags || [],
    badges: data.badges || [],
    productDescriptions: data.productDescriptions || [],
    // Product déclare: videoUrl: string | undefined
    videoUrl: data.videoUrl ?? '',
    metaTitle: data.metaTitle || '',
    metaDescription: data.metaDescription || '',
    keywords: data.keywords || [],
    canonicalUrl: data.canonicalUrl,
    isActive: data.isActive !== false,
    isNewArrival: data.isNewArrival || false,

    // ✅ normalisation en Timestamp (pas d’objet {seconds, nanoseconds})
    createdAt: toTimestamp(data.createdAt),
    updatedAt: toTimestamp(data.updatedAt),
  } satisfies Product; // évite le cast “as Product”
}

async function getRelatedProducts(
  categoryIds: string[],
  currentProductId: string,
  brandId?: string
): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    
    // Requête par catégorie
    const categoryQuery = query(
      productsRef,
      where('categoryIds', 'array-contains-any', categoryIds.slice(0, 10)),
      where('isActive', '==', true),
      limit(8)
    );
    
    const categorySnapshot = await getDocs(categoryQuery);
    let relatedProducts = categorySnapshot.docs
      .filter(doc => doc.id !== currentProductId)
      .map(doc => serializeFirebaseProduct(doc as QueryDocumentSnapshot<FirebaseProductData>));
    
    // Si moins de 4 produits, chercher par marque
    if (relatedProducts.length < 4 && brandId) {
      const brandQuery = query(
        productsRef,
        where('brandId', '==', brandId),
        where('isActive', '==', true),
        limit(8)
      );
      
      const brandSnapshot = await getDocs(brandQuery);
      const brandProducts = brandSnapshot.docs
        .filter(doc => doc.id !== currentProductId)
        .map(doc => serializeFirebaseProduct(doc as QueryDocumentSnapshot<FirebaseProductData>));
      
      // Fusionner et dédupliquer
      const productMap = new Map<string, Product>();
      [...relatedProducts, ...brandProducts].forEach(p => {
        if (!productMap.has(p.id)) {
          productMap.set(p.id, p);
        }
      });
      
      relatedProducts = Array.from(productMap.values());
    }
    
    return relatedProducts.slice(0, 4);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export async function RelatedProducts({ 
  categoryIds, 
  currentProductId, 
  brandId 
}: RelatedProductsProps) {
  const relatedProducts = await getRelatedProducts(
    categoryIds,
    currentProductId,
    brandId
  );

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 border-l-4 border-yellow-500 pl-4">
        Produits similaires
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}