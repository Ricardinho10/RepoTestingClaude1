export type CodigoIndicador = 'uf' | 'utm' | 'dolar';

export type Indicador = {
  codigo: CodigoIndicador;
  nombre: string;
  descripcion: string;
  color: string;
  isMensual: boolean;
};

export type PuntoSerie = { fecha: string; valor: number };

export type ValorDia = { codigo: CodigoIndicador; valor: number | null; fecha: string | null };

export const INDICADORES: Record<CodigoIndicador, Indicador> = {
  uf: { codigo: 'uf', nombre: 'UF', descripcion: 'Unidad de Fomento', color: '#2563eb', isMensual: false },
  utm: { codigo: 'utm', nombre: 'UTM', descripcion: 'Unidad Tributaria Mensual', color: '#16a34a', isMensual: true },
  dolar: { codigo: 'dolar', nombre: 'Dólar', descripcion: 'Dólar observado', color: '#d97706', isMensual: false },
};

export const CODIGOS = Object.keys(INDICADORES) as CodigoIndicador[];

export const API_BASE = 'https://mindicador.cl/api';

type RespuestaSerie = { serie?: Array<{ fecha: string; valor: number | string }> };
type RespuestaHoy = Partial<Record<CodigoIndicador, { valor: number; fecha: string }>>;

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al consultar mindicador.cl`);
  return (await res.json()) as T;
}

export async function fetchValoresHoy(): Promise<ValorDia[]> {
  const data = await getJson<RespuestaHoy>(API_BASE);
  return CODIGOS.map((codigo) => ({
    codigo,
    valor: data[codigo]?.valor ?? null,
    fecha: data[codigo]?.fecha ?? null,
  }));
}

/** Últimos registros publicados (30 días para UF/dólar, meses recientes para UTM). */
export async function fetchUltimos(codigo: CodigoIndicador): Promise<PuntoSerie[]> {
  const data = await getJson<RespuestaSerie>(`${API_BASE}/${codigo}`);
  return normalizarSerie(data.serie);
}

export async function fetchAnio(codigo: CodigoIndicador, anio: number): Promise<PuntoSerie[]> {
  const data = await getJson<RespuestaSerie>(`${API_BASE}/${codigo}/${anio}`);
  return normalizarSerie(data.serie);
}

/** Ordena ascendente por fecha y deja la fecha como YYYY-MM-DD. */
export function normalizarSerie(serie: RespuestaSerie['serie'] = []): PuntoSerie[] {
  return serie
    .map((p) => ({ fecha: p.fecha.slice(0, 10), valor: Number(p.valor) }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

/** Filtra una serie a un mes (1-12) de un año. */
export function filtrarMes(serie: PuntoSerie[], anio: number, mes: number): PuntoSerie[] {
  const prefijo = `${anio}-${String(mes).padStart(2, '0')}`;
  return serie.filter((p) => p.fecha.startsWith(prefijo));
}

/** Media móvil simple de n puntos (null mientras no haya suficientes datos). */
export function mediaMovil(valores: number[], n: number): Array<number | null> {
  return valores.map((_, i) => {
    if (i < n - 1) return null;
    const ventana = valores.slice(i - n + 1, i + 1);
    return ventana.reduce((s, v) => s + v, 0) / n;
  });
}

export type Estadisticas = { minimo: number; maximo: number; promedio: number; variacion: number };

export function calcularEstadisticas(serie: PuntoSerie[]): Estadisticas {
  const valores = serie.map((p) => p.valor);
  const primero = valores[0];
  const ultimo = valores[valores.length - 1];
  return {
    minimo: Math.min(...valores),
    maximo: Math.max(...valores),
    promedio: valores.reduce((s, v) => s + v, 0) / valores.length,
    variacion: ((ultimo - primero) / primero) * 100,
  };
}
