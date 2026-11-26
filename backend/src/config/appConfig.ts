export interface AppConfig {
  frontendOrigin: string;
  /** Number of reverse proxies in front of the server, needed to see the real client address. */
  trustProxyHops: number;
  checksPerHour: number;
  dailyCheckLimit: number;
  feedbackPerHour: number;
  cacheTtlSeconds: number;
}

export const defaultConfig: AppConfig = {
  frontendOrigin: 'http://localhost:3000',
  trustProxyHops: 0,
  checksPerHour: 10,
  dailyCheckLimit: 100,
  feedbackPerHour: 20,
  cacheTtlSeconds: 3600,
};
