// app/account/points/page.tsx - Page Points connectée à Firebase
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getUserPointsTransactions, 
  getUserData, 
  calculatePointsValue, 
  formatExpirationDate, 
  formatTransactionDate 
} from '@/lib/points';
import { PointsTransaction, User } from '@/types/user';

export default function PointsPage() {
  const { user: authUser, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  // Charger les données utilisateur à jour
  useEffect(() => {
    if (authUser?.uid) {
      loadUserData();
    }
  }, [authUser]);

  // Charger les transactions
  useEffect(() => {
    if (authUser?.uid) {
      loadTransactions();
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

  const loadTransactions = async () => {
    if (!authUser?.uid) return;
    
    setTransactionsLoading(true);
    try {
      const userTransactions = await getUserPointsTransactions(authUser.uid, 20);
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
    } finally {
      setTransactionsLoading(false);
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

  // Utiliser les données les plus récentes (userData ou authUser en fallback)
  const currentUser = userData || authUser;
  const totalPoints = currentUser?.totalPoints || 0;
  const pointsValue = calculatePointsValue(totalPoints);

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Points fidélité
        </h1>
        <p className="text-gray-600">
          Consultez votre solde, historique et utilisez vos points pour économiser
        </p>
      </div>

      {/* Solde des points - DONNÉES RÉELLES */}
<div className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow text-white overflow-hidden">
  {/* Image de background */}
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: 'url(/images/Test123.webp)' }}
  ></div>
  
  
  
  {/* Contenu */}
  <div className="relative z-10 p-8">
    <div className="flex items-center justify-between">
      <div>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-32 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-48 mb-4"></div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-2 drop-shadow-md">{totalPoints.toLocaleString()} points</h2>
            <p className="text-yellow-100 mb-4 drop-shadow-sm">
              Valeur: {pointsValue.toFixed(2)} MAD
              {currentUser?.createdAt && (
                <> • Expire le {formatExpirationDate(currentUser.createdAt)}</>
              )}
            </p>
          </>
        )}
        <div className="flex gap-4">
          <button
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-colors border border-white/20"
            disabled={totalPoints < 100}
          >
            Utiliser mes points
          </button>
          <Link
            href="/categories"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-colors inline-block border border-white/20"
          >
            Gagner plus de points
          </Link>
        </div>
      </div>
      
    </div>
  </div>
</div>

      {/* Comment ça marche */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Comment ça marche ?</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Achetez</h3>
              <p className="text-sm text-gray-600">
                Gagnez 1 point par dirham dépensé sur tous vos achats
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Cumulez</h3>
              <p className="text-sm text-gray-600">
                Accumulez vos points et débloquez des récompenses exclusives
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Économisez</h3>
              <p className="text-sm text-gray-600">
                Utilisez vos points pour réduire le prix de vos prochains achats
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Façons de gagner des points */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Façons de gagner des points</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl">🛍️</span>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Achats réguliers</h3>
                <p className="text-sm text-gray-600">1 point par dirham dépensé</p>
              </div>
              <span className="text-sm font-medium text-green-600">Actif</span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl">🔧</span>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Configuration PC complète</h3>
                <p className="text-sm text-gray-600">Bonus de 5% sur les points gagnés</p>
              </div>
              <span className="text-sm font-medium text-green-600">Actif</span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl">🎂</span>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Anniversaire</h3>
                <p className="text-sm text-gray-600">200 points bonus chaque année</p>
              </div>
              <span className="text-sm font-medium text-blue-600">Automatique</span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl">👥</span>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Parrainage</h3>
                <p className="text-sm text-gray-600">300 points par ami parrainé</p>
              </div>
              <button className="text-sm font-medium text-yellow-600 hover:text-yellow-700">
                Parrainer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Historique des points - DONNÉES RÉELLES */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Historique des points</h2>
            <select className="text-sm rounded-md border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
              <option>Toutes les transactions</option>
              <option>30 derniers jours</option>
              <option>3 derniers mois</option>
              <option>Cette année</option>
            </select>
          </div>
        </div>
        <div className="p-6">
          {transactionsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'bonus' ? (
                        <span className="text-blue-600">🎁</span>
                      ) : (
                        <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {transaction.amount > 0 ? '+' : '-'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">
                        {formatTransactionDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} points
                    </p>
                    {transaction.type === 'bonus' && (
                      <p className="text-xs text-blue-600">Bonus</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune transaction</h3>
              <p className="text-gray-600 mb-4">
                Vos transactions de points apparaîtront ici après votre premier achat.
              </p>
              <Link
                href="/categories"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
              >
                Commencer vos achats
              </Link>
            </div>
          )}

          {transactions.length > 0 && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => loadTransactions()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Actualiser l&apos;historique
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Récompenses disponibles - POINTS RÉELS */}
<div className="bg-white rounded-lg shadow">
  <div className="p-6 border-b border-gray-200">
    <h2 className="text-lg font-medium text-gray-900">Récompenses disponibles</h2>
    <p className="text-sm text-gray-600 mt-1">
      Utilisez vos points pour obtenir des réductions et services exclusifs
    </p>
  </div>
  <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      
      {/* Récompense 1 - T-shirt Gamer */}
      <div className={`border-2 rounded-lg p-4 transition-colors ${
        totalPoints >= 2500 
          ? 'border-gray-200 hover:border-yellow-400' 
          : 'border-gray-200 opacity-50'
      }`}>
        <div className="text-center">
          <div className="text-3xl mb-2">👕</div>
          <h3 className="font-medium text-gray-900 mb-1">T-shirt Gamer Atlas Gaming</h3>
          <p className="text-sm text-gray-600 mb-3">T-shirt exclusif avec logo Atlas Gaming</p>
          <div className="mb-3">
            <span className={`px-2 py-1 rounded text-sm font-medium ${
              totalPoints >= 2500 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              2 500 points
            </span>
          </div>
          <button 
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              totalPoints >= 2500
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={totalPoints < 2500}
          >
            {totalPoints >= 2500 ? 'Échanger' : 'Pas assez de points'}
          </button>
        </div>
      </div>

      {/* Récompense 2 - Service Nettoyage PC */}
      <div className={`border-2 rounded-lg p-4 transition-colors ${
        totalPoints >= 5000 
          ? 'border-gray-200 hover:border-yellow-400' 
          : 'border-gray-200 opacity-50'
      }`}>
        <div className="text-center">
          <div className="text-3xl mb-2">🖥️</div>
          <h3 className="font-medium text-gray-900 mb-1">Service Nettoyage PC Gamer</h3>
          <p className="text-sm text-gray-600 mb-3">Nettoyage complet gratuit de votre PC</p>
          <div className="mb-3">
            <span className={`px-2 py-1 rounded text-sm font-medium ${
              totalPoints >= 5000 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              5 000 points
            </span>
          </div>
          <button 
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              totalPoints >= 5000
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={totalPoints < 5000}
          >
            {totalPoints >= 5000 ? 'Échanger' : 'Pas assez de points'}
          </button>
        </div>
      </div>

      {/* Récompense 3 - Bon d'achat 1000 DH */}
      <div className={`border-2 rounded-lg p-4 transition-colors ${
        totalPoints >= 10000 
          ? 'border-gray-200 hover:border-yellow-400' 
          : 'border-gray-200 opacity-50'
      }`}>
        <div className="text-center">
          <div className="text-3xl mb-2">🎟️</div>
          <h3 className="font-medium text-gray-900 mb-1">Bon d&apos;achat 1000 DH</h3>
          <p className="text-sm text-gray-600 mb-3">Bon d&apos;achat valable sur tout le site</p>
          <div className="mb-3">
            <span className={`px-2 py-1 rounded text-sm font-medium ${
              totalPoints >= 10000 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              10 000 points
            </span>
          </div>
          <button 
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              totalPoints >= 10000
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={totalPoints < 10000}
          >
            {totalPoints >= 10000 ? 'Échanger' : 'Pas assez de points'}
          </button>
        </div>
      </div>

    </div>
  </div>
</div>  
</div>
       

  );
}