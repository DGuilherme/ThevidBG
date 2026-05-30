# BoardGameHub — Especificação

## O que é

Hub pessoal de board games com integração BoardGameGeek. Permite a um utilizador gerir a sua coleção, registar partidas, manter uma wishlist e ter um roster de jogadores com possibilidade de os ligar a contas da plataforma.

---

## Funcionalidades em scope

### Autenticação
- Registo com email + password (bcrypt, iron-session)
- Login/logout
- Auto-linkagem de jogadores pelo email no login/registo

### Coleção
- Pesquisar e adicionar jogos via BoardGameGeek (search + detalhes)
- Remover jogos da coleção
- Marcar jogos como "shelf of shame" (possuídos mas nunca jogados)
- Visualização em galeria com capas dos jogos
- Status: `owned`, `previously_owned`, `for_trade`, `want_to_buy`

### Wishlist
- Adicionar/remover jogos desejados (via BGG)
- Prioridade de 1 a 5 (Must Have → Someday)
- Notas personalizadas por item
- Promover item de wishlist para coleção

### Registo de Partidas
- Log de partidas multi-jogador
- Selecionar jogo da coleção
- Adicionar jogadores (do roster), scores, vencedor e posição
- Detalhes: data, duração, localização, notas
- Apagar partida

### Players
- Criar jogadores (nome + email opcional)
- Ligar jogador a uma conta de utilizador existente (por username/email)
- Desligar jogador de conta
- Auto-linkagem por email correspondente

### Estatísticas
- Total de jogos, partidas e jogos únicos jogados
- Top 5 jogos mais jogados
- Win rates por jogo (mínimo 3 partidas)
- Shelf of shame count
- Duração média de partidas

### Perfil
- Alterar username (único, validado)
- Alterar password (requer password atual)
- Ver partidas onde o utilizador foi jogador linkado

### Infraestrutura
- Deploy via Coolify (self-hosted), push para `main`
- PostgreSQL self-hosted gerido pelo Coolify
- BGG API proxiada (CORS + caching)

---

## Fora de scope

- Marketplace / compra e venda de jogos
- Funcionalidades real-time (websockets, notificações push)
- App móvel nativa (estrutura prepara para Capacitor, mas não implementar)
- Feed social / timeline de atividade entre utilizadores
- Torneios ou ligas
- Integração com outras APIs além do BGG
- Funcionalidades premium (campo `is_premium` reservado para o futuro)
- Upload de imagens / avatares (campos existem mas não são utilizados ainda)
- Ratings de jogador por outros utilizadores
- Exportação de dados

---

## Fora de scope sem decisão explícita

Qualquer feature não listada acima requer atualização deste ficheiro e confirmação antes de ser implementada.
