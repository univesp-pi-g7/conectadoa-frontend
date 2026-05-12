/**
 * api.js — Instância centralizada do Axios para chamadas à API
 *
 * Configura:
 * - baseURL lida da variável de ambiente VITE_API_URL
 * - Interceptor de request: adiciona o token JWT automaticamente
 * - Interceptor de response: trata erro 401 (não autorizado)
 */
import axios from 'axios';

// Chave usada para armazenar o token no localStorage
const CHAVE_TOKEN = 'conectadoa_token';

// Cria a instância do axios com a URL base da API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de REQUEST
 * Antes de cada requisição, verifica se existe um token salvo
 * e adiciona o header Authorization automaticamente.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(CHAVE_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (erro) => {
    return Promise.reject(erro);
  }
);

/**
 * Interceptor de RESPONSE
 * Se a API retornar 401 (token inválido ou expirado),
 * remove o token do localStorage e redireciona para /login.
 */
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response?.status === 401) {
      localStorage.removeItem(CHAVE_TOKEN);

      // Redireciona para /login apenas se não estiver já na página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(erro);
  }
);

export default api;
