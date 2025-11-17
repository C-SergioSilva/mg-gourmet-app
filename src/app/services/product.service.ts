import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductResponse, CreateProductRequest } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  // Get all products (public) => obter todos os produtos
  getAllProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.API_URL}/products`);
  }

  // Get single product (public)
  getProduct(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.API_URL}/products/${id}`);
  }

  // Get user's products (protected)
  getMyProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.API_URL}/my-products`);
  }

  // Create product (protected)
  createProduct(productData: CreateProductRequest): Observable<ProductResponse> {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    
    if (productData.image) {
      formData.append('image', productData.image);
    }

    return this.http.post<ProductResponse>(`${this.API_URL}/products`, formData);
  }

  // Update product (protected)
  updateProduct(id: number, productData: CreateProductRequest): Observable<ProductResponse> {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('_method', 'PUT');
    
    if (productData.image) {
      formData.append('image', productData.image);
    }

    return this.http.post<ProductResponse>(`${this.API_URL}/products/${id}`, formData);
  }

  // Delete product (protected)
  deleteProduct(id: number): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${this.API_URL}/products/${id}`);
  }
}
