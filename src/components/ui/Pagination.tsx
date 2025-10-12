// src/components/ui/Pagination.tsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
  // État pour gérer la détection mobile côté client
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Effet pour détecter la taille d'écran côté client
  useEffect(() => {
    setIsClient(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Vérification initiale
    checkMobile();
    
    // Écouter les changements de taille
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Version desktop : avec détection mobile sécurisée
  const getVisiblePages = () => {
    // Utiliser l'état mobile au lieu d'accéder directement à window
    const delta = isMobile ? 1 : 2;
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

  // Version simplifiée pour mobile avec moins de pages
  const getMobileVisiblePages = () => {
    const visiblePages: (number | string)[] = [];
    
    // Afficher maximum 5 éléments sur mobile
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Logique simplifiée pour mobile
      if (currentPage <= 3) {
        visiblePages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        visiblePages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        visiblePages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    
    return visiblePages;
  };

  // Affichage conditionnel basé sur l'état client et mobile
  if (!isClient) {
    // Rendu côté serveur : version simple sans détection mobile
    return (
      <nav 
        className="bg-white shadow-sm p-4 mb-6"
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
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors rounded"
                aria-label="Page précédente"
                rel="prev"
              >
                Précédent
              </Link>
            ) : (
              <span className="px-4 py-2 border border-gray-300 text-gray-400 cursor-not-allowed rounded">
                Précédent
              </span>
            )}
            
            {/* Current page indicator */}
            <span className="px-3 py-2 bg-yellow-500 text-white font-medium rounded">
              {currentPage}
            </span>
            
            {/* Next button */}
            {currentPage < totalPages ? (
              <Link
                href={createUrl(currentPage + 1)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors rounded"
                aria-label="Page suivante"
                rel="next"
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

  return (
    <nav 
      className="bg-white shadow-sm p-2 sm:p-4 mb-4 sm:mb-6"
      aria-label="Pagination"
      role="navigation"
    >
      {/* Version mobile : layout vertical pour très petits écrans */}
      <div className="block sm:hidden">
        {/* Indicateur de page mobile */}
        <div className="text-xs text-gray-600 text-center mb-3">
          Page {currentPage} sur {totalPages}
        </div>
        
        {/* Boutons navigation mobile */}
        <div className="flex items-center justify-between mb-3">
          {/* Previous button mobile */}
          {currentPage > 1 ? (
            <Link
              href={createUrl(currentPage - 1)}
              className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 hover:bg-gray-50 transition-colors rounded"
              aria-label="Page précédente"
              rel="prev"
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

        {/* Page numbers mobile - version compacte */}
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
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Version desktop : layout horizontal */}
      <div className="hidden sm:flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {currentPage} sur {totalPages}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Previous button desktop */}
          {currentPage > 1 ? (
            <Link
              href={createUrl(currentPage - 1)}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors rounded"
              aria-label="Page précédente"
              rel="prev"
            >
              Précédent
            </Link>
          ) : (
            <span className="px-4 py-2 border border-gray-300 text-gray-400 cursor-not-allowed rounded">
              Précédent
            </span>
          )}
          
          {/* Page numbers desktop */}
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
                >
                  {pageNumber}
                </Link>
              );
            })}
          </div>
          
          {/* Next button desktop */}
          {currentPage < totalPages ? (
            <Link
              href={createUrl(currentPage + 1)}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors rounded"
              aria-label="Page suivante"
              rel="next"
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