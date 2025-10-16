// app/categories/[slug]/page.tsx - VERSION ULTRA OPTIMISÉE
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Services
import { getCategory } from '@/services/categories';

// Components
import { CategoryHeader } from '@/components/category/CategoryHeader';
import { CategoryDescription } from '@/components/category/CategoryDescription';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { CategoryFiltersContainer } from '@/components/category/CategoryFiltersContainer';
import { ProductsSection } from '@/components/category/ProductsSection';

// Types
import { SearchParams, ProductFilters } from '@/types/filters';

// Utils
import { buildCategoryBreadcrumb } from '@/utils/breadcrumb';

// Génération des métadonnées
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
         
          {/* Sidebar Filters - SANS Suspense pour éviter double skeleton */}
          <aside className="w-full lg:w-64 lg:flex-shrink-0">
            <CategoryFiltersContainer categoryId={category.id} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Breadcrumb items={breadcrumbItems} />
            <CategoryHeader category={category} />

            {/* Section produits - SANS Suspense pour UX fluide */}
            <ProductsSection
              categoryId={category.id}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              filters={filters}
              searchParams={resolvedSearchParams}
            />

            <CategoryDescription category={category} />
          </main>
        </div>
      </div>
    </div>
  );
}

// Optimisations Next.js
export const dynamic = 'auto';
export const revalidate = 3600;
export const runtime = 'nodejs';