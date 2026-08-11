import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.survivorspathyouth.app',
  appName: "Survivor's Path Youth",
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
