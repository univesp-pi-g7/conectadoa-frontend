import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Container,
  Box,
  Paper,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";

import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import MapIcon from '@mui/icons-material/Map';
import Navbar from '../../componentes/Navbar';
import { criarDoacao } from '../../servicos/doacaoServico';

const gerarDatas = () => {
  const datas = [];
  const hoje = new Date();
  const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  for (let i = 0; i < 4; i++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + i);
    
    let labelDia = '';
    if (i === 0) labelDia = 'HOJE';
    else if (i === 1) labelDia = 'AMANHÃ';
    else labelDia = diasSemana[data.getDay()];
    
    const diaNum = data.getDate();
    const mesStr = meses[data.getMonth()];
    
    datas.push({
      labelTop: labelDia,
      labelBottom: `${diaNum} de ${mesStr}`,
      value: data.toISOString().split('T')[0]
    });
  }
  return datas;
};

const horarios = [
  "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
  "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"
];

const ConfirmarAgendamento = () => {
  const location = useLocation();
  const navegar = useNavigate();
  
  const itensSelecionados = location.state?.itensSelecionados || [];

  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [observacao, setObservacao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const totalQuantidade = itensSelecionados.reduce((acc, item) => acc + item.quantidade, 0);
  
  // Computa categorias únicas
  const categorias = [...new Set(itensSelecionados.map(item => item.categoria))].join(' e ');
  
  // Verifica se há item urgente
  const temUrgente = itensSelecionados.some(item => item.prioridade_status === 'alta');

  const handleSubmit = async () => {
    if (!data || !hora) {
      setErro("Por favor, selecione a data e o horário.");
      return;
    }

    setCarregando(true);
    setErro("");

    const horaFormatada = hora.split(' ')[0]; // Pega apenas "09:00" de "09:00 - 10:00"

    const payload = {
      itens: itensSelecionados.map(item => ({
        id_item: item.id,
        quantidade: item.quantidade,
      })),
      data_agendamento: data,
      hora_agendamento: horaFormatada,
      observacao: observacao || null,
    };

    try {
      await criarDoacao(payload);
      // Passar dados da doação para a página de sucesso para poder renderizar os mesmos dados do protótipo
      navegar('/AgendamentoConfirmado', { 
        state: { 
          totalItens: totalQuantidade, 
          categorias, 
          dataStr: gerarDatas().find(d => d.value === data)?.labelBottom || data,
          horaStr: hora
        } 
      });
    } catch (err) {
      setErro(err.message || "Ocorreu um erro ao realizar o agendamento.");
    } finally {
      setCarregando(false);
    }
  };

  if (itensSelecionados.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Navbar mostrarBotaoHome />
        <Container maxWidth="sm" sx={{ py: 6, textAlign: 'center' }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Nenhum item foi selecionado para doação.
          </Alert>
          <Button variant="contained" onClick={() => navegar('/doacao')} sx={{ bgcolor: '#1a3c6e' }}>
            Selecionar Itens
          </Button>
        </Container>
      </Box>
    );
  }

  const datasDisponiveis = gerarDatas();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', pb: { xs: 10, sm: 3 } }}>
      <Navbar mostrarBotaoHome />

      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Typography 
          variant="h5" 
          align="center" 
          fontWeight={700} 
          color="#1a3c6e" 
          gutterBottom
        >
          Agendar Entrega
        </Typography>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: { xs: 2.5, sm: 3 },
            backgroundColor: "#ffffff",
            mt: 2,
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          {/* Box 1: Resumo da Doação */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <Box sx={{ 
                bgcolor: '#f5efe6', 
                p: 1.5, 
                borderRadius: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <ShoppingBasketIcon sx={{ color: '#8d6e63', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} color="#1a3c6e" sx={{ lineHeight: 1.2 }}>
                  Resumo da Doação:
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {totalQuantidade} itens selecionados
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.2 }}>
                  ({categorias})
                </Typography>
              </Box>
            </Box>
            
            {temUrgente && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 2 }}>
                <DeviceThermostatIcon sx={{ color: '#d32f2f', fontSize: 28 }} />
                <Box 
                  component="span" 
                  sx={{ 
                    bgcolor: '#d32f2f', 
                    color: 'white', 
                    px: 1, 
                    py: 0.2, 
                    borderRadius: 1, 
                    fontSize: '0.65rem', 
                    fontWeight: 'bold',
                    mt: 0.5
                  }}
                >
                  URGENTE
                </Box>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Box 2: Escolha a Data e Hora */}
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="#1a3c6e" gutterBottom>
              Escolha a Data e Hora
            </Typography>

            {/* Datas Pill Buttons */}
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, mb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
              {datasDisponiveis.map((item) => {
                const isSelected = data === item.value;
                return (
                  <Button
                    key={item.value}
                    onClick={() => setData(item.value)}
                    sx={{
                      minWidth: 80,
                      flexDirection: 'column',
                      borderRadius: 2,
                      py: 1,
                      px: 2,
                      border: isSelected ? '2px solid #1a3c6e' : '1px solid #e0e0e0',
                      bgcolor: isSelected ? '#1a3c6e' : 'transparent',
                      color: isSelected ? 'white' : 'text.primary',
                      '&:hover': {
                        bgcolor: isSelected ? '#1a3c6e' : '#f5f5f5',
                      }
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold" sx={{ display: 'block', lineHeight: 1.1 }}>
                      {item.labelTop}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      {item.labelBottom}
                    </Typography>
                  </Button>
                );
              })}
            </Box>

            {/* Horas Pill Buttons */}
            <Grid container spacing={1}>
              {horarios.map((item) => {
                const isSelected = hora === item;
                return (
                  <Grid item xs={6} sm={4} key={item}>
                    <Button
                      fullWidth
                      onClick={() => setHora(item)}
                      sx={{
                        borderRadius: 2,
                        py: 0.8,
                        border: isSelected ? '2px solid #1a3c6e' : '1px solid #e0e0e0',
                        bgcolor: isSelected ? '#1a3c6e' : 'transparent',
                        color: isSelected ? 'white' : 'text.primary',
                        fontSize: '0.8rem',
                        fontWeight: isSelected ? 'bold' : 'normal',
                        '&:hover': {
                          bgcolor: isSelected ? '#1a3c6e' : '#f5f5f5',
                        }
                      }}
                    >
                      {item}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Divider />

          {/* Box 3: Local de Entrega */}
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="#1a3c6e" gutterBottom>
              Local de Entrega
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box sx={{ mt: 0.5 }}>
                <MapIcon sx={{ color: '#4caf50', fontSize: 32 }} />
              </Box>
              <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ lineHeight: 1.4 }}>
                <Typography component="span" fontWeight={700} color="#1a3c6e" sx={{ display: 'block' }}>
                  Casa de Passagem Geisiane Valente,
                </Typography>
                Rua Seis, 1318 - Jardim Ipanema,<br/>
                Rio Claro-SP
              </Typography>
            </Box>
          </Box>

          <TextField
            fullWidth
            placeholder="Observações opcionais..."
            variant="outlined"
            multiline
            rows={2}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#f8f9fa'
              }
            }}
          />

          {erro && <Alert severity="error">{erro}</Alert>}

          <Button
            variant="contained"
            fullWidth
            disabled={carregando}
            onClick={handleSubmit}
            sx={{ 
              borderRadius: 8, 
              py: 1.5, 
              fontSize: '1rem', 
              fontWeight: 'bold',
              textTransform: 'none',
              background: 'linear-gradient(90deg, #1a3c6e 0%, #2e6da4 100%)',
              boxShadow: '0 4px 15px rgba(26, 60, 110, 0.4)',
              mt: 1
            }}
          >
            {carregando ? <CircularProgress size={24} color="inherit" /> : "Confirmar Agendamento"}
          </Button>

        </Paper>
      </Container>
    </Box>
  );
};

export default ConfirmarAgendamento;
