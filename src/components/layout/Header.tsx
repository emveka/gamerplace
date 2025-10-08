"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/ui/SearchBar";

type HeaderProps = {
  onSearch?: (q: string) => void;
};

export function Header({ onSearch }: HeaderProps) {
  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="mx-auto max-w-[1500px] py-4">
        <div className="flex items-center gap-20">
          {/* Logo Gamerplace */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <Image
              src="/logogamerplace.png"
              alt="Gamerplace.ma"
              width={200}
              height={50}
              className="h-6 w-auto"
              priority
            />
          </Link>

          {/* SearchBar avec suggestions */}
          <SearchBar 
            className="flex-1"
            onSearch={onSearch}
            placeholder="Rechercher des produits gaming..."
          />

          {/* Navigation utilisateur */}
          <div className="ml-2 flex items-center gap-6">
            {/* Mon Compte */}
            <Link
              href="/account"
              className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Mon Compte"
              title="Mon Compte"
            >
              <Image
                src="/icons/Login_Icon.svg"
                alt="Mon Compte"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="text-xs font-medium text-white whitespace-nowrap">
                Mon Compte
              </span>
            </Link>

            {/* Mon Panier */}
            <Link
              href="/cart"
              className="relative flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Mon Panier"
              title="Mon Panier"
            >
              <div className="relative">
                <Image
                  src="/icons/cart.svg"
                  alt="Mon Panier"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                {/* Badge quantité en jaune */}
                <span className="absolute -right-2 -top-2 rounded-full bg-yellow-400 px-1.5 py-0.5 text-[10px] font-semibold text-black min-w-[18px] text-center">
                  0
                </span>
              </div>
              <span className="text-xs font-medium text-white whitespace-nowrap">
                Mon Panier
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}