export {};

declare global {
  interface Window {
    gtag: (command: 'config' | 'event', trackingId: string, options?: object) => void;
  }
}
