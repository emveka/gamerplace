// components/ui/SearchBar.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query as firebaseQuery, where, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  price: number;
  imageUrl?: string;
  categoryName?: string;
  brandName?: string;
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

interface FirebaseProductData {
  id: string;
  title: string;
  slug: string;
  price: number;
  images?: string[];
  primaryCategoryName?: string;
  brandName?: string;
  isActive: boolean;
  tags?: string[];
}

export function SearchBar({ 
  placeholder = "Rechercher des produits gaming...", 
  className = "",
  onSearch 
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Détection mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Fermer les résultats quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fermer les résultats lors du scroll
  useEffect(() => {
    function handleScroll() {
      setShowResults(false);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Recherche en temps réel avec Firebase - Inchangé
  useEffect(() => {
    if (searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      
      try {
        const searchTermLower = searchQuery.toLowerCase().trim();
        const searchResults: SearchResult[] = [];
        const seenIds = new Set<string>();

        // Recherche par titre
        try {
          const titleQuery = firebaseQuery(
            collection(db, 'products'),
            where('isActive', '==', true),
            where('title', '>=', searchTermLower),
            where('title', '<=', searchTermLower + '\uf8ff'),
            orderBy('title'),
            limit(6)
          );

          const titleSnapshot = await getDocs(titleQuery);
          titleSnapshot.forEach(doc => {
            const data = doc.data() as FirebaseProductData;
            const product: FirebaseProductData = { ...data, id: doc.id };
            if (!seenIds.has(product.id)) {
              searchResults.push({
                id: product.id,
                title: product.title,
                slug: product.slug,
                price: product.price,
                imageUrl: product.images?.[0],
                categoryName: product.primaryCategoryName,
                brandName: product.brandName
              });
              seenIds.add(product.id);
            }
          });
        } catch (error) {
          console.log('Recherche par titre échouée:', error);
        }

        // Recherche par marque
        if (searchResults.length < 6) {
          try {
            const brandQuery = firebaseQuery(
              collection(db, 'products'),
              where('isActive', '==', true),
              where('brandName', '>=', searchTermLower),
              where('brandName', '<=', searchTermLower + '\uf8ff'),
              orderBy('brandName'),
              limit(4)
            );

            const brandSnapshot = await getDocs(brandQuery);
            brandSnapshot.forEach(doc => {
              const data = doc.data() as FirebaseProductData;
              const product: FirebaseProductData = { ...data, id: doc.id };
              if (!seenIds.has(product.id)) {
                searchResults.push({
                  id: product.id,
                  title: product.title,
                  slug: product.slug,
                  price: product.price,
                  imageUrl: product.images?.[0],
                  categoryName: product.primaryCategoryName,
                  brandName: product.brandName
                });
                seenIds.add(product.id);
              }
            });
          } catch (error) {
            console.log('Recherche par marque échouée:', error);
          }
        }

        // Recherche par tags
        if (searchResults.length < 6) {
          try {
            const tagsQuery = firebaseQuery(
              collection(db, 'products'),
              where('isActive', '==', true),
              where('tags', 'array-contains-any', [searchTermLower]),
              limit(4)
            );

            const tagsSnapshot = await getDocs(tagsQuery);
            tagsSnapshot.forEach(doc => {
              const data = doc.data() as FirebaseProductData;
              const product: FirebaseProductData = { ...data, id: doc.id };
              if (!seenIds.has(product.id)) {
                searchResults.push({
                  id: product.id,
                  title: product.title,
                  slug: product.slug,
                  price: product.price,
                  imageUrl: product.images?.[0],
                  categoryName: product.primaryCategoryName,
                  brandName: product.brandName
                });
                seenIds.add(product.id);
              }
            });
          } catch (error) {
            console.log('Recherche par tags échouée:', error);
          }
        }

        // Limiter à 6 résultats pour mobile, 8 pour desktop
        const maxResults = isMobile ? 6 : 8;
        setResults(searchResults.slice(0, maxResults));
        setShowResults(true);

      } catch (error) {
        console.error('Erreur générale de recherche:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, isMobile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      if (onSearch) {
        onSearch(searchQuery.trim());
      } else {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      }
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Placeholder adaptatif selon la taille d'écran
  const getPlaceholder = () => {
    if (isMobile) {
      return "Rechercher...";
    }
    return placeholder;
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Barre de recherche responsive */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 relative flex items-stretch"
        role="search"
        aria-label="Recherche"
      >
        <input
          name="q"
          type="text"
          placeholder={getPlaceholder()}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          className={`w-full rounded-l bg-white text-black outline-none placeholder:text-gray-400 ${
            isMobile ? 'px-3 py-1.5 text-sm' : 'px-3 sm:px-4 py-2 text-sm'
          }`}
        />
        <button
          type="submit"
          className={`group inline-flex items-center justify-center rounded-r bg-yellow-400 hover:bg-yellow-500 transition-colors ${
            isMobile ? 'px-3 py-1.5' : 'px-3 sm:px-4 py-2'
          }`}
          aria-label="Rechercher"
        >
          <svg
            viewBox="0 0 24 24"
            className={`fill-black group-hover:opacity-80 ${
              isMobile ? 'w-4 h-4' : 'w-4 h-4 sm:w-[18px] sm:h-[18px]'
            }`}
            aria-hidden="true"
          >
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      </form>

      {/* Résultats de recherche responsives */}
      {showResults && (
        <div 
          className={`fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] overflow-y-auto ${
            isMobile 
              ? 'left-2 right-2 max-h-[70vh]' // Pleine largeur sur mobile avec marges
              : 'max-h-96' // Largeur normale sur desktop
          }`}
          style={!isMobile ? {
            top: searchRef.current ? searchRef.current.getBoundingClientRect().bottom + window.scrollY + 4 : 0,
            left: searchRef.current ? searchRef.current.getBoundingClientRect().left + window.scrollX : 0,
            width: searchRef.current ? searchRef.current.getBoundingClientRect().width : 'auto',
          } : {
            top: searchRef.current ? searchRef.current.getBoundingClientRect().bottom + window.scrollY + 4 : 0,
          }}
        >
          {isLoading ? (
            <div className={`p-4 text-center text-gray-500 ${isMobile ? 'py-8' : ''}`}>
              <div className="animate-spin w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm">Recherche en cours...</p>
            </div>
          ) : results.length > 0 ? (
            <div>
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/products/${result.slug}`}
                  onClick={handleResultClick}
                  className={`flex items-center hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                    isMobile ? 'p-3' : 'p-3'
                  }`}
                >
                  {/* Image du produit */}
                  <div className={`relative flex-shrink-0 mr-3 ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}>
                    <Image
                      src={result.imageUrl || '/placeholder-product.jpg'}
                      alt={result.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  
                  {/* Informations du produit */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-gray-900 ${
                      isMobile 
                        ? 'text-sm truncate' 
                        : 'text-sm truncate'
                    }`}>
                      {result.title}
                    </h4>
                    
                    {/* Marque et catégorie - Cachés sur très petits écrans */}
                    <p className={`text-gray-500 ${
                      isMobile 
                        ? 'text-xs truncate' 
                        : 'text-sm'
                    }`}>
                      {isMobile ? (
                        // Sur mobile, afficher seulement la marque
                        result.brandName
                      ) : (
                        // Sur desktop, afficher marque et catégorie
                        `${result.brandName} • ${result.categoryName}`
                      )}
                    </p>
                  </div>
                  
                  {/* Prix */}
                  <div className={`font-semibold text-yellow-600 ${
                    isMobile ? 'text-sm' : 'text-sm'
                  }`}>
                    {formatPrice(result.price)}
                  </div>
                </Link>
              ))}
              
              {/* Bouton voir tous les résultats */}
              <div className={`border-t border-gray-100 bg-gray-50 ${
                isMobile ? 'p-3' : 'p-3'
              }`}>
                <button
                  onClick={() => {
                    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                  }}
                  className={`text-yellow-600 hover:text-yellow-800 font-medium ${
                    isMobile ? 'text-sm w-full text-center' : 'text-sm'
                  }`}
                >
                  Voir tous les résultats pour &quot;{searchQuery}&quot;
                </button>
              </div>
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className={`text-center text-gray-500 ${
              isMobile ? 'p-6' : 'p-4'
            }`}>
              <p className="text-sm">Aucun résultat trouvé pour &quot;{searchQuery}&quot;</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}