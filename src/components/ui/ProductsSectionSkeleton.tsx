// src/components/ui/ProductsSectionSkeleton.tsx
import { ProductGridSkeleton } from './ProductGridSkeleton';

interface ProductsSectionSkeletonProps {
  itemsPerPage: number;
}

// Skeleton pour ProductSortingBar - exact same structure
function ProductSortingBarSkeleton() {
  return (
    <section 
      className="bg-white shadow-sm p-2 mb-2"
      aria-label="Chargement des options de tri"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-7 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

// Skeleton complet pour toute la section produits
export function ProductsSectionSkeleton({ itemsPerPage }: ProductsSectionSkeletonProps) {
  return (
    <>
      {/* Skeleton pour ProductSortingBar */}
      <ProductSortingBarSkeleton />
      
      {/* Skeleton pour ProductGrid */}
      <ProductGridSkeleton count={itemsPerPage} />
      
      {/* Pas de skeleton pour pagination car elle dépend des données */}
    </>
  );
}