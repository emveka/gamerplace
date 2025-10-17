// src/components/ui/Pagination.tsx - VERSION CORRIGÉE (utilise vos types existants)
import Link from 'next/link';
import { SearchParams } from '@/types/filters';
import { createPaginationUrl } from '@/utils/searchParamsUtils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: SearchParams;
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

  // Utilise la fonction utilitaire pour créer les URLs
  const createUrl = (page: number) => createPaginationUrl(searchParams, page, baseUrl);

  // CORRECTION 4 : Validation des pages
  const isValidPage = (page: number) => {
    return page >= 1 && page <= totalPages && Number.isInteger(page);
  };

  // Version responsive PURE SSR (sans détection client)
  const getVisiblePages = () => {
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    // Ajout de la première page si elle n'est pas dans la range
    if (currentPage > 3) {
      rangeWithDots.push(1);
      if (currentPage > 4) {
        rangeWithDots.push('...');
      }
    } else {
      rangeWithDots.push(1);
    }

    // Pages autour de la page actuelle
    for (let i = Math.max(2, currentPage - 1); 
         i <= Math.min(totalPages - 1, currentPage + 1); 
         i++) {
      if (i !== 1 && i !== totalPages) {
        range.push(i);
      }
    }

    rangeWithDots.push(...range);

    // Ajout de la dernière page si elle n'est pas dans la range
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(totalPages);
    } else if (totalPages > 1 && !rangeWithDots.includes(totalPages)) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Version mobile simplifiée
  const getMobileVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 2) {
      return [1, 2, '...', totalPages];
    } else if (currentPage >= totalPages - 1) {
      return [1, '...', totalPages - 1, totalPages];
    } else {
      return [1, '...', currentPage, '...', totalPages];
    }
  };

  return (
    <nav 
      className="bg-white shadow-sm p-2 sm:p-4 mb-4 sm:mb-6"
      aria-label="Pagination"
      role="navigation"
    >
      {/* Version mobile */}
      <div className="block sm:hidden">
        <div className="text-xs text-gray-600 text-center mb-3">
          Page {currentPage} sur {totalPages}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          {/* Previous button mobile */}
          {currentPage > 1 ? (
            <Link
              href={createUrl(currentPage - 1)}
              className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 hover:bg-gray-50 transition-colors rounded"
              aria-label="Page précédente"
              rel="prev"
              prefetch={true}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Préc.
            </Link>
          ) : (
            <span className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 text-gray-400 cursor-not-allowed rounded">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Préc.
            </span>
          )}

          {/* Next button mobile */}
          {currentPage < totalPages ? (
            <Link
              href={createUrl(currentPage + 1)}
              className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 hover:bg-gray-50 transition-colors rounded"
              aria-label="Page suivante"
              rel="next"
              prefetch={true}
            >
              Suiv.
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <span className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 text-gray-400 cursor-not-allowed rounded">
              Suiv.
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </div>

        {/* Page numbers mobile */}
        <div className="flex items-center justify-center gap-1">
          {getMobileVisiblePages().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`dots-${index}`} className="px-2 py-1 text-gray-500 text-sm">
                  …
                </span>
              );
            }
            
            const pageNumber = page as number;
            const isCurrentPage = currentPage === pageNumber;
            
            return isCurrentPage ? (
              <span
                key={pageNumber}
                className="px-2 py-1 bg-yellow-500 text-white font-medium text-sm rounded min-w-[32px] text-center"
                aria-current="page"
                aria-label={`Page ${pageNumber}, page actuelle`}
              >
                {pageNumber}
              </span>
            ) : (
              <Link
                key={pageNumber}
                href={createUrl(pageNumber)}
                className="px-2 py-1 border border-gray-300 hover:bg-gray-50 transition-colors text-sm rounded min-w-[32px] text-center"
                aria-label={`Aller à la page ${pageNumber}`}
                prefetch={true}
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Version desktop */}
      <div className="hidden sm:flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {currentPage} sur {totalPages}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Previous button */}
          {currentPage > 1 ? (
            <Link
              href={createUrl(currentPage - 1)}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors rounded"
              aria-label="Page précédente"
              rel="prev"
              prefetch={true}
            >
              Précédent
            </Link>
          ) : (
            <span className="px-4 py-2 border border-gray-300 text-gray-400 cursor-not-allowed rounded">
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
                  className="px-3 py-2 bg-yellow-500 text-white font-medium rounded"
                  aria-current="page"
                  aria-label={`Page ${pageNumber}, page actuelle`}
                >
                  {pageNumber}
                </span>
              ) : (
                <Link
                  key={pageNumber}
                  href={createUrl(pageNumber)}
                  className="px-3 py-2 border border-gray-300 hover:bg-gray-50 transition-colors rounded"
                  aria-label={`Aller à la page ${pageNumber}`}
                  prefetch={true}
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
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors rounded"
              aria-label="Page suivante"
              rel="next"
              prefetch={true}
            >
              Suivant
            </Link>
          ) : (
            <span className="px-4 py-2 border border-gray-300 text-gray-400 cursor-not-allowed rounded">
              Suivant
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}