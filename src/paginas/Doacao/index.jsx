import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  IconButton,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Navbar from "../../componentes/Navbar";
import { listarItens } from "../../servicos/itemServico";

const Doacao = () => {
  const navegar = useNavigate();
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const dados = await listarItens();
        setItens(dados.map(item => ({ ...item, quantidade: 0 })));
      } catch (err) {
        setErro("Não foi possível carregar os itens de doação.");
      } finally {
        setCarregando(false);
      }
    };
    buscarDados();
  }, []);

  const handleQuantidade = (index, delta) => {
    setItens((prevItens) =>
      prevItens.map((item, i) =>
        i === index
          ? { ...item, quantidade: Math.max(0, item.quantidade + delta) }
          : item
      )
    );
  };

  const totalItens = itens.reduce((acc, curr) => acc + curr.quantidade, 0);

  const handleAgendar = () => {
    const itensSelecionados = itens.filter(i => i.quantidade > 0);
    if (itensSelecionados.length === 0) return;
    
    // Passa os itens selecionados para a tela de confirmação
    navegar("/ConfirmarAgendamento", { state: { itensSelecionados } });
  };

  const itensUrgentes = itens.filter(item => item.prioridade_status === "alta");
  const itensOutros = itens.filter(item => item.prioridade_status !== "alta");

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa", pb: { xs: 10, sm: 3 } }}>
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
          Selecionar Doação
        </Typography>

        {/* Card Principal */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            p: { xs: 2, sm: 3 },
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
              <Box 
                component="span" 
                sx={{ 
                  bgcolor: '#d32f2f', 
                  color: 'white', 
                  px: 1, 
                  py: 0.2, 
                  borderRadius: 1, 
                  fontSize: '0.7rem', 
                  fontWeight: 'bold',
                  mt: 0.5
                }}
              >
                URGENTE
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {carregando ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : erro ? (
            <Typography variant="body1" color="error" align="center" sx={{ py: 3 }}>
              {erro}
            </Typography>
          ) : (
            <>
              {/* Necessidades Urgentes */}
              <Typography variant="subtitle2" fontWeight={700} color="#1a3c6e" sx={{ mb: 2 }}>
                Necessidades Urgentes
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3 }}>
                {itensUrgentes.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">Nenhum item urgente no momento.</Typography>
                ) : (
                  itens.map((item, index) => item.prioridade_status === 'alta' && (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" fontWeight={600} color="#333">{item.nome_item}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.5 }}>
                          Categoria: {item.categoria}
                        </Typography>
                      </Box>
                      
                      {/* Botão de Quantidade (Pílula) */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        bgcolor: '#1a3c6e', 
                        borderRadius: 8,
                        px: 0.5,
                        py: 0.2,
                        color: 'white',
                        minWidth: 90,
                        justifyContent: 'space-between'
                      }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantidade(index, -1)}
                          sx={{ color: 'white', p: 0.5 }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body1" fontWeight="bold" sx={{ minWidth: 24, textAlign: 'center' }}>
                          {item.quantidade}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantidade(index, 1)}
                          sx={{ color: 'white', p: 0.5 }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>

              {/* Outras Necessidades */}
              <Typography variant="subtitle2" fontWeight={700} color="#1a3c6e" sx={{ mb: 2 }}>
                Outras Necessidades
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {itensOutros.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">Nenhuma outra necessidade.</Typography>
                ) : (
                  itens.map((item, index) => item.prioridade_status !== 'alta' && (
                    <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body1" fontWeight={600} color="#333">{item.nome_item}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: -0.5 }}>
                          Categoria: {item.categoria}
                        </Typography>
                      </Box>
                      
                      {/* Botão de Quantidade (Pílula) */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        bgcolor: '#1a3c6e', 
                        borderRadius: 8,
                        px: 0.5,
                        py: 0.2,
                        color: 'white',
                        minWidth: 90,
                        justifyContent: 'space-between'
                      }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantidade(index, -1)}
                          sx={{ color: 'white', p: 0.5 }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body1" fontWeight="bold" sx={{ minWidth: 24, textAlign: 'center' }}>
                          {item.quantidade}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantidade(index, 1)}
                          sx={{ color: 'white', p: 0.5 }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </>
          )}

        </Paper>

        {/* Resumo e Botão de Agendar */}
        <Box sx={{ textAlign: "center", mt: 3, mb: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
            *Você selecionou {totalItens} itens no total.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            disabled={totalItens === 0 || carregando}
            sx={{ 
              mt: 1, 
              borderRadius: 8, 
              py: 1.5, 
              fontSize: '1.1rem', 
              fontWeight: 'bold',
              textTransform: 'none',
              background: totalItens === 0 ? '#cccccc' : 'linear-gradient(90deg, #1a3c6e 0%, #2e6da4 100%)',
              boxShadow: totalItens === 0 ? 'none' : '0 4px 15px rgba(26, 60, 110, 0.4)'
            }}
            onClick={handleAgendar}
          >
            Agendar Entrega
          </Button>
        </Box>
        
      </Container>
    </Box>
  );
};

export default Doacao;
