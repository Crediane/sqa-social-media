import { defineConfig } from '@playwright/test';
import base from './playwright.config';

/**
 * Configuração para DEMONSTRAÇÃO ao vivo (npm run test:demo).
 * Reaproveita a configuração principal, mas:
 *  - roda um teste por vez (uma janela de navegador só, fácil de acompanhar)
 *  - coloca uma pausa de 1 segundo entre cada ação (slowMo)
 *  - aumenta o tempo limite de cada teste, já que ele fica mais lento
 */
export default defineConfig({
  ...base,
  workers: 1,
  fullyParallel: false,
  timeout: 120_000,
  use: {
    ...base.use,
    headless: false,
    launchOptions: { slowMo: 1000 },
  },
});