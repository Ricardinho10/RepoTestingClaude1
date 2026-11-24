import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { formatoClp, formatoFecha, MESES } from '../lib/formato';
import { mediaMovil } from '../lib/indicadores';
import type { Indicador, PuntoSerie } from '../lib/indicadores';

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, LineElement, LineController, PointElement, Tooltip, Legend);

type Props = { serie: PuntoSerie[]; indicador: Indicador };

function etiqueta(fecha: string, isMensual: boolean): string {
  if (!isMensual) return formatoFecha(fecha).slice(0, 5);
  return `${MESES[Number(fecha.slice(5, 7)) - 1].slice(0, 3).toLowerCase()} ${fecha.slice(0, 4)}`;
}

/** Barras con el valor de cada día (o mes) y una línea con la media móvil. */
export function GraficoIndicador({ serie, indicador }: Props) {
  const valores = serie.map((p) => p.valor);
  const ventana = indicador.isMensual ? 3 : 5;
  const unidad = indicador.isMensual ? 'meses' : 'días';
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const margen = (max - min) * 0.2 || max * 0.01;

  const data: ChartData<'bar' | 'line', Array<number | null>, string> = {
    labels: serie.map((p) => etiqueta(p.fecha, indicador.isMensual)),
    datasets: [
      {
        type: 'bar',
        label: `${indicador.nombre} (CLP)`,
        data: valores,
        backgroundColor: `${indicador.color}99`,
        borderColor: indicador.color,
        borderWidth: 1,
        order: 2,
      },
      {
        type: 'line',
        label: `Media móvil ${ventana} ${unidad}`,
        data: mediaMovil(valores, ventana),
        borderColor: '#111827',
        backgroundColor: '#111827',
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.3,
        spanGaps: true,
        order: 1,
      },
    ],
  };

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: {
        // Las barras parten desde el mínimo del período, no desde 0, para que se vea la variación.
        beginAtZero: false,
        min: Math.floor(min - margen),
        max: Math.ceil(max + margen),
        ticks: { callback: (v) => formatoClp(Number(v)).replace(',00', '') },
      },
    },
    plugins: {
      tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatoClp(ctx.parsed.y)}` } },
      legend: { position: 'bottom' },
    },
  };

  return (
    <div className="grafico" role="img" aria-label={`Gráfico de ${indicador.nombre}`}>
      <Chart type="bar" data={data} options={options} />
    </div>
  );
}
