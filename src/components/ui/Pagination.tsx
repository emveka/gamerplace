// src/components/ui/Pagination.tsx
import Link from 'next/link';

// Interface pour les paramètres de recherche de la pagination
interface PaginationSearchParams {
  page?: string;
  sort?: string;
  priceRange?: string;
  brand?: string;
  condition?: string;
  stock?: string;
  [key: string]: string | string[] | undefined;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: PaginationSearchParams;
  baseUrl?: string;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  searchParams,
  baseUrl = ''
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const createUrl = (page: number) => {
    const params = new URLSearchParams();
    
    // Ajouter tous les paramètres de recherche existants
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.set(key, String(value));
        }
      }
    });
    
    // Gérer le paramètre page
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    
    const query = params.toString();
    return `${baseUrl}${query ? `?${query}` : ''}`;
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <nav 
      className="bg-white shadow-sm p-2 mb-6"
      aria-label="Pagination"
      role="navigation"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {currentPage} sur {totalPages}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Previous button */}
          {currentPage > 1 ? (
            <Link
              href={createUrl(currentPage - 1)}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Page précédente"
              rel="prev"
            >
              Précédent
            </Link>
          ) : (
            <span className="px-4 py-2 border border-gray-300 text-gray-400 cursor-not-allowed">
              Précédent
            </span>
          )}
          
          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getVisiblePages().map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
                    …
                  </span>
                );
              }
              
              const pageNumber = page as number;
              const isCurrentPage = currentPage === pageNumber;
              
              return isCurrentPage ? (
                <span
                  key={pageNumber}
                  className="px-3 py-2 bg-yellow-500 text-white font-medium"
                  aria-current="page"
                  aria-label={`Page ${pageNumber}, page actuelle`}
                >
                  {pageNumber}
                </span>
              ) : (
                <Link
                  key={pageNumber}
                  href={createUrl(pageNumber)}
                  className="px-3 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                  aria-label={`Aller à la page ${pageNumber}`}
                >
                  {pageNumber}
                </Link>
              );
            })}
          </div>
          
          {/* Next button */}
          {currentPage < totalPages ? (
            <Link
              href={createUrl(currentPage + 1)}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Page suivante"
              rel="next"
            >
              Suivant
            </Link>
          ) : (
            <span className="px-4 py-2 border border-gray-300 text-gray-400 cursor-not-allowed">
              Suivant
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}