import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerData: RegisterRequest = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  };
  
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.registerData.name || !this.registerData.email || 
        !this.registerData.password || !this.registerData.password_confirmation) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    if (this.registerData.password !== this.registerData.password_confirmation) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 'success') {
          this.router.navigate(['/admin']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Erro ao criar conta. Tente novamente.';
        if (error.error?.errors) {
          const errors = Object.values(error.error.errors).flat();
          this.errorMessage = errors.join(', ');
        }
      }
    });
  }
}
