import { test, expect } from '@playwright/test';
import { API_URL, SENHA_VALIDA, emailUnico, criarUsuarioPelaApi } from '../support/data';

/**
 * Testes de API (caixa-preta) - /auth
 * Entradas conhecidas -> saída esperada segundo o documento de requisitos.
 * Não olhamos o código da API: só status HTTP e corpo da resposta.
 */
test.describe('API - /auth', () => {
  test('POST /auth/signup com dados válidos cria o usuário (200)', async ({ request }) => {
    const email = emailUnico();

    const resp = await request.post(`${API_URL}/auth/signup`, {
      data: { email, password: SENHA_VALIDA },
    });

    expect(resp.status()).toBe(200);
    const corpo = await resp.json();
    expect(typeof corpo.id).toBe('number');
    expect(corpo.email).toBe(email);
  });

  // BUG DE API: o requisito diz que a mensagem deve ser "E-mail já cadastrado",
  // mas a API devolve "E-mail já está em uso". O status 409 está correto,
  // o que diverge é o texto da mensagem.
  test('POST /auth/signup com e-mail duplicado retorna 409 e "E-mail já cadastrado"', async ({ request }) => {
    const usuario = await criarUsuarioPelaApi(request);

    const resp = await request.post(`${API_URL}/auth/signup`, {
      data: { email: usuario.email, password: SENHA_VALIDA },
    });

    expect(resp.status()).toBe(409);
    const corpo = await resp.json();
    expect(corpo.message).toBe('E-mail já cadastrado');
  });

  test('POST /auth/signup com e-mail em formato inválido retorna 422', async ({ request }) => {
    const resp = await request.post(`${API_URL}/auth/signup`, {
      data: { email: 'email-sem-arroba', password: SENHA_VALIDA },
    });

    expect(resp.status()).toBe(422);
    const corpo = await resp.json();
    expect(corpo.message).toBe('E-mail inválido');
  });

  test('POST /auth/signup com senha fraca (sem caractere especial) retorna 422', async ({ request }) => {
    const resp = await request.post(`${API_URL}/auth/signup`, {
      data: { email: emailUnico(), password: 'Teste1234' },
    });

    expect(resp.status()).toBe(422);
    const corpo = await resp.json();
    expect(corpo.message).toBe('Senha inválida');
  });

  test('POST /auth/signin com credenciais corretas retorna 200 e o usuário', async ({ request }) => {
    const usuario = await criarUsuarioPelaApi(request);

    const resp = await request.post(`${API_URL}/auth/signin`, {
      data: { email: usuario.email, password: usuario.senha },
    });

    expect(resp.status()).toBe(200);
    const corpo = await resp.json();
    expect(corpo.id).toBe(usuario.id);
    expect(corpo.email).toBe(usuario.email);
  });

  test('POST /auth/signin com senha errada retorna 401 "Credenciais inválidas"', async ({ request }) => {
    const usuario = await criarUsuarioPelaApi(request);

    const resp = await request.post(`${API_URL}/auth/signin`, {
      data: { email: usuario.email, password: 'Outra123@' },
    });

    expect(resp.status()).toBe(401);
    const corpo = await resp.json();
    expect(corpo.message).toBe('Credenciais inválidas');
  });

  test('POST /auth/reset-password com e-mail não cadastrado retorna 404 "Usuário não encontrado"', async ({ request }) => {
    const resp = await request.post(`${API_URL}/auth/reset-password`, {
      data: { email: emailUnico('naoexiste') },
    });

    expect(resp.status()).toBe(404);
    const corpo = await resp.json();
    expect(corpo.message).toBe('Usuário não encontrado');
  });
});
