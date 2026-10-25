# React + Vite Setup

This project uses React with Vite for a fast development environment, Hot Module Replacement (HMR), and optimized production builds.

## Prerequisites

Install the following tools before getting started:

- [Node.js](https://nodejs.org/) — preferably an active LTS version.
- npm — included with Node.js.

Verify your installation:

```bash
node -v
npm -v
```

## Installation

Open the project folder in VS Code and run the following command in the integrated terminal:

```bash
npm install
```

This installs the dependencies defined in `package.json`.

## Start the Development Server

Run the following command:

```bash
npm run dev
```

Open the local URL displayed in the terminal, typically:

http://localhost:5173

Vite provides Hot Module Replacement (HMR), allowing supported code changes to appear in the browser without restarting the development server.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server. |
| `npm run build` | Builds the application for production. |
| `npm run preview` | Previews the production build locally. |
| `npm run lint` | Runs ESLint checks, if configured. |

## Production Build

Create an optimized production build:

```bash
npm run build
```

The generated files are normally stored in the `dist/` directory.

To preview the production build locally, run:

```bash
npm run preview
```

## Code Quality

If ESLint is configured in the project, run:

```bash
npm run lint
```

Resolve reported errors before committing changes to help maintain code quality and consistency.

## React and Vite Plugins

Vite supports official React plugins for development and Fast Refresh:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) — React support with Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) — React support with Fast Refresh using SWC.

Use the plugin already configured in `vite.config.js`. Changing plugins is optional and should be based on project requirements.

## Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Vite React Plugin](https://github.com/vitejs/vite-plugin-react)
- [ESLint Documentation](https://eslint.org/)

---

**Note:** Available commands and plugins depend on the project's `package.json` and Vite configuration. Verify them before using this README.