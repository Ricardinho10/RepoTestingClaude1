import { Link } from 'react-router-dom';
import { TarjetaIndicador } from '../components/TarjetaIndicador';
import { useValoresHoy } from '../hooks/use-indicadores';
import { INDICADORES } from '../lib/indicadores';

export function InicioPage() {
  const { data: valores, isPending, error } = useValoresHoy();

  return (
    <section>
      <h2>Valores del día</h2>
      {error && <p className="error" role="alert">No se pudieron cargar los valores: {error.message}</p>}
      {isPending && <p className="cargando">Cargando…</p>}
      {valores && (
        <div className="tarjetas">
          {valores.map((v) => (
            <TarjetaIndicador key={v.codigo} indicador={INDICADORES[v.codigo]} valor={v.valor} fecha={v.fecha} />
          ))}
        </div>
      )}
      <p className="link-historico">
        <Link to="/historico">Ver valores de los últimos 30 días →</Link>
      </p>
    </section>
  );
}
