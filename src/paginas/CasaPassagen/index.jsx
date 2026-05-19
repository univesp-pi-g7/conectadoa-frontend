import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Button,
  Container,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";

import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import Navbar from '../../componentes/Navbar';
import { listarNecessidadesAbertas } from '../../servicos/necessidadeServico';
import { listarItens } from '../../servicos/itemServico';

const CasaPassagen = () => {
  const [necessidades, setNecessidades] = useState([]);
  const [itensMap, setItensMap] = useState({});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [necessidadesDados, catalogoItens] = await Promise.all([
          listarNecessidadesAbertas(),
          listarItens()
        ]);

        const mapa = {};
        catalogoItens.forEach(item => {
          mapa[item.id] = item.nome_item;
        });

        setItensMap(mapa);
        setNecessidades(necessidadesDados);
      } catch (err) {
        console.error("Erro ao carregar necessidades dinâmicas", err);
      } finally {
        setCarregando(false);
      }
    };
    buscarDados();
  }, []);

  // Compila o texto de urgência a partir das necessidades abertas
  const getTextoUrgencia = () => {
    if (necessidades.length === 0) {
      return "Urgente: Alimentos (Perecíveis e Mistura) e Produtos de Limpeza.";
    }

    const nomes = necessidades
      .slice(0, 3) // Mostra as 3 principais
      .map(nec => itensMap[nec.id_item])
      .filter(Boolean);

    if (nomes.length === 0) {
      return "Urgente: Alimentos (Perecíveis e Mistura) e Produtos de Limpeza.";
    }

    return `Urgente: ${nomes.join(', ')} e itens de primeira necessidade.`;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', pb: { xs: 10, sm: 3 } }}>
      {/* Barra superior (Navbar e BottomNav) */}
      <Navbar />

      <Container maxWidth="sm" sx={{ py: 3 }}>
        
        {/* Título da Página */}
        <Typography 
          variant="h5" 
          align="center" 
          fontWeight={600} 
          color="#1a3c6e" 
          gutterBottom
        >
          Mural de Ajuda
        </Typography>

        {/* Card Principal */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            p: { xs: 2.5, sm: 3 },
            backgroundColor: "#ffffff",
            mt: 2,
            border: '1px solid #e0e0e0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
          }}
        >
          {/* Cabeçalho do Card */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" fontWeight={700} color="#1a3c6e" sx={{ maxWidth: '75%', lineHeight: 1.2 }}>
              Casa de Passagem Geisiane Valente <br/>
              <Typography component="span" variant="body2" color="text.secondary">(Rio Claro-SP)</Typography>
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <DeviceThermostatIcon sx={{ color: '#d32f2f', fontSize: 32 }} />
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
          </Box>

          {/* Logo da Instituição */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box
              component="img"
              src="/LogoCasa.png"
              alt="Logo da Instituição"
              sx={{
                width: '100%',
                maxHeight: "160px",
                objectFit: "contain",
                borderRadius: "8px",
                border: "1px solid #f0f0f0",
                p: 1
              }}
            />
          </Box>

          {carregando ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={30} />
            </Box>
          ) : (
            <>
              {/* Sub-box com a urgência */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: '#e3f2fd', 
                  p: 1.5, 
                  borderRadius: 2, 
                  mb: 2,
                  gap: 1.5
                }}
              >
                <ShoppingBasketIcon sx={{ color: '#1a3c6e' }} />
                <Typography variant="body2" fontWeight={600} color="#1a3c6e">
                  {getTextoUrgencia()}
                </Typography>
              </Box>

              {/* Texto descritivo */}
              <Typography variant="body2" color="text.primary" sx={{ mb: 2, lineHeight: 1.5 }}>
                A Casa de Passagem Geisiane Valente precisa de doações de alimentos e itens de 
                limpeza para manter o atendimento a famílias em vulnerabilidade. Por favor, foque nestes 
                itens; temos excesso de roupas.
              </Typography>
            </>
          )}

          {/* Contatos da Instituição */}
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3, pl: 1, borderLeft: '3px solid #e0e0e0' }}>
            <Typography variant="caption" fontWeight="bold" color="text.secondary">
              Entre em contato conosco:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Button
                component="a"
                href="https://wa.me/19996921924"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<WhatsAppIcon />}
                size="small"
                sx={{ 
                  color: '#25D366', 
                  textTransform: 'none', 
                  fontWeight: 'bold',
                  px: 0,
                  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                }}
              >
                (19) 99692-1924
              </Button>
              <Button
                component="a"
                href="https://instagram.com/casageisevalente"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<InstagramIcon />}
                size="small"
                sx={{ 
                  color: '#E1306C', 
                  textTransform: 'none', 
                  fontWeight: 'bold',
                  px: 0,
                  '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                }}
              >
                @casageisevalente
              </Button>
            </Box>
          </Box>

          {/* Botão de Ação */}
          <Button
            variant="contained"
            fullWidth
            component={RouterLink} 
            to="/doacao"
            sx={{ 
              borderRadius: 8, 
              py: 1.5, 
              fontSize: '1rem', 
              fontWeight: 'bold',
              textTransform: 'none',
              background: 'linear-gradient(90deg, #1a3c6e 0%, #2e6da4 100%)',
              boxShadow: '0 4px 15px rgba(26, 60, 110, 0.4)'
            }}
          >
            Quero Ajudar
          </Button>


        </Paper>
      </Container>
    </Box>
  );
}

export default CasaPassagen;
