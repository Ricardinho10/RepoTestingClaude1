import type { ChartData, ChartOptions } from 'chart.js';

type PropsGrafico = { data: ChartData<'bar' | 'line', Array<number | null>, string>; options: ChartOptions<'bar' | 'line'> };

/** Últimas props que recibió el <Chart> simulado, para probar opciones y callbacks. */
export const graficoSimulado: { props: PropsGrafico | null } = { props: null };
