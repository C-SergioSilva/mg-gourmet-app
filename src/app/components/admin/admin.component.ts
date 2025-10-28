import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { User } from '../../models/user';
import { CreateProductRequest } from '../../models/product';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  currentUser: User | null = null;
  products: Product[] = [];
  loading = true;
  showProductForm = false;
  editingProduct: Product | null = null;
  
  productForm: CreateProductRequest = {
    name: '',
    description: '',
    price: 0,
    image: undefined
  };
  
  errorMessage = '';
  successMessage = '';
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });

    this.loadMyProducts();
  }

  loadMyProducts(): void {
    this.loading = true;
    this.productService.getMyProducts().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 'success') {
          this.products = Array.isArray(response.data) ? response.data : [response.data];
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erro ao carregar seus produtos.';
        console.error('Error loading products:', error);
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.productForm.image = this.selectedFile || undefined;
  }

  showAddProduct(): void {
    this.showProductForm = true;
    this.editingProduct = null;
    this.resetForm();
  }

  editProduct(product: Product): void {
    this.showProductForm = true;
    this.editingProduct = product;
    this.productForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      image: undefined
    };
  }

  resetForm(): void {
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      image: undefined
    };
    this.selectedFile = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelForm(): void {
    this.showProductForm = false;
    this.editingProduct = null;
    this.resetForm();
  }

  onSubmitProduct(): void {
    if (!this.productForm.name || !this.productForm.description || this.productForm.price <= 0) {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const operation = this.editingProduct 
      ? this.productService.updateProduct(this.editingProduct.id!, this.productForm)
      : this.productService.createProduct(this.productForm);

    operation.subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 'success') {
          this.successMessage = this.editingProduct 
            ? 'Produto atualizado com sucesso!' 
            : 'Produto criado com sucesso!';
          this.showProductForm = false;
          this.resetForm();
          this.loadMyProducts();
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erro ao salvar produto.';
        if (error.error?.errors) {
          const errors = Object.values(error.error.errors).flat();
          this.errorMessage = errors.join(', ');
        }
      }
    });
  }

  deleteProduct(product: Product): void {
    if (confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      this.productService.deleteProduct(product.id!).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.successMessage = 'Produto excluído com sucesso!';
            this.loadMyProducts();
          }
        },
        error: (error) => {
          this.errorMessage = 'Erro ao excluir produto.';
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        // Even if logout fails on server, clear local data
        this.authService.removeToken();
        this.router.navigate(['/']);
      }
    });
  }

  getImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return 'assets/images/placeholder-food.svg';
    }
    return `http://127.0.0.1:8000/storage/${imagePath}`;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== 'assets/images/placeholder-food.svg') {
      target.src = 'assets/images/placeholder-food.svg';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }
}
