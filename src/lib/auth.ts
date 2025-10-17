// lib/auth.ts - Service d'authentification Firebase CORRIGÉ
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  collection,
  addDoc,
  FieldValue
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, CreateUserFormData, PointsTransaction, DEFAULT_POINTS_CONFIG } from '@/types/user';

// Interface pour l'inscription
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode?: string;
    country: string;
    additionalInfo?: string;
  };
}

// Interface pour la connexion
export interface LoginData {
  email: string;
  password: string;
}

// 🔧 INTERFACE POUR LES DONNÉES UTILISATEUR AVANT ÉCRITURE FIRESTORE
interface UserDataForFirestore {
  uid: string;
  email: string;
  role: 'member';
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode?: string;
    country: string;
    additionalInfo?: string;
  };
  status: 'active';
  totalPoints: number;
  lifetimePointsEarned: number;
  lifetimePointsUsed: number;
  createdAt: FieldValue; // FieldValue au moment de l'écriture
  updatedAt: FieldValue; // FieldValue au moment de l'écriture
}

// Créer un utilisateur dans Firestore
async function createUserProfile(firebaseUser: FirebaseUser, userData: RegisterData): Promise<User> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  
  // 🔧 CORRECTION: Utiliser l'interface compatible avec FieldValue
  const newUserData: UserDataForFirestore = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || userData.email,
    role: 'member',
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone,
    address: userData.address,
    status: 'active',
    
    // Système de points - Valeurs initiales
    totalPoints: DEFAULT_POINTS_CONFIG.registrationBonus,
    lifetimePointsEarned: DEFAULT_POINTS_CONFIG.registrationBonus,
    lifetimePointsUsed: 0,
    
    // Métadonnées - ✅ CORRIGÉ: FieldValue accepté
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, newUserData);
  
  // Créer la transaction de points bonus d'inscription
  await createPointsTransaction({
    userId: firebaseUser.uid,
    type: 'bonus',
    amount: DEFAULT_POINTS_CONFIG.registrationBonus,
    description: 'Bonus d\'inscription - Bienvenue chez Gamerplace.ma !',
    createdAt: serverTimestamp(),
  });

  // 🔧 CORRECTION: Retourner un User compatible via assertion de type
  // Les timestamps réels seront récupérés lors de la prochaine lecture depuis Firestore
  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    email: firebaseUser.email || userData.email,
    role: 'member',
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone,
    address: userData.address,
    status: 'active',
    totalPoints: DEFAULT_POINTS_CONFIG.registrationBonus,
    lifetimePointsEarned: DEFAULT_POINTS_CONFIG.registrationBonus,
    lifetimePointsUsed: 0,
    // Les timestamps seront lus depuis Firestore lors de la prochaine lecture
    createdAt: new Date(), // Temporaire - sera remplacé par Timestamp à la lecture
    updatedAt: new Date(), // Temporaire - sera remplacé par Timestamp à la lecture
  } as unknown as User;
}

// 🔧 INTERFACE POUR LES TRANSACTIONS DE POINTS AVANT ÉCRITURE
interface PointsTransactionForFirestore {
  userId: string;
  type: 'purchase' | 'bonus' | 'refund' | 'expired';
  amount: number;
  description: string;
  orderId?: string;
  createdAt: FieldValue; // FieldValue au moment de l'écriture
}

// Créer une transaction de points
async function createPointsTransaction(transaction: PointsTransactionForFirestore): Promise<void> {
  const transactionsRef = collection(db, 'pointsTransactions');
  await addDoc(transactionsRef, transaction);
}

// Récupérer le profil utilisateur depuis Firestore
export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        id: userSnap.id,
        ...userSnap.data()
      } as User;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur récupération profil utilisateur:', error);
    return null;
  }
}

// Inscription avec email/password
export async function registerWithEmail(userData: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Créer l'utilisateur Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    // Créer le profil Firestore
    const user = await createUserProfile(userCredential.user, userData);
    
    return { success: true, user };
  } catch (error) {
    console.error('Erreur inscription:', error);
    
    let errorMessage = 'Une erreur est survenue lors de l\'inscription';
    
    // Messages d'erreur en français
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Cette adresse email est déjà utilisée';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Adresse email invalide';
          break;
        case 'auth/weak-password':
          errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'L\'inscription par email est désactivée';
          break;
      }
    }
    
    return { success: false, error: errorMessage };
  }
}

// Connexion avec email/password
export async function loginWithEmail(loginData: LoginData): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      loginData.email, 
      loginData.password
    );
    
    // Récupérer le profil Firestore
    const user = await getUserProfile(userCredential.user.uid);
    
    if (!user) {
      return { success: false, error: 'Profil utilisateur non trouvé' };
    }
    
    return { success: true, user };
  } catch (error) {
    console.error('Erreur connexion:', error);
    
    let errorMessage = 'Une erreur est survenue lors de la connexion';
    
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte trouvé avec cette adresse email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Adresse email invalide';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Ce compte a été désactivé';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives. Réessayez plus tard';
          break;
      }
    }
    
    return { success: false, error: errorMessage };
  }
}

// Déconnexion
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    return { success: false, error: 'Erreur lors de la déconnexion' };
  }
}

// Observer l'état d'authentification
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Utilisateur connecté - récupérer le profil Firestore
      const user = await getUserProfile(firebaseUser.uid);
      callback(user);
    } else {
      // Utilisateur déconnecté
      callback(null);
    }
  });
}