// components/category/ProductsSection.tsx
import { ProductSortingBar } from '@/components/product/ProductSortingBar';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Pagination } from '@/components/ui/Pagination';
import { getAllChildCategories } from '@/services/categories';
import { getProducts } from '@/services/products';
import { ProductFilters, SearchParams } from '@/types/filters';

interface ProductsSectionProps {
  categoryId: string;
  currentPage: number;
  itemsPerPage: number;
  filters: ProductFilters;
  searchParams: SearchParams;
}

// Composant pour la section produits
export async function ProductsSection({
  categoryId,
  currentPage,
  itemsPerPage,
  filters,
  searchParams
}: ProductsSectionProps) {
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