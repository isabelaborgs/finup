//ARMAZENAMENTO E LEITURA DA VISIBILIDADE DO GUIA
function createGuiaDesativado() {
    localStorage.setItem("guia-inicial-desativado", JSON.stringify(true));
}

function readGuiaDesativado() {
    return JSON.parse(localStorage.getItem("guia-inicial-desativado"));
}

//LEITURA DOS DADOS DE SAÚDE FINANCEIRA
function readResultados() {
    return JSON.parse(localStorage.getItem("resultados-isfb")) || [];
}

function readResultadoAtual() {
    let resultados = readResultados();
    let indice = resultados.length - 1;
    if (resultados.length > 0) {
        return resultados[indice];
    }
}

function readDominioAtual(classeDominio) {
    let resultado = readResultadoAtual();
    if (resultado != undefined) {
        return resultado.parte1.find((item) => item.dominio == classeDominio);
    }
}

function readPontuacaoAtual(classeDominio) {
    let resultado = readDominioAtual(classeDominio);
    if (resultado != undefined) {
        return resultado.pontuacao;
    }
}

function readClassificacaoAtual(classeDominio) {
    let resultado = readDominioAtual(classeDominio);
    if (resultado != undefined) {
        return resultado.classificacao;
    }
}

//LEITURA DOS DADOS DE CONTROLE FINANCEIRO
function readTransacoes() {
    return JSON.parse(localStorage.getItem("registros-controle-financeiro")) || [];
}

function readReceitas() {
    let transacoes = readTransacoes();

    transacoes.forEach(transacao => {
        if (transacao.nome == 'Salário e Outras Rendas') {
            return receitas = transacao.transacoes;
        }
    });

    return receitas;
}

function readReceitasMesAtual() {
    let receitas = readReceitas();
    let dataAtual = new Date();
    let mesAtual = dataAtual.getMonth();
    let receitasMes = [];

    receitas.forEach(receita => {
        let data = new Date(receita.dataFinal);
        let mes = data.getMonth();
        if (mes == mesAtual) {
            receitasMes.push(receita);
        }
    })

    return receitasMes;
}

function readDespesas() {
    let transacoes = readTransacoes();
    let despesas = [];

    transacoes.forEach(transacao => {
        if (transacao.nome != 'Salário e Outras Rendas') {
            despesas.push(transacao);
        }
    });

    return despesas;
}

function readDespesasPorCategoria(categoria) {
    let despesas = readDespesas();
    return despesas.find(despesa => despesa.nome == categoria)
}

function readDespesasMesAtual(despesas) {
    //let despesas = readDespesas();
    let transacoesDespesas = obterValores(despesas, 'transacoes');
    let dataAtual = new Date();
    let mesAtual = dataAtual.getMonth();
    let despesasMes = [];

    transacoesDespesas.forEach(despesa => {
        let data = new Date(despesa.dataFinal);
        let mes = data.getMonth();
        if (mes == mesAtual) {
            despesasMes.push(despesa);
        }
    })

    return despesasMes;
}

//Balanço limite x gasto real por categoria
function readBalancoCategorias() {
    let despesas = readDespesas();
    let balanco = [];

    despesas.forEach(despesa => {
        let despesasTotais = despesa.transacoes;
        let despesasAtuais = filtrarValores(despesasTotais, 'checked', true);
        let categoria = despesa.nome;
        let valorLimite = despesa.limite;
        let valorGasto = despesasAtuais.flatMap(dados => parseInt(dados.valor)).reduce((total, valor) => total + valor, 0);
        let dadosCategoria = {
            nome: categoria,
            limite: valorLimite,
            gasto: valorGasto
        }
        balanco.push(dadosCategoria);
    })

    return balanco;
}

//Lê e retorna apenas os limites definidos
function readLimites() {
    return JSON.parse(localStorage.getItem("limits")) || [];
}

//METAS
function readMetas() {
    return JSON.parse(localStorage.getItem("metas")) || [];
}