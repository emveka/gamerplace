// src/components/category/CategoryFilters.tsx - Version optimisée avec sidebar réduit
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { Brand } from '@/types/brand';
import { Category } from '@/types/category';
import Image from 'next/image';
import Link from 'next/link';

// Interface pour une catégorie avec ses enfants
interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

interface CategoryFiltersProps {
  brands: Brand[];
  categoriesHierarchy: CategoryWithChildren[];
  currentCategoryId: string;
}

// Composant pour afficher une catégorie avec ses enfants (version compacte et pliable)
const CategoryTreeNode = ({ 
  category, 
  currentCategoryId, 
  level = 0,
  onCategoryClick 
}: { 
  category: CategoryWithChildren; 
  currentCategoryId: string;
  level?: number;
  onCategoryClick?: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCurrentCategory = category.id === currentCategoryId;
  const hasChildren = category.children.length > 0;
  
  // Auto-expand si la catégorie actuelle ou un de ses enfants est sélectionné
  useEffect(() => {
    const isCurrentOrParentOfCurrent = (cat: CategoryWithChildren): boolean => {
      if (cat.id === currentCategoryId) return true;
      return cat.children.some(child => isCurrentOrParentOfCurrent(child));
    };
    
    if (hasChildren && isCurrentOrParentOfCurrent(category)) {
      setIsExpanded(true);
    }
  }, [currentCategoryId, category, hasChildren]);
  
  return (
    <div>
      <div className="flex items-center gap-0.5">
        {/* Bouton expand/collapse pour les catégories avec enfants */}
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 w-3.5 h-3.5 flex items-center justify-center"
            type="button"
            aria-label={isExpanded ? 'Réduire' : 'Développer'}
          >
            <svg 
              className={`w-3 h-3 text-yellow-500 transform transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        
        {/* Spacer pour aligner les catégories sans enfants */}
        {!hasChildren && <div className="w-3.5" />}
        
        <Link
          href={`/categories/${category.slug}`}
          className={`flex-1 block text-[11px] py-1.5 px-1.5 rounded transition-colors ${
            isCurrentCategory
              ? 'bg-yellow-100 text-yellow-800 font-medium'
              : 'text-gray-700 hover:text-yellow-600'
          }`}
          onClick={onCategoryClick}
          style={{ paddingLeft: `${3 + (level * 8)}px` }}
        >
          <div className="flex items-center gap-1">
            <span className={`text-[11px] leading-tight truncate ${
              level === 0 ? 'font-extrabold' : level === 1 ? 'font-bold' : ''
            }`}>
              {category.name}
            </span>
          </div>
        </Link>
      </div>
      
      {/* Afficher les enfants si développé */}
      {hasChildren && isExpanded && (
        <div className="mt-0.5">
          {category.children.map(child => (
            <CategoryTreeNode
              key={child.id}
              category={child}
              currentCategoryId={currentCategoryId}
              level={level + 1}
              onCategoryClick={onCategoryClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function CategoryFilters({ 
  brands, 
  categoriesHierarchy,
  currentCategoryId 
}: CategoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStock, setSelectedStock] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // État pour les sections pliables
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: false,
    brands: false,
    stock: false,
  });

  useEffect(() => {
    const urlPriceRange = searchParams.get('priceRange');
    const urlBrand = searchParams.get('brand');
    const urlStock = searchParams.get('stock');

    setSelectedPriceRanges(urlPriceRange ? urlPriceRange.split(',').filter(Boolean) : []);
    setSelectedBrands(urlBrand ? urlBrand.split(',').filter(Boolean) : []);
    setSelectedStock(urlStock ? urlStock.split(',').filter(Boolean) : []);
  }, [searchParams]);

  // Fermer le drawer quand on clique dehors ou sur Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDrawerOpen(false);
    };
    
    if (isDrawerOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const priceRanges = [
    { value: '0-5000', label: 'Moins de 5000 DH' },
    { value: '5000-10000', label: '5000 - 10000 DH' },
    { value: '10000-15000', label: '10000 - 15000 DH' },
    { value: '15000-999999', label: 'Plus de 15000 DH' },
  ];

  const stockOptions = [
    { value: 'in-stock', label: 'En stock' },
    { value: 'out-of-stock', label: 'Rupture de stock' },
  ];

  const updateURL = useCallback((filters: {
    priceRange: string[];
    brand: string[];
    stock: string[];
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.delete('page');
    
    if (filters.priceRange.length > 0) {
      params.set('priceRange', filters.priceRange.join(','));
    } else {
      params.delete('priceRange');
    }
    
    if (filters.brand.length > 0) {
      params.set('brand', filters.brand.join(','));
    } else {
      params.delete('brand');
    }
    
    if (filters.stock.length > 0) {
      params.set('stock', filters.stock.join(','));
    } else {
      params.delete('stock');
    }
    
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const handleFilterChange = useCallback((
    type: 'price' | 'brand' | 'stock',
    value: string,
    checked: boolean
  ) => {
    let newPriceRanges = selectedPriceRanges;
    let newBrands = selectedBrands;
    let newStock = selectedStock;
    
    switch (type) {
      case 'price':
        newPriceRanges = checked 
          ? [...selectedPriceRanges, value]
          : selectedPriceRanges.filter(p => p !== value);
        setSelectedPriceRanges(newPriceRanges);
        break;
        
      case 'brand':
        newBrands = checked 
          ? [...selectedBrands, value]
          : selectedBrands.filter(b => b !== value);
        setSelectedBrands(newBrands);
        break;
        
      case 'stock':
        newStock = checked 
          ? [...selectedStock, value]
          : selectedStock.filter(s => s !== value);
        setSelectedStock(newStock);
        break;
    }
    
    updateURL({
      priceRange: newPriceRanges,
      brand: newBrands,
      stock: newStock
    });
  }, [selectedPriceRanges, selectedBrands, selectedStock, updateURL]);

  const clearFilters = useCallback(() => {
    setSelectedPriceRanges([]);
    setSelectedBrands([]);
    setSelectedStock([]);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete('priceRange');
    params.delete('brand');
    params.delete('stock');
    params.delete('page');
    
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const hasActiveFilters = selectedPriceRanges.length > 0 || 
                          selectedBrands.length > 0 || 
                          selectedStock.length > 0;

  const totalCategories = categoriesHierarchy.reduce((total, cat) => {
    const countChildren = (category: CategoryWithChildren): number => {
      return 1 + category.children.reduce((sum, child) => sum + countChildren(child), 0);
    };
    return total + countChildren(cat);
  }, 0);
  
  const showCategoriesSection = categoriesHierarchy.length > 0;
  const totalActiveFilters = selectedPriceRanges.length + selectedBrands.length + selectedStock.length;

  // Composant pour une section pliable
  const CollapsibleSection = ({ 
    id, 
    title, 
    count, 
    children 
  }: { 
    id: string; 
    title: string; 
    count?: number; 
    children: React.ReactNode; 
  }) => (
    <div>
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between py-2 text-left px-2 lg:px-0"
        type="button"
      >
        <span className="font-medium text-gray-900 text-sm">
          {title} {count !== undefined && `(${count})`}
        </span>
        <svg 
          className={`w-4 h-4 text-yellow-500 transform transition-transform ${
            expandedSections[id] ? 'rotate-45' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      
      {expandedSections[id] && (
        <div className="pb-3 px-2 lg:px-0">
          {children}
        </div>
      )}
    </div>
  );

  const FiltersContent = () => (
    <div>
      {/* Navigation Catégories hiérarchique compacte */}
      {showCategoriesSection && (
        <CollapsibleSection id="categories" title="Catégories">
          <div className="space-y-1">
            {categoriesHierarchy.map(category => (
              <CategoryTreeNode
                key={category.id}
                category={category}
                currentCategoryId={currentCategoryId}
                level={0}
                onCategoryClick={() => setIsDrawerOpen(false)}
              />
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Prix */}
      <CollapsibleSection id="price" title="Prix">
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.value} className="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500 focus:ring-2"
                checked={selectedPriceRanges.includes(range.value)}
                onChange={(e) => handleFilterChange('price', range.value, e.target.checked)}
              />
              <span className="ml-3 text-[11px] text-gray-700 font-bold">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </CollapsibleSection>
      
      {/* Marques */}
      {brands.length > 0 && (
        <CollapsibleSection id="brands" title="Marque">
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500 focus:ring-2"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={(e) => handleFilterChange('brand', brand.id, e.target.checked)}
                />
                <div className="ml-3 flex items-center gap-2 flex-1">
                  {brand.logoUrl && (
                    <div className="w-4 h-4 relative flex-shrink-0">
                      <Image
                        src={brand.logoUrl}
                        alt={brand.name}
                        fill
                        className="object-contain"
                        sizes="16px"
                      />
                    </div>
                  )}
                  <span className="text-[11px] text-gray-700 font-bold truncate">
                    {brand.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </CollapsibleSection>
      )}
      
      {/* Stock */}
      <CollapsibleSection id="stock" title="Disponibilité">
        <div className="space-y-2">
          {stockOptions.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-500 focus:ring-2"
                checked={selectedStock.includes(option.value)}
                onChange={(e) => handleFilterChange('stock', option.value, e.target.checked)}
              />
              <span className="ml-3 text-[11px] text-gray-700 font-bold">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Largeur réduite au maximum */}
      <aside className="hidden lg:block w-48 flex-shrink-0">
        <div className="bg-white sticky top-6">
          <div className="flex items-center justify-between p-3">
            <h2 className="text-base font-semibold text-gray-900">Filtres</h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-yellow-600 hover:text-yellow-700 font-medium"
                type="button"
              >
                Effacer
              </button>
            )}
          </div>
          
          <FiltersContent />

          {/* Filtres actifs */}
          {hasActiveFilters && (
            <div className="p-3">
              <div className="flex flex-wrap gap-1.5">
                {selectedPriceRanges.map(range => {
                  const rangeObj = priceRanges.find(r => r.value === range);
                  return (
                    <span key={range} className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-[11px] font-medium rounded">
                      {rangeObj?.label}
                    </span>
                  );
                })}
                {selectedBrands.map(brandId => {
                  const brand = brands.find(b => b.id === brandId);
                  return (
                    <span key={brandId} className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-[11px] font-medium rounded">
                      {brand?.name}
                    </span>
                  );
                })}
                {selectedStock.map(stock => {
                  const stockObj = stockOptions.find(s => s.value === stock);
                  return (
                    <span key={stock} className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-[11px] font-medium rounded">
                      {stockObj?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Floating Button */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="lg:hidden fixed bottom-5 right-5 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg shadow-lg z-40 transition-all duration-200 active:scale-95"
        type="button"
        aria-label="Ouvrir les filtres"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Filtres</span>
          {/* Badge pour les filtres actifs */}
          {totalActiveFilters > 0 && (
            <span className="bg-red-500 text-white text-[11px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {totalActiveFilters}
            </span>
          )}
        </div>
      </button>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-64 max-w-[85vw] bg-white shadow-xl transform transition-transform">
            {/* Header */}
            <div className="flex items-center justify-between p-3">
              <h2 className="text-base font-semibold text-gray-900">Filtres</h2>
              <div className="flex items-center gap-2.5">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-yellow-600 hover:text-yellow-700 font-medium"
                    type="button"
                  >
                    Effacer
                  </button>
                )}
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-md"
                  type="button"
                  aria-label="Fermer les filtres"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto h-full pb-16">
              <FiltersContent />
              
              {/* Filtres actifs */}
              {hasActiveFilters && (
                <div className="p-3">
                  <h4 className="text-xs font-medium text-gray-900 mb-2">Filtres actifs</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPriceRanges.map(range => {
                      const rangeObj = priceRanges.find(r => r.value === range);
                      return (
                        <span key={range} className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-[11px] font-medium rounded">
                          {rangeObj?.label}
                        </span>
                      );
                    })}
                    {selectedBrands.map(brandId => {
                      const brand = brands.find(b => b.id === brandId);
                      return (
                        <span key={brandId} className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-[11px] font-medium rounded">
                          {brand?.name}
                        </span>
                      );
                    })}
                    {selectedStock.map(stock => {
                      const stockObj = stockOptions.find(s => s.value === stock);
                      return (
                        <span key={stock} className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-[11px] font-medium rounded">
                          {stockObj?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}