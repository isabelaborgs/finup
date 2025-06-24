//Inicializando tooltips para uso com Bootstrap
document.addEventListener('DOMContentLoaded', () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
})

//Construtor de notificações
class Notificacao {
    constructor(id, txt, classLink, classIcone) {
        this.id = id;
        this.txt = txt;
        this.classLink = classLink;
        this.classIcone = classIcone;
        this.lida = false;
        this.ocultar = false;
    }
}

//CRUD para exibição de notificações
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
    let transacoesDespesas = despesas.flatMap(despesa => despesa.transacoes);
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

function readBalancoCategorias() {
    let despesas = readDespesas();
    let balanco = [];

    despesas.forEach(despesa => {
        let despesasTotais = despesa.transacoes;
        let despesasAtuais = despesasTotais.filter(item => item.checked);
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

function readMetas() {
    return JSON.parse(localStorage.getItem("metas")) || [];
}

function createNotificacao(notificacaoNova) {
    let notificacoes = readNotificacoes();
    let notificacaoExistente = notificacoes.find(notificacao => notificacao.id == notificacaoNova.id) || false; 
    if (notificacaoExistente === false) {
        notificacoes.push(notificacaoNova);
        localStorage.setItem("notificacoes", JSON.stringify(notificacoes));
    } 
}

function readNotificacoes() {
    return JSON.parse(localStorage.getItem("notificacoes")) || [];
}

function updateNotificacaoLida(idLida) {
    let notificacoes = readNotificacoes();
    let indiceLida = notificacoes.findIndex(notificacao => notificacao.id == idLida);
    notificacoes[indiceLida].lida = true;
    localStorage.setItem("notificacoes", JSON.stringify(notificacoes));
}

function updateNotificacaoOculta (idOculta) {
    let notificacoes = readNotificacoes();
    let indiceOculta = notificacoes.findIndex(notificacao => notificacao.id == idOculta);
    notificacoes[indiceOculta].ocultar = true;
    localStorage.setItem("notificacoes", JSON.stringify(notificacoes));
}


//Gerando e exibindo notificações
const dataHoje = new Date();

const diaHoje = dataHoje.getDate();
const mesHoje = dataHoje.getMonth() + 1;
const despesas = readDespesas();
const despesasMes = readDespesasMesAtual(despesas);
const receitasMes = readReceitasMesAtual();
const balancoCategorias = readBalancoCategorias();
const metas = readMetas();

function exibirNotificacoes() {
    let notificacoes = readNotificacoes();
    notificacoes.sort((a, b) => {
        return a.lida - b.lida 
    })

    notificacoes.forEach(notificacao => {
        let txt = notificacao.txt;
        let id = notificacao.id;
        let classLink = notificacao.classLink;
        let classIcone = notificacao.classIcone;
    
        const icone = document.createElement('span');
        icone.classList.add('icone-informativo');
        icone.classList.add(classIcone);
        const linkNotificacao = document.createElement('a');
        linkNotificacao.appendChild(icone);

        const txtNotificacao = document.createTextNode(txt);
        linkNotificacao.appendChild(txtNotificacao);
        linkNotificacao.classList.add(classLink);
        
        const txtDataNotif = document.createTextNode(`${diaHoje}/${mesHoje}`);
        const dataNotificacao = document.createElement('span');
        dataNotificacao.appendChild(txtDataNotif);
        dataNotificacao.classList.add('data-notificacao')
        
        const notificacaoItem = document.createElement('li');
        notificacaoItem.setAttribute('id', id);
        notificacaoItem.classList.add('notificacao');
        notificacaoItem.classList.add('dropdown-item');
        notificacaoItem.appendChild(linkNotificacao);
        notificacaoItem.appendChild(dataNotificacao);
        notificationList.appendChild(notificacaoItem);

        if (notificacao.lida) {
            notificacaoItem.classList.add('notificacao-lida');
        }

        if (notificacao.ocultar) {
            notificacaoItem.classList.add('notificacao-oculta');
        }
    })
}

function gerarNotificacaoContas() {
    despesasMes.forEach(despesa => {
        const descricao = despesa.descricao;
        const dataVencimento = new Date(despesa.dataFinal);
        const diaVencimento = dataVencimento.getDate();

        if (despesa.checked === false) {
            if (dataVencimento < dataHoje) {
                let txt = `A conta "${descricao}" está atrasada`;
                let id = `${dataHoje.getMonth()}-${descricao}-atraso`;
                let notificacao = new Notificacao(id, txt, 'controle-financeiro', 'icon-danger');
                createNotificacao(notificacao);
            } else if (dataVencimento === dataHoje) {
                let txt = `A conta "${descricao}" vence hoje`;
                let id = `${dataHoje.getMonth()}-${descricao}-venceHoje`;
                let notificacao = new Notificacao(id, txt, 'controle-financeiro', 'icon-warning');
                createNotificacao(notificacao);
            } else if (diaHoje === diaVencimento - 1) {
                let txt = `A conta "${descricao}" vence amanhã`;
                let id = `${dataHoje.getMonth()}-${descricao}-venceAmanha`;
                let notificacao = new Notificacao(id, txt, 'controle-financeiro', 'icon-info');
                createNotificacao(notificacao);
            } 
        }
    })

    if (despesasMes.length > 0) {
        const todasPagas = despesasMes.every(despesa => {
            return despesa.checked === true
        })

        if (todasPagas) {
            let txt = 'Parabéns! Você pagou todas as suas contas do mês!';
            let id = `${dataHoje.getMonth()}-TodasPagas`;
            let notificacao = new Notificacao(id, txt, 'controle-financeiro', 'icon-check');
            createNotificacao(notificacao);
        }
    }
}

function gerarNotificacaoLimites() {
    balancoCategorias.forEach(categoria => {
        let nomeCategoria = categoria.nome;
        let valorLimite = parseInt(categoria.limite);
        let valorGasto = categoria.gasto;
        let valorPorc = valorGasto / valorLimite * 100;

        if (valorPorc > 100) {
            let txt = `Você excedeu o limite definido para "${nomeCategoria}"`;
            let id = `${dataHoje.getMonth()}-${nomeCategoria}-limiteExcedido`;
            let notificacao = new Notificacao(id, txt, 'controle-financeiro', 'icon-danger');
            createNotificacao(notificacao);
        } else if (valorPorc >= 90) {
            let txt = `Você já gastou ${valorPorc.toFixed(2)}% do limite definido para "${nomeCategoria}"`;
            let id = `${dataHoje.getMonth()}-${nomeCategoria}-limiteProximo`;
            let notificacao = new Notificacao(id, txt, 'controle-financeiro', 'icon-warning');
            createNotificacao(notificacao);
        }
    })
}

function gerarNotificacaoMetas() {
    metas.forEach(meta => {
        let nomeMeta = meta.nomeMeta;
        let valorDesejado = parseFloat(meta.valorDesejado.replace(/\./g, ''));
        let valorAlcancado = parseFloat(meta.valorAlcancado.replace(/\./g, ''));

        if (valorAlcancado >= valorDesejado) {
            let txt = `Parabéns! Você alcançou a meta "${nomeMeta}!"`;
            let id = `${dataHoje.getMonth()}-${nomeMeta}-metaAlcancada`;
            let notificacao = new Notificacao(id, txt, 'metas', 'icon-check');
            createNotificacao(notificacao);
        }
    })
}

function adicionarLinksNotificacao() {
    let linkControleFin = document.querySelectorAll('.controle-financeiro');
    let linkMetas = document.querySelectorAll('.metas');

    linkControleFin.forEach(link => {
        link.setAttribute('href', '../controle-financeiro/cfinance.html');
    })

    linkMetas.forEach(link => {
        link.setAttribute('href', '../pagina-metas/metas.html');
    })
}

function adicionarIconesInformativos() {
    let iconesInformativos = document.querySelectorAll('.icone-informativo');

    iconesInformativos.forEach(icone => {
        icone.classList.add('material-symbols-outlined');
        if (icone.classList.contains('icon-danger')) {
            icone.innerHTML = 'error';
        } else if (icone.classList.contains('icon-warning')) {
            icone.innerHTML = 'warning';
        } else if (icone.classList.contains('icon-info')) {
            icone.innerHTML = 'info';
        } else if (icone.classList.contains('icon-check')) {
            icone.innerHTML = 'done_all';
        }
    });
}

function marcarComoLida() {
    const notificacoes = document.querySelectorAll('.notificacao');
    notificacoes.forEach(notificacao => {
        notificacao.addEventListener('click', () => {
            let idLida = notificacao.id;
            notificacao.classList.add('.notificacao-lida');
            updateNotificacaoLida(idLida);
            atualizarQtdeNotificacoes()
        })
    })
}

function atualizarQtdeNotificacoes() {
    const notificacoesNaoLidas = readNotificacoes().filter(notificacao => notificacao.lida === false);
    const qtdeNaoLidas = notificacoesNaoLidas.length;
    notificationBadge.innerHTML = qtdeNaoLidas;
    if (qtdeNaoLidas === 1) {
        txtNew.innerHTML = 'Você tem uma nova notificação';
    } else if (qtdeNaoLidas > 1) {
        txtNew.innerHTML = `Você tem ${qtdeNaoLidas} novas notificações`
    } else if (qtdeNaoLidas === 0) {
        txtNew.innerHTML = 'Você não tem novas notificações';
        notificationBadge.style.display = 'none';
    }
}

function marcarTodasComoLidas() {
    let notificacoes = document.querySelectorAll('.notificacao');
    notificacoes.forEach(notificacao => {
        let idLida = notificacao.id;
        notificacao.classList.add('notificacao-lida');
        updateNotificacaoLida(idLida);
        atualizarQtdeNotificacoes();
    })
}

function excluirNotificacoesLidas() {
    let notificacoesLidas = document.querySelectorAll('.notificacao-lida');
    notificacoesLidas.forEach(notificacao => {
        let idOculta = notificacao.id;
        notificacao.classList.add('notificacao-oculta');
        updateNotificacaoOculta(idOculta);
    });
}

gerarNotificacaoContas();
gerarNotificacaoLimites();
gerarNotificacaoMetas();
exibirNotificacoes();
adicionarLinksNotificacao();
adicionarIconesInformativos();
atualizarQtdeNotificacoes();
marcarComoLida();

btMarcarTodasLidas.addEventListener('click', () => {
    marcarTodasComoLidas();
})

btExcluirNotificacoes.addEventListener('click', () => {
    excluirNotificacoesLidas();
})
