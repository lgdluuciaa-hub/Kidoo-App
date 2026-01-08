
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// Use node:process to ensure types for process.cwd() are available in the Node.js environment
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno (incluyendo la que pondrás en Vercel)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Esto permite que 'process.env.API_KEY' funcione en el navegador
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: 'dist',
    },
  };
});
