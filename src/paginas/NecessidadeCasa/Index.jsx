import { useState } from "react";
import { useNavigate, Link as RouterLink, Navigate } from 'react-router-dom';
import {
  Container,
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Link,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LogoutIcon from '@mui/icons-material/Logout';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useAuth } from '../../contextos/AuthContexto';

const NecessidadesCasa = () => {
  const navegar = useNavigate();
  const { usuario, sair } = useAuth();
  const handleSair = () => {sair(); navegar('/login');};
  const inicialNome = usuario?.nome?.charAt(0)?.toUpperCase() || 'U';
  const [item, setItem] = useState("");
  const [lista, setLista] = useState([]);
  const handleAdicionar = () => {if (item.trim() !== "") {setLista([...lista, item]); setItem("");}};



  return (
    <>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            <AppBar
            position="static"
            sx={{ background: 'linear-gradient(135deg, #1a3c6e 0%, #2e6da4 100%)',
            }}>
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
                </Box> 
            </Container>
        </Box>
        <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Cadastro de Necessidades da Instituição
      </Typography>

      <Card sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Nome do item"
              variant="outlined"
              fullWidth
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAdicionar}
            >
              Adicionar
            </Button>
          </Box>

          <List>
            {lista.map((necessidade, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={necessidade} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
            
    </>
  );
}
  


export default NecessidadesCasa;
