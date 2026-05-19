import React, { useMemo } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import MapIcon from '@mui/icons-material/Map';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';

import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Navbar from '../../componentes/Navbar';
import { useAuth } from '../../contextos/AuthContexto';

const AgendamentoConfirmado = () => {
  const { usuario } = useAuth();
  const location = useLocation();
  const navegar = useNavigate();

  const state = location.state || {};
  const {
    totalItens = 0,
    categorias = "Diversos",
    dataStr = "Em breve",
    horaStr = "A combinar"
  } = state;

  // Gera um código de confirmação falso baseado na hora atual para dar realismo
  const codigoConfirmacao = useMemo(() => {
    const num = Math.floor(Math.random() * 90000) + 10000;
    return `CD-${num}`;
  }, []);

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
          Agendamento Confirmado!
        </Typography>

        {/* Ilustração "Mockada" de Sucesso */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4, position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 20, left: '20%' }}>
            <StarIcon sx={{ color: '#ffb300', fontSize: 32, opacity: 0.7 }} />
          </Box>
          <Box sx={{ position: 'absolute', top: 40, right: '25%' }}>
            <FavoriteIcon sx={{ color: '#f48fb1', fontSize: 24, opacity: 0.8 }} />
          </Box>
          <Box sx={{ position: 'absolute', bottom: 10, left: '30%' }}>
            <FavoriteIcon sx={{ color: '#81d4fa', fontSize: 20, opacity: 0.8 }} />
          </Box>
          <Box sx={{ position: 'absolute', bottom: 30, right: '20%' }}>
            <StarIcon sx={{ color: '#81d4fa', fontSize: 28, opacity: 0.7 }} />
          </Box>
          
          <Box sx={{ 
            width: 120, 
            height: 120, 
            borderRadius: '50%', 
            bgcolor: '#e8f5e9', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            boxShadow: '0 8px 24px rgba(76, 175, 80, 0.2)'
          }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50' }} />
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: { xs: 2.5, sm: 3 },
            backgroundColor: "#ffffff",
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {/* Box 1: Resumo do Seu Agendamento */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box sx={{ bgcolor: '#fff3e0', p: 1, borderRadius: 2, display: 'flex' }}>
                <FactCheckIcon sx={{ color: '#ef6c00' }} />
              </Box>
              <Typography variant="subtitle1" fontWeight={700} color="#1a3c6e">
                Resumo do Seu Agendamento
              </Typography>
            </Box>

            <List dense disablePadding sx={{ ml: 0.5 }}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mr: 0.5 }}>Código de Confirmação:</Typography>
                <Typography variant="body2" fontWeight="bold" color="text.primary">{codigoConfirmacao}</Typography>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mr: 0.5 }}>Doador:</Typography>
                <Typography variant="body2" fontWeight="bold" color="text.primary">{usuario?.nome || "Doador"}</Typography>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mr: 0.5 }}>Data de Entrega:</Typography>
                <Typography variant="body2" fontWeight="bold" color="text.primary">{dataStr}</Typography>
              </ListItem>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mr: 0.5 }}>Horário de Entrega:</Typography>
                <Typography variant="body2" fontWeight="bold" color="text.primary">{horaStr}</Typography>
              </ListItem>
              <ListItem disablePadding>
                <Typography variant="body2" sx={{ color: 'text.secondary', mr: 0.5 }}>Conteúdo:</Typography>
                <Typography variant="body2" fontWeight="bold" color="text.primary">{totalItens} itens ({categorias})</Typography>
              </ListItem>
            </List>
          </Box>

          <Divider />

          {/* Box 2: Local de Entrega */}
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
        </Paper>

        <Box sx={{ textAlign: 'center', mt: 3, px: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
            Por favor, leve os itens organizados.<br/>
            O código acima é sua referência na entrega.<br/>
            <strong>Sua ajuda faz a diferença!</strong>
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" fontWeight="bold" color="text.secondary" display="block">
              Caso queira entrar em contato:
            </Typography>
            <Button
              component="a"
              href="https://wa.me/19996921924"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<WhatsAppIcon />}
              sx={{ 
                color: '#25D366', 
                textTransform: 'none', 
                fontWeight: 'bold',
                bgcolor: '#f0f9f0',
                px: 2,
                py: 0.5,
                borderRadius: 4,
                mt: 1,
                '&:hover': { bgcolor: '#e8f5e9' }
              }}
            >
              (19) 99692-1924
            </Button>
          </Box>


          <Button
            variant="contained"
            fullWidth
            component={RouterLink}
            to="/CasaPassagen"
            sx={{ 
              borderRadius: 8, 
              py: 1.5, 
              fontSize: '1rem', 
              fontWeight: 'bold',
              textTransform: 'none',
              background: 'linear-gradient(90deg, #1a3c6e 0%, #2e6da4 100%)',
              boxShadow: '0 4px 15px rgba(26, 60, 110, 0.4)',
              mb: 2
            }}
          >
            Mural de Necessidades
          </Button>

          <Button
            variant="text"
            sx={{
              textTransform: 'none',
              color: '#2e6da4',
              fontWeight: 600,
              textDecoration: 'underline'
            }}
          >
            Compartilhar e Inspirar
          </Button>
        </Box>

      </Container>
    </Box>
  );
};

export default AgendamentoConfirmado;
