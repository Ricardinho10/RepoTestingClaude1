import { NavLink, Route, Routes } from 'react-router-dom';
import { HistoricoPage } from './pages/HistoricoPage';
import { InicioPage } from './pages/InicioPage';

export function App() {
  return (
    <div className="app">
      <header className="topbar">
        <h1>Indicadores Chile</h1>
        <nav>
          <NavLink to="/" end>Hoy</NavLink>
          <NavLink to="/historico">Últimos 30 días</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<InicioPage />} />
          <Route path="/historico" element={<HistoricoPage />} />
        </Routes>
      </main>
      <footer>
        Fuente: <a href="https://mindicador.cl" target="_blank" rel="noopener noreferrer">mindicador.cl</a>
      </footer>
    </div>
  );
}
