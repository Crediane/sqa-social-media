# Testes E2E e de API — SQA Social Media

Projeto de testes (Playwright + TypeScript) que testa o sistema **em execução**, como caixa-preta.

- `tests/e2e/` — fluxos de usuário no navegador (cadastro, login, curtidas)
- `tests/api/` — chamadas diretas aos endpoints da API
- `tests/support/` — dados e funções reutilizáveis pelos testes

## Pré-requisitos

1. MySQL rodando e `api/src/main/resources/application.properties` preenchido
2. API rodando em http://localhost:8080 (`cd api && ./mvnw spring-boot:run`, ou Run no IntelliJ)
3. Frontend rodando em http://localhost:3000 (`cd client && npm run dev`)
4. Internet (a API busca os posts em dummyjson.com)

## Como rodar

```bash
cd tests
npm install
npx playwright install chromium   # só na primeira vez
npm test                          # tudo
npm run test:api                  # só API
npm run test:e2e                  # só E2E
npm run test:headed               # E2E com o navegador visível
npm run report                    # abre o relatório HTML
```

## Testes que falham de propósito (capturam bugs)

| Teste | Bug |
|---|---|
| API: signup com e-mail duplicado | mensagem é "E-mail já está em uso", o requisito pede "E-mail já cadastrado" |
| E2E: cadastro com senha de 8 caracteres | frontend rejeita 8 caracteres (`<= 8` em vez de `< 8`) |
| E2E: sessão após recarregar a página | `localStorage` grava na chave `user` e lê de `sqa_social_user` |
