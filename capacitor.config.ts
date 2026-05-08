import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.finds.app',
  appName: 'finds',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
