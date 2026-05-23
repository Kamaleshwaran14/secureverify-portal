import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth';

type UserRole = 'General User' | 'Admin';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="min-h-screen bg-[#eef2f7]">
      <div class="flex min-h-screen items-center justify-center px-5 py-8">
        <div class="grid w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">

          <!-- INFO PANEL -->
          <section class="hidden bg-slate-900 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div class="mb-10 flex items-center gap-3">
                <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 font-bold">
                  SV
                </div>

                <div>
                  <h1 class="text-2xl font-bold">
                    SecureVerify
                  </h1>

                  <p class="text-sm text-slate-300">
                    Verification Management Portal
                  </p>
                </div>
              </div>

              <div class="max-w-xl">
                <p class="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
                  Role Based Access System
                </p>

                <h2 class="text-4xl font-bold leading-tight">
                  A simple portal to manage background verification records.
                </h2>

                <p class="mt-5 text-base leading-7 text-slate-300">
                  Built with Angular and Node.js to demonstrate login,
                  user roles, API based records and admin user management.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p class="text-xs text-slate-400">
                  Frontend
                </p>

                <h3 class="mt-1 font-semibold">
                  Angular
                </h3>
              </div>

              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p class="text-xs text-slate-400">
                  Backend
                </p>

                <h3 class="mt-1 font-semibold">
                  Node API
                </h3>
              </div>

              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p class="text-xs text-slate-400">
                  Storage
                </p>

                <h3 class="mt-1 font-semibold">
                  JSON DB
                </h3>
              </div>
            </div>
          </section>

          <!-- LOGIN PANEL -->
          <section class="flex items-center justify-center bg-white px-6 py-10">
            <div class="w-full max-w-[390px]">
              <div class="mb-8 text-center lg:text-left">
                <h2 class="text-3xl font-bold text-slate-900">
                  Sign in
                </h2>

                <p class="mt-2 text-sm text-slate-500">
                  Use the given credentials to access the dashboard.
                </p>
              </div>

              <form
                [formGroup]="loginForm"
                (ngSubmit)="login()"
                class="space-y-5"
              >
                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">
                    User ID
                  </label>

                  <input
                    formControlName="userId"
                    type="email"
                    placeholder="admin@mploychek.com"
                    class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />

                  @if (
                    loginForm.controls['userId'].touched &&
                    loginForm.controls['userId'].invalid
                  ) {
                    <p class="mt-2 text-sm text-red-500">
                      Enter a valid user ID.
                    </p>
                  }
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <input
                    formControlName="password"
                    type="password"
                    placeholder="password123"
                    class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />

                  @if (
                    loginForm.controls['password'].touched &&
                    loginForm.controls['password'].invalid
                  ) {
                    <p class="mt-2 text-sm text-red-500">
                      Password is required.
                    </p>
                  }
                </div>

                <div>
                  <label class="mb-2 block text-sm font-medium text-slate-700">
                    Role
                  </label>

                  <div class="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      (click)="selectRole('General User')"
                      [class.border-indigo-600]="selectedRole() === 'General User'"
                      [class.bg-indigo-50]="selectedRole() === 'General User'"
                      [class.text-indigo-700]="selectedRole() === 'General User'"
                      class="rounded-xl border border-slate-300 px-3 py-3 text-sm font-medium text-slate-600 transition hover:border-indigo-400"
                    >
                      General User
                    </button>

                    <button
                      type="button"
                      (click)="selectRole('Admin')"
                      [class.border-indigo-600]="selectedRole() === 'Admin'"
                      [class.bg-indigo-50]="selectedRole() === 'Admin'"
                      [class.text-indigo-700]="selectedRole() === 'Admin'"
                      class="rounded-xl border border-slate-300 px-3 py-3 text-sm font-medium text-slate-600 transition hover:border-indigo-400"
                    >
                      Admin
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  [disabled]="loading()"
                  class="w-full rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  @if (loading()) {
                    <span>Verifying...</span>
                  } @else {
                    <span>Login to Dashboard</span>
                  }
                </button>
              </form>

              <div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p class="font-semibold text-slate-800">
                  Demo login details
                </p>

                <div class="mt-3 space-y-1">
                  <p>Admin: admin&#64;gmail.com</p>
                  <p>User: user&#64;gmail.com</p>
                  <p>Password: password123</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  selectedRole = signal<UserRole>('General User');
  loading = signal(false);

  loginForm;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      userId: [
        '',
        [Validators.required, Validators.email],
      ],
      password: ['', Validators.required],
    });
  }

  selectRole(role: UserRole): void {
    this.selectedRole.set(role);
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    this.authService
      .login({
        userId: this.loginForm.value.userId ?? '',
        password: this.loginForm.value.password ?? '',
        role: this.selectedRole(),
      })
      .subscribe({
        next: (user) => {
          localStorage.setItem(
            'currentUser',
            JSON.stringify(user)
          );

          this.loading.set(false);

          this.snackBar.open(
            `Welcome ${user.name}`,
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            }
          );

          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading.set(false);

          this.snackBar.open(
            error.error?.message || 'Login failed',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            }
          );
        },
      });
  }
}