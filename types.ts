export type Platform = 'Twitter' | 'Reddit' | 'Instagram' | 'Facebook' | 'TikTok';

export interface Alert {
  id: string;
  platform: Platform;
  username: string;
  timestamp: string;
  content: string;
  keywordDetected: string;
  url: string;
  metadata: {
    likes: number;
    comments: number;
    shares: number;
  };
  emailSent: boolean;
  emailSentAt?: string;
}

export interface MonitoringConfig {
  keywords: string[];
  targetEmail: string;
  platforms: Platform[];
  isMonitoring: boolean;
}

export interface EmailLogEntry {
  id: string;
  timestamp: string;
  recipient: string;
  subject: string;
  body: string;
  triggerAlertId: string;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  LIVE_FEED = 'LIVE_FEED',
  EMAIL_LOGS = 'EMAIL_LOGS',
  SETTINGS = 'SETTINGS',
}