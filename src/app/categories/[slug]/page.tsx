// app/categories/[slug]/page.tsx - VERSION AVEC TOUTES LES CATÉGORIES
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/types/category';
import { Product } from '@/types/product';
import { Brand } from '@/types/brand';
import { CategoryHeader } from '@/components/category/CategoryHeader';
import { CategoryFilters } from '@/components/category/CategoryFilters';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Pagination } from '@/components/ui/Pagination';
import { CategoryDescription } from '@/components/category/CategoryDescription';
import { ProductSortingBar } from '@/components/product/ProductSortingBar';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Suspense } from 'react';
import { Timestamp } from 'firebase/firestore';

const toTimestamp = (ts: unknown): Timestamp => {
  if (ts instanceof Timestamp) return ts;

  return ts && typeof ts === 'object' && 'seconds' in ts && 'nanoseconds' in ts
    // @ts-expect-error constructeur (seconds, nanoseconds) accepté
    ? new Timestamp(ts.seconds, ts.nanoseconds)
    : Timestamp.fromMillis(0);
};

// Interface compatible avec PaginationSearchParams
interface SearchParams {
  page?: string;
  sort?: string;
  priceRange?: string;
  brand?: string;
  condition?: string;
  stock?: string;
  [key: string]: string | string[] | undefined; // Signature d'index ajoutée
}

interface ProductFilters {
  sort?: string;
  brand?: string;
  condition?: string;
  priceRange?: string;
  stock?: string;
}

interface BreadcrumbItem {
  href: string;
  label: string;
  current?: boolean;
}

interface CategoryWithHierarchy {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  createdAt?: { seconds: number; nanoseconds: number } | null;
  updatedAt?: { seconds: number; nanoseconds: number } | null;
  [key: string]: unknown;
}

// Interface pour une catégorie avec ses enfants
interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

// Construire le breadcrumb avec toute la hiérarchie des catégories
async function buildCategoryBreadcrumb(category: Category): Promise<BreadcrumbItem[]> {
  const breadcrumbItems: BreadcrumbItem[] = [
    { href: '/', label: 'Accueil' }
  ];

  // Récupérer récursivement tous les parents
  const categoryHierarchy: Category[] = [];
  let currentCategory = category;

  // Remonter la hiérarchie jusqu'à la racine
  while (currentCategory) {
    categoryHierarchy.unshift(currentCategory);
    
    if (currentCategory.parentId) {
      try {
        const categoriesRef = collection(db, 'categories');
        const allCategoriesSnapshot = await getDocs(
          query(categoriesRef, where('isActive', '==', true))
        );
        
        // Trouver le parent par son ID
        const parentDoc = allCategoriesSnapshot.docs.find(doc => doc.id === currentCategory.parentId);
        
        if (parentDoc) {
          const parentData = parentDoc.data();
          currentCategory = {
            id: parentDoc.id,
            ...parentData,
            createdAt: parentData.createdAt ? {
              seconds: parentData.createdAt.seconds,
              nanoseconds: parentData.createdAt.nanoseconds
            } : null,
            updatedAt: parentData.updatedAt ? {
              seconds: parentData.updatedAt.seconds,
              nanoseconds: parentData.updatedAt.nanoseconds
            } : null
          } as Category;
        } else {
          break; // Parent non trouvé, arrêter la remontée
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du parent:', error);
        break;
      }
    } else {
      break; // Plus de parent, on a atteint la racine
    }
  }

  // Construire le breadcrumb à partir de la hiérarchie
  categoryHierarchy.forEach((cat, index) => {
    const isLast = index === categoryHierarchy.length - 1;
    breadcrumbItems.push({
      href: `/categories/${cat.slug}`,
      label: cat.name,
      current: isLast
    });
  });

  return breadcrumbItems;
}

// Récupérer toutes les catégories enfants récursivement
async function getAllChildCategories(parentCategoryId: string): Promise<string[]> {
  try {
    const categoriesRef = collection(db, 'categories');
    const allCategoriesSnapshot = await getDocs(query(categoriesRef, where('isActive', '==', true)));
    
    const allCategories: CategoryWithHierarchy[] = allCategoriesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        slug: data.slug,
        parentId: data.parentId,
        isActive: data.isActive,
        createdAt: data.createdAt ? {
          seconds: data.createdAt.seconds,
          nanoseconds: data.createdAt.nanoseconds
        } : null,
        updatedAt: data.updatedAt ? {
          seconds: data.updatedAt.seconds,
          nanoseconds: data.updatedAt.nanoseconds
        } : null,
        ...data
      };
    });
    
    // Fonction récursive pour trouver tous les enfants
    const findAllChildren = (parentId: string): string[] => {
      const directChildren = allCategories
        .filter(cat => cat.parentId === parentId)
        .map(cat => cat.id);
      
      const allChildren = [...directChildren];
      
      directChildren.forEach(childId => {
        const grandChildren = findAllChildren(childId);
        allChildren.push(...grandChildren);
      });
      
      return allChildren;
    };
    
    const allCategoryIds = [parentCategoryId];
    const childrenIds = findAllChildren(parentCategoryId);
    allCategoryIds.push(...childrenIds);
    
    return [...new Set(allCategoryIds)];
  } catch (error) {
    console.error('Error in getAllChildCategories:', error);
    return [parentCategoryId];
  }
}

// Récupérer une catégorie par son slug
async function getCategory(slug: string): Promise<Category | null> {
  try {
    const categoriesRef = collection(db, 'categories');
    const categoryQuery = query(
      categoriesRef, 
      where('slug', '==', slug), 
      where('isActive', '==', true),
      limit(1)
    );
    const categorySnapshot = await getDocs(categoryQuery);
    
    if (categorySnapshot.empty) {
      return null;
    }
    
    const categoryDoc = categorySnapshot.docs[0];
    const categoryData = categoryDoc.data();
    const category = {
      id: categoryDoc.id,
      ...categoryData,
      createdAt: categoryData.createdAt ? {
        seconds: categoryData.createdAt.seconds,
        nanoseconds: categoryData.createdAt.nanoseconds
      } : null,
      updatedAt: categoryData.updatedAt ? {
        seconds: categoryData.updatedAt.seconds,
        nanoseconds: categoryData.updatedAt.nanoseconds
      } : null
    } as Category;
    
    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

// Récupérer les produits avec filtrage
async function getProducts(
  categoryIds: string[], 
  page: number = 1, 
  itemsPerPage: number = 12,
  filters: ProductFilters = {}
): Promise<{ products: Product[], totalCount: number }> {
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
      
      // DEBUG: Vérifier la présence des badges dans Firebase
      console.log(`Firebase Doc ID: ${doc.id}, Title: ${data.title}, Badges:`, data.badges);
      
      return {
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
    specifications: data.specifications ?? {},
    tags: data.tags ?? [],
    badges: data.badges ?? [],
    productDescriptions: data.productDescriptions ?? [],
    metaTitle: data.metaTitle ?? '',
    metaDescription: data.metaDescription ?? '',
    keywords: data.keywords ?? [],
    canonicalUrl: data.canonicalUrl,
    isActive: data.isActive !== false,
    isNewArrival: data.isNewArrival ?? false,

    // ✅ requis par Product (déclaré comme string | undefined mais propriété obligatoire)
    videoUrl: data.videoUrl ?? '',

    // ✅ normalisation en Timestamp (pas d’objet {seconds, nanoseconds})
    createdAt: toTimestamp(data.createdAt),
    updatedAt: toTimestamp(data.updatedAt),
  } satisfies Product; // plus sûr que `as Product`
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

    // Tri
    switch (filters.sort) {
      case 'price-asc':
        allProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        allProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        if (allProducts[0]?.createdAt) {
          allProducts.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        }
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

// Récupérer les marques
async function getBrands(categoryIds: string[]): Promise<Brand[]> {
  try {
    if (categoryIds.length === 0) {
      return [];
    }
    
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(
      query(
        productsRef, 
        where('categoryIds', 'array-contains-any', categoryIds), 
        where('isActive', '==', true)
      )
    );
    
    const brandIds = new Set<string>();
    productsSnapshot.docs.forEach(doc => {
      const brandId = doc.data().brandId;
      if (brandId) {
        brandIds.add(brandId);
      }
    });
    
    if (brandIds.size === 0) return [];
    
    // Récupérer toutes les marques et filtrer côté client
    const brandsRef = collection(db, 'brands');
    const allBrandsSnapshot = await getDocs(
      query(brandsRef, where('isActive', '==', true))
    );
    
    const filteredBrands = allBrandsSnapshot.docs
      .filter(doc => brandIds.has(doc.id))
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? {
            seconds: data.createdAt.seconds,
            nanoseconds: data.createdAt.nanoseconds
          } : null,
          updatedAt: data.updatedAt ? {
            seconds: data.updatedAt.seconds,
            nanoseconds: data.updatedAt.nanoseconds
          } : null
        };
      }) as Brand[];
    
    // Trier par nom
    filteredBrands.sort((a, b) => a.name.localeCompare(b.name));
    
    return filteredBrands;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

// Récupérer TOUTES les catégories avec leur hiérarchie complète
async function getCategoriesHierarchy(): Promise<CategoryWithChildren[]> {
  try {
    const categoriesRef = collection(db, 'categories');
    const allCategoriesSnapshot = await getDocs(
      query(categoriesRef, where('isActive', '==', true))
    );
    
    // Mapper toutes les catégories
    const allCategories = allCategoriesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        children: [] as CategoryWithChildren[],
        createdAt: data.createdAt ? {
          seconds: data.createdAt.seconds,
          nanoseconds: data.createdAt.nanoseconds
        } : null,
        updatedAt: data.updatedAt ? {
          seconds: data.updatedAt.seconds,
          nanoseconds: data.updatedAt.nanoseconds
        } : null
      } as CategoryWithChildren;
    });

    // Fonction pour construire l'arbre des enfants d'une catégorie
    const buildCategoryTree = (parentId: string): CategoryWithChildren[] => {
      const directChildren = allCategories
        .filter(cat => cat.parentId === parentId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      return directChildren.map(child => ({
        ...child,
        children: buildCategoryTree(child.id)
      }));
    };

    // Récupérer TOUTES les catégories racines (sans parent)
    const rootCategories = allCategories
      .filter(cat => !cat.parentId && cat.isActive === true)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(root => ({
        ...root,
        children: buildCategoryTree(root.id)
      }));

    return rootCategories;
  } catch (error) {
    console.error('Error fetching categories hierarchy:', error);
    return [];
  }
}

// Génération des métadonnées
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  
  if (!category) {
    return {
      title: 'Catégorie non trouvée | Gamerplace.ma',
      description: 'Cette catégorie n\'existe pas sur Gamerplace.ma.',
      robots: 'noindex, nofollow',
    };
  }

  return {
    title: category.metaTitle || `${category.name} | Gamerplace.ma`,
    description: category.metaDescription || `Découvrez notre sélection de ${category.name} sur Gamerplace.ma`,
    keywords: category.keywords?.join(', '),
    authors: [{ name: 'Gamerplace.ma' }],
    robots: 'index, follow',
    alternates: {
      canonical: `https://gamerplace.ma/categories/${category.slug}`,
    },
    openGraph: {
      type: 'website',
      title: category.metaTitle || category.name,
      description: category.metaDescription || `Découvrez notre sélection de ${category.name}`,
      url: `https://gamerplace.ma/categories/${category.slug}`,
      siteName: 'Gamerplace.ma',
      images: category.imageUrl ? [{
        url: category.imageUrl,
        width: 1200,
        height: 630,
        alt: category.name,
      }] : [],
      locale: 'fr_MA',
    },
  };
}

// Composant principal de la page
export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  
  const category = await getCategory(slug);
  
  if (!category) {
    notFound();
  }

  const currentPage = parseInt(resolvedSearchParams.page || '1');
  const itemsPerPage = 16;
  
  const filters: ProductFilters = {
    sort: resolvedSearchParams.sort || 'newest',
    brand: resolvedSearchParams.brand,
    condition: resolvedSearchParams.condition,
    priceRange: resolvedSearchParams.priceRange,
    stock: resolvedSearchParams.stock,
  };

  // Construction du breadcrumb hiérarchique
  const breadcrumbItems = await buildCategoryBreadcrumb(category);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1500px] mx-auto px-2 py-6">
        {/* Layout responsive : vertical sur mobile, horizontal sur desktop */}
        <div className="flex flex-col lg:flex-row gap-6">
         
          {/* Sidebar Filters - En haut sur mobile, à gauche sur desktop */}
          <Suspense fallback={
            <aside className="w-full lg:w-64 lg:flex-shrink-0">
              <div className="bg-white shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 mb-4"></div>
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200"></div>
                  ))}
                </div>
              </div>
            </aside>
          }>
            <CategoryFiltersContainer categoryId={category.id} />
          </Suspense>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Breadcrumb items={breadcrumbItems} />
            <CategoryHeader category={category} />

            <Suspense fallback={
              <div className="space-y-6">
                <div className="h-16 animate-pulse bg-gray-200"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="h-96 bg-gray-200 animate-pulse"></div>
                  ))}
                </div>
              </div>
            }>
              <ProductsSection
                categoryId={category.id}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                filters={filters}
                searchParams={resolvedSearchParams}
              />
            </Suspense>

            <Suspense fallback={null}>
              <CategoryDescription category={category} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

// Composant pour les filtres avec TOUTES les catégories
async function CategoryFiltersContainer({ categoryId }: { categoryId: string }) {
  const allCategoryIds = await getAllChildCategories(categoryId);
  const brands = await getBrands(allCategoryIds);
  const categoriesHierarchy = await getCategoriesHierarchy(); // Plus besoin du categoryId
 
  return (
    <CategoryFilters
      brands={brands}
      categoriesHierarchy={categoriesHierarchy}
      currentCategoryId={categoryId}
    />
  );
}

// Composant pour la section produits
async function ProductsSection({
  categoryId,
  currentPage,
  itemsPerPage,
  filters,
  searchParams
}: {
  categoryId: string;
  currentPage: number;
  itemsPerPage: number;
  filters: ProductFilters;
  searchParams: SearchParams;
}) {
  const allCategoryIds = await getAllChildCategories(categoryId);
  const { products, totalCount } = await getProducts(allCategoryIds, currentPage, itemsPerPage, filters);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <>
      <ProductSortingBar
        totalCount={totalCount}
        currentSort={filters.sort || 'newest'}
      />
     
      <ProductGrid products={products} />
     
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          searchParams={searchParams}
          baseUrl={`/categories/${categoryId}`}
        />
      )}
    </>
  );
}

// Optimisations Next.js
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';