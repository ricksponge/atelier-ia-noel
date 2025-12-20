
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Charge les variables des fichiers .env.*
  const env = loadEnv(mode, process.cwd(), '');
  
  // Sur Vercel, les variables sont dans process.env
  // On donne la priorité à la variable système si elle existe
  const apiKey = env.API_KEY || process.env.API_KEY || env.GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Cette substitution transforme process.env.API_KEY en sa valeur réelle pendant le build
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    server: {
      port: 3000,
      strictPort: true,
      hmr: {
        protocol: 'ws',
        host: 'localhost'
      }
    },
    build: {
      outDir: 'dist',
    }
  };
});
