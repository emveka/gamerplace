// src/components/product/ProductGridHomeCategory.tsx - H2 SEO optimisés
'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, query, where, limit, orderBy, DocumentData, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types/product';
import { serializeProduct, SerializedProduct } from '@/utils/serialization';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';

interface ProductGridHomeCategoryProps {
  title: string;
  categoryId: string;
  categorySlug?: string;
  maxProducts?: number;
  priority?: boolean;
  className?: string;
}

const toTimestamp = (ts: unknown): Timestamp => {
  if (ts instanceof Timestamp) return ts;

  return ts && typeof ts === 'object' && 'seconds' in ts && 'nanoseconds' in ts
    // @ts-expect-error constructeur (seconds, nanoseconds) accepté
    ? new Timestamp(ts.seconds, ts.nanoseconds)
    : Timestamp.fromMillis(0);
};

export function ProductGridHomeCategory({ 
  title, 
  categoryId,
  categorySlug,
  maxProducts = 6,
  priority = false,
  className = ""
}: ProductGridHomeCategoryProps) {
  const [products, setProducts] = useState<SerializedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction récursive pour récupérer TOUS les IDs des catégories enfants
  const getAllChildCategoryIds = useCallback(async (parentId: string): Promise<string[]> => {
    try {
      const categoriesRef = collection(db, 'categories');
      const allCategoriesSnapshot = await getDocs(
        query(categoriesRef, where('isActive', '==', true))
      );
      
      interface CategoryData {
        id: string;
        parentId?: string;
        isActive: boolean;
        name: string;
        slug: string;
      }
      
      const allCategories: CategoryData[] = allCategoriesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        parentId: doc.data().parentId as string | undefined,
        isActive: doc.data().isActive as boolean,
        name: doc.data().name as string,
        slug: doc.data().slug as string
      }));
      
      // Fonction récursive pour trouver tous les enfants
      const findAllChildren = (currentParentId: string): string[] => {
        const directChildren = allCategories
          .filter((cat: CategoryData) => cat.parentId === currentParentId)
          .map((cat: CategoryData) => cat.id);
        
        const allChildren = [...directChildren];
        
        // Pour chaque enfant direct, chercher ses propres enfants
        directChildren.forEach(childId => {
          const grandChildren = findAllChildren(childId);
          allChildren.push(...grandChildren);
        });
        
        return allChildren;
      };
      
      // Inclure la catégorie parent + tous ses enfants
      const allCategoryIds = [parentId, ...findAllChildren(parentId)];
      
      console.log(`🔍 Catégories trouvées pour ${parentId}:`, allCategoryIds);
      return [...new Set(allCategoryIds)]; // Supprimer les doublons
      
    } catch (error) {
      console.error('Erreur récupération catégories enfants:', error);
      return [parentId]; // Fallback sur la catégorie parent seulement
    }
  }, []);

  // Fonction optimisée pour récupérer les produits de toutes les catégories - RETOURNE SerializedProduct[]
  const getProductsFromAllCategories = useCallback(async (parentCategoryId: string): Promise<SerializedProduct[]> => {
    try {
      console.log(`🚀 Recherche produits pour catégorie parent: ${parentCategoryId}`);
      
      // 1. Récupérer tous les IDs de catégories (parent + enfants)
      const allCategoryIds = await getAllChildCategoryIds(parentCategoryId);
      
      if (allCategoryIds.length === 0) {
        console.log('❌ Aucune catégorie trouvée');
        return [];
      }
      
      // 2. Récupérer les produits par chunks (Firebase limit: 10 éléments max dans 'in')
      const productsRef = collection(db, 'products');
      const productPromises: Promise<QuerySnapshot<DocumentData>>[] = [];
      
      // Diviser en chunks de 10 pour respecter la limite Firebase
      for (let i = 0; i < allCategoryIds.length; i += 10) {
        const chunk = allCategoryIds.slice(i, i + 10);
        
        // Rechercher d'abord par primaryCategoryId
        const primaryQuery = query(
          productsRef,
          where('primaryCategoryId', 'in', chunk),
          where('isActive', '==', true),
          orderBy('createdAt', 'desc'),
          limit(maxProducts * 2) // Plus de produits pour avoir du choix
        );
        
        // Rechercher aussi par categoryIds (tableau)
        const categoryArrayQuery = query(
          productsRef,
          where('categoryIds', 'array-contains-any', chunk),
          where('isActive', '==', true),
          orderBy('createdAt', 'desc'),
          limit(maxProducts * 2)
        );
        
        productPromises.push(getDocs(primaryQuery));
        productPromises.push(getDocs(categoryArrayQuery));
      }
      
      // 3. Exécuter toutes les requêtes en parallèle
      const snapshots = await Promise.all(productPromises);
      
      // 4. Fusionner et dédupliquer les résultats
      const allProducts: SerializedProduct[] = [];
      const seenProductIds = new Set<string>();
      
      snapshots.forEach((snapshot: QuerySnapshot<DocumentData>) => {
        snapshot.docs.forEach((doc) => {
          if (!seenProductIds.has(doc.id)) {
            seenProductIds.add(doc.id);
            
            const data = doc.data();
            
            // Créer d'abord l'objet Product avec Timestamps
            const product: Product = {
              id: doc.id,
              title: data.title || '',
              slug: data.slug || '',
              shortDescription: data.shortDescription,
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
              videoUrl: data.videoUrl,
              metaTitle: data.metaTitle || '',
              metaDescription: data.metaDescription || '',
              keywords: data.keywords || [],
              canonicalUrl: data.canonicalUrl,
              isActive: data.isActive !== false,
              isNewArrival: data.isNewArrival || false,
              createdAt: toTimestamp(data.createdAt),
              updatedAt: toTimestamp(data.updatedAt)
            };
            
            // Puis sérialiser pour le client
            allProducts.push(serializeProduct(product));
          }
        });
      });
      
      console.log(`✅ ${allProducts.length} produits trouvés au total`);
      
      // 5. Mélanger et trier les produits pour avoir une bonne variété
      const shuffledAndSorted = allProducts
        .sort((a, b) => {
          // Prioriser les nouveaux produits
          if (a.isNewArrival && !b.isNewArrival) return -1;
          if (!a.isNewArrival && b.isNewArrival) return 1;
          
          // Puis par date de création (plus récent d'abord)
          const aCreated = new Date(a.createdAt || 0).getTime();
          const bCreated = new Date(b.createdAt || 0).getTime();
          if (aCreated !== bCreated) return bCreated - aCreated;
          
          // Enfin par prix (plus cher d'abord pour mettre en avant)
          return (b.price || 0) - (a.price || 0);
        })
        .slice(0, maxProducts);
      
      console.log(`🎯 ${shuffledAndSorted.length} produits sélectionnés pour affichage`);
      return shuffledAndSorted;
      
    } catch (error) {
      console.error('❌ Erreur récupération produits:', error);
      return [];
    }
  }, [getAllChildCategoryIds, maxProducts]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getProductsFromAllCategories(categoryId);
        
        if (isMounted) {
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error('Erreur:', error);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      isMounted = false;
    };
  }, [categoryId, getProductsFromAllCategories]);

  // Loading state
  if (loading) {
    return (
      <section className={`w-full max-w-[1500px] mx-auto px-4 py-8 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {Array.from({ length: maxProducts }).map((_, index) => (
            <div key={index} className="w-full">
              <div className="aspect-square bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Ne pas afficher si aucun produit
  if (products.length === 0) {
    console.log(`⚠️ Aucun produit à afficher pour la catégorie ${categoryId}`);
    return null;
  }

  return (
    <section className={`w-full max-w-[1500px] mx-auto px-1 py-4 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        {/* ✅ H2 SEO optimisé - Titre passé depuis la page parent */}
        <h2 className="text-2xl md:text-2xl font-bold text-gray-900">
          {title}
        </h2>
        
        {categorySlug && (
          <Link
            href={`/categories/${categorySlug}`}
            className="text-yellow-600 hover:text-yellow-700 font-medium text-sm md:text-base transition-colors duration-200 flex items-center gap-1 group"
          >
            Voir plus
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1 md:gap-1">
        {products.map((product, index) => (
          <div key={product.id} className="w-full">
            <ProductCard
              product={product}
              priority={priority && index < 3}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16.66vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}