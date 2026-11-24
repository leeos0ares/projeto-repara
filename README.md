# Repara

Sistema web de gestão para uma assistência técnica de computadores, notebooks, videogames, controles e periféricos.
Clientes, equipamentos, ordens de serviço, orçamentos e histórico de reparos em um lugar só.

Projeto acadêmico (Next.js Fullstack). **Estado atual: Etapa 2 de 5** (inclui tudo da Etapa 1).

## Tecnologias

Next.js (App Router), TypeScript, MongoDB Atlas + Mongoose, NextAuth.js (JWT), bcryptjs, TanStack React Query,
Zustand, Tailwind CSS, ShadCN/UI e Vercel.

## Funcionalidades (até agora)

**Etapa 1**
- Conexão com MongoDB usando Singleton (`src/lib/mongodb.ts`)
- Cadastro de conta (perfil "cliente") com senha criptografada com bcrypt
- Login e logout com NextAuth (credenciais + sessão em JWT)
- Proteção das páginas privadas (middleware + layout do painel)
- Menu lateral que muda conforme o perfil, `loading.tsx` e `error.tsx`

**Etapa 2**
- CRUD de usuários (só admin): cria administradores e técnicos, edita, ativa/desativa, redefine senha e exclui
- CRUD de clientes (admin edita, técnico só consulta) com página de detalhes em `/clientes/[id]`
- CRUD de equipamentos (admin edita; técnico consulta; cliente vê só os dele) com detalhes em `/equipamentos/[id]`
- Campos de especificação (processador, RAM, placa de vídeo, armazenamento) só para computador e notebook
- Toda rota `/api` confere login e perfil no servidor (`src/lib/permissoes.ts`)
- React Query nas listas (cache e atualização depois de salvar/excluir)
- Zustand para filtros e abertura dos modais (`src/store/useUiStore.ts`)

## Como instalar (projeto novo)

```bash
npx create-next-app@15 repara --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd repara
npx shadcn@latest init -d
npx shadcn@latest add button input label card table dialog textarea badge
npm install mongoose next-auth@4 bcryptjs @tanstack/react-query zustand
```

(Se o `create-next-app` fizer alguma pergunta que não estiver nas opções acima, é só apertar Enter.)

Depois copie para dentro da pasta `repara/` as pastas `src/` e `scripts/` e o arquivo `.env.example` deste projeto.
Confirme a substituição de `src/app/layout.tsx` e `src/app/page.tsx`.

### Já está com a Etapa 1 funcionando?

Não precisa recomeçar. Dentro do projeto rode:

```bash
npx shadcn@latest add table dialog textarea badge
```

e copie a pasta `src/` deste zip por cima (pode substituir tudo, a Etapa 1 está incluída).

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

Abra http://localhost:3000 e entre com o admin criado.

Roteiro de teste da Etapa 2:
1. Em **Usuários**, crie um técnico.
2. Em **Clientes**, cadastre um cliente (ex.: nome, e-mail, telefone).
3. Em **Equipamentos**, cadastre um notebook para ele (aparecem os campos de especificação) e um videogame (não aparecem).
4. Tente excluir o cliente: deve avisar que ainda tem equipamentos.
5. Saia, crie uma conta em `/cadastro` com o mesmo e-mail do cliente do passo 2: ela fica ligada a ele e em
   **Equipamentos** só aparecem os dele.
6. Entre como técnico: vê clientes e equipamentos, mas sem botões de editar. Abrir `/usuarios` volta para o dashboard.

## Estrutura das pastas

```
src/
  app/            páginas e rotas (api/ tem as rotas do servidor)
    (painel)/     páginas privadas, com menu lateral
  components/     componentes (ui/ é do ShadCN)
  lib/            banco, login, permissões, constantes, fetch das rotas
  models/         modelos do MongoDB (Usuario, Cliente, Equipamento)
  providers/      SessionProvider + React Query
  store/          Zustand (filtros e modais)
  types/          tipagens
scripts/          criar-admin.mjs
```

## Limitações conhecidas

- Ao criar a conta, o sistema liga o usuário ao cliente que tiver o mesmo e-mail. Não há confirmação de e-mail, então
  alguém poderia se cadastrar com o e-mail de outro cliente e ver os equipamentos dele. Para o escopo da faculdade foi aceito.
- Fotos do equipamento ficam de fora (exigiria armazenamento de arquivos).
- A busca das listas é feita no navegador, em cima dos dados já carregados (suficiente para uma assistência pequena).

## Próximas etapas

3. Ordens de serviço: status com regras, orçamento e aprovação (e bloquear exclusão de equipamento/técnico com OS)
4. Dashboards por perfil e histórico por equipamento
5. Ajustes finais, README completo e deploy na Vercel

Link do deploy: _ainda não publicado_
