export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Company {
  id: string;
  name: string;
  ownerId: string;
  description?: string;
  logo?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  companyId: string;
  category: string;
  images: string[];
}
