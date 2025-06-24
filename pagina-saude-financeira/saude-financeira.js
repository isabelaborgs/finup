//Inicializa tooltip do Bootstrap
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

//Declaração e exibição das variáveis dos resultados na página
//Geral
var pontuacaoGeral = readPontuacaoAtual('geral');
var classificacaoGeral = readClassificacaoAtual('geral');
pontGeral.innerHTML = pontuacaoGeral;
marcGeral.style.left = pontuacaoGeral + '%';
txtMarcGeral.innerHTML = classificacaoGeral;
txtMarcGeral.style.right = 100 - pontuacaoGeral + '%';

//Habilidade financeira
var pontuacaoHabilidade = readPontuacaoAtual('habilidade');
var classificacaoHabilidade = readClassificacaoAtual('habilidade');
pontHabilidade.innerHTML = pontuacaoHabilidade;
marcHabilidade.style.left = pontuacaoHabilidade + '%';
txtMarcHabilidade.innerHTML= classificacaoHabilidade;
txtMarcHabilidade.style.right = 100 - pontuacaoHabilidade + '%';

//Comportamento financeiro
var pontuacaoComportamento = readPontuacaoAtual('comportamento');
var classificacaoComportamento = readClassificacaoAtual('comportamento');
pontComportamento.innerHTML = pontuacaoComportamento;
marcComportamento.style.left = pontuacaoComportamento + '%';
txtMarcComportamento.innerHTML= classificacaoComportamento;
txtMarcComportamento.style.right = 100 - pontuacaoComportamento + '%';

//Segurança financeira
var pontuacaoSeguranca = readPontuacaoAtual('seguranca');
var classificacaoSeguranca = readClassificacaoAtual('seguranca');
pontSeguranca.innerHTML = pontuacaoSeguranca;
marcSeguranca.style.left = pontuacaoSeguranca + '%';
txtMarcSeguranca.innerHTML= classificacaoSeguranca;
txtMarcSeguranca.style.right = 100 - pontuacaoSeguranca + '%';

////Liberdade financeira
var pontuacaoLiberdade = readPontuacaoAtual('liberdade');
var classificacaoLiberdade = readClassificacaoAtual('liberdade');
pontLiberdade.innerHTML = pontuacaoLiberdade;
marcLiberdade.style.left = pontuacaoLiberdade + '%';
txtMarcLiberdade.innerHTML= classificacaoLiberdade;
txtMarcLiberdade.style.right = 100 - pontuacaoLiberdade + '%';

//DECLARAÇÃO DAS FUNÇÕES
//Exibe texto conforme classificação do usuário
function exibirTextoResultadoGeral (classificacao) {
    if (classificacao == 'Ótima') {
        txtOtima.style.display = 'block';
        analiseOtima.style.display = 'flex';
    } else if (classificacao == 'Muito boa') {
        txtMuitoBoa.style.display = 'block';
        analiseMuitoBoa.style.display = 'flex';
    } else if (classificacao == 'Boa') {
        txtBoa.style.display = 'block';
        analiseBoa.style.display = 'flex';
    } else if (classificacao == 'Ok') {
        txtOk.style.display = 'block';
        analiseOk.style.display = 'flex';
    } else if (classificacao == 'Baixa') {
        txtBaixa.style.display = 'block';
        analiseBaixa.style.display = 'flex';
    } else if (classificacao == 'Muito baixa') {
        txtMuitoBaixa.style.display = 'block';
        analiseMuitoBaixa.style.display = 'flex';
    } else if (classificacao == 'Ruim') {
        txtRuim.style.display = 'block';
        analiseRuim.style.display = 'flex';
    } 
}

//Exibe comparação entre pontuação do usuário e média do Brasil
function exibirComparacaoDominios (id, pontuacaoDominio, mediaBrasil) {
    let dominio = document.getElementById(id);    
    if (pontuacaoDominio < mediaBrasil) {
        dominio.innerHTML = 'Abaixo da média';
    } else if (pontuacaoDominio == mediaBrasil) {
        dominio.innerHTML = 'Na média';
    } else {
        dominio.innerHTML = 'Acima da média';
    }
}

//Exibe resultados do questionário quando há resposta armazenada
var resultados = readResultados();
function exibirResultado() {
    if (resultados.length > 0) {
        pagSaudeFinInicial.style.display = 'none';
        resultadoISFB.style.display = 'block';
    } else {
        resultadoISFB.style.display = 'none';
    }
}

//Exibe chart de progresso quando há mais de uma resposta
function exibirProgresso () {
    if (resultados.length < 2) {
        chartContainer.style.display = 'none';
        progressoVazio.style.display = 'block';
    } else {
        chartContainer.style.display = 'block';
        progressoVazio.style.display = 'none';
    }
}
//Gera chart de linhas com as pontuações do usuário ao longo do tempo
function exibirChartProgresso() {
    const ctx = document.getElementById('chartProgresso');
    const labels = readDatas();
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Geral',
                data: readPontuacoesDominio('geral'),
                borderColor: '#0c2d57',
                backgroundColor: '#0c2d57'
            },
            {
                label: 'Segurança Financeira',
                data: readPontuacoesDominio('seguranca'),
                borderColor: '#fc6736',
                backgroundColor: '#fc6736'
            },
            {
                label: 'Comportamento Financeiro',
                data: readPontuacoesDominio('comportamento'),
                borderColor: '#ffad60',
                backgroundColor: '#ffad60'
            },
            {
                label: 'Habilidade Financeira',
                data: readPontuacoesDominio('habilidade'),
                borderColor: '#2c62a7',
                backgroundColor: '#2c62a7'
            },
            {
                label: 'Liberdade Financeira',
                data: readPontuacoesDominio('liberdade'),
                borderColor: '#3a7e5e',
                backgroundColor: '#3a7e5e'
            }
        ]
    };

    var chartProgresso = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            maintainAspectRatio: false
        }
    });
}

//Exibe resultados do usuário em formato de tabela
function exibirTabelaHistorico() {
    var histResultados = readResultados();

    const conteudoTitulo = readDatas();
    const conteudoCabec = ['Domínio', 'Pontuação', 'Classificação'];
    const conteudoDomCorpo = ['Geral', 'Segurança', 'Habilidade', 'Comportamento', 'Liberdade'];

    //Gera uma tabela por resultado armazenado
    for (let i = 0; i < histResultados.length; i++) {
        let id = 'resultado' + (i+1);
        //Gera aba de navegação do resultado no histórico
        let txtTituloNavHist = document.createTextNode(conteudoTitulo[i])
        let tituloNavHist = document.createElement('button');
        tituloNavHist.appendChild(txtTituloNavHist);
        tituloNavHist.setAttribute('data-bs-toggle', 'collapse');
        tituloNavHist.setAttribute('data-bs-target', '#' + id);

        //Gera o cabeçalho para cada resultado
        let cabecHist = document.createElement('thead');
        for (j = 0; j < conteudoCabec.length; j++) {
            let txtItemCabec = document.createTextNode(conteudoCabec[j]);
            let itemCabec = document.createElement('th');
            itemCabec.appendChild(txtItemCabec);
            cabecHist.appendChild(itemCabec);
        }
        //Gera uma linha por cada domínio do I-SFB com seu respectivo conteúdo em cada coluna do cabeçalho
        let corpoHist = document.createElement('tbody');
        let conteudoPontCorpo = readPontuacoesResult(i);
        let conteudoClassifCorpo = readClassificacoesResult(i)
        for (let j = 0; j < conteudoDomCorpo.length; j++) {
            let linhaCorpo = document.createElement('tr');

            let txtColunaDom = document.createTextNode(conteudoDomCorpo[j]);
            let colunaDom = document.createElement('td');
            colunaDom.appendChild(txtColunaDom);
            linhaCorpo.appendChild(colunaDom);

            let txtColunaPont = document.createTextNode(conteudoPontCorpo[j]);
            let colunaPont = document.createElement('td');
            colunaPont.appendChild(txtColunaPont);
            linhaCorpo.appendChild(colunaPont);

            let txtColunaClassif = document.createTextNode(conteudoClassifCorpo[j]);
            let colunaClassif = document.createElement('td');
            colunaClassif.appendChild(txtColunaClassif);
            linhaCorpo.appendChild(colunaClassif);

            corpoHist.appendChild(linhaCorpo);
        }

        //Gera e exibe tabela completa 
        let tabelaHist = document.createElement('table');
        tabelaHist.setAttribute('id', id);
        tabelaHist.setAttribute('data-bs-parent', '#historicoContainer');
        tabelaHist.classList.add('collapse');
        //Mantém resultado atual visível inicialmente
        if (i == histResultados.length - 1) {
            tabelaHist.classList.add('show');
            tituloNavHist.classList.add('active');
        }
        tabelaHist.appendChild(cabecHist);
        tabelaHist.appendChild(corpoHist);
        navDataHistorico.appendChild(tituloNavHist);
        historicoContainer.appendChild(tabelaHist);
    }
}

//Classifica abas ativas de navegação do histórico para estilização
function ativarNavLink() {
    var itensNav = document.querySelectorAll('#navHistorico button');
    for (let i = 0; i < itensNav.length; i++) {
        itensNav[i].addEventListener("click", () => {
            let clicado = itensNav[i];
            for (let j = 0; j < itensNav.length; j++) {
                if (itensNav[j].classList.contains('active')) {
                    itensNav[j].classList.remove('active')
                } else if (itensNav[j] === clicado) {
                    itensNav[j].classList.add('active')
                }
            }
        })
    }
}

//CHAMADA DAS FUNÇÕES
exibirResultado()
exibirTextoResultadoGeral(classificacaoGeral)
exibirComparacaoDominios ('comparacaoHabilidade', pontuacaoHabilidade, 55);
exibirComparacaoDominios ('comparacaoComportamento', pontuacaoComportamento, 64);
exibirComparacaoDominios ('comparacaoSeguranca', pontuacaoSeguranca, 56);
exibirComparacaoDominios ('comparacaoLiberdade', pontuacaoLiberdade, 52);
exibirProgresso();
exibirChartProgresso();
exibirTabelaHistorico();
ativarNavLink();