import { useState, useEffect } from "react";
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
import { listarNecessidadesAbertas } from "../../servicos/necessidadeServico";

// Mapeamento de prioridade para label e cor da tag
const PRIORIDADE_CONFIG = {
  media: { label: "Média", color: "#f59e0b", bg: "#fff8e1" },
  baixa: { label: "Baixa", color: "#6b7280", bg: "#f3f4f6" },
  suficiente: { label: "Suficiente", color: "#10b981", bg: "#ecfdf5" },
  bloqueado: { label: "Bloqueado", color: "#ef4444", bg: "#fef2f2" },
};

const Doacao = () => {
  const navegar = useNavigate();

  // Cada elemento de `necessidades` é { id: <id_necessidade>, item: { nome_item, categoria, prioridade_status, quantidade_atual }, quantidade: 0 }
  const [necessidades, setNecessidades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const dados = await listarNecessidadesAbertas();
        // Inicializa a quantidade selecionada em 0 para cada necessidade
        setNecessidades(dados.map(nec => ({ ...nec, quantidadeSelecionada: 0 })));
      } catch (err) {
        setErro("Não foi possível carregar os itens de doação.");
        console.error("Erro ao listar necessidades abertas:", err);
      } finally {
        setCarregando(false);
      }
    };
    buscarDados();
  }, []);

  const handleQuantidade = (id, delta) => {
    setNecessidades(prev =>
      prev.map(nec =>
        nec.id === id
          ? { ...nec, quantidadeSelecionada: Math.max(0, nec.quantidadeSelecionada + delta) }
          : nec
      )
    );
  };

  const totalItens = necessidades.reduce((acc, nec) => acc + nec.quantidadeSelecionada, 0);

  const handleAgendar = () => {
    // Filtra apenas os que têm quantidade selecionada > 0
    // e mapeia para o formato esperado pelo ConfirmarAgendamento
    const itensSelecionados = necessidades
      .filter(nec => nec.quantidadeSelecionada > 0)
      .map(nec => ({
        id: nec.id_item,             // id do item para o payload da doação (foreign key da necessidade)
        nome_item: nec.item.nome_item,
        categoria: nec.item.categoria,
        prioridade_status: nec.item.prioridade_status,
        quantidade: nec.quantidadeSelecionada,
      }));

    if (itensSelecionados.length === 0) return;
    navegar("/ConfirmarAgendamento", { state: { itensSelecionados } });
  };

  const itensUrgentes = necessidades.filter(nec => nec.item?.prioridade_status === "alta");
  const itensOutros   = necessidades.filter(nec => nec.item?.prioridade_status !== "alta");

  // Componente inline de linha de item para evitar duplicação de código
  const LinhaItem = ({ nec }) => {
    const prioridade = nec.item?.prioridade_status;
    const tagCfg = prioridade !== "alta" ? PRIORIDADE_CONFIG[prioridade] : null;

    return (
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" fontWeight={600} color="#333">
              {nec.item?.nome_item}
            </Typography>
            {/* Tag de prioridade apenas para itens que NÃO são alta */}
            {tagCfg && (
              <Box
                component="span"
                sx={{
                  bgcolor: tagCfg.bg,
                  color: tagCfg.color,
                  border: `1px solid ${tagCfg.color}`,
                  px: 0.8,
                  py: 0.1,
                  borderRadius: 4,
                  fontSize: "0.6rem",
                  fontWeight: "bold",
                  lineHeight: 1.8,
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                }}
              >
                Prioridade: {tagCfg.label}
              </Box>
            )}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: -0.3 }}>
            {nec.item?.categoria}
          </Typography>
        </Box>

        {/* Botão de Quantidade (Pílula) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#1a3c6e",
            borderRadius: 8,
            px: 0.5,
            py: 0.2,
            color: "white",
            minWidth: 90,
            justifyContent: "space-between",
          }}
        >
          <IconButton
            size="small"
            onClick={() => handleQuantidade(nec.id, -1)}
            sx={{ color: "white", p: 0.5 }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography variant="body1" fontWeight="bold" sx={{ minWidth: 24, textAlign: "center" }}>
            {nec.quantidadeSelecionada}
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleQuantidade(nec.id, 1)}
            sx={{ color: "white", p: 0.5 }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa", pb: { xs: 10, sm: 3 } }}>
      <Navbar />

      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Typography
          variant="h5"
          align="center"
          fontWeight={600}
          color="#1a3c6e"
          gutterBottom
        >
          Selecionar Doação
        </Typography>

        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            p: { xs: 2, sm: 3 },
            backgroundColor: "#ffffff",
            mt: 2,
            border: "1px solid #e0e0e0",
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
          }}
        >
          {/* Cabeçalho do Card */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Typography variant="h6" fontWeight={700} color="#1a3c6e" sx={{ maxWidth: "75%", lineHeight: 1.2 }}>
              Casa de Passagem Geisiane Valente{" "}
              <Typography component="span" variant="body2" color="text.secondary">
                (Rio Claro-SP)
              </Typography>
            </Typography>
            <Box
              component="span"
              sx={{
                bgcolor: "#d32f2f",
                color: "white",
                px: 1,
                py: 0.2,
                borderRadius: 1,
                fontSize: "0.7rem",
                fontWeight: "bold",
                mt: 0.5,
              }}
            >
              URGENTE
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

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 3 }}>
                {itensUrgentes.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum item urgente no momento.
                  </Typography>
                ) : (
                  itensUrgentes.map(nec => <LinhaItem key={nec.id} nec={nec} />)
                )}
              </Box>

              {/* Outras Necessidades */}
              <Typography variant="subtitle2" fontWeight={700} color="#1a3c6e" sx={{ mb: 2 }}>
                Outras Necessidades
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {itensOutros.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma outra necessidade no momento.
                  </Typography>
                ) : (
                  itensOutros.map(nec => <LinhaItem key={nec.id} nec={nec} />)
                )}
              </Box>
            </>
          )}
        </Paper>

        {/* Resumo e Botão de Agendar */}
        <Box sx={{ textAlign: "center", mt: 3, mb: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
            *Você selecionou {totalItens} {totalItens === 1 ? "item" : "itens"} no total.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            disabled={totalItens === 0 || carregando}
            sx={{
              mt: 1,
              borderRadius: 8,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "bold",
              textTransform: "none",
              background: totalItens === 0 ? "#cccccc" : "linear-gradient(90deg, #1a3c6e 0%, #2e6da4 100%)",
              boxShadow: totalItens === 0 ? "none" : "0 4px 15px rgba(26, 60, 110, 0.4)",
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
