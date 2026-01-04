export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  location?: string;
  industry?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  categoryId: string;
  companyId: string;
  companyName?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}
