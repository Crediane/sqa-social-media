import { test, expect } from '@playwright/test';
import { SENHA_VALIDA, SENHA_8_CARACTERES, emailUnico, criarUsuarioPelaApi } from '../support/data';
import { entrarPelaTela } from '../support/ui';

/**
 * E2E - Cadastro e Login
 * Simulam um usuário real no navegador, com frontend + API + banco rodando.
 */
test.describe('E2E - Cadastro e login', () => {
  test('cadastro com dados válidos autentica o usuário e redireciona para a home', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Criar Conta' }).click();
    await expect(page).toHaveURL(/\/signup$/);

    await page.getByPlaceholder('seu@email.com').fill(emailUnico());
    const campoSenha = page.getByPlaceholder('••••••••');
    await campoSenha.nth(0).fill(SENHA_VALIDA);
    await campoSenha.nth(1).fill(SENHA_VALIDA);
    await page.locator('form').getByRole('button', { name: 'Criar Conta' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Posts Curtidos' })).toBeVisible();
  });

  // BUG DE FRONTEND: o requisito diz "mínimo 8 caracteres", mas a tela rejeita
  // senhas com EXATAMENTE 8 caracteres (utils/password.ts usa "<= 8").
  test('cadastro com senha de exatamente 8 caracteres deve ser aceito (requisito: mínimo 8)', async ({ page }) => {
    await page.goto('/signup');

    await page.getByPlaceholder('seu@email.com').fill(emailUnico());
    const campoSenha = page.getByPlaceholder('••••••••');
    await campoSenha.nth(0).fill(SENHA_8_CARACTERES);
    await campoSenha.nth(1).fill(SENHA_8_CARACTERES);
    await page.locator('form').getByRole('button', { name: 'Criar Conta' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  });

  test('login com credenciais corretas autentica o usuário e redireciona para a home', async ({ page, request }) => {
    const usuario = await criarUsuarioPelaApi(request);

    await entrarPelaTela(page, usuario.email, usuario.senha);

    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toHaveCount(0);
  });

  // BUG DE FRONTEND: lib/localStorage.ts grava o usuário na chave "user" mas
  // lê da chave "sqa_social_user". A sessão some ao recarregar a página.
  test('usuário logado continua logado depois de recarregar a página (F5)', async ({ page, request }) => {
    const usuario = await criarUsuarioPelaApi(request);
    await entrarPelaTela(page, usuario.email, usuario.senha);
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();

    await page.reload();

    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  });
});
