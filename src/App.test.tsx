import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { API_BASE } from './lib/indicadores';
import { mockFetch, renderConProveedores } from './test/utils';

afterEach(() => vi.unstubAllGlobals());

describe('App', () => {
  it('navega de la portada al histórico', async () => {
    const user = userEvent.setup();
    mockFetch({ [API_BASE]: {}, [`${API_BASE}/uf`]: { serie: [] } });
    renderConProveedores(<App />);

    await user.click(screen.getByRole('link', { name: /ver valores de los últimos 30 días/i }));
    expect(await screen.findByRole('heading', { name: 'Histórico: UF' })).toBeInTheDocument();
  });
});
