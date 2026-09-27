# SQA Social Media

Projeto educacional com uma API Spring Boot e um frontend Next.js.

## Visão Geral

- `api/`: backend Java 17 com Spring Boot, autenticação, usuários, posts e curtidas.
- `client/`: frontend Next.js/React que consome a API.

Principais rotas da aplicação:

- Frontend: `http://localhost:3000`
- API: `http://localhost:8080`

## Como Rodar

**Pré-requisitos:**
- Git
- Docker e Docker Compose instalados

**Passo a passo:**

1. Clone o repositório e acesse a pasta do projeto:
`bash
git clone https://github.com/Crediane/trabalho-docker-nuvem.git
cd sqa-social-media
`

2. Configure as variáveis de ambiente:
Como medida de segurança, as senhas reais não estão versionadas. Crie um arquivo chamado `.env` na raiz do projeto (ou faça uma cópia do `.env.example`) e preencha com as credenciais locais desejadas para o banco de dados.

3. Construa a imagem e suba os serviços:
`bash
docker compose up --build -d
`

O Docker se encarregará de baixar as imagens, criar a rede interna e subir o banco de dados MySQL e a API Spring Boot. A API estará acessível em `http://localhost:8080`.

## Documentações

- [README da API](api/README.md)
- [README do Frontend](client/README.md)
- [DummyJSON API Docs](https://dummyjson.com/docs)
