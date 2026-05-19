import { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Avatar, 
  Typography, 
  Button, 
  useMediaQuery, 
  useTheme,
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../contextos/AuthContexto';

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children] - Elementos extras a serem exibidos à esquerda do perfil do usuário
 * @param {boolean} [props.mostrarBotaoHome=false] - Se true, exibe um botão para voltar à página inicial
 */
const Navbar = ({ children, mostrarBotaoHome = false }) => {
  const navegar = useNavigate();
  const location = useLocation();
  const { usuario, sair } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSair = () => {
    sair();
    navegar('/login');
  };

  const inicialNome = usuario?.nome?.charAt(0)?.toUpperCase() || 'U';

  // Determinar qual aba da bottom navigation está ativa
  const getPathIndex = () => {
    if (location.pathname === '/') return 0;
    if (location.pathname.includes('/doacao') || location.pathname.includes('/casapassagen') || location.pathname.includes('/NecessidadeCasa')) return 1;
    return 0; // Default
  };

  const [value, setValue] = useState(getPathIndex());

  const handleBottomNavChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) navegar('/');
    if (newValue === 1) navegar('/casapassagen');
    if (newValue === 2) handleSair(); // Temporário: usa Perfil como botão de sair
  };

  // Se for mobile, exibe a barra superior simplificada + barra inferior
  if (isMobile) {
    return (
      <>
        {/* Top bar minimalista (Apenas logo centralizada) */}
        <AppBar
          position="sticky"
          sx={{
            background: '#ffffff',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <Toolbar sx={{ justifyContent: 'center', minHeight: '60px !important' }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="ConectaDoa"
                sx={{ height: 45 }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        {/* Bottom Navigation */}
        <Paper 
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} 
          elevation={4}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={handleBottomNavChange}
            sx={{
              height: 65,
              '& .MuiBottomNavigationAction-root': {
                color: 'text.secondary',
              },
              '& .Mui-selected': {
                color: 'primary.main',
              }
            }}
          >
            <BottomNavigationAction label="Início" icon={<HomeIcon />} />
            <BottomNavigationAction label="Mural" icon={<AssignmentIcon />} />
            <BottomNavigationAction label="Sair" icon={<PersonIcon />} />
          </BottomNavigation>
        </Paper>
      </>
    );
  }

  // Desktop: Mantém a barra superior completa
  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(135deg, #1a3c6e 0%, #2e6da4 100%)',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            transition: 'opacity 0.2s ease',
            '&:hover': {
              opacity: 0.85,
            },
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="ConectaDoa"
            sx={{ height: 40, filter: 'brightness(0) invert(1)' }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
          {mostrarBotaoHome && (
            <Button
              variant="outlined"
              color="inherit"
              size="medium"
              startIcon={<HomeIcon />}
              onClick={() => navegar('/')}
              sx={{
                borderRadius: '20px',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Página Inicial
            </Button>
          )}

          {children}

          {usuario && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'primary.main',
                  fontWeight: 700,
                  width: 36,
                  height: 36,
                  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {inicialNome}
              </Avatar>

              <Typography
                variant="body1"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  fontWeight: 500,
                  color: '#ffffff',
                }}
              >
                {usuario.nome}
              </Typography>

              <Button
                id="botao-sair"
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleSair}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                Sair
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
