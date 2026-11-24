const fmtClp = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatoClp(valor: number | null | undefined): string {
  return valor == null ? '—' : fmtClp.format(valor);
}

/** YYYY-MM-DD (o ISO completo) a DD-MM-AAAA. */
export function formatoFecha(iso: string | null | undefined): string {
  if (!iso) return '';
  const [a, m, d] = iso.slice(0, 10).split('-');
  return `${d}-${m}-${a}`;
}

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
