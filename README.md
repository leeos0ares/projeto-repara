# Repara

Sistema web de gestão para uma assistência técnica de computadores, notebooks, videogames, controles e periféricos.
Reúne clientes, equipamentos, ordens de serviço, orçamentos e o histórico de reparos em um lugar só, para a equipe
saber o que precisa ser feito e o cliente acompanhar o andamento sem depender de mensagens no WhatsApp.

Projeto acadêmico (Next.js Fullstack).

## Objetivo

Representar a rotina de uma assistência técnica real: receber o equipamento, diagnosticar, orçar, pedir a aprovação do
cliente, reparar, testar e entregar, com cada etapa registrada.

## Tecnologias

- Next.js 15 (App Router) e TypeScript
- MongoDB Atlas com Mongoose (conexão Singleton)
- NextAuth.js v4 com sessão em JWT e senhas com bcrypt (`bcryptjs`)
- TanStack React Query (dados das listas e detalhes) e Zustand (filtros e modais)
- Tailwind CSS e ShadCN/UI (onde o componente nativo do HTML resolve, usamos o nativo)
- Deploy na Vercel

## Perfis de usuário

| Perfil | O que faz |
|---|---|
| Administrador | Gerencia usuários, clientes, equipamentos e ordens; atribui técnicos; muda prioridades; registra entregas e cancelamentos |
| Técnico | Vê as ordens atribuídas a ele; registra diagnóstico, orçamento, peças, procedimentos e testes; avança o status até "pronto para retirada" |
| Cliente | Vê só as ordens e equipamentos dele; consulta o diagnóstico e o orçamento; aprova ou recusa o orçamento |

## Principais funcionalidades

- Cadastro, login e logout; páginas privadas protegidas e rotas `/api` que conferem o perfil no servidor
- CRUD de usuários, clientes e equipamentos (campos de especificação só para computador e notebook)
- Ordens de serviço com número sequencial, prioridade, técnico, prazo e linha do tempo de movimentações
- Status com regras (`src/lib/status.ts`): cada status só vai para os próximos permitidos, e só para quem tem permissão
- Orçamento: criado pela equipe, aprovado ou recusado pelo cliente; sem aprovação o reparo não começa
- Dashboard diferente para cada perfil (admin: números, status, carga por técnico e alertas; técnico: fila de trabalho;
  cliente: situação dos seus equipamentos)
- Histórico de reparos por equipamento, em `/equipamentos/[id]`
- Busca e filtros nas listas
- Vínculo seguro entre conta de login e cadastro de cliente: quem já foi cadastrado no balcão cria a conta com um
  código de vínculo de uso único, gerado pelo admin na página do cliente

### Como o status anda

```
Recebido -> Em diagnóstico -> Aguardando aprovação -> (cliente aprova) -> Em reparo
                                                    -> (cliente recusa) -> Recusado -> Entregue ou Cancelado
Em reparo <-> Aguardando peças
Em reparo <-> Em testes -> Pronto para retirada -> Entregue
Em reparo -> Aguardando aprovação (serviço adicional: novo orçamento)
Cancelar: só o admin, até antes de "Pronto para retirada"
```

Regras extras: para iniciar o diagnóstico a ordem precisa ter técnico; para enviar ao cliente precisa ter orçamento;
para marcar como pronto precisa ter o resultado dos testes.

## Segurança

- Senhas guardadas com bcrypt; o hash nunca sai nas respostas da API.
- Toda rota `/api` confere login e perfil no servidor (`exigirAcesso`), além do middleware e do layout nas páginas.
- A sessão é revalidada a cada acesso: se o admin desativar, excluir ou rebaixar um usuário, o acesso muda na hora,
  sem esperar o token expirar (`src/lib/auth.ts`).
- Cliente só enxerga o que é dele; técnico só abre as ordens atribuídas a ele; notas internas, técnico e prioridade
  não vão para o cliente.
- O e-mail sozinho não liga uma conta nova a um cliente já cadastrado: é preciso o código de vínculo
  (`src/app/api/cadastro/route.ts`, `src/lib/vinculo.ts`).

## Estrutura das pastas

```
src/
  app/            páginas e rotas (api/ tem as rotas do servidor)
    (painel)/     páginas privadas, com menu lateral (layout aninhado)
  components/     componentes (ui/ é do ShadCN)
  hooks/          useAtualizarOrdem
  lib/            banco, login, permissões, regras de status, formatação, constantes
  models/         Usuario, Cliente, Equipamento, OrdemServico
  providers/      SessionProvider + React Query
  store/          Zustand (filtros e modais)
  types/          tipagens
public/           logo
scripts/          criar-admin.mjs
```

## Como instalar

```bash
npx create-next-app@15 repara --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd repara
npx shadcn@latest init -d
npx shadcn@latest add button input label card table dialog textarea badge
npm install mongoose next-auth@4 bcryptjs @tanstack/react-query zustand
```

(Se o `create-next-app` fizer alguma pergunta que não estiver nas opções acima, é só apertar Enter.)

Depois copie para dentro da pasta `repara/` as pastas `src/`, `public/` e `scripts/` e o arquivo `.env.example`.
Confirme a substituição de `src/app/layout.tsx` e `src/app/page.tsx`.

**Já está com a Etapa 3 funcionando?** Não precisa instalar nada novo: copie `src/` e `public/` por cima.

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

O arquivo `.env.local` não deve ir para o GitHub (o `.gitignore` do Next já ignora).

## Como executar localmente

```bash
npm run criar-admin -- "Seu Nome" admin@repara.com suaSenha   # só na primeira vez
npm run dev
```

Abra http://localhost:3000 e entre com o admin criado.

Antes de publicar, rode também:

```bash
npm run lint
npm run build
```

## Deploy na Vercel

1. Suba o projeto para um repositório no GitHub (sem o `.env.local`).
2. Na Vercel: **Add New > Project**, escolha o repositório. O Next.js é detectado sozinho.
3. Em **Environment Variables**, cadastre `MONGODB_URI`, `NEXTAUTH_SECRET` e `NEXTAUTH_URL`
   (use a URL que a Vercel vai dar ao projeto, por exemplo `https://repara.vercel.app`).
4. Clique em **Deploy**. Se precisou ajustar o `NEXTAUTH_URL` depois, faça um **Redeploy**.
5. No Atlas, confira em **Network Access** se `0.0.0.0/0` está liberado.
6. Para criar o admin no banco do deploy, rode o `criar-admin` no seu computador com o mesmo `MONGODB_URI` no `.env.local`.

Link do deploy: _(preencher depois de publicar)_

## Roteiro de demonstração (uns 5 minutos)

1. **Admin:** em Usuários, crie um técnico. Em Clientes, cadastre um cliente. Em Equipamentos, cadastre um notebook para ele.
2. **Admin:** abra a ordem de serviço pelo equipamento (prioridade alta, técnico escolhido). Mostre o dashboard.
3. **Técnico:** entre com o técnico, veja a fila no dashboard, inicie o diagnóstico, preencha e envie o orçamento.
4. **Cliente:** abra a página do cliente como admin e gere o código de vínculo. Em `/cadastro`, crie a conta com o e-mail do cliente e esse código, veja o orçamento e aprove. Mostre que não aparecem notas internas. (Tente criar a conta sem o código para mostrar que é recusada.)
5. **Técnico:** registre procedimentos e testes, marque como pronto.
6. **Admin:** registre a entrega e mostre o histórico de reparos na página do equipamento.
7. Mostre que um técnico não abre `/usuarios` e que um equipamento com ordens não pode ser excluído.

## Onde está cada requisito da avaliação

| Requisito | Onde |
|---|---|
| MongoDB Atlas com Singleton | `src/lib/mongodb.ts` |
| CRUD completo | Usuários, clientes e equipamentos (todos); ordens (criar, ler, editar e cancelar, para o histórico não se perder) |
| React Query ou cache do Next | React Query nas listas e detalhes; dashboards são Server Components que consultam o banco a cada acesso |
| NextAuth com JWT, login e logout | `src/lib/auth.ts`, `FormLogin.tsx`, botão Sair em `Sidebar.tsx` |
| Bcrypt | `src/app/api/cadastro`, `src/app/api/usuarios`, `scripts/criar-admin.mjs` |
| Proteção no frontend e no backend | `src/middleware.ts`, `(painel)/layout.tsx`, `exigirAcesso` em `src/lib/permissoes.ts` nas rotas `/api` |
| App Router, layouts aninhados, rotas dinâmicas | `app/layout.tsx` e `(painel)/layout.tsx`; `/clientes/[id]`, `/equipamentos/[id]`, `/ordens/[id]` |
| TypeScript | todo o projeto (`src/types`) |
| Zustand | `src/store/useUiStore.ts` |
| `loading.tsx` e `error.tsx` | `src/app/(painel)/` |
| Tailwind, ShadCN, responsivo, feedback | componentes em `src/components`, avisos com `Alerta.tsx`, botões com estado de carregamento |
| `next/image`, `next/link`, Server e Client Components | logo em `Sidebar.tsx`, `page.tsx` e login; páginas são Server Components e só o que tem interação é Client |
| Variáveis de ambiente e deploy | `.env.example` e a seção de deploy acima |

## Limitações conhecidas

- Quem se cadastra com um e-mail que a assistência ainda não conhece vira um cliente novo, sem confirmação de e-mail
  (não há dados para ver até a assistência abrir ordens para ele).
- O código de vínculo tem 10 caracteres aleatórios e as tentativas de cadastro não têm limite de frequência. Para o
  escopo da faculdade foi aceito.
- Ordens não são apagadas: "excluir" uma ordem é cancelá-la, para o histórico não se perder.
- Se o cliente recusar um orçamento de serviço adicional (no meio do reparo), a ordem vai para "Recusado" e o admin decide
  entre devolver o equipamento ou cancelar.
- Cliente sem conta no sistema não consegue aprovar sozinho: o admin registra a decisão em nome dele.
- Fotos do equipamento ficam de fora (exigiria armazenamento de arquivos).
- A busca das listas é feita no navegador, em cima dos dados já carregados.
