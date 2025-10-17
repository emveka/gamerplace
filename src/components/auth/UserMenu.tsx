// components/auth/UserMenu.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '@/types/user';

interface UserMenuProps {
  user?: User | null;
  isAuthenticated?: boolean;
  onSignOut?: () => void;
}

export function UserMenu({ user, isAuthenticated = false, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu quand on clique dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsOpen(false);
    onSignOut?.();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Bouton Menu - Remplace l'ancien lien Mon Compte */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col items-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
        aria-label="Menu utilisateur"
        title={isAuthenticated ? `Menu de ${user?.firstName || 'utilisateur'}` : "Se connecter"}
      >
        <Image
          src="/icons/Login_Icon.svg"
          alt="Menu utilisateur"
          width={24}
          height={24}
          className="h-4 sm:h-5 lg:h-6 w-4 sm:w-5 lg:w-6"
        />
        <span className="text-[10px] sm:text-xs font-medium text-white whitespace-nowrap hidden sm:block">
          {isAuthenticated ? user?.firstName || 'Mon Compte' : 'Mon Compte'}
        </span>
        <span className="text-[8px] sm:text-[9px] font-medium text-white sm:hidden">
          Compte
        </span>
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999]">
          
          {isAuthenticated && user ? (
            <>
              {/* En-tête utilisateur connecté */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
                {user.totalPoints !== undefined && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md text-xs font-medium">
                      <span>🏆</span>
                      <span>{user.totalPoints} points</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Liens espace utilisateur */}
              <div className="py-2">
                <Link
                  href="/account/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-blue-500">📊</span>
                  <span>Tableau de bord</span>
                </Link>
                
                <Link
                  href="/account/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-green-500">📦</span>
                  <span>Mes commandes</span>
                </Link>
                
                <Link
                  href="/account/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-purple-500">👤</span>
                  <span>Mon profil</span>
                </Link>

                {user.totalPoints !== undefined && (
                  <Link
                    href="/account/points"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-yellow-500">🏆</span>
                    <span>Mes points fidélité</span>
                  </Link>
                )}
              </div>

              {/* Déconnexion */}
              <div className="border-t border-gray-100 pt-2">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <span>🚪</span>
                  <span>Se déconnecter</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Utilisateur non connecté */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  Bienvenue sur Gamerplace.ma
                </p>
                <p className="text-xs text-gray-500">
                  Connectez-vous pour accéder à votre espace
                </p>
              </div>

              <div className="py-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-green-500">🔑</span>
                  <span>Se connecter</span>
                </Link>
                
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-blue-500">✨</span>
                  <span>Créer un compte</span>
                </Link>
              </div>

              {/* Bonus inscription */}
              <div className="border-t border-gray-100 pt-2">
                <div className="px-4 py-2">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800 font-medium">
                      🎁 Bonus inscription
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      500 points offerts à la création de votre compte
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}