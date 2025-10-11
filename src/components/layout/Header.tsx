// components/layout/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/ui/SearchBar";

type HeaderProps = {
  onMenuToggle?: () => void; // Fonction pour gérer l'ouverture du menu hamburger
  isMenuOpen?: boolean; // État du menu pour l'animation de l'icône
  onSearch?: (q: string) => void; // Fonction de recherche
};

export function Header({ onMenuToggle, isMenuOpen = false, onSearch }: HeaderProps) {
  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="mx-auto max-w-[1500px] py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-20 px-2 sm:px-4 lg:px-0">
          
          {/* Section gauche : Bouton hamburger + Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Bouton Menu Hamburger - Visible uniquement sur mobile et tablette */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              aria-label="Menu Navigation"
              aria-expanded={isMenuOpen}
              title="Menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center">
                {/* Animation du hamburger vers X */}
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${
                  isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                }`}></span>
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${
                  isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                }`}></span>
              </div>
            </button>

            {/* Logo Gamerplace */}
            <Link href="/" className="shrink-0 flex items-center gap-2">
              <Image
                src="/logogamerplace.png"
                alt="Gamerplace.ma"
                width={200}
                height={50}
                className="h-5 sm:h-6 lg:h-7 w-auto" // Taille responsive du logo
                priority
              />
            </Link>
          </div>

          {/* SearchBar Desktop - Visible uniquement sur desktop */}
          <SearchBar 
            className="hidden lg:block flex-1"
            onSearch={onSearch}
            placeholder="Rechercher des produits gaming..."
          />

          {/* Section droite : Navigation utilisateur */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            {/* Mon Compte */}
            <Link
              href="/account"
              className="flex flex-col items-center gap-0.5 sm:gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Mon Compte"
              title="Mon Compte"
            >
              <Image
                src="/icons/Login_Icon.svg"
                alt="Mon Compte"
                width={24}
                height={24}
                className="h-5 sm:h-6 w-5 sm:w-6"
              />
              <span className="text-[10px] sm:text-xs font-medium text-white whitespace-nowrap hidden sm:block">
                Mon Compte
              </span>
              {/* Version ultra-compacte pour très petit écrans */}
              <span className="text-[9px] font-medium text-white sm:hidden">
                Compte
              </span>
            </Link>

            {/* Mon Panier */}
            <Link
              href="/cart"
              className="relative flex flex-col items-center gap-0.5 sm:gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Mon Panier"
              title="Mon Panier"
            >
              <div className="relative">
                <Image
                  src="/icons/cart.svg"
                  alt="Mon Panier"
                  width={24}
                  height={24}
                  className="h-5 sm:h-6 w-5 sm:w-6"
                />
                {/* Badge quantité adaptatif */}
                <span className="absolute -right-1.5 sm:-right-2 -top-1.5 sm:-top-2 rounded-full bg-yellow-400 px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[10px] font-semibold text-black min-w-[14px] sm:min-w-[18px] text-center">
                  0
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-white whitespace-nowrap hidden sm:block">
                Mon Panier
              </span>
              {/* Version ultra-compacte pour très petit écrans */}
              <span className="text-[9px] font-medium text-white sm:hidden">
                Panier
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}