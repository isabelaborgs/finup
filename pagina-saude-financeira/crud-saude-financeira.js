//Acrescenta um resultado à lista com os resultados do I-SFB e a armazena
function createResultado(resultado) {
    let resultados = readResultados();
    resultados.push(resultado);
    updateResultados(resultados);
}

//ESCOPO: TODOS OS RESULTADOS COMPLETOS / TODOS OS DOMÍNIOS
//Lê e retorna uma lista com todos os resultados armazenados
function readResultados() {
    return JSON.parse(localStorage.getItem("resultados-isfb")) || [];
}

//Lê e retorna uma lista com as datas de todos os resultados
function readDatas() {
    let resultados = readResultados();
    return resultados.flatMap(resultado => resultado.data);
}

//ESCOPO: TODOS OS RESULTADOS / DOMÍNIO ESPECIFICADO
//Lê e retorna uma lista com os objetos do domínio especificado de todos os resutados armazenados 
function readDominio(classeDominio) {
    let resultados = readResultados();
    return resultados.map(resultado => resultado.parte1.find(item => item.dominio == classeDominio));
}

//Lê e retorna uma lista com as pontuações do domínio especificado de todos os resutados armazenados 
function readPontuacoesDominio(classeDominio) {
    let resultados = readDominio(classeDominio);
    return resultados.flatMap(resultado => resultado.pontuacao);
}

//Lê e retorna uma lista com as classificações do domínio especificado de todos os resutados armazenados 
function readClassificacoesDominio(classeDominio) {
    let resultados = readDominio(classeDominio);
    return resultados.flatMap(resultado => resultado.classificacao);
}

//ESCOPO: RESULTADO ESPECIFICADO / TODOS OS DOMÍNIOS
//Lê e retorna o objeto armazenado no índice indicado
function readResultado(indice) {
    let resultados = readResultados();
    return resultados[indice];
}

//Lê e retorna uma lista com todas as pontuações do resultado especificado
function readPontuacoesResult(indice) {
    let resultado = readResultado(indice);
    return resultado.parte1.flatMap(dominio => dominio.pontuacao);
}

//Lê e retorna uma lista com todas as classificações do resultado especificado
function readClassificacoesResult(indice) {
    let resultado = readResultado(indice);
    return resultado.parte1.flatMap(dominio => dominio.classificacao);
}

//ESCOPO: RESULTADO ATUAL / DOMÍNIO ESPECIFICADO
//Lê e retorna o último objeto da lista
function readResultadoAtual() {
    let resultados = readResultados();
    let indice = resultados.length - 1;
    return resultados[indice];
}

//Lê e retorna o objeto do domínio indicado dentro do último objeto da lista
function readDominioAtual(classeDominio) {
    let resultado = readResultadoAtual();
    return resultado.parte1.find((item) => item.dominio == classeDominio);
}

//Lê e retorna a pontuação do domínio especificado no último objeto da lista
function readPontuacaoAtual(classeDominio) {
    let resultado = readDominioAtual(classeDominio);
    return resultado.pontuacao;
}

//Lê e retorna a classificação do domínio especificado no último objeto da lista
function readClassificacaoAtual(classeDominio) {
    let resultado = readDominioAtual(classeDominio);
    return resultado.classificacao;
}

//Armazena a lista de resultados atualizada
function updateResultados(resultados) {
    localStorage.setItem("resultados-isfb", JSON.stringify(resultados));
}

//function deleteResultado(index) {}
