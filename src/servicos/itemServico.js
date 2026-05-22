import api from '@/servicos/api';

export const listarItens = async () => {
  try {
    const resposta = await api.get('/itens');
    return resposta.data;
  } catch (erro) {
    const mensagem = erro.response?.data?.detail?.[0]?.msg || erro.response?.data?.detail || 'Erro ao buscar itens.';
    throw new Error(mensagem);
  }
};
export const criarItem = async (dados) => {
  try {
    const resposta = await api.post('/itens', dados);
    return resposta.data;
  } catch (erro) {
    const mensagem = erro.response?.data?.detail?.[0]?.msg || erro.response?.data?.detail || 'Erro ao criar item.';
    throw new Error(mensagem);
  }
};

export const atualizarItem = async (id, dados) => {
  try {
    const resposta = await api.put(`/itens/${id}`, dados);
    return resposta.data;
  } catch (erro) {
    const mensagem = erro.response?.data?.detail?.[0]?.msg || erro.response?.data?.detail || 'Erro ao atualizar item.';
    throw new Error(mensagem);
  }
};

export const deletarItem = async (id) => {
  try {
    const resposta = await api.delete(`/itens/${id}`);
    return resposta.data;
  } catch (erro) {
    // Captura o erro específico de item com histórico de doações, se aplicável
    const mensagem = erro.response?.data?.detail?.[0]?.msg || erro.response?.data?.detail || 'Erro ao deletar item.';
    throw new Error(mensagem);
  }
};
