"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// Types pour les éléments du menu
type SubMenuItem = {
  label: string;
  href: string;
};

type MenuCategory = {
  title: string;
  titleHref?: string;
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

// Configuration des mega menus (même configuration que l'original)
const pcGamersMenu: MenuCategory[] = [
  {
    title: "PC Gamer AMD",
    titleHref: "/categories/pc-gamer-amd",
    items: [
      { label: "PC Gamer AMD Ryzen 3", href: "/categories/pc-gamer-amd-ryzen-3" },
      { label: "PC Gamer AMD Ryzen 5", href: "/categories/pc-gamer-amd-ryzen-5" },
      { label: "PC Gamer AMD Ryzen 7", href: "/categories/pc-gamer-amd-ryzen-7" },
      { label: "PC Gamer AMD Ryzen 9", href: "/categories/pc-gamer-amd-ryzen-9" },
    ]
  },
  {
    title: "PC Gamer INTEL",
    titleHref: "/categories/pc-gamer-intel",
    items: [
      { label: "PC GAMER INTEL Core i3", href: "/categories/pc-gamer-intel-core-i3" },
      { label: "PC GAMER INTEL Core i5", href: "/categories/pc-gamer-intel-core-i5" },
      { label: "PC GAMER INTEL Core i7", href: "/categories/pc-gamer-intel-core-i7" },
      { label: "PC GAMER INTEL Core i9", href: "/categories/pc-gamer-intel-core-i9" },
    ]
  },
  {
    title: "PC Gamer PRO",
    titleHref: "/categories/pc-gamer-professionnel",
    items: [
      { label: "PC GAMER IA", href: "/categories/pc-gamer-ia" },
      { label: "PC GAMER Architects", href: "/categories/pc-gamer-architectes" },
      { label: "PC GAMER Streamers", href: "/categories/pc-gamer-streamers" },
      { label: "PC GAMER Designers", href: "/categories/pc-gamer-designers" },
      { label: "PC GAMER Business", href: "/categories/pc-gamer-business" },
      { label: "PC GAMER Developers", href: "/categories/pc-gamer-developpeurs" },
    ]
  }
];

const kitevoGamersMenu: MenuCategory[] = [
  {
    title: "Packs Composants",
    titleHref: "/categories/packs-composants",
    items: [
      { label: "CPU/CM", href: "/categories/pack-cpu-carte-mere" },
      { label: "CPU/CM/RAM", href: "/categories/pack-cpu-carte-mere-ram" },
      { label: "CPU/CM/Boitier", href: "/categories/pack-cpu-carte-mere-boitier" },
      { label: "Boitier/Alimentation", href: "/categories/pack-boitier-alimentation" },
      { label: "Pack RGB", href: "/categories/pack-rgb" },
    ]
  },
  {
    title: "Packs Périphériques",
    titleHref: "/categories/packs-peripheriques",
    items: [
      { label: "Souris/Tapis", href: "/categories/pack-souris-tapis" },
      { label: "Souris/Clavier", href: "/categories/pack-souris-clavier" },
      { label: "Ecrans/autres", href: "/categories/pack-ecrans-accessoires" },
      { label: "Pack Périphériques", href: "/categories/pack-peripheriques-complet" },
    ]
  },
  {
    title: "Nos Packs Gamers",
    titleHref: "/categories/packs-gamers-specialises",
    items: [
      { label: "Pack for Streaming", href: "/categories/pack-streaming" },
      { label: "Pack for Mobilier", href: "/categories/pack-mobilier-gaming" },
      { label: "Pack for Designers", href: "/categories/pack-designers" },
      { label: "Pack for Business", href: "/categories/pack-business" },
    ]
  },
];

const laptopGamersMenu: MenuCategory[] = [
  {
    title: "Laptops",
    titleHref: "/categories/laptops-gaming",
    items: [
      { label: "Laptops AMD", href: "/categories/laptops-amd" },
      { label: "Laptops INTEL", href: "/categories/laptops-intel" },
    ]
  },
  {
    title: "Accessoires",
    titleHref: "/categories/accessoires-laptop",
    items: [
      { label: "Refroidisseurs", href: "/categories/refroidisseurs-laptop" },
      { label: "Sacs Gaming", href: "/categories/sacs-gaming-laptop" },
      { label: "Supports", href: "/categories/supports-laptop" },
    ]
  },
  {
    title: "Marques",
    titleHref: "/categories/marques-laptop",
    items: [
      { label: "ASUS ROG", href: "/categories/laptop-asus-rog" },
      { label: "MSI Gaming", href: "/categories/laptop-msi-gaming" },
      { label: "Alienware", href: "/categories/laptop-alienware" },
      { label: "Razer Blade", href: "/categories/laptop-razer-blade" },
      { label: "HP Omen", href: "/categories/laptop-hp-omen" },
    ]
  }
];

const composantsMenu: MenuCategory[] = [
  {
    title: "Cartes Graphiques",
    titleHref: "/categories/cartes-graphiques",
    items: [
      { label: "NVIDIA GeForce", href: "/categories/nvidia-geforce" },
      { label: "AMD Radeon", href: "/categories/amd-radeon" },
    ]
  },
  {
    title: "Processeurs",
    titleHref: "/categories/processeurs",
    items: [
      { label: "Processeurs INTEL Core", href: "/categories/processeurs-intel-core" },
      { label: "Processeurs AMD Ryzen", href: "/categories/processeurs-amd-ryzen" },
    ]
  },
  {
    title: "Cartes Mères",
    titleHref: "/categories/cartes-meres",
    items: [
      { label: "Cartes mère INTEL", href: "/categories/cartes-meres-intel" },
      { label: "Cartes mère AMD", href: "/categories/cartes-meres-amd" },
    ]
  },
  {
    title: "Stockage Disques",
    titleHref: "/categories/stockage",
    items: [
      { label: "SSD NVMe", href: "/categories/ssd-nvme" },
      { label: "SSD SATA", href: "/categories/ssd-sata" },
      { label: "Disques durs HDD", href: "/categories/disques-durs-hdd" },
    ]
  },
  {
    title: "Boitiers",
    titleHref: "/categories/boitiers",
    items: [
      { label: "Boitiers avec RGB", href: "/categories/boitiers-rgb" },
      { label: "Boitiers sans RGB", href: "/categories/boitiers-classiques" },
    ]
  },
  {
    title: "Mémoire RAM",
    titleHref: "/categories/memoire-ram",
    items: [
      { label: "RAM DDR5", href: "/categories/ram-ddr5" },
      { label: "RAM DDR4", href: "/categories/ram-ddr4" },
    ]
  },
  {
    title: "Alimentation",
    titleHref: "/categories/alimentations",
    items: [
      { label: "Alimentations Modulaires", href: "/categories/alimentations-modulaires" },
      { label: "Alimentations Standards", href: "/categories/alimentations-standards" },
    ]
  },
  {
    title: "Refroidissement",
    titleHref: "/categories/refroidissement",
    items: [
      { label: "AirCooling", href: "/categories/refroidissement-air" },
      { label: "WaterCooling", href: "/categories/refroidissement-liquide" },
    ]
  },
];

const peripheriquesMenu: MenuCategory[] = [
  {
    title: "Mobilier Gaming",
    titleHref: "/categories/mobilier-gaming",
    items: [
      { label: "Chaises Gamer", href: "/categories/chaises-gamer" },
      { label: "Bureaux Gamer", href: "/categories/bureaux-gamer" },
      { label: "Tapis de Sol Gamer", href: "/categories/tapis-sol-gamer" },
    ]
  },
  {
    title: "Souris",
    titleHref: "/categories/souris",
    items: [
      { label: "Souris Professionnelles", href: "/categories/souris-professionnelles" },
      { label: "Souris Gamer", href: "/categories/souris-gamer" },
      { label: "Tapis de Souris", href: "/categories/tapis-souris" },
    ]
  },
  {
    title: "Claviers",
    titleHref: "/categories/claviers",
    items: [
      { label: "Claviers Professionnels", href: "/categories/claviers-professionnels" },
      { label: "Claviers Gamers", href: "/categories/claviers-gamer" },
    ]
  },
  {
    title: "Audio",
    titleHref: "/categories/audio",
    items: [
      { label: "Casques Gamer", href: "/categories/casques-gamer" },
      { label: "Haut-Parleurs", href: "/categories/haut-parleurs" },
      { label: "Microphones", href: "/categories/microphones" },
    ]
  },
  {
    title: "Streaming",
    titleHref: "/categories/streaming",
    items: [
      { label: "Cartes Vidéos Streaming", href: "/categories/cartes-videos-streaming" },
      { label: "Cartes Son", href: "/categories/cartes-son" },
      { label: "Déco Streaming", href: "/categories/decoration-streaming" },
      { label: "Accessoires Streaming", href: "/categories/accessoires-streaming" },
    ]
  },
  {
    title: "Ecrans Moniteurs",
    titleHref: "/categories/moniteurs",
    items: [
      { label: "Moniteurs Gaming", href: "/categories/moniteurs-gaming" },
      { label: "Accessoires Ecrans", href: "/categories/accessoires-moniteurs" },
    ]
  },
];

const consolesMenu: MenuCategory[] = [
  {
    title: "Consoles",
    titleHref: "/categories/consoles",
    items: [
      { label: "PlayStation 5", href: "/categories/playstation-5" },
      { label: "Xbox", href: "/categories/xbox" },
      { label: "Nintendo", href: "/categories/nintendo" },
      { label: "Jeux Vidéos", href: "/categories/jeux-videos" },
      { label: "Accessoires Consoles", href: "/categories/accessoires-consoles" },
    ]
  },
  {
    title: "Rétro Gaming",
    titleHref: "/categories/retro-gaming",
    items: [
      { label: "Consoles Rétro Gaming", href: "/categories/consoles-retro" },
      { label: "Jeux Rétro", href: "/categories/jeux-retro" },
      { label: "Accessoires Rétro Gaming", href: "/categories/accessoires-retro" },
    ]
  },
  {
    title: "Arcades",
    titleHref: "/categories/arcades",
    items: [
      { label: "Bornes Arcade", href: "/categories/bornes-arcade" },
      { label: "Bartop", href: "/categories/bartop" },
    ]
  }
];

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
    label: "COMPOSANTS",
    href: "/categories/composants",
    hasMegaMenu: true,
    megaMenuCategories: composantsMenu,
    megaMenuImage: {
      src: "/images/computer-cover.webp",
      alt: "Composants PC",
      title: "Composants",
      subtitle: "PC Gaming"
    }
  },
  {
    label: "PACK GAMERS",
    href: "/categories/kit-evo-gamers",
    hasMegaMenu: true,
    megaMenuCategories: kitevoGamersMenu,
    megaMenuImage: {
      src: "/images/setup-gaming-promo.jpg",
      alt: "Setup Gaming",
      title: "Setup",
      subtitle: "Gaming"
    }
  },
  {
    label: "LAPTOP GAMERS",
    href: "/categories/laptop-gamers",
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
    label: "PERIPHERIQUES",
    href: "/categories/peripheriques",
    hasMegaMenu: true,
    megaMenuCategories: peripheriquesMenu,
    megaMenuImage: {
      src: "/images/test-7.webp",
      alt: "Périphériques Gaming",
      title: "Périphériques",
      subtitle: "Gaming"
    }
  },
  {
    label: "CONSOLES",
    href: "/categories/consoles",
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
    href: "/categories/nouveautes",
    isSpecial: true,
    specialColor: "#ff6b6b",
  },
  {
    label: "PROMOTIONS",
    href: "/categories/promotions",
    isSpecial: true,
    specialColor: "#e74c3c",
  },
];

const brands = [
  { name: "Intel", logo: "/brands/intel-logo.png", href: "/categories/marque-intel", slug: "intel" },
  { name: "NVIDIA", logo: "/brands/nvidia-logo.png", href: "/categories/marque-nvidia", slug: "nvidia" },
  { name: "AMD", logo: "/brands/amd-logo.png", href: "/categories/marque-amd", slug: "amd" },
  { name: "ASUS", logo: "/brands/asus-logo.png", href: "/categories/marque-asus", slug: "asus" },
  { name: "MSI", logo: "/brands/msi-logo.png", href: "/categories/marque-msi", slug: "msi" },
  { name: "Corsair", logo: "/brands/corsair-logo.png", href: "/categories/marque-corsair", slug: "corsair" },
  { name: "Razer", logo: "/brands/razer-logo.png", href: "/categories/marque-razer", slug: "razer" },
  { name: "Logitech", logo: "/brands/logitech-logo.png", href: "/categories/marque-logitech", slug: "logitech" },
];

type NavigationMenuProps = {
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
};

export function NavigationMenu({ isMobileMenuOpen = false, onMobileMenuClose }: NavigationMenuProps) {
  // États pour desktop (existants)
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  // États pour mobile
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  
  // Refs pour gestion des timeouts
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fermer le menu mobile au scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        onMobileMenuClose?.();
      }
      if (isMenuVisible) {
        setIsMenuVisible(false);
        setActiveMenu(null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen, isMenuVisible, onMobileMenuClose]);

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Nettoyage des timeouts
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  // Gestion hover desktop (existant)
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

  const handleMegaMenuLeave = () => {
    setIsMenuVisible(false);
    setActiveMenu(null);
    
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  const handleMegaMenuEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsMenuVisible(true);
  };

  // Gestion mobile - Toggle sous-menu
  const handleMobileMenuToggle = (itemLabel: string) => {
    setExpandedMobileMenu(expandedMobileMenu === itemLabel ? null : itemLabel);
  };

  // Fermer le menu mobile après clic sur un lien
  const handleMobileLinkClick = () => {
    onMobileMenuClose?.();
    setExpandedMobileMenu(null);
  };

  const activeItem = menuItems.find(item => item.label === activeMenu);

  return (
    <>
      {/* Navigation Desktop - Cachée sur mobile et tablette */}
      <nav className="bg-yellow-400 border-b border-yellow-500 sticky top-[84px] z-40 hidden lg:block">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex items-center">
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

      {/* Menu Mobile/Tablette - Overlay RÉDUIT */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-opacity-50" onClick={onMobileMenuClose}>
          <div 
            className="bg-white w-64 h-full overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du menu mobile RÉDUIT */}
            <div className="flex items-center justify-between p-2.5 border-b border-gray-200 bg-yellow-400">
              <h2 className="font-bold text-black text-sm">Menu Gamerplace.ma</h2>
              <button 
                onClick={onMobileMenuClose}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-yellow-500 transition-colors"
                aria-label="Fermer le menu"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Navigation mobile RÉDUITE */}
            <div className="py-1">
              {menuItems.filter(item => !item.isSpecial).map((item) => (
                <div key={item.label} className="border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={handleMobileLinkClick}
                      className="flex-1 px-2.5 py-2 text-gray-800 hover:bg-gray-50 transition-colors font-medium text-xs"
                    >
                      {item.label}
                    </Link>
                    
                    {/* Bouton d'expansion RÉDUIT */}
                    {item.hasMegaMenu && (
                      <button
                        onClick={() => handleMobileMenuToggle(item.label)}
                        className="px-2.5 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                        aria-label={`Afficher les sous-catégories de ${item.label}`}
                      >
                        <svg 
                          className={`w-3.5 h-3.5 transform transition-transform ${
                            expandedMobileMenu === item.label ? 'rotate-180' : ''
                          }`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Sous-menu mobile RÉDUIT */}
                  {item.hasMegaMenu && expandedMobileMenu === item.label && (
                    <div className="bg-gray-50 border-t border-gray-200">
                      {item.megaMenuCategories?.map((category, index) => (
                        <div key={index} className="p-2.5 border-b border-gray-200 last:border-b-0">
                          {category.titleHref ? (
                            <Link
                              href={category.titleHref}
                              onClick={handleMobileLinkClick}
                              className="font-semibold text-gray-900 text-xs mb-1.5 block hover:text-yellow-600 transition-colors"
                            >
                              {category.title}
                            </Link>
                          ) : (
                            <h3 className="font-semibold text-gray-900 text-xs mb-1.5">
                              {category.title}
                            </h3>
                          )}
                          <ul className="space-y-0.5">
                            {category.items.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                <Link
                                  href={subItem.href}
                                  onClick={handleMobileLinkClick}
                                  className="text-xs text-gray-600 hover:text-yellow-600 hover:underline transition-colors block py-0.5"
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Items spéciaux en mobile RÉDUITS */}
              <div className="mt-3 px-2.5 space-y-1.5">
                {menuItems.filter(item => item.isSpecial).map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={handleMobileLinkClick}
                    className="block text-center py-2 px-3 text-white font-bold rounded-lg transition-colors text-xs"
                    style={{ backgroundColor: item.specialColor }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Marques en mobile RÉDUITES */}
              <div className="mt-4 p-2.5 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 text-xs mb-2">Marques Populaires</h3>
                <div className="grid grid-cols-2 gap-2">
                  {brands.slice(0, 6).map((brand, index) => (
                    <Link 
                      key={index}
                      href={brand.href}
                      onClick={handleMobileLinkClick}
                      className="block p-1.5 border border-gray-200 rounded-lg hover:border-yellow-400 transition-colors"
                    >
                      <Image
                        src={brand.logo}
                        alt={`Logo ${brand.name}`}
                        width={40}
                        height={20}
                        className="h-4 w-auto object-contain mx-auto"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mega menu Desktop - Inchangé */}
      {isMenuVisible && activeItem && activeItem.hasMegaMenu && (
        <div 
          className="hidden lg:block fixed left-1/2 transform -translate-x-1/2 w-[1500px] bg-white shadow-2xl border-t-4 border-yellow-400 z-30"
          onMouseEnter={handleMegaMenuEnter}
          onMouseLeave={handleMegaMenuLeave}
        >
          <div className="grid grid-cols-6 gap-6 p-6">
            <div className="col-span-5">
              <div className="grid grid-cols-5 gap-4">
                {activeItem.megaMenuCategories?.map((category, index) => (
                  <div key={index}>
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

            <div className="col-span-1">
              {activeItem?.megaMenuImage && (
                <div className="relative bg-gradient-to-br from-gray-800 to-black p-4 text-white h-full min-h-[260px] overflow-hidden">
                  <Image
                    src={activeItem.megaMenuImage.src}     
                    alt={activeItem.megaMenuImage.alt}
                    fill
                    sizes="(min-width: 1024px) 320px, 100vw"
                    className="object-cover opacity-70"
                    priority
                  />
                  <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
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

          <div className="px-6 pb-6">
            <div className="pt-4">
              <div className="flex items-center justify-between gap-4">
                {brands.slice(0, 8).map((brand, index) => (
                  <div key={index} className="flex-1 flex items-center justify-center">
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