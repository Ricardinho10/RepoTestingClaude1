import { useQuery } from '@tanstack/react-query';
import { fetchAnio, fetchUltimos, fetchValoresHoy, filtrarMes, filtrarUltimosDias, INDICADORES } from '../lib/indicadores';
import type { CodigoIndicador } from '../lib/indicadores';

export function useValoresHoy() {
  return useQuery({ queryKey: ['hoy'], queryFn: fetchValoresHoy });
}

/** El endpoint sin año entrega los últimos 30 registros; el dólar solo se publica en días hábiles. */
export const DIAS_ULTIMOS = 30;

export type Periodo = { tipo: 'ultimos' } | { tipo: 'mes'; anio: number; mes: number };

/**
 * Serie de un indicador para el período pedido. La UTM es mensual: al elegir un mes
 * se devuelve el año completo para que el gráfico tenga sentido.
 */
export function useSerieIndicador(codigo: CodigoIndicador, periodo: Periodo) {
  const isMensual = INDICADORES[codigo].isMensual;
  const anio = periodo.tipo === 'mes' ? periodo.anio : null;
  const mes = periodo.tipo === 'mes' ? periodo.mes : null;

  return useQuery({
    queryKey: anio == null ? ['ultimos', codigo] : ['anio', codigo, anio],
    queryFn: () => (anio == null ? fetchUltimos(codigo) : fetchAnio(codigo, anio)),
    select: (serie) => {
      if (isMensual) return serie;
      if (anio == null || mes == null) return filtrarUltimosDias(serie, DIAS_ULTIMOS);
      return filtrarMes(serie, anio, mes);
    },
  });
}
