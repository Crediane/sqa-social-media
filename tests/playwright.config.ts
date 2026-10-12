import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do projeto de testes (caixa-preta) do SQA Social Media.
 *
 * Pré-requisito: o sistema precisa estar rodando.
 *   - Frontend (Next.js): http://localhost:3000
 *   - API (Spring Boot):  http://localhost:8080
 */
export default defineConfig({
  testDir: './tests',

  // Os testes criam usuários com e-mails únicos, então podem rodar em paralelo.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,

  // 'list' mostra cada teste no terminal (bom para demonstrar);
  // 'html' gera o relatório navegável (npm run report).
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    // Permite usar page.goto('/signin') nos testes E2E.
    baseURL: process.env.WEB_URL ?? 'http://localhost:3000',
    // Guarda evidências quando um teste falha (útil para mostrar o bug).
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  // Apenas Chromium: suficiente para a atividade e evita baixar 3 navegadores.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
