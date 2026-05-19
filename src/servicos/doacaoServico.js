import api from './api';

export const criarDoacao = async (dados) => {
  try {
    const resposta = await api.post('/doacoes', dados);
    return resposta.data;
  } catch (erro) {
    const mensagem = erro.response?.data?.detail?.[0]?.msg || erro.response?.data?.detail || 'Erro ao registrar doação.';
    throw new Error(mensagem);
  }
};

export const listarMinhasDoacoes = async () => {
  try {
    const resposta = await api.get('/doacoes/minhas');
    return resposta.data;
  } catch (erro) {
    const mensagem = erro.response?.data?.detail?.[0]?.msg || erro.response?.data?.detail || 'Erro ao buscar histórico de doações.';
    throw new Error(mensagem);
  }
};
