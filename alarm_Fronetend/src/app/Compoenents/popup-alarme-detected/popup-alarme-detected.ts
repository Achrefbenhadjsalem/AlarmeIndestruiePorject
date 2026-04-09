import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { WebsocketService } from '../../Services/websocket.service';
import { Alarm } from '../../Models/Alamre';
import { AlarmPriority } from '../../Models/ALames-enumes';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-popup-alarme-detected',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './popup-alarme-detected.html',
  styleUrl: './popup-alarme-detected.css',
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(110%)', opacity: 0 }),
        animate('350ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('250ms ease-in',
          style({ transform: 'translateX(110%)', opacity: 0 }))
      ])
    ])
  ]
})
export class PopupAlarmeDetected implements OnInit, OnDestroy {
  public visibleAlarms: Alarm[] = [];
  private sub?: Subscription;
  private alarmAudio: HTMLAudioElement | null = null;

  constructor(private wsService: WebsocketService) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.alarmAudio = new Audio('/TOYElec_Docteur maboul 4 (ID 1685)_LaSonotheque.fr.wav');
      this.alarmAudio.loop = true;
      this.alarmAudio.load();
    }

    this.requestNotificationPermission();

    this.sub = this.wsService.onAlarmCreated.subscribe((alarm) => {
      this.showAlarm(alarm);
    });
  }

  requestNotificationPermission() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }

  showAlarm(alarm: Alarm) {
    // Évite les doublons
    if (this.visibleAlarms.some(a => a.id === alarm.id)) return;

    this.visibleAlarms.unshift(alarm); // Dernier en haut

    // Lancer l'audio seulement au premier alarm actif
    if (this.alarmAudio && this.visibleAlarms.length === 1) {
      this.alarmAudio.play().catch(() => {});
    }

    this.triggerBigPopup(alarm);

    setTimeout(() => this.dismiss(alarm), 8000);
  }

  triggerBigPopup(alarm: Alarm) {
    if (typeof window === 'undefined') return;

    // Toujours rouge foncé quel que soit la priorité
    const priorityLabel = alarm.priority?.toUpperCase() || 'INCONNUE';
    const priorityColor = this.getPriorityColor(alarm.priority);
    const machineName   = alarm.machine?.name || 'Machine inconnue';
    const alarmCode     = alarm.code || 'ALM-????';
    const timestamp     = new Date().toLocaleString('fr-FR');
    const isBlinking    = alarm.priority === AlarmPriority.CRITICAL;

    // Popup plus grande et centrée
    const width  = 1000;
    const height = 700;
    const left   = Math.round((window.screen.width  / 2) - (width  / 2));
    const top    = Math.round((window.screen.height / 2) - (height / 2));

    const popup = window.open(
      '',
      `alarm_${alarm.id}`,
      `width=${width},height=${height},top=${top},left=${left},scrollbars=no,resizable=no,toolbar=no,menubar=no`
    );

    if (!popup) {
      console.warn('Popup bloqué — fallback notification navigateur.');
      this.triggerBrowserNotification(alarm);
      return;
    }

    popup.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>⚠ ALARME — ${alarmCode}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:           #ffffff;
      --surface:      #f8fafc;
      --surface-2:    #f1f5f9;
      --text:         #0f172a;
      --text-muted:   #475569;
      --text-dim:     #64748b;
      --border:       #e2e8f0;
      --accent:       ${priorityColor};
      --red-bright:   #ef4444;
      --font:         'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    html, body {
      width: 100%; height: 100%;
      background: var(--bg);
      color: var(--text);
      font-family: var(--font);
      overflow: hidden;
    }

    /* Fond clignotant discret sur CRITIQUE uniquement */
    ${isBlinking ? `
    @keyframes bg-blink {
      0%, 100% { background: var(--bg); }
      50%       { background: #fff1f2; }
    }
    body { animation: bg-blink 1.2s ease-in-out infinite; }` : ''}

    /* Bandeau supérieur */
    .topbar {
      height: 56px;
      background: var(--accent);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40px;
      color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .topbar-icon {
      width: 28px;
      height: 28px;
    }

    .topbar-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .topbar-right {
      font-size: 13px;
      font-weight: 500;
      opacity: 0.9;
    }

    /* Contenu principal */
    .main {
      padding: 40px;
      display: flex;
      flex-direction: column;
      height: calc(100% - 56px - 80px);
      overflow-y: auto;
    }

    /* En-tête alarme */
    .alarm-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 32px;
    }

    .alarm-code {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .alarm-title {
      font-size: 32px;
      font-weight: 800;
      color: var(--text);
      line-height: 1.2;
    }

    .priority-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 20px;
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      color: var(--accent);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      text-transform: uppercase;
    }

    .priority-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--accent);
      animation: dot-pulse 1.5s ease-in-out infinite;
    }

    @keyframes dot-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%       { transform: scale(1.2); opacity: 0.5; }
    }

    /* Message d'alarme important */
    .alarm-message {
      font-size: 18px;
      font-weight: 500;
      color: var(--text);
      padding: 24px;
      background: var(--surface);
      border-radius: 12px;
      border-left: 6px solid var(--accent);
      margin-bottom: 32px;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
    }

    /* Grille de données */
    .data-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .data-cell {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
    }

    .data-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-dim);
      margin-bottom: 6px;
    }

    .data-value {
      font-size: 16px;
      font-weight: 700;
      color: var(--text);
    }

    /* Log système moderne */
    .log-box {
      background: var(--surface-2);
      border-radius: 12px;
      padding: 20px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 13px;
    }

    .log-header {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-dim);
      margin-bottom: 12px;
    }

    .log-line {
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .log-line span { color: var(--accent); font-weight: 600; }

    /* Pied de page — actions */
    .footer {
      height: 80px;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 0 40px;
      background: var(--surface);
      border-top: 1px solid var(--border);
    }

    .btn-ack {
      padding: 14px 40px;
      background: var(--accent);
      color: white;
      font-size: 14px;
      font-weight: 700;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-ack:hover { 
      filter: brightness(1.1);
      transform: translateY(-1px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .btn-ack:active { transform: translateY(0); }

    .btn-sec {
      padding: 14px 28px;
      background: white;
      color: var(--text-muted);
      font-size: 14px;
      font-weight: 600;
      border: 1px solid var(--border);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-sec:hover {
      background: var(--surface-2);
      color: var(--text);
    }

    .footer-status {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 0 4px ${priorityColor}20;
    }
  </style>
</head>
<body>

  <div class="topbar">
    <div class="topbar-left">
      <svg class="topbar-icon" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span class="topbar-title">Notification d'alarme système</span>
    </div>
    <div class="topbar-right">${timestamp}</div>
  </div>

  <div class="main">
    <div class="alarm-header">
      <div>
        <div class="alarm-code">${alarmCode}</div>
        <div class="alarm-title">${machineName}</div>
      </div>
      <div class="priority-chip">
        <span class="priority-dot"></span>
        ${priorityLabel}
      </div>
    </div>

    <div class="alarm-message">${alarm.message}</div>

    <div class="data-grid">
      <div class="data-cell">
        <div class="data-label">Code Alarme</div>
        <div class="data-value">${alarmCode}</div>
      </div>
      <div class="data-cell">
        <div class="data-label">Heure de détection</div>
        <div class="data-value">${timestamp}</div>
      </div>
    </div>

    <div class="log-box">
      <div class="log-header">Détails techniques</div>
      <div class="log-line"><span>[SYS]</span> Alarme initiale enregistrée sous l'ID #${alarm.id}</div>
      <div class="log-line"><span>[LOG]</span> Serveur WebSocket a relayé l'événement vers le terminal.</div>
      <div class="log-line"><span>[SRV]</span> Attente de l'intervention de l'opérateur…</div>
    </div>
  </div>

  <div class="footer">
    <button class="btn-ack" onclick="acknowledgeAndClose()">Acquitter &amp; Fermer</button>
    <button class="btn-sec" onclick="window.close()">Ignorer</button>
    <div class="footer-status">
      <span class="status-dot"></span>
      Intervention requise
    </div>
  </div>

  <script>
    const audio = new Audio(window.opener?.location?.origin + '/TOYElec_Docteur maboul 4 (ID 1685)_LaSonotheque.fr.wav');
    audio.loop = true;

    function tryPlay() { audio.play().catch(() => {}); }
    tryPlay();
    document.body.addEventListener('click', tryPlay, { once: true });

    window.addEventListener('beforeunload', () => {
      audio.pause();
      audio.currentTime = 0;
    });

    function acknowledgeAndClose() {
      audio.pause();
      window.close();
    }
  </script>
</body>
</html>`);

    popup.document.close();
    popup.focus();
  }

  triggerBrowserNotification(alarm: Alarm) {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const n = new Notification(`⚠ Alarme ${alarm.priority} — ${alarm.machine?.name || 'Machine inconnue'}`, {
        body: alarm.message,
        icon: 'assets/alarm-icon.png',
        tag: `alarm-${alarm.id}`,
        requireInteraction: true
      } as NotificationOptions);

      n.onclick = () => { window.focus(); n.close(); };
    }
  }

  dismiss(alarm: Alarm) {
    this.visibleAlarms = this.visibleAlarms.filter(a => a.id !== alarm.id);

    if (this.visibleAlarms.length === 0 && this.alarmAudio) {
      this.alarmAudio.pause();
      this.alarmAudio.currentTime = 0;
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.alarmAudio?.pause();
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case AlarmPriority.CRITICAL: return '#ff4444';
      case AlarmPriority.MEDIUM:   return '#ff4444'; // Changé de orange à rouge
      case AlarmPriority.LOW:      return '#55aaff';
      default:                     return '#ff4444';
    }
  }
}