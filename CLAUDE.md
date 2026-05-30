# ThevidBG — Instruções para o Agente

## Resumo
Hub de board games com integração BGG — gestão de coleção, matches, wishlist e perfis de jogadores.

---

## Governance

| Ficheiro | Propósito |
|----------|-----------|
| `SPEC.md` | O que o projeto faz e o que está fora de scope. **Imutável sem decisão explícita.** |
| `PLAN.md` | Fases do roadmap com checkboxes (`[x]` done, `[~]` in progress, `[ ]` todo) |
| `TASKS.md` | Tarefas em formato MoSCoW com critério de done por tarefa |
| `CLAUDE.md` | Este ficheiro |

> `SPEC.md`, `PLAN.md` e `TASKS.md` ainda não existem — criar antes de começar features.

---

## Regras do Agente

1. **Lê sempre `SPEC.md` e `TASKS.md`** antes de começar qualquer feature.
2. **Usa Plan Mode** antes de qualquer mudança que toque mais de 2 ficheiros.
3. **Não implementas nada que não esteja em `SPEC.md`** — se for necessário, atualiza o spec primeiro e aguarda confirmação.
4. **Quando uma task fica completa**, atualiza o `[~]` ou `[ ]` para `[x]` em `TASKS.md` (e em `PLAN.md` se a fase ficar concluída).
5. **Corre os testes antes de marcar uma task como done.**
6. **Não criar ficheiros `.md` ou `README` sem pedido explícito.**
7. **Não adicionar comentários de código** — só quando o WHY é não-óbvio. Nunca comentar o WHAT.

---

## Adicionar Funcionalidades

Quando o utilizador pede uma nova feature, seguir sempre esta ordem:

1. **Verificar `SPEC.md`** — a feature está no scope?
   - Não está → propor adição ao `SPEC.md`, aguardar confirmação, só depois continuar.
   - Está → avançar.
2. **Registar em `TASKS.md`** — adicionar a task com prioridade MoSCoW e critério de done.
3. **Atualizar `PLAN.md`** se a feature afeta ou conclui uma fase.
4. **Plan Mode** se a implementação tocar mais de 2 ficheiros.
5. **Implementar → correr testes → marcar `[x]` em `TASKS.md`.**

Nunca começar a escrever código sem os passos 1 e 2 estarem completos.

---

## Feedback de Testes Manuais

Quando o utilizador testa manualmente e dá feedback, distinguir sempre:

| Tipo | Sinal | Ação |
|------|-------|------|
| **Bug** | "não funciona", "está partido", comportamento diverge do spec | Corrigir inline se for na mesma sessão; se for sessão nova, adicionar a `TASKS.md` antes de corrigir. |
| **Correção de spec** | "não era bem assim", expectativa diferente do que está escrito | Atualizar `SPEC.md` primeiro, confirmar com o utilizador, depois corrigir. |
| **Validação positiva** | "ficou bem", aprovação de uma escolha não-óbvia | Guardar como convenção em `CLAUDE.md` se for algo reutilizável no projeto. |

Nunca corrigir silenciosamente sem identificar em qual dos três casos estás.

---

## Tarefas Manuais

Quando identificares uma ação que não podes executar (deploy em produção, configurar env vars no Coolify, aplicar migrações SQL em servidor remoto, etc.), **não mencionar apenas no chat**. Registar em `TASKS.md` na secção `## Tarefas Manuais` com descrição clara do que fazer e onde.

---

## Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **ORM:** Drizzle ORM + postgres.js
- **Auth:** iron-session (sessões encriptadas em cookie) + bcryptjs
- **UI:** shadcn/ui + Base UI + Tailwind CSS v4
- **Estado:** Zustand + TanStack Query
- **API externa:** BoardGameGeek (BGG) XML API
- **Infra:** Docker (Dockerfile para produção)

---

## Como Correr

O código da app está em `boardgamehub/`.

```bash
cd boardgamehub

# Desenvolvimento (http://localhost:3000)
npm run dev

# Build
npm run build

# Lint
npm run lint
```

### Variáveis de Ambiente
```
DATABASE_URL=postgresql://user:pass@host:5432/thevidbg
SESSION_SECRET=string-aleatoria-32-chars
```

---

## Deployment

| Ambiente | Plataforma | URL |
|----------|-----------|-----|
| Produção | Coolify (self-hosted) | https://TODO |

```bash
# Deploy via Coolify — push para main → auto-deploy
git push origin main
```

---

## Convenções

- **App Router:** Route groups `(auth)` para login/registo, `(dashboard)` para área autenticada.
- **Server Actions** em `boardgamehub/app/actions/` — usar `"use server"` no topo do ficheiro.
- **Isolamento de dados:** todos os queries filtram por `user_id`. Nunca expor dados de outros utilizadores.
- **Migrações:** SQL puro em `boardgamehub/migrations/`. Aplicar manualmente no Coolify.
- Sem `any` no TypeScript — usar tipos explícitos ou `unknown`.
- Sem comentários no código salvo quando o porquê é não-óbvio.
- Sem `tailwind.config.js` — Tailwind v4 configura-se via CSS (`@theme`).

---

## O que NÃO fazer

- Não implementar features fora de `SPEC.md` sem atualizar o spec primeiro.
- Não marcar tasks como done sem ter corrido os testes.
- Não usar `next/router` — usar `next/navigation`.
- Não usar `getServerSideProps` / `getStaticProps` — são do Pages Router.
- Não commitar variáveis de ambiente.
