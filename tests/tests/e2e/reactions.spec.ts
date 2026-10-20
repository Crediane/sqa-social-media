import { test, expect } from '@playwright/test';
import { API_URL } from '../support/data';

/**
 * E2E - Nova feature: curtidas e descurtidas (reactions) na home.
 * Compara o que a TELA mostra com o que a API devolve para os mesmos posts.
 * Observação: os dados vêm do dummyjson.com (precisa de internet).
 */
test.describe('E2E - Curtidas e descurtidas na home', () => {
  test('cada post da home exibe o número de curtidas e descurtidas vindo da API', async ({ page, request }) => {
    // A home carrega 10 posts por vez (limit=10, skip=0).
    const resp = await request.get(`${API_URL}/posts`, { params: { limit: 10, skip: 0 } });
    expect(resp.status()).toBe(200);
    const { posts } = await resp.json();
    expect(posts).toHaveLength(10);

    await page.goto('/');
    const cards = page.getByRole('listitem');
    await expect(cards).toHaveCount(10);

    for (let i = 0; i < posts.length; i++) {
      const card = cards.nth(i);
      await expect(card.getByTestId('post-likes')).toContainText(String(posts[i].reactions.likes));
      await expect(card.getByTestId('post-dislikes')).toContainText(String(posts[i].reactions.dislikes));
    }
  });
});
