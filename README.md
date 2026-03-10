# Verde

A starter kit for building React and Node.js turn-based multiplayer games with WebSockets.

## Architecture

```
verde/
├── client/          # React frontend (Vite + TypeScript)
│   └── src/
│       ├── components/   # Reusable UI components (Button, Box, Page, etc.)
│       ├── context/      # React contexts (WebSocket, User)
│       ├── pages/        # Route pages (Home, Room, Create, Join, Profile, About)
│       └── theme/        # JSS theme configuration
├── server/          # Express backend (TypeScript)
│   ├── api/         # WebSocket API classes (auto-generates client schema)
│   ├── engine/      # Core game logic (users, rooms, game state)
│   ├── routes/      # HTTP REST endpoints
│   └── sockets/     # WebSocket server and message routing
└── gen-api.ts       # Script to generate client API schema from server
```

## Development

### Prerequisites

- [Bun](https://bun.sh/docs/installation) (package manager and runtime)
- Alternatively, [Nix](https://nixos.org/) + [direnv](https://direnv.net/) for automatic environment setup

### Getting started

```bash
bun install          # Install all dependencies
bun run gen-api      # Generate the WebSocket API schema for the client
bun run dev          # Start both client (port 3000) and server (port 4000)
```

### Available scripts

| Command                | Description                                      |
|------------------------|--------------------------------------------------|
| `bun run dev`          | Start client and server in parallel (hot reload) |
| `bun run dev:client`   | Start Vite dev server on port 3000               |
| `bun run dev:server`   | Start Express server on port 4000 with `--watch`  |
| `bun run build`        | Build client for production                      |
| `bun run typecheck`    | Run TypeScript type checking (client + server)   |
| `bun run gen-api`      | Regenerate client API schema from server classes |

### How it works

**Defining a game:** Edit `server/game.ts` to define your game's initial state, player actions, end conditions, and winner logic. The sample game is a simple +1/-1 counter where the first player to reach 10 wins.

**WebSocket API:** Server-side API classes in `server/api/` are automatically introspected to generate a JSON schema (`client/src/api_schema.json`). The client uses this schema to create type-safe WebSocket message functions via `useGameActions()`.

**Room system:** Players create or join rooms with 4-character codes. Each room has a moderator (first player), supports spectators, player banning, and turn-based game sessions.

**State model:** Game state is split into `pub` (broadcast to all clients) and `priv` (server-only). Player state tracks per-player data. State updates are broadcast to all connected clients via WebSocket.

## Tech stack

| Layer    | Technology                                         |
|----------|----------------------------------------------------|
| Frontend | React 18, React Router v7, JSS (CSS-in-JS), Vite  |
| Backend  | Express 4, ws (WebSocket), Winston (logging)       |
| Tooling  | Bun, TypeScript, Prettier                          |

## Design language

Mondrianesque, de Stijl inspired.

## Remaining work

- [ ] Add proper CORS configuration (currently allows all origins)
- [ ] Add test infrastructure (Vitest recommended)
- [ ] Room cleanup when all users leave (partially implemented)
- [ ] Persist game state (currently in-memory only)
- [ ] Production deployment configuration
- [ ] WebSocket URL should be configurable (currently hardcoded to localhost:4000)
