// components/category/ProductsSection.tsx - VERSION CORRIGÉE
import { ProductSortingBar } from '@/components/product/ProductSortingBar';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Pagination } from '@/components/ui/Pagination';
import { getAllChildCategories } from '@/services/categories';
import { getProducts } from '@/services/products';
import { ProductFilters, SearchParams } from '@/types/filters';

interface ProductsSectionProps {
  categoryId: string;
  categorySlug: string; // AJOUT : On a besoin du slug pour l'URL
  currentPage: number;
  itemsPerPage: number;
  filters: ProductFilters;
  searchParams: SearchParams;
}

// Composant pour la section produits
export async function ProductsSection({
  categoryId,
  categorySlug, // NOUVEAU : slug pour l'URL
  currentPage,
  itemsPerPage,
  filters,
  searchParams
}: ProductsSectionProps) {
  try {
    // CORRECTION 1 : Validation des paramètres d'entrée avec logs détaillés
    console.log('🔍 ProductsSection - Paramètres reçus:', {
      categoryId,
      categorySlug,
      categorySlugType: typeof categorySlug,
      categorySlugExists: !!categorySlug,
      currentPage,
      itemsPerPage,
      filters,
      searchParams
    });

    if (!categoryId) {
      console.error('❌ ProductsSection: categoryId manquant');
      return (
        <div className="text-center py-8">
          <p className="text-red-500">Erreur: ID de catégorie manquant</p>
        </div>
      );
    }

    if (!categorySlug) {
      console.error('❌ ProductsSection: categorySlug manquant');
      return (
        <div className="text-center py-8">
          <p className="text-red-500">Erreur: Slug de catégorie manquant</p>
        </div>
      );
    }

    // CORRECTION 2 : Validation de la page
    const validatedPage = Math.max(1, currentPage);
    
    console.log('✅ ProductsSection - Validation OK, début récupération données');

    // Récupération des données
    const allCategoryIds = await getAllChildCategories(categoryId);
    const { products, totalCount } = await getProducts(
      allCategoryIds, 
      validatedPage, 
      itemsPerPage, 
      filters
    );
    
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    console.log('✅ ProductsSection - Données récupérées:', {
      productsCount: products.length,
      totalCount,
      totalPages,
      currentPage: validatedPage,
      allCategoryIds
    });

    // CORRECTION 3 : Validation des résultats
    if (validatedPage > totalPages && totalPages > 0) {
      console.warn('⚠️ Page demandée supérieure au nombre total de pages', {
        requestedPage: validatedPage,
        totalPages
      });
    }

    return (
      <>
        <ProductSortingBar
          totalCount={totalCount}
          currentSort={filters.sort || 'newest'}
        />
       
        <ProductGrid products={products} />
       
        {totalPages > 1 && (
          <Pagination
            currentPage={validatedPage}
            totalPages={totalPages}
            searchParams={searchParams}
            baseUrl={`/categories/${categorySlug}`} // UTILISE le slug validé
          />
        )}
        
        {/* DEBUG info en développement */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-100 text-xs text-gray-600 rounded">
            <div>🔍 Debug ProductsSection:</div>
            <div>• Page: {validatedPage}/{totalPages}</div>
            <div>• Produits: {products.length}/{totalCount}</div>
            <div>• CategoryId: {categoryId}</div>
            <div>• CategorySlug: {categorySlug}</div>
            <div>• BaseUrl: /categories/{categorySlug}</div>
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error('❌ Erreur dans ProductsSection:', error);
    
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erreur lors du chargement des produits</p>
        <p className="text-gray-500 text-sm mt-2">Erreur: {error instanceof Error ? error.message : 'Erreur inconnue'}</p>
      </div>
    );
  }
}