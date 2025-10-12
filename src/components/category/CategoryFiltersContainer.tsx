// components/category/CategoryFiltersContainer.tsx
import { CategoryFilters } from '@/components/category/CategoryFilters';
import { getAllChildCategories } from '@/services/categories';
import { getBrands } from '@/services/brands';
import { getCategoriesHierarchy } from '@/services/categories';

interface CategoryFiltersContainerProps {
  categoryId: string;
}

// Composant pour les filtres avec TOUTES les catégories
export async function CategoryFiltersContainer({ categoryId }: CategoryFiltersContainerProps) {
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