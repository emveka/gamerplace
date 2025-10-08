// types/header.ts
export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  price: number;
  imageUrl?: string;
  categoryName?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface HeaderProps {
  user?: User | null;
  cartItems?: CartItem[];
  isAuthenticated?: boolean;
}