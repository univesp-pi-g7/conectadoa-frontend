/**
 * Página de Registro — /registro
 *
 * Permite que um novo doador crie uma conta na plataforma.
 * Design baseado no protótipo: card centralizado com logo e campos do formulário.
 *
 * O tipo_usuario é fixado como "doador" — admins são criados diretamente no banco.
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
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Contexto de autenticação
import { useAuth } from '../../contextos/AuthContexto';

const Registro = () => {
  const navegar = useNavigate();
  const { registrarUsuario, usuario } = useAuth();

  // Estados locais do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Se já está logado, redireciona para a página inicial
  if (usuario) {
    return <Navigate to="/" replace />;
  }

  /**
   * Valida os campos do formulário antes de enviar à API.
   * Retorna uma string de erro ou string vazia se tudo estiver válido.
   */
  const validarFormulario = () => {
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      return 'Preencha todos os campos.';
    }

    if (senha !== confirmarSenha) {
      return 'As senhas não coincidem.';
    }

    if (senha.length < 6) {
      return 'A senha deve ter ao menos 6 caracteres.';
    }

    return ''; // sem erro
  };

  /**
   * Envia o formulário de registro.
   * Se bem-sucedido, exibe mensagem de sucesso e redireciona para /login após 2s.
   */
  const handleSubmit = async (evento) => {
    evento.preventDefault();
    setErro('');
    setSucesso('');

    // Validação local antes de chamar a API
    const erroValidacao = validarFormulario();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setCarregando(true);

    try {
      await registrarUsuario({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        tipo_usuario: 'doador', // tipo fixo — admin é criado pelo banco
      });

      setSucesso('Conta criada com sucesso! Redirecionando para o login...');

      // Redireciona para login após 2 segundos
      setTimeout(() => {
        navegar('/login');
      }, 2000);
    } catch (err) {
      setErro(err.message || 'Erro ao criar conta. Tente novamente.');
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
          width: { xs: 180, sm: 240 },
          marginBottom: 2,
        }}
      />

      {/* Card do formulário */}
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 3, sm: 4 },
          width: '100%',
          maxWidth: 440,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          align="center"
          sx={{ fontWeight: 700, color: 'primary.main' }}
        >
          Criar Conta
        </Typography>

        <Typography
          variant="body2"
          align="center"
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          Preencha seus dados para começar a ajudar.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Campo Nome Completo */}
          <TextField
            id="campo-nome"
            label="Nome Completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            autoComplete="name"
            autoFocus
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Campo E-mail */}
          <TextField
            id="campo-email-registro"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
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

          {/* Campo Senha */}
          <TextField
            id="campo-senha-registro"
            label="Senha"
            type={mostrarSenha ? 'text' : 'password'}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="new-password"
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

          {/* Campo Confirmar Senha */}
          <TextField
            id="campo-confirmar-senha"
            label="Confirmar Senha"
            type={mostrarConfirmar ? 'text' : 'password'}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            autoComplete="new-password"
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
                      aria-label={mostrarConfirmar ? 'Ocultar senha' : 'Mostrar senha'}
                      onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                      edge="end"
                    >
                      {mostrarConfirmar ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Mensagem de erro */}
          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}

          {/* Mensagem de sucesso */}
          {sucesso && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {sucesso}
            </Alert>
          )}

          {/* Botão de cadastro com loading */}
          <Button
            id="botao-cadastrar"
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
              'CADASTRAR'
            )}
          </Button>

          {/* Link para login */}
          <Typography align="center" variant="body2" sx={{ mb: 1 }}>
            Já tem conta?{' '}
            <Link
              component={RouterLink}
              to="/login"
              underline="always"
              sx={{ fontWeight: 600 }}
            >
              Fazer Login
            </Link>
          </Typography>

          {/* Termos de uso */}
          <Typography
            align="center"
            variant="caption"
            sx={{ display: 'block', color: 'text.secondary', mt: 1 }}
          >
            Ao cadastrar-se, você concorda com nossos{' '}
            <Link href="#" underline="always">
              Termos de Uso
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Registro;
