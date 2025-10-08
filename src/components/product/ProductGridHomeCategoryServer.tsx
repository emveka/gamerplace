// src/components/product/ProductGridHomeCategoryServer.tsx
import { collection, getDocs, query, where, limit, orderBy, QueryDocumentSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types/product';
import Link from 'next/link';

interface ProductGridHomeCategoryServerProps {
  title: string;
  categoryId: string;
  categorySlug?: string;
  maxProducts?: number;
  priority?: boolean;
  className?: string;
}

// Fonction pour récupérer les produits côté serveur
async function getCategoryProducts(categoryId: string, maxProducts: number = 6): Promise<Product[]> {
  try {
    console.time(`🚀 Récupération produits ${categoryId}`);
    
    // Récupérer les sous-catégories et les produits en parallèle
    const [subCategoriesSnapshot, mainCategoryProductsSnapshot] = await Promise.all([
      // Sous-catégories
      getDocs(query(
        collection(db, 'categories'),
        where('parentId', '==', categoryId),
        where('isActive', '==', true)
      )),
      // Produits de la catégorie principale
      getDocs(query(
        collection(db, 'products'),
        where('primaryCategoryId', '==', categoryId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(maxProducts)
      ))
    ]);
    
    // Collecter tous les produits
    const allProducts: Product[] = [];
    
    // Ajouter les produits de la catégorie principale
    mainCategoryProductsSnapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      allProducts.push({
        id: doc.id,
        ...doc.data()
      } as Product);
    });
    
    // Si on n'a pas assez de produits, chercher dans les sous-catégories
    if (allProducts.length < maxProducts && !subCategoriesSnapshot.empty) {
      const subCategoryIds = subCategoriesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => doc.id);
      const remainingSlots = maxProducts - allProducts.length;
      
      // Récupérer les produits des sous-catégories par chunks
      const subCategoryPromises: Promise<QuerySnapshot<DocumentData>>[] = [];
      
      for (let i = 0; i < subCategoryIds.length; i += 10) {
        const chunk = subCategoryIds.slice(i, i + 10);
        
        subCategoryPromises.push(
          getDocs(query(
            collection(db, 'products'),
            where('primaryCategoryId', 'in', chunk),
            where('isActive', '==', true),
            orderBy('createdAt', 'desc'),
            limit(Math.ceil(remainingSlots * 1.5))
          ))
        );
      }
      
      const subCategorySnapshots = await Promise.all(subCategoryPromises);
      
      // Ajouter les produits des sous-catégories
      subCategorySnapshots.forEach(snapshot => {
        snapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const productData = {
            id: doc.id,
            ...doc.data()
          } as Product;
          
          // Éviter les doublons
          if (!allProducts.find(p => p.id === productData.id)) {
            allProducts.push(productData);
          }
        });
      });
    }
    
    // Trier et limiter les résultats finaux
    const finalProducts = allProducts
      .sort((a, b) => {
        // Prioriser : nouveaux produits > createdAt > prix
        if (a.isNewArrival && !b.isNewArrival) return -1;
        if (!a.isNewArrival && b.isNewArrival) return 1;
        
        const aCreated = a.createdAt?.seconds || 0;
        const bCreated = b.createdAt?.seconds || 0;
        if (aCreated !== bCreated) return bCreated - aCreated;
        
        return (b.price || 0) - (a.price || 0);
      })
      .slice(0, maxProducts);
    
    console.timeEnd(`🚀 Récupération produits ${categoryId}`);
    console.log(`✅ ${finalProducts.length} produits récupérés`);
    
    return finalProducts;
    
  } catch (error) {
    console.error('❌ Erreur récupération produits:', error);
    return [];
  }
}

export async function ProductGridHomeCategoryServer({ 
  title, 
  categoryId,
  categorySlug,
  maxProducts = 6,
  priority = false,
  className = ""
}: ProductGridHomeCategoryServerProps) {
  
  const products = await getCategoryProducts(categoryId, maxProducts);
  
  // Ne pas afficher si aucun produit
  if (products.length === 0) {
    return null;
  }

  return (
    <section className={`w-full max-w-[1500px] mx-auto px-4 py-8 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
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

// Version avec Suspense pour loading
export function ProductGridHomeCategoryWithSuspense(props: ProductGridHomeCategoryServerProps) {
  return (
    <div className="w-full">
      <ProductGridHomeCategoryServer {...props} />
    </div>
  );
}