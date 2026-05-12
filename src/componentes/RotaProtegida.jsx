/**
 * RotaProtegida.jsx — Componente de proteção de rotas
 *
 * Verifica se o usuário está autenticado antes de renderizar a página.
 * Se não estiver logado, redireciona para /login.
 * Se a rota for apenasAdmin e o usuário não for admin, redireciona para /.
 *
 * Uso nas rotas:
 *   <Route path="/" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
 *   <Route path="/admin" element={<RotaProtegida apenasAdmin><AdminPage /></RotaProtegida>} />
 */
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../contextos/AuthContexto';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente filho a ser renderizado se autorizado
 * @param {boolean} [props.apenasAdmin=false] - Se true, só permite acesso a admins
 */
const RotaProtegida = ({ children, apenasAdmin = false }) => {
  const { usuario, carregando } = useAuth();

  // Enquanto verifica a sessão, mostra loading centralizado
  if (carregando) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Se não está logado, redireciona para login
  // replace evita que o usuário volte para a rota protegida com o botão "voltar"
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota exige admin e o usuário não é admin, redireciona para home
  if (apenasAdmin && usuario.tipo_usuario !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Usuário autorizado — renderiza o conteúdo da rota
  return children;
};

export default RotaProtegida;
