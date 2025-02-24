# Verde

A reasonable starter kit for building React and Node.js turn-based games.

## Development
This is a standard full stack JavaScript monorepo managed with Bun workspaces.
Frontend and backend are found in `client/` and `server/`, respectively.

### Start developing:
If you have `nix` and `direnv` set up, just open this directory. Everything will 'just work'. Otherwise:

1. Make sure you have [bun](https://bun.sh/docs/installation) installed and an [`eslint`](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) plugin, or a language server protocol plugin that will allow you to use `tsserver`, installed for your editor of choice. VSCode is your go-to option if you're newer to software development.
2. Run `bun install` in the root directory of the entire project to install all dependencies.
3. Run `bun run dev` in the root directory to start up the hot reloading process.

## Technologies
### Front-end
- [React](https://reactjs.org/) functional components for templating and structure. Industry standard.
- CSS-in-JS [(JSS)](https://cssinjs.org/?v=v10.6.0): This is my personal preference, but it's not something we have to use.
### Backend
- [Express API](http://expressjs.com/) with websockets. I think it's best to use websockets and in-memory data as much as we can, because there isn't much of a reason to create accounts and persist data yet (IMO).
### Ops
- All-in-one, strongly opinionated ESLint + Prettier linting and fixing. Feel free to convert errors into warnings if something is annoying you.
- Some sort of deployment infrastructure

## Design language
Mondrianesque, de Stijl inspired
