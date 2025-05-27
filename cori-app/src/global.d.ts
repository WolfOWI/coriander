export {};

declare global {
  interface Window {
    electronAPI?: {
      startGoogleOAuth: () => Promise<void>;
      onGoogleToken: (callback: (token: string) => void) => void;
    };
  }
}
