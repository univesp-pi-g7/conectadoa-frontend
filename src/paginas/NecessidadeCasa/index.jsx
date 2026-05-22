import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import Navbar from '@/componentes/Navbar';
import { useAuth } from '@/contextos/AuthContexto';
import { listarItens } from "@/servicos/itemServico";
import { listarNecessidadesAbertas, criarNecessidade } from "@/servicos/necessidadeServico";

const NecessidadesCasa = () => {
  const { usuario } = useAuth();
  const navegar = useNavigate();

  const [itensCatalogo, setItensCatalogo] = useState([]);
  const [necessidadesAbertas, setNecessidadesAbertas] = useState([]);
  
  const [selectedItemId, setSelectedItemId] = useState("");
  const [observacao, setObservacao] = useState("");
  
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregarDados = async () => {
    try {
      const [itensDados, necessidadesDados] = await Promise.all([
        listarItens(),
        listarNecessidadesAbertas()
      ]);
      setItensCatalogo(itensDados);
      setNecessidadesAbertas(necessidadesDados);
    } catch (err) {
      setErro("Erro ao carregar catálogo ou necessidades.");
      console.error("Erro ao listar itens ou necessidades:", err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleAdicionar = async (e) => {
    e.preventDefault();
    if (!selectedItemId) {
      setErro("Por favor, selecione o item.");
      return;
    }

    setEnviando(true);
    setErro("");
    setSucesso("");

    const payload = {
      id_item: parseInt(selectedItemId),
      observacao: observacao || null,
    };

    try {
      await criarNecessidade(payload);
      setSucesso("Necessidade cadastrada com sucesso!");
      
      // Limpa formulário
      setSelectedItemId("");
      setObservacao("");

      // Recarrega lista
      carregarDados();
    } catch (err) {
      setErro(err.message || "Erro ao salvar a necessidade.");
    } finally {
      setEnviando(false);
    }
  };



  if (usuario?.tipo_usuario !== 'admin') {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 6, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            Acesso Restrito: Apenas administradores podem gerenciar necessidades da instituição.
          </Alert>
          <Button variant="contained" onClick={() => navegar('/')} sx={{ bgcolor: '#1a3c6e' }}>
            Voltar para Início
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', pb: { xs: 10, sm: 3 } }}>
      <Navbar />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center" color="#1a3c6e">
          Gestão de Necessidades da Instituição
        </Typography>

        {carregando ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            
            {/* Bloco de Mensagens */}
            {(erro || sucesso) && (
              <Box sx={{ maxWidth: 600, mx: "auto", width: '100%' }}>
                {erro && <Alert severity="error">{erro}</Alert>}
                {sucesso && <Alert severity="success">{sucesso}</Alert>}
              </Box>
            )}

            {/* Card de Cadastro */}
            <Card sx={{ maxWidth: 600, mx: "auto", p: 2, width: '100%', borderRadius: 3, border: '1px solid #e0e0e0', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' }}>
              <CardContent component="form" onSubmit={handleAdicionar}>
                <Typography variant="h6" fontWeight="bold" color="#1a3c6e" gutterBottom>
                  Cadastrar Nova Necessidade
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
                  <FormControl fullWidth required>
                    <InputLabel id="select-item-label">Selecione o Item</InputLabel>
                    <Select
                      labelId="select-item-label"
                      value={selectedItemId}
                      label="Selecione o Item"
                      onChange={(e) => setSelectedItemId(e.target.value)}
                    >
                      {itensCatalogo.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.nome_item} ({item.categoria})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>


                  <TextField
                    label="Observação (Opcional)"
                    variant="outlined"
                    fullWidth
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={enviando}
                    startIcon={enviando ? <CircularProgress size={20} /> : <AddIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #1a3c6e 0%, #2e6da4 100%)',
                      boxShadow: '0 4px 15px rgba(26, 60, 110, 0.4)',
                    }}
                  >
                    {enviando ? "Adicionando..." : "Adicionar Necessidade"}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Card com Necessidades Ativas */}
            <Card sx={{ maxWidth: 600, mx: "auto", p: 2, width: '100%', borderRadius: 3, border: '1px solid #e0e0e0', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="#1a3c6e" gutterBottom>
                  Necessidades Abertas Atuais
                </Typography>
                
                <Divider sx={{ my: 1.5 }} />

                {necessidadesAbertas.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                    Nenhuma necessidade aberta cadastrada no momento.
                  </Typography>
                ) : (
                  <List>
                    {necessidadesAbertas.map((necessidade, index) => (
                      <ListItem 
                        key={necessidade.id} 
                        divider={index < necessidadesAbertas.length - 1}
                        sx={{ px: 0 }}
                      >
                        <ListItemText 
                          primary={necessidade.item?.nome_item || `Item #${necessidade.id_item}`}
                          secondary={necessidade.observacao ? `Obs: ${necessidade.observacao}` : necessidade.item?.categoria}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

          </Box>
        )}
      </Container>
    </Box>
  );
}

export default NecessidadesCasa;
