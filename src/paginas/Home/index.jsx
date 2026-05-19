import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';


import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Fab,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ConectaDoa
          </Typography>
          <Button color="inherit" component="a" href="#início">
            Início
          </Button>
          <Button color="inherit" component="a" href="#como-funciona">
            Como Funciona
          </Button>
          <Button color="inherit" component="a" href="#mural-de-necessidades">
            Mural de Necessidades
          </Button>
          <Button color="inherit" component="a" href="#instituições">
            Instituições
          </Button>
          <Button color="inherit" component={RouterLink} to="/login">
            Quero Ajudar
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 6 }}>
        <Box id="início" sx={{ display: "flex", justifyContent: "center", textAlign: "center", alignItems: "center", color:"#160f75", gap: 2 }}>
          <Box> 
            <Typography variant="h3" gutterBottom>
              Conectando quem quer ajudar a quem mais precisa
            </Typography>
            <Box sx={{ mt: 2, py: 2, alignContent:"center", display:"flex", justifyContent:"center"}}>
            <Button variant="contained" color="primary" sx={{ mr: 2 }} component={RouterLink} to="/login">
              Quero Ajudar
            </Button>
            <Button variant="outlined" color="primary">
              Cadastrar Necessidade
            </Button>
          </Box>
        </Box>    
                    
          <Box
            component="img"
            src="/logo.png" 
            alt="ConectaDoa"
            sx={{
              height: "200px",
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
        <Box sx={{ justifyContent: "center", alignItems: "center", padding: 4 }} >     
          <Box id="como-funciona" sx={{ border: "2px solid #1976d2", borderRadius: "50px", backgroundColor: "#f5f5f5", boxShadow: "2px 2px 6px rgba(0,0,0,0.2)", alignItems: "center", justifyContent: "center", textAlign: "center" }}    >
            <Typography variant="h5" gutterBottom align="center">
              Como funciona
            </Typography>
          </Box>
          <Typography variant="h6" colortext="#160f75" align="center"sx={{ mt: 3 }} >
              Em poucos passos a sua doação chega a quem mais precisa.
          </Typography>
        </Box>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card sx={{ display: "flex", justifyContent: "center" }}>
              <CardContent sx={{ width: "360px", height: "130px" }}>
                <Typography variant="h6">1. Veja as necessidades</Typography>
                <Typography>
                  Encontre no mural as instituições que precisam de ajuda.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ display: "flex", justifyContent: "center" }}>
              <CardContent sx={{ width: "360px", height: "130px" }}>
                <Typography variant="h6">2. Escolha o que doar</Typography>
                <Typography>
                  Selecione alimentos, roupas, higiene, limpeza ou outros itens.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ display: "flex", justifyContent: "center" }}>
              <CardContent sx={{ width: "360px", height: "130px" }}>
                <Typography variant="h6">3. Agende a entrega</Typography>
                <Typography>
                  Escolha o melhor dia e horário para entregar a doação.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Mural de Necessidades */}
      <Container sx={{ py: 2 }}>
        <Box sx={{ justifyContent: "center", alignItems: "center", padding: 4 }} >     
          <Box id="mural-de-necessidades" sx={{ border: "2px solid #1976d2", borderRadius: "50px", backgroundColor: "#f5f5f5", boxShadow: "2px 2px 6px rgba(0,0,0,0.2)", alignItems: "center", justifyContent: "center", textAlign: "center" }}    >
            <Typography variant="h5" gutterBottom align="center">
              Mural de Necessidades
            </Typography>
          </Box> 
          <Typography variant="h6" colortext="#160f75" align="center"sx={{ mt: 3 }} >
              Veja ospedidos ativos da instituição e escolha como contribuir.
          </Typography>
        </Box>
        <Card>
          <CardHeader id="instituições" title="Casa de Passagem Geisiane Valentes" />
          <CardContent>
            <Typography color="text.secondary">
              Alimentos e produtos de limpeza
            </Typography>
            <Typography>
              A instituição precisa de doações para manter o atendimento às
              famílias em vulnerabilidade.
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}component={RouterLink} to="/login">
              Contribuir
            </Button>
          </CardContent>
        </Card>
      </Container>
      {visible && (
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={handleClick}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </>
  );
}

export default Home;
