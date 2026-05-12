/**
 * Página Dashboard — /
 *
 * Página principal após o login. Exibe uma saudação e botão de sair.
 * TODO: implementar dashboard completo com listagem de doações,
 * necessidades do centro e funcionalidades do perfil do usuário.
 */
import { useNavigate } from 'react-router-dom';

// Componentes MUI
import {
  Box,
  Typography,
  Button,
  Paper,
  AppBar,
  Toolbar,
  Avatar,
} from '@mui/material';

// Ícones MUI
import LogoutIcon from '@mui/icons-material/Logout';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

// Contexto de autenticação
import { useAuth } from '../../contextos/AuthContexto';

const Dashboard = () => {
  const navegar = useNavigate();
  const { usuario, sair } = useAuth();

  /**
   * Faz logout e redireciona para a tela de login
   */
  const handleSair = () => {
    sair();
    navegar('/login');
  };

  // Pega a primeira letra do nome para exibir no avatar
  const inicialNome = usuario?.nome?.charAt(0)?.toUpperCase() || 'U';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Barra superior */}
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #1a3c6e 0%, #2e6da4 100%)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo e nome */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="ConectaDoa"
              sx={{ height: 40, filter: 'brightness(0) invert(1)' }}
            />
          </Box>

          {/* Área do usuário */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', color: 'primary.main', fontWeight: 700 }}>
              {inicialNome}
            </Avatar>
            <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {usuario?.nome}
            </Typography>
            <Button
              id="botao-sair"
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleSair}
              sx={{ ml: 1 }}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Conteúdo principal */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          padding: 3,
        }}
      >
        {/* Card de boas-vindas */}
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 4, sm: 6 },
            textAlign: 'center',
            maxWidth: 500,
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src="/logo.png"
            alt="ConectaDoa"
            sx={{ width: 200, mb: 3 }}
          />

          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 1, color: 'primary.main' }}
          >
            Olá, {usuario?.nome}!
          </Typography>

          <Typography
            variant="body1"
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            Bem-vindo(a) ao ConectaDoa — Sua Ponte Para Ajudar.
          </Typography>

          {/* TODO: implementar dashboard completo */}
          {/* Aqui serão adicionados:
              - Listagem de necessidades do centro de acolhimento
              - Histórico de doações do usuário
              - Agendamento de novas doações
              - Painel administrativo (para admins)
          */}

          <Button
            variant="contained"
            size="large"
            startIcon={<VolunteerActivismIcon />}
            sx={{
              background: 'linear-gradient(135deg, #1a3c6e 0%, #2e6da4 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0f2744 0%, #1a3c6e 100%)',
              },
            }}
          >
            CLIQUE AQUI PARA AJUDAR
          </Button>

          {/* Tipo do usuário */}
          <Typography
            variant="caption"
            sx={{ display: 'block', mt: 3, color: 'text.secondary' }}
          >
            Perfil: {usuario?.tipo_usuario === 'admin' ? 'Administrador' : 'Doador'}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
