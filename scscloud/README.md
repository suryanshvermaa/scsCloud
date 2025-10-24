# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json', './tsconfig.app.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Development proxy and CORS

If you run the frontend on `http://localhost:5173` and the backend on `http://localhost:8080`, browsers will block cross-origin requests unless the backend answers CORS preflight requests. To keep development simple, the Vite dev server now proxies API traffic to the backend.

- Dev env (`.env.development`) sets `VITE_API_URL` to an empty string, so API calls use relative paths like `/api/v1/...`.
- `vite.config.ts` forwards requests starting with `/api` to `http://localhost:8080`.

This avoids CORS during development. In production, configure `.env` with your actual API origin (e.g. `VITE_API_URL=https://api.example.com`) and ensure your backend sends proper CORS headers.
