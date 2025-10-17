// app/account/layout.tsx - Layout avec largeur 1500px cohérente
import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Mon compte | Gamerplace.ma',
  description: 'Gérez votre compte, commandes et points fidélité sur Gamerplace.ma',
};

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mon compte</h3>
              <nav className="space-y-2">
                <Link
                  href="/account/dashboard"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <span>📊</span>
                  <span>Tableau de bord</span>
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <span>📦</span>
                  <span>Mes commandes</span>
                </Link>
                <Link
                  href="/account/points"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <span>🏆</span>
                  <span>Points fidélité</span>
                </Link>
                <Link
                  href="/account/profile"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <span>👤</span>
                  <span>Mon profil</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}