export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ProductResponse {
  status: string;
  data: Product | Product[];
  message?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  image?: File;
}
