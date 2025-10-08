// src/components/product/ProductSortingBar.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface ProductSortingBarProps {
  totalCount: number;
  currentSort: string;
}

export function ProductSortingBar({ totalCount, currentSort }: ProductSortingBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: 'newest', label: 'Plus récent' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'popular', label: 'Popularité' },
    { value: 'name-asc', label: 'Nom A-Z' },
    { value: 'name-desc', label: 'Nom Z-A' },
  ];

  const handleSortChange = useCallback((sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue === 'newest') {
      params.delete('sort');
    } else {
      params.set('sort', sortValue);
    }
    params.delete('page'); // Reset page when sorting changes
    
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  return (
    <section 
      className="bg-white shadow-sm p-2 mb-2"
      aria-label="Options de tri"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600" role="status" aria-live="polite">
            <strong>{totalCount.toLocaleString()}</strong> produit{totalCount > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm text-gray-600">
            Trier par:
          </label>
          <select
            id="sort-select"
            className="text-sm border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            aria-label="Trier les produits"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}