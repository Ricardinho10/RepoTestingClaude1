import { formatoClp, formatoFecha } from '../lib/formato';
import type { PuntoSerie } from '../lib/indicadores';

type Props = { serie: PuntoSerie[] };

export function TablaValores({ serie }: Props) {
  const filas = [...serie].reverse();
  return (
    <details>
      <summary>Ver tabla de valores ({serie.length})</summary>
      <table>
        <thead>
          <tr><th scope="col">Fecha</th><th scope="col">Valor</th></tr>
        </thead>
        <tbody>
          {filas.map((p) => (
            <tr key={p.fecha}><td>{formatoFecha(p.fecha)}</td><td>{formatoClp(p.valor)}</td></tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
