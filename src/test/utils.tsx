import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

export function renderConProveedores(ui: ReactElement, ruta = '/') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[ruta]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

type Rutas = Record<string, unknown>;

/** Reemplaza fetch: responde el JSON asociado a cada URL, o 500 si no está. */
export function mockFetch(rutas: Rutas) {
  const fn = vi.fn(async (url: string) => {
    if (url in rutas) return new Response(JSON.stringify(rutas[url]), { status: 200 });
    return new Response('error', { status: 500 });
  });
  vi.stubGlobal('fetch', fn);
  return fn;
}
