# Repara

Sistema web de gestão para uma assistência técnica de computadores, notebooks, videogames, controles e periféricos.
Clientes, equipamentos, ordens de serviço, orçamentos e histórico de reparos em um lugar só.

Projeto acadêmico (Next.js Fullstack). **Estado atual: Etapa 1 de 5** — base do projeto, cadastro e login.

## Tecnologias

Next.js (App Router), TypeScript, MongoDB Atlas + Mongoose, NextAuth.js (JWT), bcryptjs, TanStack React Query,
Zustand, Tailwind CSS, ShadCN/UI e Vercel.

## Funcionalidades (até agora)

- Conexão com MongoDB usando Singleton (`src/lib/mongodb.ts`)
- Cadastro de conta (perfil "cliente") com senha criptografada com bcrypt
- Login e logout com NextAuth (credenciais + sessão em JWT)
- Proteção das páginas privadas (middleware + layout do painel)
- Layout do painel com menu lateral que muda conforme o perfil
- `loading.tsx` e `error.tsx` no painel

## Como instalar

```bash
npx create-next-app@15 repara --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd repara
npx shadcn@latest init -d
npx shadcn@latest add button input label card
npm install mongoose next-auth@4 bcryptjs @tanstack/react-query zustand
```

(Se o `create-next-app` fizer alguma pergunta que não estiver nas opções acima, é só apertar Enter.)

Depois copie para dentro da pasta `repara/` o conteúdo deste projeto: pastas `src/` e `scripts/` e o arquivo
`.env.example`. Confirme a substituição de `src/app/layout.tsx` e `src/app/page.tsx`.

### Cor azul do tema

No final de `src/app/globals.css`, adicione:

```css
.dark {
  --primary: oklch(0.62 0.19 255);
  --primary-foreground: oklch(0.985 0 0);
  --ring: oklch(0.62 0.19 255);
}
```

### Script para criar o admin

No `package.json`, dentro de `"scripts"`, adicione:

```json
"criar-admin": "node --env-file=.env.local scripts/criar-admin.mjs"
```

(precisa do Node 20.6 ou mais novo)

## Como configurar o .env

1. Copie `.env.example` para `.env.local`.
2. `MONGODB_URI`: no MongoDB Atlas, crie um cluster, um usuário de banco e libere o acesso de rede
   (para a Vercel funcionar, libere `0.0.0.0/0`). Copie a string de conexão e coloque `/repara` no final.
3. `NEXTAUTH_SECRET`: gere com `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.
4. `NEXTAUTH_URL`: `http://localhost:3000` no computador; na Vercel, a URL do deploy.

## Como executar

```bash
npm run criar-admin -- "Seu Nome" admin@repara.com suaSenha   # só na primeira vez
npm run dev
```

Abra http://localhost:3000. Teste: criar conta em `/cadastro` → cair no dashboard → sair → entrar de novo em `/login`.
Abrir `/dashboard` sem estar logado deve mandar para `/login`.

## Estrutura das pastas

```
src/
  app/            páginas e rotas (api/ tem as rotas do servidor)
    (painel)/     páginas privadas, com menu lateral
  components/     componentes (ui/ é do ShadCN)
  lib/            conexão com o banco, configuração do login, constantes
  models/         modelos do MongoDB (Usuario, Cliente)
  providers/      SessionProvider + React Query
  types/          tipagens extras
scripts/          criar-admin.mjs
```

## Limitações conhecidas

- Ao criar a conta, o sistema liga o usuário ao cliente que tiver o mesmo e-mail. Não há confirmação de e-mail, então
  alguém poderia se cadastrar com o e-mail de outro cliente e ver as ordens dele. Para o escopo da faculdade foi aceito.
- Fotos do equipamento ficam de fora (exigiria armazenamento de arquivos).

## Próximas etapas

2. Usuários/técnicos, clientes e equipamentos (CRUD)
3. Ordens de serviço: status com regras, orçamento e aprovação
4. Dashboards por perfil e histórico por equipamento
5. Ajustes finais, README completo e deploy na Vercel

Link do deploy: _ainda não publicado_
