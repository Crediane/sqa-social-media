import { APIRequestContext, expect } from '@playwright/test';

/** URL da API (Spring Boot). Pode ser trocada com a variável de ambiente API_URL. */
export const API_URL = process.env.API_URL ?? 'http://localhost:8080';

/** Senha que atende a TODOS os critérios (9 caracteres: maiúscula, minúscula, número e especial). */
export const SENHA_VALIDA = 'Teste123@';

/** Senha válida com EXATAMENTE 8 caracteres (requisito: "mínimo 8"). */
export const SENHA_8_CARACTERES = 'Test123@';

/** Gera um e-mail diferente a cada chamada, para os testes não colidirem no banco. */
export function emailUnico(prefixo = 'teste'): string {
  const sufixo = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return `${prefixo}.${sufixo}@teste.com`;
}

/**
 * Cria um usuário diretamente pela API (atalho para preparar o cenário
 * dos testes E2E sem precisar passar pela tela de cadastro).
 */
export async function criarUsuarioPelaApi(
  request: APIRequestContext,
  senha: string = SENHA_VALIDA,
) {
  const email = emailUnico();
  const resp = await request.post(`${API_URL}/auth/signup`, {
    data: { email, password: senha },
  });
  expect(resp.status(), 'o cenário precisa conseguir criar o usuário').toBe(200);
  const usuario = await resp.json();
  return { id: usuario.id as number, email, senha };
}
