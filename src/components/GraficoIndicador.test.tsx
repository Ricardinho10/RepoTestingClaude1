import { render } from '@testing-library/react';
import type { TooltipItem } from 'chart.js';
import { describe, expect, it } from 'vitest';
import { formatoClp } from '../lib/formato';
import { INDICADORES } from '../lib/indicadores';
import { graficoSimulado } from '../test/grafico-mock';
import { GraficoIndicador } from './GraficoIndicador';

const serie = [
  { fecha: '2026-01-01', valor: 68000 },
  { fecha: '2026-02-01', valor: 68500 },
];

describe('GraficoIndicador', () => {
  it('rotula meses en series mensuales y formatea eje y tooltip en CLP', () => {
    render(<GraficoIndicador serie={serie} indicador={INDICADORES.utm} />);
    const props = graficoSimulado.props!;

    expect(props.data.labels).toEqual(['ene 2026', 'feb 2026']);
    expect(props.data.datasets[1].label).toBe('Media móvil 3 meses');

    const ticks = props.options.scales!.y!.ticks as { callback: (v: number) => string };
    expect(ticks.callback(68000)).toBe(formatoClp(68000).replace(',00', ''));

    const label = props.options.plugins!.tooltip!.callbacks!.label as (ctx: TooltipItem<'bar'>) => string;
    const ctx = { dataset: { label: 'UTM (CLP)' }, parsed: { y: 68500 } } as unknown as TooltipItem<'bar'>;
    expect(label(ctx)).toBe(`UTM (CLP): ${formatoClp(68500)}`);
  });

  it('usa un margen mínimo cuando todos los valores son iguales', () => {
    render(<GraficoIndicador serie={[{ fecha: '2026-11-24', valor: 950 }]} indicador={INDICADORES.dolar} />);
    const y = graficoSimulado.props!.options.scales!.y!;
    expect(y.min).toBeLessThan(950);
    expect(y.max).toBeGreaterThan(950);
  });
});
