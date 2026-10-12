import { Page, expect } from '@playwright/test';

/** Faz login pela tela /signin (o botão do formulário, não o do header). */
export async function entrarPelaTela(page: Page, email: string, senha: string) {
  await page.goto('/signin');
  await page.getByPlaceholder('seu@email.com').fill(email);
  await page.getByPlaceholder('••••••••').fill(senha);
  await page.locator('form').getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL('/');
}
