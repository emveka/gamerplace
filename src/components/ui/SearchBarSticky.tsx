// components/ui/SearchBarSticky.tsx
"use client";

import { SearchBar } from "@/components/ui/SearchBar";
import { useEffect, useState } from "react";

interface SearchBarStickyProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBarSticky({ onSearch, className = "" }: SearchBarStickyProps) {
  const [headerHeight, setHeaderHeight] = useState(60); // Hauteur par défaut

  useEffect(() => {
    const updateHeaderHeight = () => {
      // Chercher le header dans le DOM
      const header = document.querySelector('header');
      if (header) {
        const height = header.offsetHeight;
        setHeaderHeight(height);
      }
    };

    // Calculer la hauteur initiale
    updateHeaderHeight();

    // Recalculer lors du resize
    window.addEventListener('resize', updateHeaderHeight);
    
    // Recalculer après le premier rendu (au cas où)
    const timer = setTimeout(updateHeaderHeight, 100);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      className={`lg:hidden bg-gradient-to-r from-yellow-400 to-yellow-500 border-b border-yellow-600 sticky z-40 shadow-md ${className}`}
      style={{ 
        top: `${headerHeight}px` // ✅ Hauteur dynamique calculée
      }}
    >
      <div className="mx-auto max-w-[1500px] py-1.5 sm:py-2 w-full overflow-hidden"> {/* ✅ Ajouté w-full et overflow-hidden */}
        <div className="px-1 sm:px-2"> {/* ✅ Réduit padding pour correspondre au header */}
          {/* SearchBar Mobile - Plus compacte */}
          <div className="max-w-md mx-auto">
            <SearchBar 
              className="w-full"
              onSearch={onSearch}
              placeholder="Rechercher..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}