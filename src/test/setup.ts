import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, vi } from 'vitest';

afterEach(() => cleanup());

// jsdom no tiene canvas: reemplazamos solo el lienzo de Chart.js por un <canvas> vacío
// que expone los datos recibidos, para poder verificar qué se graficaría.
vi.mock('react-chartjs-2', async () => {
  const { graficoSimulado } = await import('./grafico-mock');
  return {
    Chart: (props: { data: { datasets: Array<{ type: string; label: string }> } }) => {
      graficoSimulado.props = props as unknown as typeof graficoSimulado.props;
      return createElement('canvas', {
        'data-series': props.data.datasets.map((d) => `${d.type}:${d.label}`).join('|'),
      });
    },
  };
});
