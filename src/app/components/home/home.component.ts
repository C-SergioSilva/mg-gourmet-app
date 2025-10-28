import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 'success') {
          this.products = Array.isArray(response.data) ? response.data : [response.data];
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erro ao carregar produtos.';
        console.error('Error loading products:', error);
      }
    });
  }

  getImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return 'assets/images/placeholder-food.svg';
    }
    return `http://127.0.0.1:8000/storage/${imagePath}`;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== 'assets/images/placeholder-food.svg') {
      target.src = 'assets/images/placeholder-food.svg';
    }
  }
}
