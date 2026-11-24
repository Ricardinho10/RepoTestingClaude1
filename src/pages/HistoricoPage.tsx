import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraficoIndicador } from '../components/GraficoIndicador';
import { ResumenSerie } from '../components/ResumenSerie';
import { SelectorPeriodo } from '../components/SelectorPeriodo';
import { TablaValores } from '../components/TablaValores';
import { useSerieIndicador } from '../hooks/use-indicadores';
import type { Periodo } from '../hooks/use-indicadores';
import { MESES } from '../lib/formato';
import { CODIGOS, INDICADORES } from '../lib/indicadores';
import type { CodigoIndicador } from '../lib/indicadores';

type Props = { hoy?: Date };

export function HistoricoPage({ hoy = new Date() }: Props) {
  const anioActual = hoy.getFullYear();
  const mesActual = hoy.getMonth() + 1;

  const [codigo, setCodigo] = useState<CodigoIndicador>('uf');
  const [periodo, setPeriodo] = useState<Periodo>({ tipo: 'ultimos' });
  const { data: serie, isPending, error } = useSerieIndicador(codigo, periodo);

  const indicador = INDICADORES[codigo];
  const titulo = tituloPeriodo(periodo, indicador.isMensual);

  return (
    <section>
      <p><Link to="/">← Volver a los valores del día</Link></p>
      <h2>Histórico: {indicador.nombre}</h2>

      <div className="tabs" role="tablist" aria-label="Indicador">
        {CODIGOS.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={codigo === c}
            className={codigo === c ? 'activo' : ''}
            onClick={() => setCodigo(c)}
          >
            {INDICADORES[c].nombre}
          </button>
        ))}
      </div>

      <SelectorPeriodo
        periodo={periodo}
        anioActual={anioActual}
        mesActual={mesActual}
        isSoloAnio={indicador.isMensual}
        onChange={setPeriodo}
      />
      {indicador.isMensual && (
        <p className="nota">La UTM se publica una vez al mes, por eso al elegir un período se muestra el año completo.</p>
      )}

      <h3>{titulo}</h3>
      {error && <p className="error" role="alert">No se pudieron cargar los datos: {error.message}</p>}
      {isPending && <p className="cargando">Cargando…</p>}
      {serie && serie.length === 0 && <p>No hay datos para este período.</p>}
      {serie && serie.length > 0 && (
        <>
          <GraficoIndicador serie={serie} indicador={indicador} />
          <ResumenSerie serie={serie} />
          <TablaValores serie={serie} />
        </>
      )}
    </section>
  );
}

function tituloPeriodo(periodo: Periodo, isMensual: boolean): string {
  if (periodo.tipo === 'ultimos') return isMensual ? 'Últimos valores mensuales' : 'Últimos 30 días';
  return isMensual ? `Año ${periodo.anio}` : `${MESES[periodo.mes - 1]} ${periodo.anio}`;
}
