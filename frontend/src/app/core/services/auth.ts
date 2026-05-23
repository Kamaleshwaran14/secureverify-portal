import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type UserRole = 'General User' | 'Admin';

export interface LoginPayload {
  userId: string;
  password: string;
  role: UserRole;
}

export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  accessLevel: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api';

  login(payload: LoginPayload): Observable<UserSession> {
    return this.http.post<UserSession>(
      `${this.apiUrl}/login`,
      payload
    );
  }
}