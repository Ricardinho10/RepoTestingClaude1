import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { API_BASE } from '../lib/indicadores';
import { mockFetch, renderConProveedores } from '../test/utils';
import { HistoricoPage } from './HistoricoPage';

afterEach(() => vi.unstubAllGlobals());

const HOY = new Date(2026, 10, 24); // 24-nov-2026

const ufUltimos = {
  serie: [
    { fecha: '2026-11-24T03:00:00.000Z', valor: 39700 },
    { fecha: '2026-11-23T03:00:00.000Z', valor: 39600 },
  ],
};
const uf2025 = {
  serie: [
    { fecha: '2025-03-02T03:00:00.000Z', valor: 38500 },
    { fecha: '2025-03-01T03:00:00.000Z', valor: 38400 },
    { fecha: '2025-04-01T03:00:00.000Z', valor: 38600 },
  ],
};
const utm2025 = {
  serie: [
    { fecha: '2025-02-01T03:00:00.000Z', valor: 67000 },
    { fecha: '2025-01-01T03:00:00.000Z', valor: 66800 },
  ],
};

function filasTabla() {
  return within(screen.getByRole('table')).getAllByRole('row').slice(1);
}

describe('HistoricoPage', () => {
  it('muestra por defecto los últimos 30 días de la UF con gráfico, resumen y tabla', async () => {
    mockFetch({ [`${API_BASE}/uf`]: ufUltimos });
    renderConProveedores(<HistoricoPage hoy={HOY} />);

    const grafico = await screen.findByRole('img', { name: 'Gráfico de UF' });
    expect(grafico.querySelector('canvas')).toHaveAttribute(
      'data-series',
      'bar:UF (CLP)|line:Media móvil 5 días',
    );
    expect(screen.getByRole('heading', { name: 'Últimos 30 días' })).toBeInTheDocument();
    expect(screen.getByText('+0.25%')).toBeInTheDocument();
    expect(filasTabla()[0]).toHaveTextContent('24-11-2026');
  });

  it('cambia de mes y año y filtra la serie', async () => {
    const user = userEvent.setup();
    mockFetch({ [`${API_BASE}/uf`]: ufUltimos, [`${API_BASE}/uf/2025`]: uf2025 });
    renderConProveedores(<HistoricoPage hoy={HOY} />);
    await screen.findByRole('img', { name: 'Gráfico de UF' });

    await user.selectOptions(screen.getByRole('combobox', { name: 'Año' }), '2025');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Mes' }), '3');

    expect(await screen.findByRole('heading', { name: 'Marzo 2025' })).toBeInTheDocument();
    expect(filasTabla()).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Mes siguiente' }));
    expect(await screen.findByRole('heading', { name: 'Abril 2025' })).toBeInTheDocument();
    expect(filasTabla()).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Últimos 30 días' }));
    expect(await screen.findByRole('heading', { name: 'Últimos 30 días' })).toBeInTheDocument();
  });

  it('no permite meses futuros', async () => {
    const user = userEvent.setup();
    mockFetch({ [`${API_BASE}/uf`]: ufUltimos, [`${API_BASE}/uf/2026`]: ufUltimos });
    renderConProveedores(<HistoricoPage hoy={HOY} />);

    await user.selectOptions(screen.getByRole('combobox', { name: 'Año' }), '2026');
    expect(screen.getByRole('option', { name: 'Diciembre' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Mes siguiente' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Mes anterior' })).toBeEnabled();
  });

  it('para la UTM muestra el año completo', async () => {
    const user = userEvent.setup();
    mockFetch({ [`${API_BASE}/uf`]: ufUltimos, [`${API_BASE}/utm`]: utm2025, [`${API_BASE}/utm/2025`]: utm2025 });
    renderConProveedores(<HistoricoPage hoy={HOY} />);

    await user.click(screen.getByRole('tab', { name: 'UTM' }));
    expect(screen.getByRole('combobox', { name: 'Mes' })).toBeDisabled();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Año' }), '2025');
    expect(await screen.findByRole('heading', { name: 'Año 2025' })).toBeInTheDocument();
    expect(filasTabla()).toHaveLength(2);
  });

  it('avisa cuando no hay datos o la API falla', async () => {
    const user = userEvent.setup();
    mockFetch({ [`${API_BASE}/uf`]: { serie: [] } });
    renderConProveedores(<HistoricoPage hoy={HOY} />);
    expect(await screen.findByText('No hay datos para este período.')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Dólar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron cargar');
  });
});
