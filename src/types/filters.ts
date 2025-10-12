// types/filters.ts

// Interface compatible avec PaginationSearchParams
export interface SearchParams {
  page?: string;
  sort?: string;
  priceRange?: string;
  brand?: string;
  condition?: string;
  stock?: string;
  [key: string]: string | string[] | undefined;
}

// Interface pour les filtres de produits
export interface ProductFilters {
  sort?: string;
  brand?: string;
  condition?: string;
  priceRange?: string;
  stock?: string;
}

// Interface pour les éléments de breadcrumb
export interface BreadcrumbItem {
  href: string;
  label: string;
  current?: boolean;
}