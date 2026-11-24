import { MESES } from '../lib/formato';
import type { Periodo } from '../hooks/use-indicadores';

export const ANIO_INICIAL = 2000;

type Props = {
  periodo: Periodo;
  anioActual: number;
  mesActual: number;
  isSoloAnio: boolean;
  onChange: (periodo: Periodo) => void;
};

/** Botón "Últimos 30 días" + selects de mes y año con flechas de mes anterior/siguiente. */
export function SelectorPeriodo({ periodo, anioActual, mesActual, isSoloAnio, onChange }: Props) {
  const anio = periodo.tipo === 'mes' ? periodo.anio : anioActual;
  const mes = periodo.tipo === 'mes' ? periodo.mes : mesActual;
  const anios = Array.from({ length: anioActual - ANIO_INICIAL + 1 }, (_, i) => anioActual - i);

  const isFuturo = (a: number, m: number) => a > anioActual || (a === anioActual && m > mesActual);
  const isValido = (a: number, m: number) => a >= ANIO_INICIAL && !isFuturo(a, m);

  const irA = (a: number, m: number) => {
    const mesAjustado = isFuturo(a, m) ? mesActual : m;
    onChange({ tipo: 'mes', anio: a, mes: mesAjustado });
  };

  const desplazar = (delta: number) => {
    const total = anio * 12 + (mes - 1) + delta;
    return { a: Math.floor(total / 12), m: (total % 12) + 1 };
  };
  const anterior = desplazar(-1);
  const siguiente = desplazar(1);
  const hayAnterior = isValido(anterior.a, anterior.m);
  const haySiguiente = isValido(siguiente.a, siguiente.m);

  return (
    <div className="filtros">
      <button
        type="button"
        className={periodo.tipo === 'ultimos' ? 'activo' : ''}
        aria-pressed={periodo.tipo === 'ultimos'}
        onClick={() => onChange({ tipo: 'ultimos' })}
      >
        Últimos 30 días
      </button>
      <span className="sep">o elige período:</span>
      <button type="button" aria-label="Mes anterior" disabled={isSoloAnio || !hayAnterior} onClick={() => irA(anterior.a, anterior.m)}>‹</button>
      <select aria-label="Mes" value={mes} disabled={isSoloAnio} onChange={(e) => irA(anio, Number(e.target.value))}>
        {MESES.map((nombre, i) => (
          <option key={nombre} value={i + 1} disabled={isFuturo(anio, i + 1)}>{nombre}</option>
        ))}
      </select>
      <select aria-label="Año" value={anio} onChange={(e) => irA(Number(e.target.value), mes)}>
        {anios.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
      <button type="button" aria-label="Mes siguiente" disabled={isSoloAnio || !haySiguiente} onClick={() => irA(siguiente.a, siguiente.m)}>›</button>
    </div>
  );
}
