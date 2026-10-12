import { test, expect } from '@playwright/test';
import { criarUsuarioPelaApi } from '../support/data';
import { entrarPelaTela } from '../support/ui';

/**
 * E2E - Feed de posts e curtidas (com e sem autenticação)
 * Observação: o feed vem da API, que busca os posts em dummyjson.com (precisa de internet).
 */
test.describe('E2E - Curtidas', () => {
  test('usuário deslogado vê um alert ao clicar em "Curtir"', async ({ page }) => {
    await page.goto('/');
    const primeiroPost = page.getByRole('listitem').first();
    await expect(primeiroPost).toBeVisible();

    // O alert nativo do navegador é um "dialog" no Playwright.
    const mensagemDoAlert = new Promise<string>((resolve) => {
      page.once('dialog', async (dialog) => {
        resolve(dialog.message());
        await dialog.accept();
      });
    });

    await primeiroPost.getByRole('button', { name: /curtir/i }).click();

    expect(await mensagemDoAlert).toBe('Você precisa estar autenticado para curtir posts!');
  });

  test('usuário logado curte um post, vê o feedback "Curtido" e o post aparece em "Posts Curtidos"', async ({ page, request }) => {
    const usuario = await criarUsuarioPelaApi(request);
    await entrarPelaTela(page, usuario.email, usuario.senha);

    const primeiroPost = page.getByRole('listitem').first();
    await expect(primeiroPost).toBeVisible();
    const tituloDoPost = await primeiroPost.getByRole('heading').textContent();

    await primeiroPost.getByRole('button', { name: /curtir/i }).click();
    await expect(primeiroPost.getByRole('button', { name: /curtido/i })).toBeVisible();

    await page.getByRole('button', { name: 'Posts Curtidos' }).click();
    await expect(page).toHaveURL(/\/auth\/liked$/);

    const postsCurtidos = page.getByRole('listitem');
    await expect(postsCurtidos).toHaveCount(1);
    await expect(postsCurtidos.first().getByRole('heading')).toHaveText(tituloDoPost!);
  });
});
