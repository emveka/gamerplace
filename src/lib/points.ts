// lib/points.ts - Service pour gérer les points
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  doc,
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { PointsTransaction, User } from '@/types/user';

// Type pour gérer les différents formats de timestamp Firebase
type FirebaseTimestamp = Timestamp | { seconds: number; nanoseconds: number } | Date | null | undefined;

// Récupérer les transactions de points d'un utilisateur
export async function getUserPointsTransactions(userId: string, limitCount: number = 10): Promise<PointsTransaction[]> {
  try {
    const transactionsRef = collection(db, 'pointsTransactions');
    const q = query(
      transactionsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PointsTransaction[];
  } catch (error) {
    console.error('Erreur récupération transactions:', error);
    return [];
  }
}

// Récupérer les données utilisateur à jour
export async function getUserData(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        id: userSnap.id,
        ...userSnap.data()
      } as User;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    return null;
  }
}

// Calculer la valeur en MAD des points
export function calculatePointsValue(points: number): number {
  return points * 0.05; // 100 points = 5 MAD
}

// Fonction utilitaire pour convertir un timestamp Firebase en Date
function convertFirebaseTimestampToDate(timestamp: FirebaseTimestamp): Date | null {
  if (!timestamp) return null;
  
  // Si c'est un Timestamp Firebase avec la méthode toDate()
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
    return (timestamp as Timestamp).toDate();
  }
  
  // Si c'est un objet avec seconds et nanoseconds
  if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
    return new Date((timestamp as { seconds: number }).seconds * 1000);
  }
  
  // Si c'est déjà une instance de Date
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  return null;
}

// Formater la date d'expiration
export function formatExpirationDate(createdAt: FirebaseTimestamp): string {
  const date = convertFirebaseTimestampToDate(createdAt);
  
  if (!date) return '';
  
  // Ajouter 12 mois pour l'expiration
  const expirationDate = new Date(date);
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);
  
  return expirationDate.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
}

// Formater une date de transaction
export function formatTransactionDate(createdAt: FirebaseTimestamp): string {
  const date = convertFirebaseTimestampToDate(createdAt);
  
  if (!date) return 'Date inconnue';
  
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}