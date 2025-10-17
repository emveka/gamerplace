// app/account/dashboard/page.tsx - Dashboard connecté Firebase
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getUserData, calculatePointsValue } from '@/lib/points';
import { User } from '@/types/user';

export default function DashboardPage() {
  const { user: authUser, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser?.uid) {
      loadUserData();
    }
  }, [authUser]);

  const loadUserData = async () => {
    if (!authUser?.uid) return;
    
    setIsLoading(true);
    try {
      const freshUserData = await getUserData(authUser.uid);
      setUserData(freshUserData);
    } catch (error) {
      console.error('Erreur chargement données utilisateur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Protection : utilisateur non connecté
  if (!isAuthenticated || !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès restreint</h2>
          <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à cette page.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const currentUser = userData || authUser;
  const totalPoints = currentUser?.totalPoints || 0;
  const pointsValue = calculatePointsValue(totalPoints);

  return (
    <div className="space-y-6">
      
      {/* En-tête avec message de bienvenue */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600">
          Bienvenue, {currentUser?.firstName || 'Gamer'} ! Votre espace personnel Gamerplace.ma
        </p>
        
        {/* Message de bienvenue pour nouveaux utilisateurs */}
        {totalPoints === 500 && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🎉</span>
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Inscription réussie !
                </h3>
                <p className="text-sm text-green-700">
                  Vous avez gagné 500 points de bienvenue. Commencez à explorer notre boutique !
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Points fidélité</p>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-20 mt-1"></div>
                </div>
              ) : (
                <p className="text-2xl font-bold text-yellow-600">{totalPoints.toLocaleString()}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Valeur: {pointsValue.toFixed(2)} MAD
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Commandes totales</p>
              <p className="text-2xl font-bold text-blue-600">{currentUser?.totalOrders || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                Depuis votre inscription
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total dépensé</p>
              <p className="text-2xl font-bold text-green-600">
                {currentUser?.totalSpent ? `${currentUser.totalSpent.toLocaleString()} MAD` : '0 MAD'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Économies réalisées
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <Link
            href="/pc-builder"
            className="group flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
          >
            <span className="text-2xl">🔧</span>
            <div>
              <p className="font-medium text-gray-900 group-hover:text-yellow-700">PC Builder</p>
              <p className="text-sm text-gray-600">Configurez votre PC gaming</p>
            </div>
          </Link>

          <Link
            href="/account/points"
            className="group flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
          >
            <span className="text-2xl">🎁</span>
            <div>
              <p className="font-medium text-gray-900 group-hover:text-yellow-700">Utiliser mes points</p>
              <p className="text-sm text-gray-600">{totalPoints} points disponibles</p>
            </div>
          </Link>

          <Link
            href="/categories"
            className="group flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
          >
            <span className="text-2xl">🛒</span>
            <div>
              <p className="font-medium text-gray-900 group-hover:text-yellow-700">Explorer la boutique</p>
              <p className="text-sm text-gray-600">Découvrir nos produits</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Commandes récentes - Placeholder */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Commandes récentes</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
            <p className="text-gray-600 mb-4">
              Vos commandes apparaîtront ici après votre premier achat.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
            >
              Commencer vos achats
            </Link>
          </div>
        </div>
      </div>

      {/* Informations du compte */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Informations du compte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Email</p>
            <p className="text-gray-900">{currentUser?.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Membre depuis</p>
            <p className="text-gray-900">
              {currentUser?.createdAt?.toDate?.()?.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }) || 'Date inconnue'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Statut</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              currentUser?.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {currentUser?.status === 'active' ? 'Actif' : currentUser?.status || 'Inconnu'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Actions</p>
            <Link
              href="/account/profile"
              className="text-yellow-600 hover:text-yellow-500 text-sm font-medium"
            >
              Modifier mon profil →
            </Link>
          </div>
        </div>
      </div>

      {/* Conseils pour gagner des points */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-full">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Maximisez vos points</h3>
            <p className="text-sm text-blue-800 mb-3">
              Saviez-vous que vous pouvez gagner 5% de points bonus en utilisant notre PC Builder pour une configuration complète ?
            </p>
            <div className="flex gap-3">
              <Link
                href="/pc-builder"
                className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                PC Builder
              </Link>
              <Link
                href="/account/points"
                className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                Voir mes points
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}