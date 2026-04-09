import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../Services/websocket.service';
import { Alarm } from '../../Models/Alamre';
import { AlarmPriority } from '../../Models/ALames-enumes';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-popup-alarme-detected',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-alarme-detected.html',
  styleUrl: './popup-alarme-detected.css',
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class PopupAlarmeDetected implements OnInit, OnDestroy {
  public visibleAlarms: Alarm[] = [];
  private sub?: Subscription;

  constructor(private wsService: WebsocketService) {}

  ngOnInit() {
    this.requestNotificationPermission();

    this.sub = this.wsService.onAlarmCreated.subscribe((alarm) => {
      this.showAlarm(alarm);
    });
  }

  requestNotificationPermission() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            console.log('✅ Notifications navigateur autorisées.');
          }
        });
      }
    }
  }

  showAlarm(alarm: Alarm) {
    this.visibleAlarms.push(alarm);
    this.triggerBigPopup(alarm);
    
    // Auto dismiss after 8 seconds
    setTimeout(() => {
      this.dismiss(alarm);
    }, 8000);
  }

  triggerBigPopup(alarm: Alarm) {
    if (typeof window === 'undefined') return;

    const bg = alarm.priority === AlarmPriority.CRITICAL ? 'darkred' : (alarm.priority === AlarmPriority.MEDIUM ? 'darkorange' : 'darkgreen');
    const anim = alarm.priority === AlarmPriority.CRITICAL ? 'animation: blink 1s infinite;' : '';
    
    // Popup massive, centrée sur l'écran
    const width = 800;
    const height = 600;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    const popup = window.open('', '_blank', `width=${width},height=${height},top=${top},left=${left},scrollbars=no,resizable=no`);
    
    if (popup) {
      popup.document.write(`
        <html>
          <head>
            <title>🚨 ALARME DETECTEE !</title>
            <style>
              body { 
                background-color: ${bg}; 
                color: white; 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                display: flex; flex-direction: column; align-items: center; justify-content: center; 
                height: 100vh; margin: 0; text-align: center;
                ${anim}
              }
              @keyframes blink { 0% { background-color: darkred; } 50% { background-color: red; } 100% { background-color: darkred; } }
              h1 { font-size: 5rem; margin: 0; text-transform: uppercase; text-shadow: 2px 2px 4px #000; }
              .machine-name { font-size: 3rem; color: yellow; text-shadow: 1px 1px 3px #000; margin-top: 10px; }
              .message { font-size: 2.5rem; margin: 20px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px; }
              button { 
                padding: 20px 50px; font-size: 2rem; cursor: pointer; border: none; background: white; 
                color: ${bg}; border-radius: 10px; font-weight: bold; margin-top: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                transition: transform 0.1s, background 0.3s;
              }
              button:hover { background: #f0f0f0; transform: scale(1.05); }
              button:active { transform: scale(0.95); }
            </style>
          </head>
          <body>
            <h1>🚨 ALARME: ${alarm.priority}</h1>
            <div class="machine-name">Machine: ${alarm.machine?.name || 'Inconnue'}</div>
            <div class="message">${alarm.message}</div>
            <button onclick="window.close()">Acquitter / Fermer</button>
            <script>
               let beepInterval;
               const ctx = new (window.AudioContext || window.webkitAudioContext)();
               function beep() {
                 try {
                   const osc = ctx.createOscillator();
                   const gain = ctx.createGain();
                   osc.connect(gain);
                   gain.connect(ctx.destination);
                   osc.type = 'square';
                   osc.frequency.value = 800; // Fréquence d'alarme
                   osc.start();
                   gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.8);
                   setTimeout(() => osc.stop(), 800);
                 } catch(e) {}
               }
               // Play beep every 2 seconds
               beep();
               beepInterval = setInterval(beep, 2000);
               window.addEventListener('beforeunload', () => clearInterval(beepInterval));
            </script>
          </body>
        </html>
      `);
      popup.document.close();
      popup.focus(); // Force au premier plan
    } else {
      console.warn('⚠️ POPUP BLOQUÉ : Veuillez autoriser les popups pour ce site afin d\'afficher la grande alerte.');
      // En solution de repli (si bloqué), afficher la petite notification standard
      this.triggerBrowserNotification(alarm);
    }
  }

  triggerBrowserNotification(alarm: Alarm) {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('🚨 Alarme ! (Popup Bloqué)', {
        body: `Machine: ${alarm.machine?.name || 'Inconnue'}\nMessage: ${alarm.message}`,
        icon: 'assets/alarm-icon.png',
        tag: `alarm-${alarm.id}`
      } as any);

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  dismiss(alarm: Alarm) {
    this.visibleAlarms = this.visibleAlarms.filter(a => a !== alarm);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case AlarmPriority.CRITICAL: return '#ff4444';
      case AlarmPriority.MEDIUM: return '#ffaa00';
      case AlarmPriority.LOW: return '#00C851';
      default: return '#007bff';
    }
  }
}
