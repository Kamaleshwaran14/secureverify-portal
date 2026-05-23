import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type UserRole = 'General User' | 'Admin';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  accessLevel?: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api';

  getUsers(delayMs = 1500): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(
      `${this.apiUrl}/users?delay=${delayMs}`
    );
  }

  addUser(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(
      `${this.apiUrl}/users`,
      user
    );
  }

  deleteUser(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `${this.apiUrl}/users/${id}`
    );
  }
}