// components/layout/Header.tsx - MISE À JOUR avec UserMenu
"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/ui/SearchBar";
import { CartIcon } from "@/components/cart/CartIcon";
import { UserMenu } from "@/components/auth/UserMenu";
import { User } from "@/types/user";

type HeaderProps = {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
  onSearch?: (q: string) => void;
  // Props pour l'authentification
  user?: User | null;
  isAuthenticated?: boolean;
  onSignOut?: () => void;
};

export function Header({ 
  onMenuToggle, 
  isMenuOpen = false, 
  onSearch,
  user,
  isAuthenticated = false,
  onSignOut
}: HeaderProps) {
  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-lg ">
      <div className="mx-auto max-w-[1500px] py-3 sm:py-4 w-full">
        <div className="flex items-center justify-between lg:gap-20 px-1 sm:px-2 lg:px-0 gap-1 sm:gap-2">
          
          {/* Zone 1 : Hamburger (Mobile) | Hamburger + Logo (Desktop) */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 min-w-0">
            {/* Bouton Menu Hamburger */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/50 shrink-0"
              aria-label="Menu Navigation"
              aria-expanded={isMenuOpen}
              title="Menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center">
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

            {/* Logo Desktop */}
            <Link href="/" className="hidden lg:flex shrink-0 items-center gap-2">
              <Image
                src="/logogamerplace.png"
                alt="Gamerplace.ma"
                width={160}
                height={40}
                className="h-6 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Zone 2 : Logo centré (Mobile uniquement) */}
          <Link href="/" className="lg:hidden shrink-0 flex items-center gap-2">
            <Image
              src="/logogamerplace.png"
              alt="Gamerplace.ma"
              width={160}
              height={40}
              className="h-5 sm:h-6 w-auto"
              priority
            />
          </Link>

          {/* Zone milieu : SearchBar (Desktop uniquement) */}
          <SearchBar 
            className="hidden lg:block flex-1"
            onSearch={onSearch}
            placeholder="Rechercher des produits gaming..."
          />

          {/* Zone 3 : Navigation utilisateur */}
          <div className="flex items-center gap-1 sm:gap-3 lg:gap-6 min-w-0">
            {/* Menu Utilisateur - Remplace l'ancien lien Mon Compte */}
            <UserMenu 
              user={user}
              isAuthenticated={isAuthenticated}
              onSignOut={onSignOut}
            />

            {/* Mon Panier */}
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}