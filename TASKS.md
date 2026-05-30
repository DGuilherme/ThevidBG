# BoardGameHub — Backlog de Tarefas

## Legenda

- `[x]` Concluído
- `[~]` Em progresso
- `[ ]` Por fazer
- **M** Must Have · **S** Should Have · **C** Could Have · **W** Won't Have (agora)

---

## Concluídas

### Fundações
- [x] **M** Setup inicial (Next.js 16, Drizzle, iron-session, PostgreSQL)
- [x] **M** Schema da base de dados
- [x] **M** Auth: login, registo, logout
- [x] **M** Layout: sidebar desktop + bottom bar mobile
- [x] **M** Dockerfile + deploy Coolify
- [x] **M** Migração Supabase → stack self-hosted

### Coleção
- [x] **M** Pesquisar e adicionar jogos via BGG
- [x] **M** Remover jogo da coleção
- [x] **M** Galeria visual com capas (grid)
- [x] **S** Shelf of shame (marcar/desmarcar)

### Wishlist
- [x] **M** Adicionar/remover itens via BGG
- [x] **S** Prioridades 1–5 com labels
- [x] **S** Promover wishlist → coleção

### Partidas
- [x] **M** Log de partida multi-step (jogo → jogadores → detalhes)
- [x] **M** Scores, vencedor, posição por jogador
- [x] **M** Data, duração, localização, notas
- [x] **M** Histórico de partidas com detalhes
- [x] **S** Apagar partida

### Players
- [x] **M** Criar jogadores (nome + email)
- [x] **S** Ligar/desligar jogador a conta de utilizador
- [x] **S** Auto-linkagem por email no login/registo

### Estatísticas
- [x] **M** Sumário: total jogos, partidas, jogos únicos jogados
- [x] **S** Top 5 jogos mais jogados
- [x] **S** Win rates por jogo
- [x] **S** Shelf of shame count

### Perfil
- [x] **S** Alterar username
- [x] **S** Alterar password
- [x] **C** Ver partidas como jogador linkado

### Dashboard
- [x] **S** Home com jogo mais jogado e matches recentes

---

## Backlog

### Should Have
- [ ] **S** Paginação no histórico de partidas
  - *Done quando:* a página `/matches` mostra N por página com navegação e não degrada com 100+ partidas.
- [ ] **S** Rating pessoal de jogo editável na coleção
  - *Done quando:* utilizador pode editar o campo `rating` diretamente na galeria sem sair da página.
- [ ] **S** Status da coleção na UI (`previously_owned`, `for_trade`, `want_to_buy`)
  - *Done quando:* é possível mudar o status de um jogo e o filtro mostra apenas a categoria selecionada.

### Could Have
- [ ] **C** Hooks TanStack Query para fetches client-side (`hooks/`)
  - *Done quando:* pelo menos Collection e Players usam `useQuery` + `useMutation` e os componentes não recebem dados via props de Server Components desnecessários.
- [ ] **C** Avatares para utilizadores e jogadores (URL ou upload)
  - *Done quando:* campo `avatar_url` é preenchível no perfil e exibido no sidebar e no roster.
- [ ] **C** Estatísticas de jogador (PlayerStats)
  - *Done quando:* a página `/players` mostra por jogador: total de partidas, wins, win rate e jogo favorito.

### Won't Have (agora)
- [ ] **W** Feed social / timeline entre utilizadores
- [ ] **W** Torneios e ligas
- [ ] **W** App móvel nativa
- [ ] **W** Funcionalidades premium

---

## Tarefas Manuais

> Ações que requerem acesso externo — não podem ser executadas pelo agente.

- [ ] Aplicar `drizzle/schema.sql` na base de dados PostgreSQL no Coolify (primeiro deploy)
- [ ] Configurar env vars no Coolify: `DATABASE_URL` e `SESSION_SECRET` (mín. 32 chars)
- [ ] Verificar que o auto-deploy por push para `main` está ativo no Coolify

---

## Bugs Conhecidos

> Nenhum registado.
