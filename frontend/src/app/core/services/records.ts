import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type UserRole = 'General User' | 'Admin';

export interface VerificationRecord {
  id: number;
  employeeName: string;
  verificationType: string;
  status: string;
  accessLevel: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class RecordsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api';

  getRecords(
    role: UserRole,
    delayMs = 3000
  ): Observable<VerificationRecord[]> {
    return this.http.get<VerificationRecord[]>(
      `${this.apiUrl}/records?role=${role}&delay=${delayMs}`
    );
  }
}