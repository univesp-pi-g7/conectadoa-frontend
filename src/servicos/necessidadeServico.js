import api from './api';

export const listarNecessidadesAbertas = async () => {
  try {
    const resposta = await api.get('/necessidades');
    return resposta.data;
  } catch (erro) {
    const mensagem = erro.response?.data?.detail?.[0]?.msg || erro.response?.data?.detail || 'Erro ao buscar necessidades abertas.';
    throw new Error(mensagem);
  }
};

export const criarNecessidade = async (dados) => {
  try {
    const resposta = await api.post('/necessidades', dados);
    return resposta.data;
  } catch (erro) {
    const mensagem = erro.response?.data?.detail?.[0]?.msg || erro.response?.data?.detail || 'Erro ao criar necessidade.';
    throw new Error(mensagem);
  }
};
export const deletarNecessidade = async (id) => {
  try {
    const resposta = await api.delete(`/necessidades/${id}`);
    return resposta.data;
  } catch (erro) {
    const mensagem = erro.response?.data?.detail?.[0]?.msg || erro.response?.data?.detail || 'Erro ao remover necessidade.';
    throw new Error(mensagem);
  }
};
