# BoardGameHub — Roadmap

## Fase 1 — Fundações [x]

- [x] Setup Next.js 16 + Drizzle ORM + PostgreSQL + iron-session
- [x] Schema da base de dados (users, games_collection, players, match_logs, match_players, wishlist)
- [x] Autenticação (login, registo, logout)
- [x] Layout base (sidebar desktop + bottom bar mobile)
- [x] Dockerfile + deploy Coolify
- [x] Migração de Supabase para stack self-hosted

## Fase 2 — Features Principais [x]

- [x] Coleção de jogos (adicionar via BGG, remover, galeria visual)
- [x] Shelf of shame
- [x] Wishlist com prioridades e notas
- [x] Promover wishlist → coleção
- [x] Log de partidas (multi-step: jogo → jogadores → detalhes)
- [x] Histórico de partidas
- [x] Apagar partida
- [x] Página de estatísticas (top jogos, win rates, shelf of shame)

## Fase 3 — Camada Social [x]

- [x] Roster de jogadores
- [x] Ligar/desligar jogador a conta de utilizador
- [x] Auto-linkagem por email no login/registo
- [x] Perfil (alterar username e password)
- [x] Ver partidas como jogador linkado no perfil
- [x] Procura de utilizadores (API route)
- [x] Dashboard home com sumário (jogo mais jogado, matches recentes)

## Fase 4 — Refinamento [ ]

- [ ] Hooks TanStack Query (migrar fetches client-side para `hooks/`)
- [ ] Avatares (upload ou URL) para utilizadores e jogadores
- [ ] Status da coleção utilizável na UI (`previously_owned`, `for_trade`, `want_to_buy`)
- [ ] Estatísticas de jogador (PlayerStats — total matches, wins, win rate, jogo favorito)
- [ ] Rating pessoal de jogo editável na coleção
- [ ] Paginação no histórico de partidas

## Fase 5 — Funcionalidades Premium (futuro) [ ]

- [ ] Decisão sobre modelo premium (`is_premium` em users)
- [ ] Features a definir
