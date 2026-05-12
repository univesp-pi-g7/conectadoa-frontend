const Doacao = () => {
    const [doacao, setDoacao] = useState({
        nome: "",
        descricao: "",
        tipo: "",
        quantidade: "",
    })

    const handleFazerDoacao = () => {
        try{
            criarDoacao(doacao)
        }catch(error){
            console.log(error)
        }
    }

    return (
        <div>
            <h1>Doacao</h1>
            <form onSubmit={handleFazerDoacao}>
                <input type="text" placeholder="Nome" value={doacao.nome} onChange={(e) => setDoacao({...doacao, nome: e.target.value})} />
                <input type="text" placeholder="Descricao" value={doacao.descricao} onChange={(e) => setDoacao({...doacao, descricao: e.target.value})} />
                <input type="text" placeholder="Tipo" value={doacao.tipo} onChange={(e) => setDoacao({...doacao, tipo: e.target.value})} />
                <input type="text" placeholder="Quantidade" value={doacao.quantidade} onChange={(e) => setDoacao({...doacao, quantidade: e.target.value})} />
                <button type="submit">Fazer doacao</button>
            </form>
        </div>
    );
};

export default Doacao;