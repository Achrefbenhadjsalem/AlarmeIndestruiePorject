import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { Alarm } from '../Models/Alamre';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  private socket: Socket;
  private alarmCreatedSubject = new Subject<Alarm>();

  constructor() {
    // Initialize standard socket connection. 
    // Assuming backend is at localhost:3000 where our REST API is.
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server');
    });

    // Listen for alarmCreated
    this.socket.on('alarmCreated', (alarm: Alarm) => {
      console.log('🔔 New Alarm Received via WebSocket:', alarm);
      this.alarmCreatedSubject.next(alarm);
    });
  }

  // Expose as observable
  public get onAlarmCreated(): Observable<Alarm> {
    return this.alarmCreatedSubject.asObservable();
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
