import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Machine } from '../Models/Machine';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private apiUrl = 'http://localhost:3000/machines';

  constructor(private http: HttpClient) {}

  // ✅ CREATE
  create(machine: Partial<Machine>): Observable<Machine> {
    return this.http.post<Machine>(this.apiUrl, machine);
  }

  // ✅ GET ALL
  findAll(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.apiUrl);
  }

  // ✅ GET BY ID
  findOne(id: number): Observable<Machine> {
    return this.http.get<Machine>(`${this.apiUrl}/${id}`);
  }

  // ✅ UPDATE
  update(id: number, machine: Partial<Machine>): Observable<Machine> {
    return this.http.patch<Machine>(`${this.apiUrl}/${id}`, machine);
  }

  // ✅ DELETE
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}