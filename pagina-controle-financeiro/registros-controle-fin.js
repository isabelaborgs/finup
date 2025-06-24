function gerarRegistros() {
    let categorias = document.querySelectorAll('.category')
    var registros = [];

    categorias.forEach(categoria => {
        let nomeCategoria = categoria.getAttribute('data-category');
        let tabela = categoria.querySelector('.static-table');
        let linhasTabela = tabela.querySelectorAll('tr');
    
        let transacoes = [];

        linhasTabela.forEach(linha => {
            let celulas = linha.querySelectorAll('td');
            let checkbox = linha.querySelector('input[type = "checkbox"]:checked');
            let checked;
            if (checkbox) {
                checked = true;
            } else {
                checked = false;
            }
            
            let dadosLinha = [];
            celulas.forEach(celula => {
                let dadosCelula = celula.innerHTML;
                dadosLinha.push(dadosCelula);
            });

            let transacao = {
                descricao: dadosLinha[0],
                valor: dadosLinha[1],
                dataFinal: dadosLinha[2],
                checked: checked
            }

            transacoes.push(transacao);
        })

        let inputLimite = categoria.querySelector('.limit-value');
        let valorLimite;
        if (inputLimite) {
            valorLimite = inputLimite.value;
        } else {
            valorLimite = '';
        }
        
        let dadosCategoria = {
            nome: nomeCategoria,
            limite: valorLimite,
            transacoes: transacoes
        }

        registros.push(dadosCategoria);
    })
    return registros;
}

function armazenarRegistrosControleFin(registros) {
    localStorage.setItem('registros-controle-financeiro', JSON.stringify(registros));
}

document.addEventListener('DOMContentLoaded', () => {
    let registros = gerarRegistros()
    armazenarRegistrosControleFin(registros);
});
document.addEventListener('change', () => {
    let registros = gerarRegistros()
    armazenarRegistrosControleFin(registros);
});