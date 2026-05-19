import { useState, useEffect } from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';

// Componentes MUI
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Chip,
  List,
  ListItem,
  Divider,
} from '@mui/material';

// Ícones MUI
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';

// Componentes do Sistema
import Navbar from '../../componentes/Navbar';

// Contexto e Serviços
import { useAuth } from '../../contextos/AuthContexto';
import { listarMinhasDoacoes } from '../../servicos/doacaoServico';

const Dashboard = () => {
  const { usuario } = useAuth();
  const [doacoes, setDoacoes] = useState([]);

  if (usuario?.tipo_usuario === 'admin') {
    return <Navigate to="/admin-doacoes" replace />;
  }

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const doacoesDados = await listarMinhasDoacoes();
        setDoacoes(doacoesDados);
      } catch (err) {
        setErro("Não foi possível carregar seu histórico de doações.");
        console.error("Erro ao listar doações:", err);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const getStatusChip = (status) => {
    switch (status) {
      case 'recebida':
        return (
          <Chip 
            icon={<CheckCircleIcon />} 
            label="Recebida" 
            color="success" 
            variant="outlined" 
            size="small" 
          />
        );
      case 'rejeitada':
        return (
          <Chip 
            icon={<CancelIcon />} 
            label="Rejeitada" 
            color="error" 
            variant="outlined" 
            size="small" 
          />
        );
      default:
        return (
          <Chip 
            icon={<PendingActionsIcon />} 
            label="Agendada" 
            color="warning" 
            variant="outlined" 
            size="small" 
          />
        );
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "";
    const partes = dataString.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataString;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', pb: { xs: 10, sm: 3 } }}>
      {/* Barra superior (Navbar) */}
      <Navbar />

      <Box sx={{ p: { xs: 2, sm: 4 } }}>
        <Grid container spacing={3} justifyContent="center" maxWidth="lg" sx={{ mx: 'auto' }}>
          
          {/* Card de boas-vindas */}
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper
              elevation={3}
              sx={{
                width: '100%',
                maxWidth: { xs: 500, md: 'none' },
                mx: { xs: 'auto', md: 0 },
                padding: { xs: 3, sm: 4 },
                textAlign: 'center',
                borderRadius: 4,
                border: '1px solid #e0e0e0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.03)'
              }}
            >
              {/* Logo */}
              <Box
                component="img"
                src="/logo.png"
                alt="ConectaDoa"
                sx={{ width: 160, mb: 2 }}
              />

              <Typography
                variant="h5"
                component="h1"
                sx={{ mb: 1, color: '#1a3c6e', fontWeight: 'bold' }}
              >
                Olá, {usuario?.nome}!
              </Typography>

              <Typography
                variant="body2"
                sx={{ mb: 3, color: 'text.secondary' }}
              >
                Bem-vindo(a) ao ConectaDoa — Sua Ponte Para Ajudar.
              </Typography>

              <Button 
                component={RouterLink} to="/CasaPassagen"
                variant="contained"
                size="large"
                startIcon={<VolunteerActivismIcon />}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #1a3c6e 0%, #2e6da4 100%)',
                  boxShadow: '0 4px 15px rgba(26, 60, 110, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0f2744 0%, #1a3c6e 100%)',
                  },
                }}
              >
                Quero Ajudar Agora!
              </Button>

              <Typography
                variant="caption"
                sx={{ display: 'block', mt: 3, color: 'text.secondary' }}
              >
                Perfil: {usuario?.tipo_usuario === 'admin' ? 'Administrador' : 'Doador'}
              </Typography>
            </Paper>
          </Grid>

          {/* Histórico de doações */}
          <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper
              elevation={3}
              sx={{
                width: '100%',
                maxWidth: { xs: 500, md: 'none' },
                mx: { xs: 'auto', md: 0 },
                padding: { xs: 3, sm: 4 },
                borderRadius: 4,
                border: '1px solid #e0e0e0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
                minHeight: '260px'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <HistoryIcon color="primary" />
                <Typography variant="h6" fontWeight="bold" color="#1a3c6e">
                  Minhas Doações Agendadas
                </Typography>
              </Box>

              {carregando ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : erro ? (
                <Typography variant="body2" color="error" align="center">
                  {erro}
                </Typography>
              ) : doacoes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Você ainda não fez nenhum agendamento.
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Escolha uma causa no Mural de Ajuda para começar!
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {doacoes.map((doacao, index) => (
                    <Box key={doacao.id}>
                      <ListItem sx={{ px: 0, py: 2, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <Typography variant="body2" fontWeight="bold" color="text.secondary">
                            Agendado para: {formatarData(doacao.data_agendamento)} às {doacao.hora_agendamento}
                          </Typography>
                          <Box sx={{ flexShrink: 0 }}>
                            {getStatusChip(doacao.status_doacao)}
                          </Box>
                        </Box>
                        
                        <Box sx={{ pl: 1, borderLeft: '2px solid #e0e0e0' }}>
                          {doacao.itens?.map((item) => (
                            <Typography key={item.id_item} variant="body2" color="text.primary">
                              • {item.item?.nome_item || `Item #${item.id_item}`} (Qtd: {item.quantidade})
                            </Typography>
                          ))}
                        </Box>
                        
                        {doacao.observacao && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                            Nota: "{doacao.observacao}"
                          </Typography>
                        )}
                      </ListItem>
                      {index < doacoes.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
