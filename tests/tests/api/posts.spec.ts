import { test, expect } from '@playwright/test';
import { API_URL, criarUsuarioPelaApi } from '../support/data';

/**
 * Testes de API (caixa-preta) - /posts
 * Observação: a API busca os posts no site público dummyjson.com,
 * então estes testes precisam de internet.
 */
test.describe('API - /posts', () => {
  test('GET /posts retorna a lista de posts com título, corpo e flag "liked"', async ({ request }) => {
    const resp = await request.get(`${API_URL}/posts`, { params: { limit: 5, skip: 0 } });

    expect(resp.status()).toBe(200);
    const corpo = await resp.json();
    expect(corpo.posts).toHaveLength(5);
    for (const post of corpo.posts) {
      expect(typeof post.title).toBe('string');
      expect(typeof post.body).toBe('string');
      expect(post.liked).toBe(false); // sem userId, nenhum post vem curtido
    }
  });

  test('POST /posts/{id}/like alterna entre curtir e descurtir, e reflete em /posts/liked', async ({ request }) => {
    const usuario = await criarUsuarioPelaApi(request);
    const postId = 1;

    // 1ª chamada: curte
    const curtir = await request.post(`${API_URL}/posts/${postId}/like`, {
      params: { userId: usuario.id },
    });
    expect(curtir.status()).toBe(200);
    expect(await curtir.json()).toEqual({ postId, liked: true });

    // O post agora aparece na lista de curtidos do usuário
    const curtidos = await request.get(`${API_URL}/posts/liked`, {
      params: { userId: usuario.id },
    });
    expect(curtidos.status()).toBe(200);
    const lista = await curtidos.json();
    expect(lista.total).toBe(1);
    expect(lista.posts[0].id).toBe(postId);

    // 2ª chamada: descurta
    const descurtir = await request.post(`${API_URL}/posts/${postId}/like`, {
      params: { userId: usuario.id },
    });
    expect(await descurtir.json()).toEqual({ postId, liked: false });
  });
});
