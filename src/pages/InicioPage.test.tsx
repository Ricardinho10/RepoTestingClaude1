import { screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_BASE } from '../lib/indicadores';
import { mockFetch, renderConProveedores } from '../test/utils';
import { InicioPage } from './InicioPage';

afterEach(() => vi.unstubAllGlobals());

describe('InicioPage', () => {
  it('muestra UF, UTM y dólar del día y el link al histórico', async () => {
    mockFetch({
      [API_BASE]: {
        uf: { valor: 39643.59, fecha: '2026-11-24T03:00:00.000Z' },
        utm: { valor: 69751, fecha: '2026-11-01T03:00:00.000Z' },
        dolar: { valor: 948.12, fecha: '2026-11-24T03:00:00.000Z' },
      },
    });
    renderConProveedores(<InicioPage />);

    const uf = await screen.findByRole('article', { name: 'UF' });
    expect(within(uf).getByText(/39\.643,59/)).toBeInTheDocument();
    expect(within(uf).getByText('24-11-2026')).toBeInTheDocument();
    expect(within(screen.getByRole('article', { name: 'UTM' })).getByText(/69\.751,00/)).toBeInTheDocument();
    expect(within(screen.getByRole('article', { name: 'Dólar' })).getByText(/948,12/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /últimos 30 días/i })).toHaveAttribute('href', '/historico');
  });

  it('muestra un error si la API falla', async () => {
    mockFetch({});
    renderConProveedores(<InicioPage />);
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron cargar');
  });
});
