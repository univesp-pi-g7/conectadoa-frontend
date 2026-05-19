import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,
  Chip,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Snackbar
} from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';

import Navbar from '../../componentes/Navbar';
import { listarTodasDoacoes, atualizarStatusDoacao } from '../../servicos/doacaoServico';

const STATUS_CORES = {
  agendada: { cor: 'warning', label: 'Agendado' },
  recebida: { cor: 'success', label: 'Recebida' },
  rejeitada: { cor: 'error', label: 'Rejeitada' }
};

const formatarData = (dataStr) => {
  if (!dataStr) return '';
  const partes = dataStr.split('T')[0].split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return dataStr;
};

const AdminDashboard = () => {
  const [doacoes, setDoacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('All');

  useEffect(() => {
    const carregarDoacoes = async () => {
      setCarregando(true);
      try {
        const dados = await listarTodasDoacoes();
        setDoacoes(dados);
      } catch (err) {
        setErro(err.message || 'Erro ao carregar doações.');
      } finally {
        setCarregando(false);
      }
    };

    carregarDoacoes();
  }, []);

  const handleStatusChange = async (doacaoId, novoStatus) => {
    try {
      await atualizarStatusDoacao(doacaoId, novoStatus);
      setSucesso(`Doação atualizada para "${novoStatus}" com sucesso!`);
      // Atualiza o estado local para evitar recarregar tudo
      setDoacoes(doacoes.map(d => d.id === doacaoId ? { ...d, status_doacao: novoStatus } : d));
    } catch (err) {
      setErro(err.message || 'Erro ao atualizar status.');
    }
  };

  const doacoesFiltradas = doacoes.filter(d => 
    filtroStatus === 'All' ? true : d.status_doacao === filtroStatus
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', pb: { xs: 10, sm: 4 } }}>
      <Navbar />

      <Container maxWidth="md" sx={{ py: 4 }}>
        
        {/* Título do Painel */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, gap: 2 }}>
          <AdminPanelSettingsIcon sx={{ fontSize: 40, color: '#1a3c6e' }} />
          <Typography variant="h5" fontWeight={800} color="#1a3c6e" align="center" sx={{ textTransform: 'uppercase' }}>
            Painel Administrativo - ConectaDoa
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, mb: 4, border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" fontWeight={700} color="#2e6da4" sx={{ textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShippingIcon /> Visualizar Doações
            </Typography>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filtroStatus}
                label="Status"
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <MenuItem value="All">Todos</MenuItem>
                <MenuItem value="agendada">Agendados</MenuItem>
                <MenuItem value="recebida">Recebidas</MenuItem>
                <MenuItem value="rejeitada">Rejeitadas</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {carregando ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : erro ? (
            <Alert severity="error">{erro}</Alert>
          ) : doacoesFiltradas.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
              <Typography variant="body1" color="text.secondary">
                Nenhuma doação encontrada para o filtro selecionado.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2} justifyContent="center">
              {doacoesFiltradas.map((doacao) => {
                const cfg = STATUS_CORES[doacao.status_doacao] || { cor: 'default', label: doacao.status_doacao };
                
                return (
                  <Grid item xs={12} key={doacao.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        width: 500,
                        maxWidth: '100%',
                        mx: 'auto',
                        p: { xs: 2, sm: 3 }, 
                        borderRadius: 4, 
                        border: '1px solid',
                        borderColor: doacao.status_doacao === 'agendada' ? '#bbdefb' : doacao.status_doacao === 'recebida' ? '#c8e6c9' : '#ffcdd2',
                        bgcolor: doacao.status_doacao === 'agendada' ? '#f0f7ff' : doacao.status_doacao === 'recebida' ? '#f1f8e9' : '#fff0f2',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%' }}>
                        <Avatar sx={{ bgcolor: '#fff', color: '#666', border: '1px solid #ccc', width: 48, height: 48, flexShrink: 0 }}>
                          <AccountCircleIcon fontSize="large" />
                        </Avatar>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ lineHeight: 1.2 }}>
                            Doador(a): {doacao.nome || doacao.usuario?.nome || doacao.nome_doador || `ID ${doacao.usuario_id || ''}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            {doacao.email || doacao.usuario?.email || doacao.email_doador || ''}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Código: CD-{String(doacao.id).padStart(5, '0')}
                          </Typography>
                        </Box>

                        <Box>
                          <Chip label={cfg.label} color={cfg.cor} size="small" sx={{ fontWeight: 'bold' }} />
                        </Box>
                      </Box>
                      
                      {/* Agendamento */}
                      {(doacao.data_agendamento || doacao.hora_agendamento) && (
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 3, 
                          alignItems: 'center', 
                          bgcolor: 'rgba(0,0,0,0.03)', 
                          p: 1.5, 
                          borderRadius: 3,
                          border: '1px dashed rgba(0,0,0,0.08)'
                        }}>
                          {doacao.data_agendamento && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarMonthIcon fontSize="small" sx={{ color: '#1a3c6e', opacity: 0.8 }} />
                              <Typography variant="body2" fontWeight={600} color="text.primary">
                                {formatarData(doacao.data_agendamento)}
                              </Typography>
                            </Box>
                          )}
                          {doacao.hora_agendamento && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTimeIcon fontSize="small" sx={{ color: '#1a3c6e', opacity: 0.8 }} />
                              <Typography variant="body2" fontWeight={600} color="text.primary">
                                {doacao.hora_agendamento.substring(0, 5)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* Observações */}
                      {doacao.observacao && (
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1, 
                          alignItems: 'flex-start', 
                          bgcolor: '#fffde7', 
                          p: 1.5, 
                          borderRadius: 3,
                          border: '1px solid #fff59d'
                        }}>
                          <AssignmentIcon fontSize="small" sx={{ color: '#fbc02d', mt: 0.3 }} />
                          <Box>
                            <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block" sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
                              Observação:
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                              {doacao.observacao}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                      
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, fontWeight: 'bold' }}>
                          <CategoryIcon fontSize="small" sx={{ color: '#8d6e63' }} /> 
                          Conteúdo da Doação:
                        </Typography>
                        <Box sx={{ pl: 3, borderLeft: '2px solid rgba(0,0,0,0.1)' }}>
                          {doacao.itens?.map((item, idx) => (
                            <Typography key={item.id || idx} variant="body2" color="text.primary">
                              • {item.item?.nome_item || item.nome_item || `Item #${item.id_item}`} (Qtd: {item.quantidade})
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 1 }}>
                        <FormControl size="small" sx={{ minWidth: 140, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 1 }}>
                          <Select
                            value={doacao.status_doacao}
                            onChange={(e) => handleStatusChange(doacao.id, e.target.value)}
                            sx={{ fontSize: '0.85rem', height: 36, fontWeight: 600 }}
                          >
                            <MenuItem value="agendada" sx={{ fontSize: '0.85rem' }}>Agendada</MenuItem>
                            <MenuItem value="recebida" sx={{ fontSize: '0.85rem' }}>Marcar Recebida</MenuItem>
                            <MenuItem value="rejeitada" sx={{ fontSize: '0.85rem' }}>Rejeitar</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Paper>
      </Container>

      <Snackbar
        open={!!sucesso}
        autoHideDuration={4000}
        onClose={() => setSucesso('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSucesso('')} severity="success" sx={{ width: '100%', fontWeight: 'bold' }}>
          {sucesso}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default AdminDashboard;
