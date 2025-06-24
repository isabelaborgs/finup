isfb.addEventListener('input', () => {
    exibirCheck ('radio-container');
    exibirCheck ('checkbox-container');
    liberaBtEnviar();
})

isfb.addEventListener('submit', (e) => {
    e.preventDefault();
    createResultado(calcularResultado());
    window.location.href = '../pagina-saude-financeira/saude-financeira.html';
});

enviar.addEventListener('click', () => {
    if (btEnviar.disabled) {
        aviso.removeAttribute('hidden');
    } 
})

function liberaBtEnviar () {
    const questoesRadio = Array.from(document.querySelectorAll('.radio-group'));
    const questoesRespondidas = Array.from(document.querySelectorAll('input[type="radio"]:checked'));
    if (questoesRespondidas.length == questoesRadio.length) {
        btEnviar.disabled = false;
        aviso.setAttribute('hidden', '');
    } else {
        btEnviar.disabled = true;
    }
}

function exibirCheck (className) {
    let containers = document.getElementsByClassName(className);

    for (let i = 0; i < containers.length; i++) {
        let input = containers[i].querySelector('input');
        //document.addEventListener('input', () => {
            if (input.checked) {
                containers[i].classList.remove('unchecked');
                containers[i].classList.add('checked');
            } else {
                containers[i].classList.remove('checked');
                containers[i].classList.add('unchecked');
            }
    }
};

function calcularResultado () {
    const respostas = Array.from(document.querySelectorAll('input[type="radio"]:checked'));
    const itensCheckbox = document.querySelectorAll('input[type=checkbox]:checked').length;
    const data = new Date().toLocaleDateString();
    
    const gabaritoPt2 = criarGabarito('pt2');
    
    var valorCheckbox;
    if (itensCheckbox == 0) {
        valorCheckbox = 0;
    } else if (itensCheckbox < 3) {
        valorCheckbox = 1;
    } else if (itensCheckbox < 6) {
        valorCheckbox = 2;
    } else if (itensCheckbox < 9) {
        valorCheckbox = 3;
    } else {
        valorCheckbox = 4;
    };

    const somaPt2 = somarValores(gabaritoPt2) + valorCheckbox;

    const gabaritoPt1 = criarGabarito('pt1');
    const somaPt1 = somarValores(gabaritoPt1);
    const pontuacaoPt1 = pontuar('geral', somaPt1);
    const classificacaoGeral = classificar(pontuacaoPt1, 37, 50, 57, 61, 69, 83);

    const gabaritoSeguranca = criarGabarito('seguranca');
    const somaSeguranca = somarValores(gabaritoSeguranca);
    const pontuacaoSeguranca = pontuar('seguranca', somaSeguranca);
    const classificacaoSeguranca = classificar(pontuacaoSeguranca, 24, 42, 54, 63, 78, 90);

    const gabaritoHabilidade = criarGabarito('habilidade');
    const somaHabilidade = somarValores(gabaritoHabilidade);
    const pontuacaoHabilidade = pontuar('habilidade', somaHabilidade);
    const classificacaoHabilidade = classificar(pontuacaoHabilidade, 20, 35, 51, 59, 76, 92);

    const gabaritoComportamento = criarGabarito('comportamento');
    const somaComportamento = somarValores(gabaritoComportamento);
    const pontuacaoComportamento = pontuar('comportamento', somaComportamento);
    const classificacaoComportamento = classificar(pontuacaoComportamento, 28, 48, 60, 72, 84, 96);

    const gabaritoLiberdade = criarGabarito('liberdade')
    const somaLiberdade = somarValores(gabaritoLiberdade);
    const pontuacaoLiberdade = pontuar('liberdade', somaLiberdade);
    const classificacaoLiberdade = classificar(pontuacaoLiberdade, 17, 35, 48, 64, 76, 94);

    //createResultado(resultado);

    function criarGabarito (classe) {
        return respostas.filter(resposta => resposta.classList.contains(classe)).flatMap(resposta => parseInt(resposta.value));
    };

    function somarValores (array) {
        return parseInt(array.reduce((total, valor) => total + valor));
    };

    function criarGabarito (classe) {
        return respostas.filter(resposta => resposta.classList.contains(classe)).flatMap(resposta => parseInt(resposta.value));
    };
    
    function somarValores (array) {
        return array.reduce((total, valor) => total + valor);
    };
    
    function pontuar (classe, somaClasse) {
        const pontuador = {
            base1: {
                geral: [8, 11, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 39, 41, 43, 45, 47, 49, 51, 52, 54, 56, 58, 60, 62, 63, 65, 68, 70, 72, 74, 76, 78, 80, 82, 83, 85, 87, 89, 91, 92, 94, 95, 97, 98, 100],
                seguranca: [6, 15, 21, 27, 33, 39, 45, 51, 57, 63, 66, 72, 78, 84, 90, 93, 100],
                habilidade: [4, 16, 24, 32, 40, 48, 56, 60, 72, 76, 84, 92, 100], 
                comportamento: [4, 16, 24, 32, 40, 48, 56, 64, 72, 80, 84, 92, 100],
                liberdade: [11, 23, 35, 47, 58, 70, 76, 88, 100]
            },
            base2: {
                geral: [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 12, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 35, 37, 40, 42, 44, 46, 48, 50, 53, 55, 57, 59, 61, 64, 67, 69, 71, 73, 75, 77, 79, 81, 84, 86, 88, 90, 93, 96],
                seguranca: [0, 3, 9, 12, 18, 24, 30, 36, 42, 48, 54, 60, 69, 75, 81, 87, 96],
                habilidade: [0, 8, 12, 20, 28, 36, 44, 52, 64, 68, 80, 88, 96],
                comportamento: [0, 8, 12, 20, 28, 36, 44, 52, 60, 68, 76, 88, 96],
                liberdade: [0, 5, 17, 29, 41, 52, 64, 82, 94]
            }
        };

        let base = somaPt2 < 7 ? 'base1' : 'base2';
        return pontuador[base][classe][somaClasse];
    };
    
    function classificar (pontuacao, marcoRuim, marcoMuitoBaixa, marcoBaixa, marcoOk, marcoBoa, marcoMuitoBoa) {
        if (pontuacao < marcoRuim) {
            return 'Ruim';
        } else if (pontuacao < marcoMuitoBaixa) {
            return 'Muito baixa';
        } else if (pontuacao < marcoBaixa) {
            return 'Baixa';
        } else if (pontuacao < marcoOk) {
            return 'Ok';
        } else if (pontuacao < marcoBoa) {
            return 'Boa';
        } else if (pontuacao < marcoMuitoBoa) {
            return 'Muito boa';
        } else {
            return 'Ótima';
        };
    };
    
    return resultado = {
        data: data,
        parte1: [
            {
                dominio: 'geral',
                gabarito: gabaritoPt1,
                soma: somaPt1,
                pontuacao: pontuacaoPt1,
                classificacao: classificacaoGeral
            },
            {
                dominio: 'seguranca',
                gabarito: gabaritoSeguranca,
                soma: somaSeguranca,
                pontuacao: pontuacaoSeguranca,
                classificacao: classificacaoSeguranca
            },
            {
                dominio: 'habilidade',
                gabarito: gabaritoHabilidade,
                soma: somaHabilidade,
                pontuacao: pontuacaoHabilidade,
                classificacao: classificacaoHabilidade
            },
            {
                dominio: 'comportamento',
                gabarito: gabaritoComportamento,
                soma: somaComportamento,
                pontuacao: pontuacaoComportamento,
                classificacao: classificacaoComportamento
            },
            {
                dominio: 'liberdade',
                gabarito: gabaritoLiberdade,
                soma: somaLiberdade,
                pontuacao: pontuacaoLiberdade,
                classificacao: classificacaoLiberdade
            }
        ],
        parte2: {
            gabaritoRadio: gabaritoPt2,
            gabaritoCheckbox: valorCheckbox,
            soma: somaPt2
        } 
    }
}
