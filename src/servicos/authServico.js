/**
 * authServico.js — Serviço de autenticação do ConectaDoa
 *
 * Centraliza todas as chamadas à API relacionadas a autenticação:
 * registro, login, logout e dados do usuário logado.
 *
 * Todas as funções são async e usam a instância do axios configurada em api.js.
 */
import { AxiosError } from 'axios';
import api from './api';

// Chave usada para armazenar o token no localStorage
const CHAVE_TOKEN = 'conectadoa_token';

/**
 * Registra um novo usuário (doador) na plataforma.
 * @param {Object} dados - Objeto com { nome, email, senha, tipo_usuario }
 * @returns {Object} Dados do usuário criado
 */
export const registrar = async (dados) => {
  try {
    const resposta = await api.post('/auth/registro', dados);
    return resposta.data;
  } catch (erro) {
    // Relança com mensagem legível vinda da API, ou mensagem genérica
    const mensagem = erro.response?.data.detail[0].msg || 'Erro ao registrar. Tente novamente.';
    throw new Error(mensagem);
  }
};

/**
 * Realiza login do usuário.
 * Salva o token JWT no localStorage para uso em requisições futuras.
 * @param {string} email
 * @param {string} senha
 * @returns {string} O access_token recebido da API
 */
export const login = async (email, senha) => {
  try {
    const resposta = await api.post('/auth/login', { email, senha });
    const { access_token } = resposta.data;

    // Salva o token no localStorage para persistir a sessão
    localStorage.setItem(CHAVE_TOKEN, access_token);

    return access_token;
  } catch (erro) {
    console.log("erro api login: ",erro.response);
    console.log("erro api login: ",);
    const mensagem = erro.response?.data.detail[0].msg || 'E-mail ou senha inválidos.';
    throw new Error(mensagem);
  }
};

/**
 * Realiza logout: remove o token do localStorage.
 * Não precisa chamar a API — basta remover o token localmente.
 */
export const logout = () => {
  localStorage.removeItem(CHAVE_TOKEN);
};

/**
 * Busca os dados do usuário logado usando o token armazenado.
 * Usada para restaurar a sessão ao recarregar a página.
 * @returns {Object} Dados do usuário (id, nome, email, tipo_usuario, criado_em)
 */
export const getUsuarioAtual = async () => {
  try {
    const resposta = await api.get('/auth/me');
    return resposta.data;
  } catch (erro) {
    const mensagem = erro.response?.data.detail[0].msg || 'Erro ao buscar dados do usuário.';
    throw new Error(mensagem);
  }
};


/**
 * Verifica se existe um token salvo no localStorage.
 * Não valida o token — apenas verifica se ele existe.
 * @returns {boolean}
 */
export const estaAutenticado = () => {
  return !!localStorage.getItem(CHAVE_TOKEN);
};
