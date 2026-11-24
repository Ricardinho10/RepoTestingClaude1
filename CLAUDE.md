# Indicadores Chile

React 19 + TypeScript + Vite. Datos de https://mindicador.cl/api (UF, UTM, dólar).

- Sigue las reglas de React de ECC (https://github.com/affaan-m/ECC, `rules/react`).
- Datos solo vía hooks de `src/hooks/use-indicadores.ts` (TanStack Query); nada de `fetch` en `useEffect`.
- Componentes en `src/components` son presentacionales: reciben props, no llaman a la API.
- Pruebas con Vitest + Testing Library, consultando por rol accesible. `fetch` se simula con `mockFetch` de `src/test/utils.tsx`.
- Antes de entregar: `npm run lint && npm run test:coverage && npm run build`.
- Textos de la interfaz en español de Chile.
