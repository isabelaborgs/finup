document.addEventListener("DOMContentLoaded", function () {
    const filtroCategoria = document.getElementById("filtroCategoria");
    const filtroPrioridade = document.getElementById("filtroPrioridade");
  
    filtroCategoria.addEventListener("change", aplicarFiltro);
    filtroPrioridade.addEventListener("change", aplicarFiltro);
  
    function aplicarFiltro() {
      const categoriaSelecionada = filtroCategoria.value;
      const prioridadeSelecionada = filtroPrioridade.value;
  
      const metas = JSON.parse(localStorage.getItem("metas")) || [];
      const metasFiltradas = metas.filter(meta => {
        const categoriaCorresponde = categoriaSelecionada ? meta.categoria === categoriaSelecionada : true;
        const prioridadeCorresponde = prioridadeSelecionada ? meta.prioridade === prioridadeSelecionada : true;
  
        return categoriaCorresponde && prioridadeCorresponde;
      });
  
      metasAdicionadas.innerHTML = '';
      metasFiltradas.forEach(meta => adicionarMetas(meta));
    }
  });

  function carregarMetas() {
    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const categoriaSelecionada = document.getElementById("filtroCategoria").value;
    const prioridadeSelecionada = document.getElementById("filtroPrioridade").value;
  
    const metasFiltradas = metas.filter(meta => {
      const categoriaCorresponde = categoriaSelecionada ? meta.categoria === categoriaSelecionada : true;
      const prioridadeCorresponde = prioridadeSelecionada ? meta.prioridade === prioridadeSelecionada : true;
  
      return categoriaCorresponde && prioridadeCorresponde;
    });
  
    metasFiltradas.forEach(meta => adicionarMetas(meta));
  }