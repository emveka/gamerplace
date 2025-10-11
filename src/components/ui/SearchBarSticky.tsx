// components/ui/SearchBarSticky.tsx
"use client";

import { SearchBar } from "@/components/ui/SearchBar";

interface SearchBarStickyProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBarSticky({ onSearch, className = "" }: SearchBarStickyProps) {
  return (
    <div className={`lg:hidden bg-gradient-to-r from-yellow-400 to-yellow-500 border-b border-yellow-600 sticky top-[68px] sm:top-[76px] z-40 shadow-md ${className}`}>
      <div className="mx-auto max-w-[1500px] py-1.5 sm:py-2">
        <div className="px-3 sm:px-4">
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