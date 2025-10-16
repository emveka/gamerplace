// src/components/ui/ProductGridSkeleton.tsx
interface ProductGridSkeletonProps {
  count?: number;
}

// Skeleton pour une carte produit individuelle
function ProductCardSkeleton() {
  return (
    <article className="bg-white border border-gray-200 overflow-hidden w-full max-w-sm animate-pulse">
      {/* Image Container - Aspect ratio exact : aspect-[1000/1000] */}
      <div className="aspect-[1000/1000] bg-gray-200 relative overflow-hidden">
        {/* Placeholder pour l'image */}
        <div className="w-full h-full bg-gray-200"></div>
      </div>
      
      {/* Product Info - Padding exact : p-2 space-y-1 */}
      <div className="p-2 space-y-1">
        {/* Titre - 2 lignes avec min-h-[2.5rem] */}
        <div className="min-h-[2.5rem] space-y-1">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Spécifications - 2 à 5 lignes selon le type de produit */}
        <div className="space-y-1">
          <div className="flex items-start">
            <div className="w-1.5 h-1.5 bg-gray-300 mr-2 flex-shrink-0 mt-1.5 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="flex items-start">
            <div className="w-1.5 h-1.5 bg-gray-300 mr-2 flex-shrink-0 mt-1.5 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
          </div>
          <div className="flex items-start">
            <div className="w-1.5 h-1.5 bg-gray-300 mr-2 flex-shrink-0 mt-1.5 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        
        {/* Delivery info */}
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* Divider */}
        <hr className="border-gray-200" />
        
        {/* Price and Button container */}
        <div className="flex justify-between items-end gap-2">
          {/* Price section */}
          <div className="flex-1 min-w-0">
            <div className="min-h-[1rem] mb-1">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-20"></div>
          </div>
          
          {/* Buy button */}
          <div className="flex-shrink-0">
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProductGridSkeleton({ count = 16 }: ProductGridSkeletonProps) {
  return (
    <section className="mb-8">
      <div 
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
        role="list"
        aria-label="Chargement des produits..."
      >
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} role="listitem">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}