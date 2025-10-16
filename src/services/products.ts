// services/products.ts - VERSION CORRIGÉE
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types/product';
import { SerializedProduct } from '@/utils/serialization';
import { ProductFilters } from '@/types/filters';
import { toTimestamp, serializeProduct } from '@/utils/firebase-helpers';

// Récupérer les produits avec filtrage - RETOURNE SerializedProduct[]
export async function getProducts(
  categoryIds: string[], 
  page: number = 1, 
  itemsPerPage: number = 12,
  filters: ProductFilters = {}
): Promise<{ products: SerializedProduct[], totalCount: number }> {
  try {
    const productsRef = collection(db, 'products');
    
    const baseQuery = query(
      productsRef,
      where('categoryIds', 'array-contains-any', categoryIds),
      where('isActive', '==', true)
    );

    const allProductsSnapshot = await getDocs(baseQuery);
    let allProducts = allProductsSnapshot.docs.map(doc => {
      const data = doc.data();
      
      // DEBUG: Vérifier la présence des badges et specs dans Firebase
      console.log(`Firebase Doc ID: ${doc.id}, Title: ${data.title}, Badges:`, data.badges);
      console.log(`🔍 SPECS DEBUG - Card:`, data.specificationCard, `Tech:`, data.specificationTech);
      
      // Créer d'abord l'objet Product avec Timestamps
      const product: Product = {
        id: doc.id,
        title: data.title ?? '',
        slug: data.slug ?? '',
        shortDescription: data.shortDescription,
        brandId: data.brandId ?? '',
        brandName: data.brandName ?? '',
        categoryIds: data.categoryIds ?? [],
        categoryPath: data.categoryPath ?? [],
        primaryCategoryId: data.primaryCategoryId ?? '',
        primaryCategoryName: data.primaryCategoryName ?? '',
        price: data.price ?? 0,
        oldPrice: data.oldPrice,
        costPrice: data.costPrice,
        images: data.images ?? [],
        imageAlts: data.imageAlts ?? [],
        stock: data.stock ?? 0,
        sku: data.sku,
        barcode: data.barcode,
        
        // ✅ CORRECTION: Ajouter les nouveaux champs
        specificationCard: data.specificationCard ?? {},
        specificationTech: data.specificationTech ?? {},
        
        // Ancien champ pour rétrocompatibilité
        specifications: data.specifications ?? {},
        
        // Informations techniques (pour compatibilité)
        technicalInfo: data.technicalInfo ?? {},
        
        tags: data.tags ?? [],
        badges: data.badges ?? [],
        productDescriptions: data.productDescriptions ?? [],
        metaTitle: data.metaTitle ?? '',
        metaDescription: data.metaDescription ?? '',
        keywords: data.keywords ?? [],
        canonicalUrl: data.canonicalUrl,
        isActive: data.isActive !== false,
        isNewArrival: data.isNewArrival ?? false,
        videoUrl: data.videoUrl ?? '',
        // Garder les Timestamps Firebase
        createdAt: toTimestamp(data.createdAt),
        updatedAt: toTimestamp(data.updatedAt),
      };

      // Puis sérialiser pour le client
      return serializeProduct(product);
    });

    // Filtrage prix côté client
    if (filters.priceRange && allProducts.length > 0) {
      const priceRanges = filters.priceRange.split(',').filter(Boolean);
      
      allProducts = allProducts.filter(product => {
        return priceRanges.some(range => {
          if (range === '0-5000') {
            return product.price < 5000;
          } else if (range === '5000-10000') {
            return product.price >= 5000 && product.price <= 10000;
          } else if (range === '10000-15000') {
            return product.price >= 10000 && product.price <= 15000;
          } else if (range === '15000-999999') {
            return product.price > 15000;
          }
          return false;
        });
      });
    }

    // Filtrage marque
    if (filters.brand) {
      const brands = filters.brand.split(',').filter(Boolean);
      allProducts = allProducts.filter(product => brands.includes(product.brandId));
    }

    // Filtrage stock
    if (filters.stock) {
      const stockFilters = filters.stock.split(',').filter(Boolean);
      if (stockFilters.includes('in-stock') && !stockFilters.includes('out-of-stock')) {
        allProducts = allProducts.filter(product => product.stock > 0);
      } else if (stockFilters.includes('out-of-stock') && !stockFilters.includes('in-stock')) {
        allProducts = allProducts.filter(product => product.stock === 0);
      }
    }

    // Tri - Utilise les strings ISO pour les dates
    switch (filters.sort) {
      case 'price-asc':
        allProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        allProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        allProducts.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        break;
      case 'name-asc':
        allProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        allProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    // Pagination
    const totalCount = allProducts.length;
    const offset = (page - 1) * itemsPerPage;
    const products = allProducts.slice(offset, offset + itemsPerPage);

    return { products, totalCount };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], totalCount: 0 };
  }
}