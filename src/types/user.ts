// types/user.ts

import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'member';
export type UserStatus = 'active' | 'suspended' | 'banned';

export interface Address {
  street: string;
  city: string;
  postalCode?: string;
  country: string;
  additionalInfo?: string;
}

export interface User {
  id: string;
  uid: string; // Firebase Auth UID
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
  status: UserStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // 🆕 SYSTÈME DE POINTS
  totalPoints: number;                    // Points disponibles actuellement
  lifetimePointsEarned: number;          // Total des points gagnés depuis l'inscription
  lifetimePointsUsed: number;            // Total des points utilisés
  pointsExpiringAt?: Timestamp;          // Date d'expiration des plus anciens points
  
  // Stats optionnelles (calculées)
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: Timestamp;
}

// 🆕 HISTORIQUE DES TRANSACTIONS DE POINTS
export interface PointsTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'used' | 'expired' | 'bonus' | 'manual_adjustment';
  amount: number;                        // Positif pour gain, négatif pour utilisation
  orderId?: string;                      // Si lié à une commande
  productId?: string;                    // Si lié à un produit spécifique
  buildId?: string;                      // Si lié à une configuration PC Builder
  description: string;                   // "Achat produit X", "Utilisation panier", "Bonus inscription", etc.
  adminNote?: string;                    // Note de l'admin pour les ajustements manuels
  createdAt: Timestamp;
  expiresAt?: Timestamp;                 // Pour les points avec expiration
}

// 🆕 CONFIGURATION DU SYSTÈME DE POINTS
export interface PointsConfig {
  pointsPerEuro: number;                 // Ratio points gagnés par euro dépensé
  pointsToEuroRatio: number;             // Valeur de rachat (ex: 100 points = 5€)
  minimumPointsToUse: number;            // Seuil minimum pour utiliser les points
  pointsValidityMonths: number;          // Durée de validité des points en mois
  registrationBonus: number;             // Points bonus à l'inscription
  birthdayBonus: number;                 // Points bonus anniversaire
  completeBuilderBonus: number;          // Bonus % pour configuration PC complète
  maxPointsPerOrder: number;             // Maximum de points utilisables par commande
}

// Formulaire de création d'utilisateur
export interface CreateUserFormData {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
  status: UserStatus;
  totalPoints?: number;                  // Points d'inscription optionnels
}

// Formulaire de mise à jour d'utilisateur
export interface UpdateUserFormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
  status: UserStatus;
  role: UserRole;
  totalPoints?: number;                  // Modification manuelle des points (admin)
}

// 🆕 FORMULAIRE D'AJUSTEMENT DES POINTS (ADMIN)
export interface PointsAdjustmentFormData {
  userId: string;
  amount: number;                        // Positif ou négatif
  reason: string;                        // Raison de l'ajustement
  adminNote?: string;                    // Note interne
}

// Statistiques des utilisateurs
export interface UserStats {
  totalUsers: number;
  totalAdmins: number;
  totalMembers: number;
  activeUsers: number;
  suspendedUsers: number;
  bannedUsers: number;
  newUsersThisMonth: number;
  
  // 🆕 STATISTIQUES DES POINTS
  totalPointsInCirculation: number;      // Tous les points disponibles
  totalPointsEarnedAllTime: number;      // Tous les points gagnés depuis le début
  totalPointsUsedAllTime: number;        // Tous les points utilisés
  totalPointsExpired: number;            // Points expirés
  averagePointsPerUser: number;          // Moyenne des points par utilisateur
  topPointsHolder: {                     // Utilisateur avec le plus de points
    userId: string;
    firstName: string;
    lastName: string;
    points: number;
  } | null;
}

// Filtres pour la recherche d'utilisateurs
export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string; // Recherche par nom, email, téléphone
  dateFrom?: Date;
  dateTo?: Date;
  minPoints?: number;                    // 🆕 Filtre par points minimum
  maxPoints?: number;                    // 🆕 Filtre par points maximum
}

// 🆕 FILTRES POUR L'HISTORIQUE DES POINTS
export interface PointsTransactionFilters {
  userId?: string;
  type?: PointsTransaction['type'];
  dateFrom?: Date;
  dateTo?: Date;
  orderId?: string;
  minAmount?: number;
  maxAmount?: number;
}

// 🆕 DONNÉES POUR LE DASHBOARD POINTS
export interface PointsDashboardData {
  totalPointsDistributed: number;
  totalPointsUsed: number;
  totalPointsExpired: number;
  pointsDistributedThisMonth: number;
  pointsUsedThisMonth: number;
  topEarners: Array<{
    userId: string;
    firstName: string;
    lastName: string;
    pointsEarned: number;
  }>;
  topSpenders: Array<{
    userId: string;
    firstName: string;
    lastName: string;
    pointsUsed: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    earned: number;
    used: number;
    expired: number;
  }>;
}

// 🆕 VALIDATION DU SYSTÈME DE POINTS
export interface PointsValidation {
  isValid: boolean;
  canUsePoints: boolean;
  availablePoints: number;
  requestedPoints: number;
  maxUsablePoints: number;
  error?: string;
}

// 🆕 CALCUL DES POINTS POUR UNE COMMANDE
export interface OrderPointsCalculation {
  pointsToEarn: number;                  // Points que va gagner l'utilisateur
  pointsUsed: number;                    // Points utilisés dans cette commande
  bonusPoints: number;                   // Points bonus (première commande, etc.)
  totalPointsImpact: number;             // Impact net sur le solde (+/-)
  newTotalPoints: number;                // Nouveau solde après commande
}

// 🆕 CONSTANTES PAR DÉFAUT
export const DEFAULT_POINTS_CONFIG: PointsConfig = {
  pointsPerEuro: 1,                      // 1 point par dirham dépensé
  pointsToEuroRatio: 0.05,               // 100 points = 5 MAD (5% de cashback)
  minimumPointsToUse: 100,               // Minimum 100 points pour utiliser
  pointsValidityMonths: 12,              // Points valables 12 mois
  registrationBonus: 500,                // 500 points à l'inscription
  birthdayBonus: 200,                    // 200 points d'anniversaire
  completeBuilderBonus: 5,               // 5% de bonus pour PC Builder complet
  maxPointsPerOrder: 5000,               // Maximum 5000 points par commande
};

export default User;