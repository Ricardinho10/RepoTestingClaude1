import { useQuery } from '@tanstack/react-query';
import { fetchAnio, fetchUltimos, fetchValoresHoy, filtrarMes, INDICADORES } from '../lib/indicadores';
import type { CodigoIndicador } from '../lib/indicadores';

export function useValoresHoy() {
  return useQuery({ queryKey: ['hoy'], queryFn: fetchValoresHoy });
}

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
    select: (serie) => (anio == null || mes == null || isMensual ? serie : filtrarMes(serie, anio, mes)),
  });
}
