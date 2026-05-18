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

const CasaPassagen = () => {
  const navegar = useNavigate();
  const { usuario, sair } = useAuth();
  const handleSair = () => {sair(); navegar('/login');};
  const inicialNome = usuario?.nome?.charAt(0)?.toUpperCase() || 'U';

  return (
    <>
    
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Barra superior */}
        <AppBar
          position="static"
          sx={{
            background: 'linear-gradient(135deg, #1a3c6e 0%, #2e6da4 100%)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="ConectaDoa"
                sx={{ height: 40, filter: 'brightness(0) invert(1)' }}
              />
            </Box>

            {/* Área do usuário */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

        {/* Conteúdo principal */}
        <Container sx={{ py: 3 }}>
          <Box id="início" sx={{ display: "flex", justifyContent: "center", textAlign: "center", alignItems: "center", color:"#160f75", gap: 2 }}>
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
            
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, padding: 4  }}>
                <Box component="img" src="/LogoCasa.png" alt="Casa de Passagem Geise Valente" 
                    sx={{
                    height: "230px",
                    border: "2px solid #cfe2f5", 
                    borderRadius: "8px",          
                    padding: "4px",               
                    backgroundColor: "#fff",      
                    boxShadow: "4px 4px 10px rgba(0,0,0,0.3)",
                    }}
                />
                <Card sx={{ maxWidth: 1000 }}>
                    <CardContent>
                        <Typography>
                            A Casa de Passagem Geise Valente não oferece apenas abrigo — oferece dignidade, cuidado, amor e uma nova chance.  
                            Cada dia é marcado pela transformação de vidas: pessoas que chegam fragilizadas e encontram força para partir de cabeça erguida.
                            É essa mudança que impulsiona a missão da Casa de Passagem Geise Valente e dá sentido a cada gesto de solidariedade.
                            Para que mais vidas possam ser transformadas, precisamos de você. Venha fazer parte desta corrente do bem.
                            Agende sua doação e faça a diferença!
                        </Typography>
                        <Button variant="contained" color="primary" sx={{ mt: 2 }} component={RouterLink} to="/doacao">
                            Necessidades da Instituição
                        </Button>
                    </CardContent>
                </Card>
                </Box>
            </Box>
        </Container>
      </Box>
    </>
  );
}

export default CasaPassagen;
