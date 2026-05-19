/**
 * App.jsx — Componente raiz da aplicação ConectaDoa
 *
 * Define todas as rotas da aplicação e envolve tudo com
 * o tema MUI (ThemeProvider) e o reset CSS (CssBaseline).
 *
 * Rotas:
 * - /login    → Página de login (pública)
 * - /registro → Página de cadastro (pública)
 * - /         → Dashboard (protegida — requer login)
 * - /admin    → Dashboard admin (protegida — requer perfil admin)
 */
import { Routes, Route } from 'react-router-dom';

// MUI — Tema e reset CSS
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Tema customizado
import tema from './tema/tema';

// Componente de proteção de rotas
import RotaProtegida from './componentes/RotaProtegida';

// Páginas
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import Dashboard from './paginas/Dashboard';
import Doacao from './paginas/Doacao';
import Home from './paginas/Home';
import CasaPassagen from './paginas/CasaPassagen';
import NecessidadeCasa from './paginas/NecessidadeCasa';
import ConfirmarAgendamento from './paginas/ConfirmarAgendamento';
import AgendamentoConfirmado from './paginas/AgendamentoConfirmado';

import AdminDashboard from './paginas/AdminDashboard';
import AdminItens from './paginas/AdminItens';

const App = () => {
  return (
    <ThemeProvider theme={tema}>
      {/* CssBaseline normaliza os estilos padrão do navegador */}
      <CssBaseline />

      <Routes>
        {/* Rotas públicas — acessíveis sem login */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />}/>
        <Route path="/home" element={<Home />}/>

        {/* Rota protegida — requer autenticação */}
        <Route
          path="/"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />
        <Route
          path="/ConfirmarAgendamento"
          element={
            <RotaProtegida>
              <ConfirmarAgendamento />
            </RotaProtegida>
          }
        />
        <Route
          path="/AgendamentoConfirmado"
          element={
            <RotaProtegida>
              <AgendamentoConfirmado />
            </RotaProtegida>
          }
        />
        <Route
          path="/casapassagen"
          element={
            <RotaProtegida>
              <CasaPassagen />
            </RotaProtegida>
          }
        />
        <Route
          path="/NecessidadeCasa"
          element={
            <RotaProtegida>
              <NecessidadeCasa />
            </RotaProtegida>
          }
        />

        <Route
          path="/doacao"
          element={
            <RotaProtegida>
              <Doacao />
            </RotaProtegida>
          }
        />

        {/* Rota protegida — requer perfil de administrador */}
        <Route
          path="/admin-doacoes"
          element={
            <RotaProtegida apenasAdmin>
              <AdminDashboard />
            </RotaProtegida>
          }
        />
        <Route
          path="/admin-itens"
          element={
            <RotaProtegida apenasAdmin>
              <AdminItens />
            </RotaProtegida>
          }
        />
      </Routes>
      
    </ThemeProvider>
  );
};

export default App;
