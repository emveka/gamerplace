// components/product/ProductInfoDetails.tsx

import React from 'react';
import { SerializedProduct } from '@/utils/serialization';

interface ProductInfoDetailsProps {
  product: SerializedProduct;
}

// Template pour les informations de base du produit
const ProductInfoTemplate = [
  { key: 'designation', label: 'Désignation', getValue: (product: SerializedProduct) => product.title },
  { key: 'marque', label: 'Marque', getValue: (product: SerializedProduct) => product.brandName },
  { key: 'reference', label: 'Référence', getValue: (product: SerializedProduct) => product.sku },
  { key: 'barcode', label: 'Code-barres', getValue: (product: SerializedProduct) => product.barcode },
  { key: 'categorie', label: 'Catégorie', getValue: (product: SerializedProduct) => product.primaryCategoryName },
  { key: 'prix', label: 'Prix', getValue: (product: SerializedProduct) => `${product.price} MAD` },
  { key: 'stock', label: 'Stock', getValue: (product: SerializedProduct) => {
    if (product.stock > 0) {
      return 'En Stock';
    }
    return 'Rupture de stock';
  }},
  { key: 'nouveau', label: 'Nouveauté', getValue: (product: SerializedProduct) => product.isNewArrival ? 'Oui' : 'Non' },
  // ✅ Ligne personnalisable - vous pouvez décommenter et modifier selon vos besoins
  // { key: 'custom', label: 'Votre label', getValue: (product: SerializedProduct) => 'Votre valeur' },
];

export const ProductInfoDetails: React.FC<ProductInfoDetailsProps> = ({ product }) => {
  // Filtrer les informations qui ont des valeurs
  const availableInfo = ProductInfoTemplate.filter(info => {
    const value = info.getValue(product);
    return value && value !== '' && value !== 'Non' && value !== '0' && value !== 'undefined MAD';
  });
  
  if (availableInfo.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Titre séparé comme les autres sections */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900 border-l-4 border-yellow-500 pl-3 md:pl-4">
        Informations du {product.title}
      </h2>
      
      {/* Tableau des informations */}
      <div className="bg-white border border-gray-200 shadow-sm">
        <div className="p-3 md:p-6">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-100">
                {availableInfo.map((info, index) => {
                  const value = info.getValue(product);
                  const isStock = info.key === 'stock';
                  const isOutOfStock = isStock && product.stock <= 0;
                  
                  return (
                    <tr 
                      key={info.key} 
                      className={`
                        ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} 
                        hover:bg-yellow-50 transition-colors duration-200
                      `}
                    >
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-700 w-1/2">
                        <span>{info.label}</span>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900 font-semibold">
                        <span className={`
                          ${isOutOfStock ? 'text-red-600' : ''}
                          ${isStock && product.stock > 0 ? 'text-green-600' : ''}
                          ${!isStock ? 'text-gray-900' : ''}
                        `}>
                          {value}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};