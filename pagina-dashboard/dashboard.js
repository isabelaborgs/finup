//Inicializando tooltips para uso com Bootstrap
document.addEventListener('DOMContentLoaded', () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
})
//Definindo visibilidade das seções conforme dados no local storage
exibirDados();
//Exibindo o progresso no guia inicial
exibirProgressoGuia();
//Desativando guia ao clicar nos botões
btDesativarGuia.addEventListener('click', () => desativarGuia());
btEncerrarGuia.addEventListener('click', () => desativarGuia());
//Exibindo charts com dados em suas respectivas seções
exibirChartGastos();
exibirTabelaLimites();
exibirTabelaMetas();
exibirTabelaContas();
exibirPorcentagemContasPagas();
alterarVisibilidadeContasPg();
exibirClassificacaoSaudeFin();

//DECLARAÇÃO DAS FUNÇÕES
//Operações com dados
function obterValores (array, propriedade) {
    return array.flatMap(objeto => objeto[propriedade]);
};
function somarValores (array) {
    return array.reduce((total, valor) => total + valor, 0);
}
function calcularPorcentagem (total, parcial) {
    return porcentagem = parcial / total * 100;
};
function formatarPorcentagem(valor) {
    let restoDivisao = valor % 2;
    if (restoDivisao == 0) {
        return valor + '%';
    } else {
        return valor.toFixed(1) + "%";
    }
};
function formatarValorDinheiro(valor) {
    return 'R$' + valor;
}
function filtrarValores (array, propriedade, valor) {
    return array.filter(objeto => objeto[propriedade] === valor);
};

//Exibe seções caso existam dados armazenados no local storage
function exibirDados() {
    let dadosSaudeFin = readResultados();
    let dadosTransacoes = JSON.parse(localStorage.getItem("transactions")) || [];;
    let dadosGastos = readBalancoCategorias().filter(categoria => categoria.gasto > 0);
    let despesas = readDespesas();
    let dadosDespesas = readDespesasMesAtual(despesas);
    let dadosLimites = Object.entries(readLimites());
    let dadosMetas = readMetas();
    let isGuiaVisivel = readGuiaDesativado();

    if (dadosSaudeFin.length > 0) {
        secaoSaudeFin.style.display = 'block';
        dadosAusentes.style.display = 'none';
        checkSaudeFin.classList.add('feito');
    }
    
    if (dadosMetas.length > 0) {
        secaoMetas.style.display = 'block';
        dadosAusentes.style.display = 'none';
        checkMetas.classList.add('feito');
    }

    if (dadosGastos.length > 0) {
        secaoGastosCategorias.style.display = 'block';
        dadosAusentes.style.display = 'none';
        checkTransacoes.classList.add('feito');
    }

    if (dadosDespesas.length > 0) {
        secaoContasAPagar.style.display = 'block';
    }

    if (dadosLimites.length > 0) {
        secaoLimitesCategorias.style.display = 'block';
        dadosAusentes.style.display = 'none';
        checkLimites.classList.add('feito');
    }

    if (isGuiaVisivel) {
        guiaInApp.style.display = 'none';
    }
}

//Exibe progresso no guia inicial da aplicação
function exibirProgressoGuia() {
    let itensConcluidos = document.getElementsByClassName('feito');
    let porcConcluido = calcularPorcentagem(5, itensConcluidos.length);
    let porcentagem = formatarPorcentagem(porcConcluido);

    if (porcConcluido == 100) {
        guiaCompleto.style.display = 'flex';
        btDesativarGuia.style.display = 'none';
        badgeBtGuia.classList.remove('bg-danger');
        badgeBtGuia.classList.add('bg-success');
    }

    porcProgressoGuia.innerHTML = porcentagem;
    progressoAtualGuia.style.width = porcentagem;
}

//Desativa exibição do guia
function desativarGuia() {
    guiaInApp.style.display = 'none';
    createGuiaDesativado();
}

//Exibe classificação de saúde financeira
function exibirClassificacaoSaudeFin() {
    let classificacaoSaudeFin = readClassificacaoAtual('geral');
    let classificacao = document.getElementById('classificacao-saude-fin');
    classificacao.innerHTML = classificacaoSaudeFin;
};

//Exibe chart com porcentagem de gastos por categoria
function exibirChartGastos() {
    const ctx = document.getElementById('chart-gastos');
    const balancoCategorias = readBalancoCategorias();
    const balancoAtual = balancoCategorias.filter(categoria => categoria.gasto > 0);
    const categoriaGastos = obterValores(balancoAtual, 'nome');
    const valorGastos = obterValores(balancoAtual, 'gasto');

    var chartGastos = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categoriaGastos,
            datasets: [{
                label: 'Valor gasto',
                data: valorGastos,
                hoverOffset: 4,
                backgroundColor: [
                    '#2c62a7',
                    '#3a7e5e',
                    '#fc6736',
                    '#ffad60',
                    '#c23f13'
                ],
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                datalabels: {
                    display:'auto',
                    formatter: (value, ctx) => {
                        let label = ctx.chart.data.labels[ctx.dataIndex];
                        let somaDados = somarValores(ctx.chart.data.datasets[0].data);
                        let porcent = calcularPorcentagem(somaDados, value);
                        return `${label}\n\ ${formatarPorcentagem(porcent)}`;
                    },
                    color: 'white',
                    align: 'end',
                },
                tooltip: {
                    callbacks: {
                        label: function(value) {
                            return 'Valor gasto: R$' + value.parsed;
                        }
                    }
                }
            }
        }
    });
};

//Exibe chart com medidor de saúde financeira
function exibirChartSaudeFin() {
    var valorChart;
    let classificacaoSaudeFin = readClassificacaoAtual('geral');
    switch (classificacaoSaudeFin) {
        case 'Ruim':
            valorChart = 1;
            break;
        case 'Muito baixa':
            valorChart = 3;
            break;
        case 'Baixa':
            valorChart = 5;
            break;
        case 'Ok':
            valorChart = 7;
            break;
        case 'Boa':
            valorChart = 9;
            break;
        case 'Muito boa':
            valorChart = 11;
            break;
        case 'Ótima':
            valorChart = 13;
            break;
        default:
            valorChart = undefined;
    }

    const ctx = document.getElementById('chart-saude-fin');

    var chartSaudeFin = new Chart(ctx, {
        type: 'gauge',
        data: {
            labels: ['Ruim', 'Muito baixa', 'Baixa', 'Ok', 'Boa', 'Muito boa', 'Ótima'],
            datasets: [{
                data: [2, 4, 6, 8, 10, 12, 14], 
                value: valorChart,
                backgroundColor: [
                    '#8c1c13', 
                    '#c23f13', 
                    '#fc6736', 
                    '#ffad60', 
                    '#a4a76c', 
                    '#49a078', 
                    '#3a7e5e'
                ],
                borderWidth: 2
            }]
        },
        options: {
            tooltips: {
                enabled: true
            },
            responsive: true,
            layout: {
                padding:  {
                    bottom: 30
                }
            },
            needle: {
                radiusPercentage: 2,
                widthPercentage: 3.2,
                lengthPercentage: 80,
                color: 'rgba(0, 0, 0, 1)'
            },
            valueLabel: {
                display: false,
                fontSize: 20,
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    })
};

//Exibe barras de progresso de metas e limites
function exibirBarraProgresso(tipo, valorPorc, valorAtual) {
    const containerProgresso = document.createElement('div');
    containerProgresso.classList.add('container-progresso');

    const progressoAtual = document.createElement('div');
    progressoAtual.classList.add('progresso-atual');
    progressoAtual.classList.add(`progresso-${tipo}`);
    progressoAtual.setAttribute('data-bs-toggle', 'tooltip');
    progressoAtual.setAttribute('data-bs-title', `Valor atual: ${valorAtual}`);
    let porcentagem = formatarPorcentagem(valorPorc);
    progressoAtual.style.width = porcentagem;

    const txtPorcentagem = document.createTextNode(porcentagem);
    const txtProgressoAtual = document.createElement('span');
    txtProgressoAtual.classList.add('txt-progresso-atual');
    txtProgressoAtual.appendChild(txtPorcentagem);

    if (valorPorc == 0) {
        txtProgressoAtual.style.color = 'black';
    } 

    if (valorPorc > 100) {
        progressoAtual.style.width = '100%'
    }

    if (tipo == 'limite') {
        if (valorPorc <= 50) {
            progressoAtual.classList.add('seguro');
        } else if (valorPorc < 80) {
            progressoAtual.classList.add('aviso');
        } else if (valorPorc <= 100) {
            progressoAtual.classList.add('perigo');
        } else {
            progressoAtual.classList.add('excedido');
        }
    }

    progressoAtual.appendChild(txtProgressoAtual);
    containerProgresso.appendChild(progressoAtual);
    return containerProgresso;
}

//Exibe tabela com limites de gastos das categorias e seu progresso
function exibirTabelaLimites() {
    const balancoCategorias = readBalancoCategorias();
    balancoCategorias.forEach(categoria => {
        let nome = categoria.nome;
        let limite = categoria.limite;
        if (limite > 0) {
            let gasto = categoria.gasto;
            let valorGasto = formatarValorDinheiro(gasto);
            let valorPorc = calcularPorcentagem(limite, gasto);

            let linhaCategoria = document.createElement('tr');
            
            let txtColunaNome = document.createTextNode(nome);
            let colunaNome = document.createElement('td');
            colunaNome.appendChild(txtColunaNome);

            let barraProgresso = exibirBarraProgresso('limite', valorPorc, valorGasto);
            let colunaProgresso = document.createElement('td');
            colunaProgresso.appendChild(barraProgresso);

            let txtColunaLimite = document.createTextNode(formatarValorDinheiro(limite));
            let colunaLimite = document.createElement('td');
            colunaLimite.appendChild(txtColunaLimite);

            linhaCategoria.appendChild(colunaNome);
            linhaCategoria.appendChild(colunaProgresso);
            linhaCategoria.appendChild(colunaLimite);

            corpoTabelaLimites.appendChild(linhaCategoria);
        }
    })
}

//Exibe tabela com metas e seu progresso
function exibirTabelaMetas() {
    const metas = readMetas();
    metas.forEach(meta => {
        let nome = meta.nomeMeta;
        let alcancadoStr = meta.valorAlcancado.replace(/\./g, '').replace(/,/g, '.');
        let alcancado = parseFloat(alcancadoStr);
        let desejadoStr = meta.valorDesejado.replace(/\./g, '').replace(/,/g, '.');
        let desejado = parseFloat(desejadoStr);
        let valorAlcancado = formatarValorDinheiro(alcancado);
        let valorDesejado = formatarValorDinheiro(desejado);
        let valorPorc = calcularPorcentagem(desejado, alcancado);

        let linhaMeta = document.createElement('tr');

        let txtColunaNome = document.createTextNode(nome);
        let colunaNome = document.createElement('td');
        colunaNome.appendChild(txtColunaNome);

        let barraProgresso = exibirBarraProgresso('meta', valorPorc, valorAlcancado);
        let colunaProgresso = document.createElement('td');
        colunaProgresso.appendChild(barraProgresso);

        let txtColunaDesejado = document.createTextNode(valorDesejado);
        let colunaDesejado = document.createElement('td');
        colunaDesejado.appendChild(txtColunaDesejado);

        linhaMeta.appendChild(colunaNome);
        linhaMeta.appendChild(colunaProgresso);
        linhaMeta.appendChild(colunaDesejado);

        corpoTabelaMetas.appendChild(linhaMeta);
    })
}

//Verifica status da conta (paga, não paga, atrasada e vence hoje)
function verificarStatusConta(coluna, dataFinal, paga) {
    let dataAtual = new Date();
    if (paga == false & dataFinal < dataAtual) {
        coluna.classList.add('atrasada');
        return 'Atrasada';
    } else if (paga == false & dataFinal == dataAtual) {
        coluna.classList.add('vence-hoje');
        return 'Vence hoje';
    } else if (paga == false & dataFinal > dataAtual) {
        coluna.classList.add('pendente');
        return 'Não paga';
    } else if (paga == true) {
        coluna.classList.add('paga');
        return 'Paga';
    }
}

//Exibe tabela com contas do mês
function exibirTabelaContas() {
    let despesas = readDespesas();
    const contas = readDespesasMesAtual(despesas);
    contas.sort((a, b) => {
        return a.checked - b.checked || new Date(a.dataFinal) - new Date(b.dataFinal);
    })

    contas.forEach(conta => {
        let nome = conta.descricao;
        let valor = conta.valor;
        let paga = conta.checked;
        let data = new Date(conta.dataFinal);
        let dia = (data.getDate() + 1).toString().padStart(2, '0');
        let mes = data.getMonth() + 1;
        let dataConta = `${dia}/${mes}`;

        let linhaConta = document.createElement('tr');

        let txtColunaNome = document.createTextNode(nome);
        let colunaNome = document.createElement('td');
        colunaNome.appendChild(txtColunaNome);

        let txtColunaValor = document.createTextNode(formatarValorDinheiro(valor));
        let colunaValor = document.createElement('td');
        colunaValor.appendChild(txtColunaValor);

        let txtColunaData = document.createTextNode(dataConta);
        let colunaData = document.createElement('td');
        colunaData.appendChild(txtColunaData);

        let colunaStatus = document.createElement('td');
        let status = verificarStatusConta(colunaStatus, data, paga);
        let txtColunaStatus = document.createTextNode(status);
        let containerTxt = document.createElement('span');
        containerTxt.appendChild(txtColunaStatus);
        colunaStatus.appendChild(containerTxt);

        linhaConta.appendChild(colunaNome);
        linhaConta.appendChild(colunaValor);
        linhaConta.appendChild(colunaData);
        linhaConta.appendChild(colunaStatus);

        if (paga) {
            linhaConta.classList.add('conta-paga');
        }

        corpoTabelaContas.appendChild(linhaConta);
    })
}

//Exibe porcentagem de contas pagas 
function exibirPorcentagemContasPagas() {
    let contas = document.querySelectorAll('#corpoTabelaContas tr');
    let contasPagas = document.querySelectorAll('#corpoTabelaContas .paga');

    let valorPorc = calcularPorcentagem(contas.length, contasPagas.length);
    let porcentagem = formatarPorcentagem(valorPorc);

    barraProgressoContas.style.width = porcentagem;
    barraProgressoContas.innerHTML = `${porcentagem} pagas`;
}

//Exibe ou oculta contas já pagas na tabela de contas
function alterarVisibilidadeContasPg() {
    let contasPagas = document.querySelectorAll('.conta-paga');
    let iconeOculto = document.querySelector('.icon-oculto');
    let iconeVisivel = document.querySelector('.icon-visivel');

    btVisibilidadeContas.addEventListener('click', () => {
        if (iconeOculto.style.display == 'inline') {
            iconeOculto.style.display = 'none';
            iconeVisivel.style.display = 'inline'
            contasPagas.forEach(conta => {conta.style.display = 'table-row'})
        } else {
            iconeOculto.style.display = 'inline';
            iconeVisivel.style.display = 'none'
            contasPagas.forEach(conta => {conta.style.display = 'none'})
        }
    })
}
