"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";



// Types pour les éléments du menu
type SubMenuItem = {
  label: string;
  href: string;
};

// Type mis à jour pour inclure titleHref
type MenuCategory = {
  title: string;
  titleHref?: string; // Nouveau champ optionnel
  items: SubMenuItem[];
};

type MenuItem = {
  label: string;
  href: string;
  isSpecial?: boolean;
  specialColor?: string;
  hasMegaMenu?: boolean;
  megaMenuCategories?: MenuCategory[];
  megaMenuImage?: {
    src: string;
    alt: string;
    title: string;
    subtitle: string;
  };
};

// Configuration des mega menus pour vos catégories gaming
const pcGamersMenu: MenuCategory[] = [
  {
    title: "PC Gamer AMD",
    titleHref: "/categories/pc-gamer-amd", // Nouveau champ pour le lien du titre
    items: [
      { label: "PC Gamer AMD Ryzen 3", href: "/categories/pc-gamer-amd-ryzen-3" },
      { label: "PC Gamer AMD Ryzen 5", href: "/categories/pc-gamer-amd-ryzen-5" },
      { label: "PC Gamer AMD Ryzen 7", href: "/categories/pc-gamer-amd-ryzen-7" },
      { label: "PC Gamer AMD Ryzen 9", href: "/categories/pc-gamer-amd-ryzen-9" },
      
    ]
  },
  {
    title: "PC Gamer INTEL ",
    titleHref: "/categories/pc-gamer-intel", // Nouveau champ pour le lien du titre
    items: [
      { label: "PC GAMER INTEL Core i3", href: "/categories/pc-gamer-intel-core-i3" },
      { label: "PC GAMER INTEL Core i5", href: "/categories/pc-gamer-intel-core-i5" },
      { label: "PC GAMER INTEL Core i7", href: "/categories/pc-gamer-intel-core-i7" },
      { label: "PC GAMER INTEL Core i9", href: "/categories/pc-gamer-intel-core-i9" },
    ]
  },
  {
    title: "PC Gamer PRO",
    titleHref: "/categories/pc-gamer-professionnel", // Nouveau champ pour le lien du titre
    items: [
      { label: "PC GAMER Ia", href: "/categories/pc-gamer-for-ia" },
      { label: "PC GAMER Architects", href: "/categories/pc-gamer-for-architects" },
      { label: "PC GAMER Streamers", href: "/categories/pc-gamer-for-streamers" },
      { label: "PC GAMER Designers", href: "/categories/pc-gamer-for-designers" },
      { label: "PC GAMER Business", href: "/categories/pc-gamer-for-music-producers" },
      { label: "PC GAMER Developers", href: "/categories/pc-gamer-for-developers" },
      
    ]
  }
];

const setupGamersMenu: MenuCategory[] = [
  {
    title: "Écrans Gaming",
    items: [
      { label: "Écrans 4K Gaming", href: "/setup-gamers/ecrans-4k" },
      { label: "Écrans 1440p 144Hz", href: "/setup-gamers/ecrans-1440p" },
      { label: "Écrans 1080p 240Hz", href: "/setup-gamers/ecrans-240hz" },
      { label: "Écrans Ultrawide", href: "/setup-gamers/ultrawide" },
      { label: "Écrans OLED", href: "/setup-gamers/oled" },
    ]
  },
  {
    title: "Audio Gaming",
    items: [
      { label: "Casques Gaming", href: "/setup-gamers/casques" },
      { label: "Enceintes Gaming", href: "/setup-gamers/enceintes" },
      { label: "Microphones", href: "/setup-gamers/microphones" },
      { label: "Cartes Son", href: "/setup-gamers/cartes-son" },
    ]
  },
  {
    title: "Éclairage RGB",
    items: [
      { label: "Bandes LED RGB", href: "/setup-gamers/led-rgb" },
      { label: "Éclairage Ambiant", href: "/setup-gamers/eclairage" },
      { label: "Accessoires RGB", href: "/setup-gamers/accessoires-rgb" },
    ]
  }
];

const laptopGamersMenu: MenuCategory[] = [
  {
    title: "Laptops RTX",
    items: [
      { label: "Laptops RTX 4090", href: "/laptop-gamers/rtx-4090" },
      { label: "Laptops RTX 4080", href: "/laptop-gamers/rtx-4080" },
      { label: "Laptops RTX 4070", href: "/laptop-gamers/rtx-4070" },
      { label: "Laptops RTX 4060", href: "/laptop-gamers/rtx-4060" },
    ]
  },
  {
    title: "Marques",
    items: [
      { label: "ASUS ROG", href: "/laptop-gamers/asus-rog" },
      { label: "MSI Gaming", href: "/laptop-gamers/msi" },
      { label: "Alienware", href: "/laptop-gamers/alienware" },
      { label: "Razer Blade", href: "/laptop-gamers/razer" },
      { label: "HP Omen", href: "/laptop-gamers/hp-omen" },
    ]
  },
  {
    title: "Accessoires",
    items: [
      { label: "Refroidisseurs", href: "/laptop-gamers/refroidisseurs" },
      { label: "Sacs Gaming", href: "/laptop-gamers/sacs" },
      { label: "Supports", href: "/laptop-gamers/supports" },
    ]
  }
];

const composantsMenu: MenuCategory[] = [
  {
    title: "Cartes Graphiques",
    items: [
      { label: "NVIDIA RTX 40 Series", href: "/composants/rtx-40" },
      { label: "NVIDIA RTX 30 Series", href: "/composants/rtx-30" },
      { label: "AMD Radeon RX 7000", href: "/composants/rx-7000" },
      { label: "AMD Radeon RX 6000", href: "/composants/rx-6000" },
    ]
  },
  {
    title: "Processeurs",
    items: [
      { label: "Intel 13ème Génération", href: "/composants/intel-13gen" },
      { label: "Intel 12ème Génération", href: "/composants/intel-12gen" },
      { label: "AMD Ryzen 7000", href: "/composants/ryzen-7000" },
      { label: "AMD Ryzen 5000", href: "/composants/ryzen-5000" },
    ]
  },
  {
    title: "Mémoire & Stockage",
    items: [
      { label: "RAM DDR5", href: "/composants/ram-ddr5" },
      { label: "RAM DDR4", href: "/composants/ram-ddr4" },
      { label: "SSD NVMe", href: "/composants/ssd-nvme" },
      { label: "SSD SATA", href: "/composants/ssd-sata" },
    ]
  },
  {
    title: "Cartes Mères",
    items: [
      { label: "Intel Z790", href: "/composants/z790" },
      { label: "Intel B760", href: "/composants/b760" },
      { label: "AMD X670E", href: "/composants/x670e" },
      { label: "AMD B650", href: "/composants/b650" },
    ]
  }
];

const peripheriquesMenu: MenuCategory[] = [
  {
    title: "Souris Gaming",
    items: [
      { label: "Souris Sans Fil", href: "/peripheriques/souris-wireless" },
      { label: "Souris Filaires", href: "/peripheriques/souris-filaires" },
      { label: "Tapis de Souris", href: "/peripheriques/tapis-souris" },
    ]
  },
  {
    title: "Claviers Gaming",
    items: [
      { label: "Claviers Mécaniques", href: "/peripheriques/claviers-mecaniques" },
      { label: "Claviers Sans Fil", href: "/peripheriques/claviers-wireless" },
      { label: "Switches Mécaniques", href: "/peripheriques/switches" },
    ]
  },
  {
    title: "Manettes",
    items: [
      { label: "Xbox Controller", href: "/peripheriques/xbox-controller" },
      { label: "PlayStation Controller", href: "/peripheriques/ps-controller" },
      { label: "Manettes Pro", href: "/peripheriques/manettes-pro" },
    ]
  }
];

const consolesMenu: MenuCategory[] = [
  {
    title: "PlayStation",
    items: [
      { label: "PlayStation 5", href: "/consoles/ps5" },
      { label: "PlayStation 5 Slim", href: "/consoles/ps5-slim" },
      { label: "Accessoires PS5", href: "/consoles/accessoires-ps5" },
      { label: "Jeux PS5", href: "/consoles/jeux-ps5" },
    ]
  },
  {
    title: "Xbox",
    items: [
      { label: "Xbox Series X", href: "/consoles/xbox-series-x" },
      { label: "Xbox Series S", href: "/consoles/xbox-series-s" },
      { label: "Accessoires Xbox", href: "/consoles/accessoires-xbox" },
      { label: "Game Pass", href: "/consoles/game-pass" },
    ]
  },
  {
    title: "Nintendo",
    items: [
      { label: "Nintendo Switch", href: "/consoles/nintendo-switch" },
      { label: "Nintendo Switch OLED", href: "/consoles/switch-oled" },
      { label: "Jeux Nintendo", href: "/consoles/jeux-nintendo" },
    ]
  }
];

// Configuration du menu principal avec vos vraies catégories
const menuItems: MenuItem[] = [
  {
    label: "PC GAMERS",
    href: "/categories/pc-gamer",
    hasMegaMenu: true,
    megaMenuCategories: pcGamersMenu,
    megaMenuImage: {
      src: "/images/pc-gaming-promo.webp",
      alt: "PC Gaming",
      title: "PC Gaming",
      subtitle: "Haute Performance"
    }
  },
  {
    label: "SETUP GAMERS",
    href: "/setup-gamers",
    hasMegaMenu: true,
    megaMenuCategories: setupGamersMenu,
    megaMenuImage: {
      src: "/images/setup-gaming-promo.jpg",
      alt: "Setup Gaming",
      title: "Setup",
      subtitle: "Gaming"
    }
  },
  {
    label: "LAPTOP GAMERS",
    href: "/laptop-gamers",
    hasMegaMenu: true,
    megaMenuCategories: laptopGamersMenu,
    megaMenuImage: {
      src: "/images/laptop-gaming-promo.jpg",
      alt: "Laptop Gaming",
      title: "Laptops",
      subtitle: "Gaming"
    }
  },
  {
    label: "COMPOSANTS",
    href: "/composants",
    hasMegaMenu: true,
    megaMenuCategories: composantsMenu,
    megaMenuImage: {
      src: "/images/composants-promo.jpg",
      alt: "Composants PC",
      title: "Composants",
      subtitle: "PC Gaming"
    }
  },
  {
    label: "PERIPHERIQUES",
    href: "/peripheriques",
    hasMegaMenu: true,
    megaMenuCategories: peripheriquesMenu,
    megaMenuImage: {
      src: "/images/peripheriques-promo.jpg",
      alt: "Périphériques Gaming",
      title: "Périphériques",
      subtitle: "Gaming"
    }
  },
  {
    label: "KIT EVO GAMING",
    href: "/kit-evo-gaming",
  },
  {
    label: "CONSOLES",
    href: "/consoles",
    hasMegaMenu: true,
    megaMenuCategories: consolesMenu,
    megaMenuImage: {
      src: "/images/consoles-promo.jpg",
      alt: "Consoles Gaming",
      title: "Consoles",
      subtitle: "Next-Gen"
    }
  },
  {
    label: "NEW ARRIVALS",
    href: "/new-releases",
    isSpecial: true,
    specialColor: "#ff6b6b",
  },
  {
    label: "PROMOTIONS",
    href: "/promotions",
    isSpecial: true,
    specialColor: "#e74c3c",
  },
];

// Configuration des marques - Images statiques optimisées
const brands = [
  { 
    name: "Intel", 
    logo: "/brands/intel-logo.png",
    href: "/marques/intel",
    slug: "intel"
  },
  { 
    name: "NVIDIA", 
    logo: "/brands/nvidia-logo.png",
    href: "/marques/nvidia",
    slug: "nvidia"
  },
  { 
    name: "AMD", 
    logo: "/brands/amd-logo.png",
    href: "/marques/amd",
    slug: "amd"
  },
  { 
    name: "ASUS", 
    logo: "/brands/asus-logo.png",
    href: "/marques/asus",
    slug: "asus"
  },
  { 
    name: "MSI", 
    logo: "/brands/msi-logo.png",
    href: "/marques/msi",
    slug: "msi"
  },
  { 
    name: "Corsair", 
    logo: "/brands/corsair-logo.png",
    href: "/marques/corsair",
    slug: "corsair"
  },
  { 
    name: "Razer", 
    logo: "/brands/razer-logo.png",
    href: "/marques/razer",
    slug: "razer"
  },
  { 
    name: "Logitech", 
    logo: "/brands/logitech-logo.png",
    href: "/marques/logitech",
    slug: "logitech"
  },
];

export function NavigationMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  // Refs pour gérer les timeouts et éviter les fuites mémoire
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Gestion du scroll - Ferme le mega menu lors du scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuVisible) {
        setIsMenuVisible(false);
        setActiveMenu(null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuVisible]);

  // Nettoyage des timeouts - Évite les fuites mémoire
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  // Gestion améliorée du hover - Entrée dans le menu
  const handleMouseEnter = (itemLabel: string) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenu(itemLabel);
      setIsMenuVisible(true);
    }, 150);
  };

  // Gestion améliorée de la sortie - Sortie du menu principal
  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    leaveTimeoutRef.current = setTimeout(() => {
      setIsMenuVisible(false);
      setActiveMenu(null);
    }, 200);
  };

  // Gestion de la sortie du mega menu - Fermeture immédiate
  const handleMegaMenuLeave = () => {
    setIsMenuVisible(false);
    setActiveMenu(null);
    
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  // Maintenir le mega menu ouvert - Quand on entre dans le mega menu
  const handleMegaMenuEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsMenuVisible(true);
  };

  // Trouver l'item actif pour afficher son contenu
  const activeItem = menuItems.find(item => item.label === activeMenu);

  return (
    <>
      {/* Navigation principale */}
      <nav className="bg-yellow-400 border-b border-yellow-500 sticky top-[84px] z-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex items-center">
            {/* Menu items principaux */}
            <div 
              className="flex items-center"
              onMouseLeave={handleMouseLeave}
            >
              {menuItems.filter(item => !item.isSpecial).map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.hasMegaMenu && handleMouseEnter(item.label)}
                >
                  <Link
                    href={item.href}
                    className={`px-4 py-1 text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
                      activeMenu === item.label && item.hasMegaMenu
                        ? 'bg-yellow-500 text-black'
                        : 'text-black hover:bg-yellow-500'
                    }`}
                  >
                    {item.label}
                    {item.hasMegaMenu && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </Link>
                </div>
              ))}
            </div>

            {/* Items spéciaux (NEW ARRIVALS, PROMOTIONS) */}
            <div className="ml-auto flex items-center">
              {menuItems.filter(item => item.isSpecial).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-1 text-sm font-bold text-white transition-colors whitespace-nowrap"
                  style={{ backgroundColor: item.specialColor }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mega menu amélioré */}
{isMenuVisible && activeItem && activeItem.hasMegaMenu && (
  <div 
    className="fixed left-1/2 transform -translate-x-1/2 w-[1500px] bg-white shadow-2xl border-t-4 border-yellow-400 z-30"
    onMouseEnter={handleMegaMenuEnter}
    onMouseLeave={handleMegaMenuLeave}
  >
    <div className="grid grid-cols-6 gap-6 p-6">
      {/* Colonnes des catégories - 5 colonnes */}
      <div className="col-span-5">
        <div className="grid grid-cols-5 gap-4">
          {activeItem.megaMenuCategories?.map((category, index) => (
            <div key={index}>
              {/* Titre cliquable ou non selon titleHref */}
              {category.titleHref ? (
                <Link
                  href={category.titleHref}
                  className="font-bold text-gray-900 text-sm mb-3 border-b border-gray-200 pb-2 block hover:text-yellow-600 transition-colors"
                >
                  {category.title}
                </Link>
              ) : (
                <h3 className="font-bold text-gray-900 text-sm mb-3 border-b border-gray-200 pb-2">
                  {category.title}
                </h3>
              )}
              <ul className="space-y-1.5">
                {category.items.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      href={subItem.href}
                      className="text-sm text-gray-600 hover:text-yellow-600 hover:underline transition-colors block"
                    >
                      {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Image promotionnelle à droite - 1 colonne */}
      <div className="col-span-1">
        {activeItem.megaMenuImage && (
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-4 text-white h-full flex flex-col justify-center items-center min-h-[200px]">
            <div className="text-center">
              <h4 className="text-lg font-bold mb-1">
                {activeItem.megaMenuImage.title}
              </h4>
              <p className="text-base mb-3">
                {activeItem.megaMenuImage.subtitle}
              </p>
              <Link
                href={activeItem.href}
                className="inline-block bg-yellow-400 text-black px-3 py-1.5 rounded text-sm font-semibold hover:bg-yellow-500 transition-colors"
              >
                Voir tout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Section des marques améliorée */}
    <div className="px-6 pb-6">
      <div className="pt-4">
        <div className="flex items-center justify-between gap-4">
          {brands.slice(0, 8).map((brand, index) => (
            <div 
              key={index} 
              className="flex-1 flex items-center justify-center"
            >
              {brand.href ? (
                <Link 
                  href={brand.href}
                  className="block hover:opacity-80 transition-opacity duration-200"
                >
                  <Image
                    src={brand.logo}
                    alt={`Logo ${brand.name}`}
                    width={80}
                    height={40}
                    className="h-8 w-auto object-contain transition-all duration-300"
                  />
                </Link>
              ) : (
                <Image
                  src={brand.logo}
                  alt={`Logo ${brand.name}`}
                  width={80}
                  height={40}
                  className="h-8 w-auto object-contain transition-all duration-300 cursor-pointer"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}