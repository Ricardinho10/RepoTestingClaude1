import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockFetch } from '../test/utils';
import {
  API_BASE,
  calcularEstadisticas,
  fetchAnio,
  fetchUltimos,
  fetchValoresHoy,
  filtrarMes,
  mediaMovil,
  normalizarSerie,
} from './indicadores';

afterEach(() => vi.unstubAllGlobals());

describe('normalizarSerie', () => {
  it('ordena ascendente y recorta la fecha', () => {
    const s = normalizarSerie([
      { fecha: '2026-11-02T03:00:00.000Z', valor: 2 },
      { fecha: '2026-11-01T03:00:00.000Z', valor: '1' },
    ]);
    expect(s).toEqual([
      { fecha: '2026-11-01', valor: 1 },
      { fecha: '2026-11-02', valor: 2 },
    ]);
  });

  it('devuelve vacío sin serie', () => {
    expect(normalizarSerie(undefined)).toEqual([]);
  });
});

describe('filtrarMes', () => {
  it('deja solo el mes pedido', () => {
    const s = [{ fecha: '2026-10-31', valor: 1 }, { fecha: '2026-11-01', valor: 2 }];
    expect(filtrarMes(s, 2026, 11)).toEqual([{ fecha: '2026-11-01', valor: 2 }]);
  });
});

describe('mediaMovil', () => {
  it('calcula la media de n puntos', () => {
    expect(mediaMovil([1, 2, 3, 4], 2)).toEqual([null, 1.5, 2.5, 3.5]);
  });
});

describe('calcularEstadisticas', () => {
  it('calcula mínimo, máximo, promedio y variación', () => {
    const e = calcularEstadisticas([
      { fecha: '2026-11-01', valor: 100 },
      { fecha: '2026-11-02', valor: 90 },
      { fecha: '2026-11-03', valor: 110 },
    ]);
    expect(e).toEqual({ minimo: 90, maximo: 110, promedio: 100, variacion: 10 });
  });
});

describe('llamadas a la API', () => {
  it('fetchValoresHoy devuelve los tres indicadores', async () => {
    mockFetch({ [API_BASE]: { uf: { valor: 39000, fecha: '2026-11-24T03:00:00.000Z' } } });
    const v = await fetchValoresHoy();
    expect(v.map((x) => x.codigo)).toEqual(['uf', 'utm', 'dolar']);
    expect(v[0].valor).toBe(39000);
    expect(v[1].valor).toBeNull();
  });

  it('fetchUltimos y fetchAnio usan la URL correcta', async () => {
    const f = mockFetch({
      [`${API_BASE}/dolar`]: { serie: [{ fecha: '2026-11-24', valor: 950 }] },
      [`${API_BASE}/uf/2025`]: { serie: [{ fecha: '2025-01-01', valor: 38000 }] },
    });
    await expect(fetchUltimos('dolar')).resolves.toEqual([{ fecha: '2026-11-24', valor: 950 }]);
    await expect(fetchAnio('uf', 2025)).resolves.toEqual([{ fecha: '2025-01-01', valor: 38000 }]);
    expect(f).toHaveBeenCalledTimes(2);
  });

  it('lanza error cuando la API falla', async () => {
    mockFetch({});
    await expect(fetchUltimos('uf')).rejects.toThrow('Error 500');
  });
});
