/**
 * AuthContexto.jsx — Contexto global de autenticação
 *
 * Gerencia o estado de autenticação da aplicação inteira.
 * Qualquer componente pode acessar o usuário logado e as funções
 * de login/logout usando o hook useAuth().
 *
 * Estrutura:
 * - AuthProvider: componente que envolve a aplicação e fornece o contexto
 * - useAuth: hook para consumir o contexto de forma simples
 */
import { createContext, useContext, useState, useEffect } from 'react';
import * as authServico from '@/servicos/authServico';

// Cria o contexto — será preenchido pelo AuthProvider
const AuthContexto = createContext(null);

/**
 * AuthProvider — Componente que fornece o estado de autenticação
 * para toda a árvore de componentes filhos.
 *
 * Deve ser usado uma vez, envolvendo toda a aplicação (geralmente no main.jsx).
 */
export const AuthProvider = ({ children }) => {
  // Estado do usuário logado (objeto com dados ou null se não logado)
  const [usuario, setUsuario] = useState(null);

  // Indica se a verificação inicial de sessão ainda está em andamento
  const [carregando, setCarregando] = useState(true);

  /**
   * Efeito executado ao montar o componente (primeira renderização).
   * Tenta restaurar a sessão verificando se existe um token válido.
   */
  useEffect(() => {
    const restaurarSessao = async () => {
      // Só tenta restaurar se houver token salvo
      if (!authServico.estaAutenticado()) {
        setCarregando(false);
        return;
      }

      try {
        // Busca os dados do usuário usando o token salvo
        const dadosUsuario = await authServico.getUsuarioAtual();
        setUsuario(dadosUsuario);
      } catch {
        // Se falhar (token expirado/inválido), limpa tudo
        authServico.logout();
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    };

    restaurarSessao();
  }, []);

  /**
   * Função de login — autentica o usuário e carrega seus dados.
   * @param {string} email
   * @param {string} senha
   */
  const entrar = async (email, senha) => {
    // Faz login na API (salva o token automaticamente)
    await authServico.login(email, senha);

    // Busca os dados completos do usuário logado
    const dadosUsuario = await authServico.getUsuarioAtual();
    setUsuario(dadosUsuario);
  };

  /**
   * Função de logout — remove token e limpa o estado.
   */
  const sair = () => {
    authServico.logout();
    setUsuario(null);
  };

  /**
   * Função de registro — cria conta mas NÃO faz login automático.
   * O usuário deve fazer login manualmente após o registro.
   * @param {Object} dados - { nome, email, senha, tipo_usuario }
   * @returns {Object} Dados do usuário criado
   */
  const registrarUsuario = async (dados) => {
    const novoUsuario = await authServico.registrar(dados);
    return novoUsuario;
  };

  // Valores disponibilizados para toda a aplicação via contexto
  const valorContexto = {
    usuario,
    carregando,
    entrar,
    sair,
    registrarUsuario,
  };

  return (
    <AuthContexto.Provider value={valorContexto}>
      {children}
    </AuthContexto.Provider>
  );
};

/**
 * useAuth — Hook para acessar o contexto de autenticação.
 *
 * Uso: const { usuario, entrar, sair } = useAuth();
 *
 * Lança erro se usado fora do AuthProvider (ajuda a debugar).
 */
export const useAuth = () => {
  const contexto = useContext(AuthContexto);

  if (!contexto) {
    throw new Error(
      'useAuth deve ser usado dentro de um <AuthProvider>. ' +
      'Verifique se o componente está envolvido pelo AuthProvider.'
    );
  }

  return contexto;
};
