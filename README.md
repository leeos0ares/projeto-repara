# Repara

Sistema web de gestão para uma assistência técnica de computadores, notebooks, videogames, controles e periféricos.
Clientes, equipamentos, ordens de serviço, orçamentos e histórico de reparos em um lugar só.

Projeto acadêmico (Next.js Fullstack). **Estado atual: Etapa 3 de 5** (inclui tudo das Etapas 1 e 2).

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
- CRUD de usuários (só admin), clientes e equipamentos, com páginas de detalhe `/clientes/[id]` e `/equipamentos/[id]`
- Toda rota `/api` confere login e perfil no servidor (`src/lib/permissoes.ts`)
- React Query nas listas e Zustand para filtros e modais

**Etapa 3**
- Ordens de serviço com número sequencial (`#0001`, `#0002`...), criadas pelo admin a partir de um equipamento
- Lista com busca (nº, cliente, equipamento) e filtros de status, prioridade e técnico
- Página `/ordens/[id]` com dados, diagnóstico e reparo, orçamento e linha do tempo (histórico de movimentações)
- Status com regras (`src/lib/status.ts`): cada status só vai para os próximos permitidos, e só para quem tem permissão
- Orçamento: técnico ou admin cria; o cliente aprova ou recusa; sem aprovação o reparo não começa
- Prioridade (baixa, normal, alta, urgente) independente do status
- Cada perfil só enxerga e altera o que lhe cabe (técnico: só ordens atribuídas; cliente: só as dele, sem notas internas)
- Equipamento com ordens e técnico com ordens não podem ser excluídos

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
para marcar como pronto precisa ter o resultado dos testes preenchido.

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

### Já está com a Etapa 2 funcionando?

A Etapa 3 **não precisa de nenhum componente novo do ShadCN** (usa `select`, `details`, `input type="date"` nativos).
É só copiar a pasta `src/` deste zip por cima do projeto.

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

### Roteiro de teste da Etapa 3

Prepare: crie um técnico em **Usuários**, um cliente em **Clientes** e um notebook para ele em **Equipamentos**.
Para testar o lado do cliente, crie uma conta em `/cadastro` com o mesmo e-mail do cliente.

1. Admin: abra o equipamento e clique em **Abrir ordem de serviço**. Preencha o problema, prioridade "Alta" e escolha o técnico.
2. Na ordem, tente **Iniciar diagnóstico** antes de ter técnico (use uma ordem sem técnico): deve avisar.
3. Entre como técnico: a ordem aparece na lista dele (e só ela). Clique em **Iniciar diagnóstico**.
4. Preencha o diagnóstico, salve, e crie o orçamento (serviços, peças, mão de obra). Clique em **Enviar orçamento ao cliente**.
5. Entre como cliente: em **Ordens de serviço** abra a ordem. Deve ver o diagnóstico e o orçamento, mas não as observações
   internas, o técnico nem a prioridade. Clique em **Aprovar orçamento**.
6. Entre como técnico de novo: status "Em reparo". Registre procedimentos, peças e tente **Marcar como pronto** sem
   resultado dos testes (deve avisar). Envie para testes, preencha o resultado e marque como pronto.
7. Admin: **Registrar entrega**. A ordem fica encerrada e não aceita mais edição.
8. Tente excluir o equipamento ou o técnico: deve bloquear porque existem ordens.
9. Teste a recusa: em outra ordem, o cliente recusa o orçamento. Status vira "Recusado" e o admin pode registrar a devolução.

## Estrutura das pastas

```
src/
  app/            páginas e rotas (api/ tem as rotas do servidor)
    (painel)/     páginas privadas, com menu lateral
  components/     componentes (ui/ é do ShadCN)
  hooks/          useAtualizarOrdem
  lib/            banco, login, permissões, regras de status, formatação, constantes
  models/         Usuario, Cliente, Equipamento, OrdemServico
  providers/      SessionProvider + React Query
  store/          Zustand (filtros e modais)
  types/          tipagens
scripts/          criar-admin.mjs
```

## Limitações conhecidas

- Ao criar a conta, o sistema liga o usuário ao cliente que tiver o mesmo e-mail. Não há confirmação de e-mail, então
  alguém poderia se cadastrar com o e-mail de outro cliente e ver as ordens dele. Para o escopo da faculdade foi aceito.
- Ordens não são apagadas: "excluir" uma ordem é cancelá-la, para o histórico não se perder.
- Se o cliente recusar um orçamento de serviço adicional (no meio do reparo), a ordem vai para "Recusado" e o admin decide
  entre devolver o equipamento ou cancelar.
- Cliente sem conta no sistema não consegue aprovar sozinho: o admin registra a decisão em nome dele.
- Fotos do equipamento ficam de fora (exigiria armazenamento de arquivos).
- A busca das listas é feita no navegador, em cima dos dados já carregados.

## Próximas etapas

4. Dashboards por perfil e histórico de reparos por equipamento
5. Ajustes finais, README completo e deploy na Vercel

Link do deploy: _ainda não publicado_
