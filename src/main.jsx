/**
 * main.jsx — Ponto de entrada da aplicação ConectaDoa
 *
 * Envolve o App com:
 * - StrictMode: ativa verificações extras do React em desenvolvimento
 * - BrowserRouter: habilita o roteamento baseado em URLs
 * - AuthProvider: fornece o contexto de autenticação para toda a aplicação
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Fontes do Material UI (Roboto em diferentes pesos)
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Provedor de autenticação
import { AuthProvider } from '@/contextos/AuthContexto';

// Componente raiz
import App from '@/App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
