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

import {
  RecordsService,
  VerificationRecord,
} from '../../../../core/services/records';

import {
  AppUser,
  UsersService,
} from '../../../../core/services/users';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="min-h-screen bg-slate-50">

      <!-- HEADER -->
      <header class="border-b border-slate-200 bg-white px-8 py-5">
        <div
          class="mx-auto flex max-w-7xl items-center justify-between"
        >
          <div>
            <h1 class="text-2xl font-bold text-slate-900">
              SecureVerify Portal
            </h1>

            <p class="text-slate-500">
              Verification dashboard
            </p>
          </div>

          <button
            (click)="logout()"
            class="rounded-xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </header>

      <main class="mx-auto max-w-7xl space-y-8 p-8">

        <!-- KPI CARDS -->
        <section
          class="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          <div
            class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p class="text-sm text-slate-500">
              Total Records
            </p>

            <h3
              class="mt-3 text-4xl font-bold text-slate-900"
            >
              {{ records().length }}
            </h3>
          </div>

          <div
            class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p class="text-sm text-slate-500">
              Verified
            </p>

            <h3
              class="mt-3 text-4xl font-bold text-emerald-600"
            >
              {{ verifiedCount() }}
            </h3>
          </div>

          <div
            class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p class="text-sm text-slate-500">
              Pending
            </p>

            <h3
              class="mt-3 text-4xl font-bold text-amber-500"
            >
              {{ pendingCount() }}
            </h3>
          </div>

          <div
            class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p class="text-sm text-slate-500">
              Active Users
            </p>

            <h3
              class="mt-3 text-4xl font-bold text-indigo-600"
            >
              {{ users().length || 2 }}
            </h3>
          </div>
        </section>

        <!-- USER INFO -->
        <section
          class="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div
            class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <p
                class="mb-2 text-sm font-medium uppercase tracking-wider text-indigo-600"
              >
                Logged in user
              </p>

              <h2
                class="text-4xl font-bold text-slate-900"
              >
                {{ currentUser?.name }}
              </h2>

              <p class="mt-2 text-slate-500">
                {{ currentUser?.email }}
              </p>
            </div>

            <div class="flex flex-wrap gap-4">
              <div
                class="rounded-3xl bg-slate-100 px-6 py-5"
              >
                <p class="text-sm text-slate-500">
                  Role
                </p>

                <h3 class="text-lg font-semibold">
                  {{ currentUser?.role }}
                </h3>
              </div>

              <div
                class="rounded-3xl bg-slate-100 px-6 py-5"
              >
                <p class="text-sm text-slate-500">
                  Access
                </p>

                <h3 class="text-lg font-semibold">
                  {{ currentUser?.accessLevel }}
                </h3>
              </div>
            </div>
          </div>
        </section>

        <!-- RECORDS TABLE -->
        <section
          class="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div class="mb-8">
            <h2
              class="text-2xl font-bold text-slate-900"
            >
              Verification Records
            </h2>

            <p class="text-slate-500">
              Async API loading simulation
            </p>
          </div>

          @if (loading()) {
            <div class="space-y-4">
              <div
                class="h-16 animate-pulse rounded-2xl bg-slate-100"
              ></div>

              <div
                class="h-16 animate-pulse rounded-2xl bg-slate-100"
              ></div>

              <div
                class="h-16 animate-pulse rounded-2xl bg-slate-100"
              ></div>
            </div>
          } @else {
            <div
              class="overflow-hidden rounded-3xl border border-slate-200"
            >
              <table class="w-full">
                <thead class="bg-slate-100">
                  <tr>
                    <th class="p-5 text-left">
                      Employee
                    </th>

                    <th class="p-5 text-left">
                      Verification
                    </th>

                    <th class="p-5 text-left">
                      Status
                    </th>

                    <th class="p-5 text-left">
                      Access
                    </th>
                  </tr>
                </thead>

                <tbody>
                  @for (
                    record of records();
                    track record.id
                  ) {
                    <tr
                      class="border-t border-slate-200"
                    >
                      <td class="p-5">
                        {{ record.employeeName }}
                      </td>

                      <td class="p-5">
                        {{ record.verificationType }}
                      </td>

                      <td class="p-5">
                        {{ record.status }}
                      </td>

                      <td class="p-5">
                        <span
                          class="rounded-full px-3 py-1 text-sm font-medium"
                          [class.bg-indigo-100]="
                            record.accessLevel ===
                            'Admin'
                          "
                          [class.text-indigo-700]="
                            record.accessLevel ===
                            'Admin'
                          "
                          [class.bg-emerald-100]="
                            record.accessLevel ===
                            'General User'
                          "
                          [class.text-emerald-700]="
                            record.accessLevel ===
                            'General User'
                          "
                        >
                          {{ record.accessLevel }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>

        <!-- ADMIN PANEL -->
        @if (currentUser?.role === 'Admin') {
          <section
            class="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div class="mb-8">
              <h2
                class="text-2xl font-bold text-slate-900"
              >
                User Management
              </h2>

              <p class="text-slate-500">
                Admin access only
              </p>
            </div>

            <form
              [formGroup]="userForm"
              class="mb-8 grid gap-4 md:grid-cols-4"
            >
              <input
                formControlName="name"
                placeholder="Full name"
                class="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />

              <input
                formControlName="email"
                placeholder="Email address"
                class="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              />

              <select
                formControlName="role"
                class="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option value="General User">
                  General User
                </option>

                <option value="Admin">
                  Admin
                </option>
              </select>

              <button
                type="button"
                (click)="addUser()"
                class="rounded-2xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700"
              >
                Add User
              </button>
            </form>

            <div
              class="overflow-hidden rounded-3xl border border-slate-200"
            >
              <table class="w-full">
                <thead class="bg-slate-100">
                  <tr>
                    <th class="p-4 text-left">
                      Name
                    </th>

                    <th class="p-4 text-left">
                      Email
                    </th>

                    <th class="p-4 text-left">
                      Role
                    </th>

                    <th class="p-4 text-left">
                      Status
                    </th>

                    <th class="p-4 text-left">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  @for (
                    user of users();
                    track user.id
                  ) {
                    <tr
                      class="border-t border-slate-200"
                    >
                      <td class="p-4">
                        {{ user.name }}
                      </td>

                      <td class="p-4">
                        {{ user.email }}
                      </td>

                      <td class="p-4">
                        {{ user.role }}
                      </td>

                      <td class="p-4">
                        {{ user.status }}
                      </td>

                      <td class="p-4">
                        <button
                          (click)="deleteUser(user.id)"
                          class="rounded-xl bg-red-100 px-4 py-2 text-red-600 transition hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
        }
      </main>
    </div>
  `,
})
export class Dashboard {
  private router = inject(Router);
  private recordService =
    inject(RecordsService);
  private usersService =
    inject(UsersService);
  private snackBar =
    inject(MatSnackBar);

  loading = signal(true);
  usersLoading = signal(false);

  records =
    signal<VerificationRecord[]>([]);

  users = signal<AppUser[]>([]);

  currentUser = JSON.parse(
    localStorage.getItem(
      'currentUser'
    ) || '{}'
  );

  userForm;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],
      role: ['General User'],
    });

    this.loadRecords();

    if (
      this.currentUser?.role ===
      'Admin'
    ) {
      this.loadUsers();
    }
  }

  loadRecords(): void {
    this.recordService
      .getRecords(
        this.currentUser.role,
        3000
      )
      .subscribe({
        next: (records) => {
          this.records.set(records);
          this.loading.set(false);
        },
      });
  }

  loadUsers(): void {
    this.usersLoading.set(true);

    this.usersService
      .getUsers()
      .subscribe({
        next: (users) => {
          this.users.set(users);
          this.usersLoading.set(false);
        },
      });
  }

  addUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const user: AppUser = {
      id: Date.now(),
      name:
        this.userForm.value.name ?? '',
      email:
        this.userForm.value.email ??
        '',
      role:
        (this.userForm.value.role as
          | 'Admin'
          | 'General User') ??
        'General User',
      status: 'Active',
    };

    this.usersService
      .addUser(user)
      .subscribe({
        next: () => {
          this.users.update(
            (existingUsers) => [
              ...existingUsers,
              user,
            ]
          );

          this.userForm.reset({
            role: 'General User',
          });

          this.snackBar.open(
            'User added successfully',
            'Close',
            {
              duration: 3000,
              horizontalPosition:
                'right',
              verticalPosition:
                'top',
            }
          );
        },
      });
  }

  deleteUser(id: number): void {
    this.usersService
      .deleteUser(id)
      .subscribe({
        next: () => {
          this.users.update(
            (existingUsers) =>
              existingUsers.filter(
                (user) =>
                  user.id !== id
              )
          );

          this.snackBar.open(
            'User deleted successfully',
            'Close',
            {
              duration: 3000,
              horizontalPosition:
                'right',
              verticalPosition:
                'top',
            }
          );
        },
      });
  }

  verifiedCount(): number {
    return this.records().filter(
      (record) =>
        record.status ===
        'Verified'
    ).length;
  }

  pendingCount(): number {
    return this.records().filter(
      (record) =>
        record.status === 'Pending'
    ).length;
  }

  logout(): void {
    localStorage.removeItem(
      'currentUser'
    );

    this.snackBar.open(
      'Logged out successfully',
      'Close',
      {
        duration: 2500,
        horizontalPosition:
          'right',
        verticalPosition: 'top',
      }
    );

    this.router.navigate([
      '/login',
    ]);
  }
}