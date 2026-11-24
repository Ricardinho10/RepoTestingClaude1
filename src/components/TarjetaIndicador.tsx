import { formatoClp, formatoFecha } from '../lib/formato';
import type { Indicador } from '../lib/indicadores';

type Props = { indicador: Indicador; valor: number | null; fecha: string | null };

export function TarjetaIndicador({ indicador, valor, fecha }: Props) {
  return (
    <article className="tarjeta" style={{ borderTopColor: indicador.color }} aria-label={indicador.nombre}>
      <h3>{indicador.nombre}</h3>
      <p className="desc">{indicador.descripcion}</p>
      <p className="valor">{formatoClp(valor)}</p>
      <p className="fecha">{formatoFecha(fecha)}</p>
    </article>
  );
}
