import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alarm } from '../Models/Alamre';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {

  private apiUrl = 'http://localhost:3000/alarms';

  constructor(private http: HttpClient) {}

  // ✅ CREATE (avec machineId en query param)
  create(machineId: number, alarm: Partial<Alarm>): Observable<Alarm> {
    const params = new HttpParams().set('machineId', machineId);
    return this.http.post<Alarm>(this.apiUrl, alarm, { params });
  }

  // ✅ GET ALL
  findAll(): Observable<Alarm[]> {
    return this.http.get<Alarm[]>(this.apiUrl);
  }

  // ✅ GET ALL ACTIVE
  findActive(): Observable<Alarm[]> {
    return this.http.get<Alarm[]>(`${this.apiUrl}/active`);
  }

  // ✅ GET ALL INACTIVE
  findInactive(): Observable<Alarm[]> {
    return this.http.get<Alarm[]>(`${this.apiUrl}/inactive`);
  }

  // ✅ GET BY MACHINE
  findByMachine(machineId: number): Observable<Alarm[]> {
    return this.http.get<Alarm[]>(`${this.apiUrl}/machine/${machineId}`);
  }

  // ✅ GET ACTIVE BY MACHINE
  findActiveByMachine(machineId: number): Observable<Alarm[]> {
    return this.http.get<Alarm[]>(`${this.apiUrl}/machine/${machineId}/active`);
  }

  // ✅ GET INACTIVE BY MACHINE
  findInactiveByMachine(machineId: number): Observable<Alarm[]> {
    return this.http.get<Alarm[]>(`${this.apiUrl}/machine/${machineId}/inactive`);
  }

  // ✅ GET BY ID
  findOne(id: number): Observable<Alarm> {
    return this.http.get<Alarm>(`${this.apiUrl}/${id}`);
  }

  // ✅ UPDATE
  update(id: number, alarm: Partial<Alarm>): Observable<Alarm> {
    return this.http.patch<Alarm>(`${this.apiUrl}/${id}`, alarm);
  }

  // ✅ DELETE
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}