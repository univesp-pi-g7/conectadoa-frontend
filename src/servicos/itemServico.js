import api from './api';

export const listarItens = async () => {
  try {
    const resposta = await api.get('/itens');
    return resposta.data;
  } catch (erro) {
    const mensagem = erro.response?.data?.detail?.[0]?.msg || erro.response?.data?.detail || 'Erro ao buscar itens.';
    throw new Error(mensagem);
  }
};
