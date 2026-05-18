import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Button,
  Link,
  TextField,
  List,
  ListItem,
  ListItemText,
  Grid,
  Paper,
} from "@mui/material";


import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../contextos/AuthContexto";

const Doacao = () => {
  const navegar = useNavigate();
  const { usuario, sair } = useAuth();
  const handleSair = () => {
    sair();
    navegar("/login");
  };
  const inicialNome = usuario?.nome?.charAt(0)?.toUpperCase() || "U";

  const [itens, setItens] = useState([
    { nome: "Cesta Básica", quantidade: 0 },
    { nome: "Carne", quantidade: 0 },
    { nome: "Frango", quantidade: 0 },
    { nome: "Detergente", quantidade: 0 },
    { nome: "Sabonete", quantidade: 0 },
  ]);

  const handleQuantidade = (index, delta) => {
    setItens((prevItens) =>
      prevItens.map((item, i) =>
        i === index
          ? { ...item, quantidade: Math.max(0, item.quantidade + delta) }
          : item
      )
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(135deg, #1a3c6e 0%, #2e6da4 100%)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="ConectaDoa"
              sx={{ height: 40, filter: "brightness(0) invert(1)" }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "secondary.main", color: "primary.main" }}>
              {inicialNome}
            </Avatar>
            <Typography variant="body1" sx={{ display: { xs: "none", sm: "block" } }}>
              {usuario?.nome}
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleSair}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center", textAlign: "center", alignItems: "center", color:"#160f75", gap: 2 }}>
          <Box> 
            <Typography variant="h3" gutterBottom>
              Conectando quem quer ajudar a quem mais precisa
            </Typography>
            <Box sx={{ mt: 2, py: 2, alignContent:"center", display:"flex", justifyContent:"center"}}>
          </Box>
        </Box>    
                    
          <Box
            component="img"
            src="/logo.png" 
            alt="ConectaDoa"
            sx={{
              height: "180px",
              border: "2px solid #cfe2f5", 
              borderRadius: "8px",          
              padding: "4px",               
              backgroundColor: "#fff",      
              boxShadow: "4px 4px 10px rgba(0,0,0,0.3)",
            }}
          />
        </Box>
     </Container>
      <Container sx={{ py: 2 }}>
          <Box sx={{ textAlign: "left", color:"#160f75" }}>
            <Box sx={{ border: "2px solid #1976d2", borderRadius: "50px", backgroundColor: "#f5f5f5", boxShadow: "2px 2px 6px rgba(0,0,0,0.2)", alignItems: "center", justifyContent: "center", textAlign: "center" }}    >
                <Typography variant="h5" gutterBottom align="center">
                Casa de Passagem Geise Valente
                </Typography>
            </Box> 
          </Box>  
      </Container>      
      <Box sx={{ p: 3, textAlign: "center", color: "#160f75" }}>
        <Grid container spacing={2} justifyContent="center">
          {itens.map((item, index) => (
            <Grid item xs={12} sm={8} md={6} key={item.nome}>
              <Paper
                elevation={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                }}
              >
                <Typography variant="h6">{item.nome}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleQuantidade(index, -1)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="body1">{item.quantidade}</Typography>
                  <IconButton
                    color="primary"
                    onClick={() => handleQuantidade(index, 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
          onClick={() => navegar("/ConfirmarAgendamento")}
        >
          Agendar Entrega
        </Button>
      </Box>
    </Box>
  );
};

export default Doacao;
