// components/product/ProductSpecifications.tsx
'use client';

interface SerializedProduct {
  specifications?: { [key: string]: string };
}

interface ProductSpecificationsProps {
  product: SerializedProduct;
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  return (
    <div className="w-1/2">
      <div className="bg-white border-2 border-yellow-500 overflow-hidden">
        
        {/* Header */}
        <div className="bg-white px-4 py-3 border-b- border-yellow-500">
          <h2 className="text-lg font-bold text-black">
            Spécifications Techniques
          </h2>
          <div className="w-16 h-1 bg-yellow-500 mt-1"></div>
        </div>

        {/* Contenu des spécifications */}
        <div className="p-4 bg-gray-100">
          {product.specifications && Object.keys(product.specifications).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div 
                  key={key} 
                  className="flex justify-between items-center py-2 px-3 bg-white border border-gray-200"
                >
                  <span className="font-medium text-black text-sm">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="text-gray-700 text-sm font-medium">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-gray-400 text-2xl mb-2">📄</div>
              <p className="text-gray-500 italic text-sm">Aucune spécification technique disponible.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}