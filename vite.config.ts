
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement (dont .env.local)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // On injecte la clé API pour qu'elle soit accessible dans le code
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.GEMINI_API_KEY || '')
    },
    server: {
      port: 3000,
      strictPort: true,
      // Configuration pour éviter les erreurs de WebSocket (Error 101)
      hmr: {
        protocol: 'ws',
        host: 'localhost'
      }
    }
  };
});
