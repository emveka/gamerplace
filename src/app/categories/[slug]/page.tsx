// app/categories/[slug]/page.tsx - VERSION AVEC SÉRIALISATION COMPLÈTE
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
import { serializeProduct, SerializedProduct } from '@/utils/serialization';

// Types sérialisés pour les catégories
interface SerializedBrand {
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

interface SerializedCategoryWithChildren {
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
interface CategoryWithHierarchy {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  [key: string]: unknown;
}

// Interface pour une catégorie avec ses enfants (interne)
interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}


const toTimestamp = (ts: unknown): Timestamp => {
  if (ts instanceof Timestamp) return ts;

  return ts && typeof ts === 'object' && 'seconds' in ts && 'nanoseconds' in ts
    // @ts-expect-error constructeur (seconds, nanoseconds) accepté
    ? new Timestamp(ts.seconds, ts.nanoseconds)
    : Timestamp.fromMillis(0);
};

// Fonction pour sérialiser une marque
function serializeBrand(brand: Brand): SerializedBrand {
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
function serializeCategoryWithChildren(category: CategoryWithChildren): SerializedCategoryWithChildren {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    descriptionLongue: category.descriptionLongue, // 🔥 NOUVEAU
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

// Interface compatible avec PaginationSearchParams
interface SearchParams {
  page?: string;
  sort?: string;
  priceRange?: string;
  brand?: string;
  condition?: string;
  stock?: string;
  [key: string]: string | string[] | undefined;
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
            name: parentData.name,
            slug: parentData.slug,
            description: parentData.description,
            parentId: parentData.parentId,
            imageUrl: parentData.imageUrl,
            metaTitle: parentData.metaTitle,
            metaDescription: parentData.metaDescription,
            keywords: parentData.keywords,
            isActive: parentData.isActive,
            order: parentData.order,
            createdAt: parentData.createdAt ? toTimestamp(parentData.createdAt) : Timestamp.fromMillis(0),
            updatedAt: parentData.updatedAt ? toTimestamp(parentData.updatedAt) : Timestamp.fromMillis(0),
          } as Category;
        } else {
          break;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du parent:', error);
        break;
      }
    } else {
      break;
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
        createdAt: data.createdAt ? toTimestamp(data.createdAt) : Timestamp.fromMillis(0),
        updatedAt: data.updatedAt ? toTimestamp(data.updatedAt) : Timestamp.fromMillis(0),
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

// 2. MISE À JOUR DE LA FONCTION getCategory() - REMPLACER ENTIÈREMENT
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
      console.warn('🔍 Aucune catégorie trouvée pour le slug:', slug);
      return null;
    }
    
    const categoryDoc = categorySnapshot.docs[0];
    const categoryData = categoryDoc.data();
    
    // 🔥 DEBUG : Afficher toutes les données Firebase
    console.log('🔍 Données brutes Firebase pour', slug, ':', {
      description: categoryData.description,
      descriptionLongue: categoryData.descriptionLongue,
      keywords: categoryData.keywords,
      metaTitle: categoryData.metaTitle,
      metaDescription: categoryData.metaDescription
    });
    
    const category: Category = {
      id: categoryDoc.id,
      name: categoryData.name || '',
      slug: categoryData.slug || slug,
      description: categoryData.description || '', // Obligatoire selon votre type
      descriptionLongue: categoryData.descriptionLongue, // 🔥 RÉCUPÉRATION de la description longue
      imageUrl: categoryData.imageUrl,
      parentId: categoryData.parentId || null, // string | null selon votre type
      level: categoryData.level || 0, // Obligatoire selon votre type
      path: categoryData.path || [], // Obligatoire selon votre type
      metaTitle: categoryData.metaTitle || `${categoryData.name} | Gamerplace.ma`, // Obligatoire
      metaDescription: categoryData.metaDescription || `Découvrez ${categoryData.name} sur Gamerplace.ma`, // Obligatoire
      keywords: categoryData.keywords || [], // Obligatoire selon votre type
      isActive: categoryData.isActive !== false,
      order: categoryData.order || 0, // Obligatoire selon votre type
      createdAt: categoryData.createdAt ? toTimestamp(categoryData.createdAt) : Timestamp.fromMillis(0),
      updatedAt: categoryData.updatedAt ? toTimestamp(categoryData.updatedAt) : Timestamp.fromMillis(0),
    };
    
    // 🔥 DEBUG : Vérifier les champs critiques
    console.log('🔍 Vérification des champs pour', category.name, ':', {
      hasDescription: !!category.description,
      hasDescriptionLongue: !!category.descriptionLongue,
      hasKeywords: category.keywords.length > 0,
      descriptionLongueLength: category.descriptionLongue?.length || 0,
      keywordsCount: category.keywords.length
    });
    
    return category;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la catégorie:', error);
    return null;
  }
}

// Récupérer les produits avec filtrage - RETOURNE SerializedProduct[]
async function getProducts(
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
      
      // DEBUG: Vérifier la présence des badges dans Firebase
      console.log(`Firebase Doc ID: ${doc.id}, Title: ${data.title}, Badges:`, data.badges);
      
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

// Récupérer les marques - RETOURNE SerializedBrand[]
async function getBrands(categoryIds: string[]): Promise<SerializedBrand[]> {
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
        const brand: Brand = {
          id: doc.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          logoUrl: data.logoUrl,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          keywords: data.keywords,
          isActive: data.isActive,
          createdAt: data.createdAt ? toTimestamp(data.createdAt) : Timestamp.fromMillis(0),
          updatedAt: data.updatedAt ? toTimestamp(data.updatedAt) : Timestamp.fromMillis(0),
        };
        // Sérialiser la marque
        return serializeBrand(brand);
      });
    
    // Trier par nom
    filteredBrands.sort((a, b) => a.name.localeCompare(b.name));
    
    return filteredBrands;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

// 4. MISE À JOUR DE LA FONCTION getCategoriesHierarchy
async function getCategoriesHierarchy(): Promise<SerializedCategoryWithChildren[]> {
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
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        descriptionLongue: data.descriptionLongue,
        imageUrl: data.imageUrl,
        parentId: data.parentId || null, // Garder null ici car c'est le type Category
        metaTitle: data.metaTitle || `${data.name} | Gamerplace.ma`,
        metaDescription: data.metaDescription || `Découvrez ${data.name}`,
        keywords: data.keywords || [],
        isActive: data.isActive !== false,
        order: data.order || 0,
        level: data.level || 0,
        path: data.path || [],
        children: [] as CategoryWithChildren[],
        createdAt: data.createdAt ? toTimestamp(data.createdAt) : Timestamp.fromMillis(0),
        updatedAt: data.updatedAt ? toTimestamp(data.updatedAt) : Timestamp.fromMillis(0),
      } as CategoryWithChildren;
    });

    // Fonction pour construire l'arbre des enfants d'une catégorie
    const buildCategoryTree = (parentId: string): CategoryWithChildren[] => {
      const directChildren = allCategories
        .filter(cat => cat.parentId === parentId) // 🔧 Comparaison avec null fonctionne
        .sort((a, b) => a.order - b.order);

      return directChildren.map(child => ({
        ...child,
        children: buildCategoryTree(child.id)
      }));
    };

    // Récupérer TOUTES les catégories racines (sans parent)
    const rootCategories = allCategories
      .filter(cat => !cat.parentId && cat.isActive === true) // 🔧 !cat.parentId fonctionne avec null
      .sort((a, b) => a.order - b.order)
      .map(root => ({
        ...root,
        children: buildCategoryTree(root.id)
      }));

    // Sérialiser toutes les catégories (la conversion null->undefined se fait ici)
    return rootCategories.map(serializeCategoryWithChildren);
  } catch (error) {
    console.error('Error fetching categories hierarchy:', error);
    return [];
  }
}

// 5. MISE À JOUR DE generateMetadata (améliorer la version existante)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const category = await getCategory(slug);
    
    if (!category) {
      return {
        title: 'Catégorie non trouvée | Gamerplace.ma',
        description: 'Cette catégorie n\'existe pas sur Gamerplace.ma.',
        robots: 'noindex, nofollow',
      };
    }

    // 🔥 METADATA AMÉLIORÉES
    return {
      title: category.metaTitle || `${category.name} - Achat en ligne | Gamerplace.ma`,
      description: category.metaDescription || `Découvrez notre collection ${category.name} chez Gamerplace.ma. Livraison rapide au Maroc.`,
      keywords: category.keywords.join(', '),
      
      authors: [{ name: 'Gamerplace.ma' }],
      creator: 'Gamerplace.ma',
      publisher: 'Gamerplace.ma',
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      
      alternates: {
        canonical: `https://gamerplace.ma/categories/${category.slug}`,
      },
      
      openGraph: {
        type: 'website',
        title: category.metaTitle,
        description: category.metaDescription,
        url: `https://gamerplace.ma/categories/${category.slug}`,
        siteName: 'Gamerplace.ma',
        locale: 'fr_MA',
        images: category.imageUrl ? [{
          url: category.imageUrl.startsWith('http') ? category.imageUrl : `https://gamerplace.ma${category.imageUrl}`,
          width: 1200,
          height: 630,
          alt: `${category.name} - Gamerplace.ma`,
          type: 'image/jpeg',
        }] : [],
      },
      
      twitter: {
        card: 'summary_large_image',
        title: category.metaTitle,
        description: category.metaDescription,
        site: '@gamerplacema',
        images: category.imageUrl ? [category.imageUrl] : [],
      },
      
      viewport: 'width=device-width, initial-scale=1',
      themeColor: '#000000',
      category: 'E-commerce',
    };
  } catch (error) {
    console.error('Erreur generateMetadata:', error);
    
    return {
      title: `Catégorie ${slug} | Gamerplace.ma`,
      description: 'Découvrez nos produits gaming sur Gamerplace.ma',
      robots: 'index, follow',
      alternates: {
        canonical: `https://gamerplace.ma/categories/${slug}`,
      },
    };
  }
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
  const categoriesHierarchy = await getCategoriesHierarchy();
 
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
export const dynamic = 'auto'; // ✅ Changé de 'force-dynamic'
export const revalidate = 3600; // ✅ Changé de 0  
export const runtime = 'nodejs';