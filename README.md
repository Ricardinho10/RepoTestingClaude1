# Indicadores Chile

Portal web en React + TypeScript que muestra el valor del día de la **UF**, la **UTM** y el **dólar observado** en pesos chilenos, y una página con el histórico de los últimos 30 días en un gráfico combinado de barras (valor diario) y línea (media móvil), con selector de mes y año.

Datos: API pública de [mindicador.cl](https://mindicador.cl), consultada directamente desde el navegador.

## Uso

```bash
npm install
npm run dev            # servidor de desarrollo en http://localhost:5173
npm run build          # verifica tipos y genera el sitio estático en dist/
npm test               # pruebas (Vitest + Testing Library)
npm run test:coverage  # pruebas con cobertura (mínimo 80%)
npm run lint           # ESLint
```

El build es estático (rutas con `#`), así que `dist/` se puede publicar en GitHub Pages, Netlify o cualquier hosting de archivos.

## Funcionalidad

- **Hoy** (`#/`): tarjetas con UF, UTM y dólar del día, y link al histórico.
- **Histórico** (`#/historico`): pestañas UF / UTM / Dólar, botón "Últimos 30 días", selects de mes y año (desde 2000, sin meses futuros) y flechas de mes anterior/siguiente. Muestra gráfico barras + línea, mínimo, máximo, promedio, variación y una tabla desplegable.
- La UTM se publica una vez al mes, por eso al elegir un período muestra el año completo.

## Estructura

```
src/
  lib/indicadores.ts        tipos, llamadas a mindicador.cl y cálculos
  lib/formato.ts            formato CLP y fechas
  hooks/use-indicadores.ts  hooks de TanStack Query
  components/               componentes presentacionales (gráfico, tarjetas, selector, tabla, resumen)
  pages/                    páginas Inicio e Histórico
```

## Convenciones

El proyecto sigue las reglas de React de [ECC](https://github.com/affaan-m/ECC) (`rules/react`): TypeScript, datos con TanStack Query en vez de `fetch` en `useEffect`, componentes presentacionales sin acceso a datos, props booleanas `isX`, pruebas por rol accesible con Testing Library y cobertura mínima de 80%.
