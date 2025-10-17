// app/categories/[slug]/page.tsx - VERSION CORRIGÉE (utilise vos types existants)
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

// Services
import { getCategory } from '@/services/categories';

// Components
import { CategoryHeader } from '@/components/category/CategoryHeader';
import { CategoryDescription } from '@/components/category/CategoryDescription';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { CategoryFiltersContainer } from '@/components/category/CategoryFiltersContainer';
import { ProductsSection } from '@/components/category/ProductsSection';

// Types - utilise vos types existants
import { SearchParams, ProductFilters } from '@/types/filters';

// Utils
import { buildCategoryBreadcrumb } from '@/utils/breadcrumb';
import { 
  normalizeSearchParams, 
  validateAndSanitizeSearchParams, 
  buildCleanUrl, 
  hasSearchParamsChanged 
} from '@/utils/searchParamsUtils';

// Génération des métadonnées (inchangée mais avec gestion d'erreur améliorée)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    
    if (!slug || typeof slug !== 'string') {
      throw new Error('Slug invalide');
    }
    
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
    
    // Fallback sécurisé
    return {
      title: 'Gamerplace.ma - Votre boutique gaming',
      description: 'Découvrez nos produits gaming sur Gamerplace.ma',
      robots: 'index, follow',
    };
  }
}

// CORRECTION 3 : Composant principal avec validation complète (simplifié avec les utils)
export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  try {
    const { slug } = await params;
    const rawSearchParams = await searchParams;
    
    // VALIDATION 1 : Vérification du slug
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      console.error('Slug invalide:', slug);
      notFound();
    }
    
    // CONVERSION : Normaliser les searchParams Next.js
    const normalizedSearchParams = normalizeSearchParams(rawSearchParams);
    
    // VALIDATION 2 : Nettoyage et validation des paramètres de recherche
    const sanitizedSearchParams = validateAndSanitizeSearchParams(normalizedSearchParams);
    
    // VALIDATION 3 : Redirection si les paramètres ont été modifiés
    if (hasSearchParamsChanged(normalizedSearchParams, sanitizedSearchParams)) {
      const redirectUrl = buildCleanUrl(slug, sanitizedSearchParams);
      console.log('Redirection vers URL propre:', redirectUrl);
      redirect(redirectUrl);
    }
    
    // VALIDATION 4 : Récupération et vérification de la catégorie
    const category = await getCategory(slug);
    
    if (!category) {
      console.error('Catégorie non trouvée:', slug);
      notFound();
    }
    
    // DEBUG COMPLET : Vérifier toutes les propriétés de la catégorie
    console.log('🔍 DEBUG COMPLET - Catégorie récupérée:', {
      id: category.id,
      name: category.name,
      slug: category.slug,
      slugType: typeof category.slug,
      slugExists: !!category.slug,
      originalSlug: slug,
      allKeys: Object.keys(category),
      fullCategory: category
    });
    
    // VALIDATION 5 : Vérification du slug de la catégorie avec fallback robuste
    const categorySlug = category.slug || slug;
    
    console.log('🔍 Slug final utilisé:', {
      categorySlug,
      fromCategory: category.slug,
      fromUrl: slug,
      isEqual: category.slug === slug
    });

    // VALIDATION 5 : Traitement des paramètres de pagination
    const currentPage = Math.max(1, parseInt(sanitizedSearchParams.page || '1'));
    const itemsPerPage = 16;
    
    // VALIDATION 6 : Construction des filtres
    const filters: ProductFilters = {
      sort: sanitizedSearchParams.sort || 'newest',
      brand: sanitizedSearchParams.brand || undefined,
      condition: sanitizedSearchParams.condition || undefined,
      priceRange: sanitizedSearchParams.priceRange || undefined,
      stock: sanitizedSearchParams.stock || undefined,
    };

    // Construction du breadcrumb hiérarchique
    const breadcrumbItems = await buildCategoryBreadcrumb(category);

    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1500px] mx-auto px-2 py-6">
          {/* Layout responsive : vertical sur mobile, horizontal sur desktop */}
          <div className="flex flex-col lg:flex-row gap-6">
           
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 lg:flex-shrink-0">
              <CategoryFiltersContainer categoryId={category.id} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <Breadcrumb items={breadcrumbItems} />
              <CategoryHeader category={category} />

              {/* Section produits avec gestion d'erreur */}
              <div className="relative">
                <ProductsSection
                  categoryId={category.id}
                  categorySlug={slug} // SOLUTION SÛRE : utilise directement le slug de l'URL
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  filters={filters}
                  searchParams={sanitizedSearchParams}
                />
              </div>

              <CategoryDescription category={category} />
            </main>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erreur dans CategoryPage:', error);
    
    // En cas d'erreur non gérée, rediriger vers 404
    notFound();
  }
}

// CORRECTION 4 : Configuration Next.js optimisée
export const dynamic = 'force-dynamic'; // Pour s'assurer que les paramètres sont traités côté serveur
export const revalidate = 3600;
export const runtime = 'nodejs';