import { formatoClp } from '../lib/formato';
import { calcularEstadisticas } from '../lib/indicadores';
import type { PuntoSerie } from '../lib/indicadores';

type Props = { serie: PuntoSerie[] };

export function ResumenSerie({ serie }: Props) {
  const { minimo, maximo, promedio, variacion } = calcularEstadisticas(serie);
  const isSube = variacion >= 0;
  const textoVariacion = `${isSube ? '+' : ''}${variacion.toFixed(2)}%`;

  return (
    <dl className="resumen">
      <div><dt>Mínimo</dt><dd>{formatoClp(minimo)}</dd></div>
      <div><dt>Máximo</dt><dd>{formatoClp(maximo)}</dd></div>
      <div><dt>Promedio</dt><dd>{formatoClp(promedio)}</dd></div>
      <div><dt>Variación</dt><dd className={isSube ? 'sube' : 'baja'}>{textoVariacion}</dd></div>
    </dl>
  );
}
