import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, Navigate } from 'react-router-dom';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  Avatar,
  Fab,
} from "@mui/material";

import LogoutIcon from '@mui/icons-material/Logout';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useAuth } from '../../contextos/AuthContexto';

const ConfirmarAgendamento = () => {
  const navegar = useNavigate();
  const { usuario, sair } = useAuth();
  const handleSair = () => {sair(); navegar('/login');};
  const inicialNome = usuario?.nome?.charAt(0)?.toUpperCase() || 'U';

  return (
    <>
    
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #1a3c6e 0%, #2e6da4 100%)',}}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="ConectaDoa"
                sx={{ height: 40, filter: 'brightness(0) invert(1)' }}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    variant="contained"
                    color="#ece7e7"
                    size="large"
                    startIcon={<HomeIcon />}
                    sx={{ mt: 4 }}
                    onClick={() => navegar("/")}
                    >
                    Página Inicial
                </Button>
              <Avatar sx={{ bgcolor: 'secondary.main', color: 'primary.main', fontWeight: 700 }}>
                {inicialNome}
              </Avatar>
              <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {usuario?.nome}
              </Typography>
              <Button
                id="botao-sair"
                color="inherit"
                startIcon={<LogoutIcon />}
                onClick={handleSair}
                sx={{ ml: 1 }}
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
      </Box>
      
    </>
  );
}

export default ConfirmarAgendamento;
