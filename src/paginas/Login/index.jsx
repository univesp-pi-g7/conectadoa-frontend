/**
 * Página de Login — /login
 *
 * Permite que o usuário entre na plataforma com e-mail e senha.
 * Design baseado no protótipo: card centralizado com logo, campos e botão.
 */
import { useState } from 'react';
import { useNavigate, Link as RouterLink, Navigate } from 'react-router-dom';

// Componentes MUI
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';

// Ícones MUI
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Contexto de autenticação
import { useAuth } from '../../contextos/AuthContexto';

const Login = () => {
  const navegar = useNavigate();
  const { entrar, usuario } = useAuth();

  // Estados locais do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Se já está logado, redireciona para a página inicial
  if (usuario) {
    return <Navigate to="/" replace />;
  }

  /**
   * Envia o formulário de login.
   * Chama a função entrar do contexto e navega para home em caso de sucesso.
   */
  const handleSubmit = async (evento) => {
    evento.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await entrar(email, senha);
      navegar('/');
    } catch (err) {
      // Exibe a mensagem de erro amigável vinda do serviço
      console.log(err);
      setErro(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e8edf5 50%, #dce3ed 100%)',
        padding: 2,
      }}
    >
      {/* Logo do ConectaDoa */}
      <Box
        component="img"
        src="/logo.png"
        alt="ConectaDoa — Sua Ponte Para Ajudar"
        sx={{
          width: { xs: 200, sm: 260 },
          marginBottom: 3,
        }}
      />

      {/* Card do formulário */}
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 3, sm: 4 },
          width: '100%',
          maxWidth: 420,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          align="center"
          sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}
        >
          Fazer Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Campo E-mail */}
          <TextField
            id="campo-email"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Campo Senha com toggle de visibilidade */}
          <TextField
            id="campo-senha"
            label="Senha"
            type={mostrarSenha ? 'text' : 'password'}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="current-password"
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      edge="end"
                    >
                      {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Mensagem de erro (visível apenas quando há erro) */}
          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}

          {/* Botão de login com loading */}
          <Button
            id="botao-entrar"
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={carregando}
            sx={{
              mb: 2,
              py: 1.5,
              background: 'linear-gradient(135deg, #1a3c6e 0%, #2e6da4 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0f2744 0%, #1a3c6e 100%)',
              },
            }}
          >
            {carregando ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'ENTRAR'
            )}
          </Button>

          {/* Divisor visual */}
          <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 2 }} />

          {/* Link para registro */}
          <Typography align="center" variant="body2">
            Ainda não tem conta?{' '}
            <Link
              component={RouterLink}
              to="/registro"
              underline="always"
              sx={{ fontWeight: 600 }}
            >
              Cadastre-se para ajudar
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
