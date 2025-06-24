let btnSalvar, btnAtualizar;
let metaIdEditando = null;

const categorias = {
  viagem: "Viagem",
  educacao: "Educação",
  emergencia: "Emergência",
  saude: "Saúde",
  filhos: "Filhos",
  outros: "Outros"
};

const prioridades = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa"
};

document.addEventListener("DOMContentLoaded", function () {
  const formMetas = document.getElementById("formMetas");
  const metasAdicionadas = document.getElementById("templateTask");
  btnSalvar = document.getElementById("btnSalvar");
  btnAtualizar = document.getElementById("btnAtualizar");

  if (formMetas) {
    formMetas.addEventListener("submit", function (event) {
      event.preventDefault();

      const meta = {
        id: metaIdEditando || Date.now(),
        nomeMeta: document.getElementById("nomeMetas").value,
        valorDesejado: document.getElementById("valorMetasDesejado").value,
        valorAlcancado: document.getElementById("valorMetasAlcancado").value,
        prazo: document.getElementById("prazo").value,
        categoria: document.getElementById("selectCategoria").value,
        prioridade: document.getElementById("prioridade").value,
        descricao: document.getElementById("descricaoMetas").value,
      };

      if (metaIdEditando) {
        atualizarMeta(meta);
      } else {
        salvarMetas(meta);
        adicionarMetas(meta);
      }

      formMetas.reset();

      const modalElement = document.getElementById("modalAddTask");
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); 
        document.body.classList.remove("modal-open"); // Remove restrição ao scroll
      }
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());

      metaIdEditando = null;

      btnSalvar.style.display = 'inline-block';
      btnAtualizar.style.display = 'none';
    });
  }
  document.getElementById("buttonCriar").addEventListener("click", function () {
    document.getElementById("formMetas").reset();
    document.getElementById("btnAtualizar").style.display = 'none';
    document.getElementById("btnSalvar").style.display = 'inline-block';
  });


});

function editarMeta(id) {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const meta = metas.find((meta) => meta.id === id);

  if (meta) {

    document.getElementById("nomeMetas").value = meta.nomeMeta;
    document.getElementById("valorMetasDesejado").value = meta.valorDesejado;
    document.getElementById("valorMetasAlcancado").value = meta.valorAlcancado;
    document.getElementById("prazo").value = meta.prazo;
    document.getElementById("selectCategoria").value = meta.categoria;
    document.getElementById("prioridade").value = meta.prioridade;
    document.getElementById("descricaoMetas").value = meta.descricao;

    metaIdEditando = meta.id;

    btnSalvar.style.display = 'none';
    btnAtualizar.style.display = 'inline-block';

    const modal = new bootstrap.Modal(document.getElementById("modalAddTask"));
    modal.show();

  }
}

function atualizarMeta() {
  const meta = {
    id: metaIdEditando,
    nomeMeta: document.getElementById("nomeMetas").value,
    valorDesejado: document.getElementById("valorMetasDesejado").value,
    valorAlcancado: document.getElementById("valorMetasAlcancado").value,
    prazo: document.getElementById("prazo").value,
    categoria: document.getElementById("selectCategoria").value,
    prioridade: document.getElementById("prioridade").value,
    descricao: document.getElementById("descricaoMetas").value,

  }

  document.getElementById("modalAddTask").addEventListener("hide.bs.modal", function () {
    btnSalvar.style.display = 'inline-block';
    btnAtualizar.style.display = 'none';
  });

  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const index = metas.findIndex((meta) => meta.id === metaIdEditando);
  if (index !== -1) {
    metas[index] = meta;
    localStorage.setItem("metas", JSON.stringify(metas));
  }

  document.querySelector(`[data-id="${metaIdEditando}"]`).remove();
  adicionarMetas(meta);

  const modal = bootstrap.Modal.getInstance(document.getElementById("modalAddTask"));
  modal.hide();
  document.getElementById("formMetas").reset();
}

function salvarMetas(meta) {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  metas.push(meta);
  localStorage.setItem("metas", JSON.stringify(metas));
}

function carregarMetas() {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  metas.forEach((meta) => adicionarMetas(meta));
}

function excluirMeta(id) {
  if (confirm("exluir meta ?")) {
    const metas = JSON.parse(localStorage.getItem("metas")) || [];
    const novasMetas = metas.filter((meta) => meta.id !== id);
    localStorage.setItem("metas", JSON.stringify(novasMetas));
    document.querySelector(`[data-id="${id}"]`).remove();
  }
}

// function toggleContent() {
//   const checkbox = document.getElementById("toggleCheckbox");
//   const descricaoDiv = document.getElementById("descricao");

//   if (checkbox.checked) {
//     descricaoDiv.style.display = "block";
//   } else {
//     descricaoDiv.style.display = "none";
//   }
// }

// document.getElementById("modalAddTask").addEventListener("show.bs.modal", function () {
//   document.getElementById("toggleCheckbox").checked = false;
//   document.getElementById("descricao").style.display = "none";
// });


function metaConcluida(id) {

  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const novasMetas = metas.filter((meta) => meta.id !== id);
  localStorage.setItem("metas", JSON.stringify(novasMetas));

  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.remove();
  }

  mensagemMetaConcluida();
}

function mensagemMetaConcluida() {
  
  const mensagem = document.createElement("div");
  mensagem.classList.add("mensagem-comemoracao");
  mensagem.textContent = "Meta concluída! Parabéns! 🥳";

  
  document.body.appendChild(mensagem);

  
  setTimeout(() => {
    mensagem.remove();
  }, 1000);
}

function mostrarDetalhes(id) {
  const metas = JSON.parse(localStorage.getItem("metas")) || [];
  const meta = metas.find((meta) => meta.id === id);

  if (meta) {
    alert(`detalhes da meta:
        nome: ${meta.nomeMeta}
        prioridade: ${meta.prioridade}
        categoria: ${meta.categoria}
        previsao: ${new Date(meta.prazo).toLocaleDateString()}
        descricao: ${meta.descricao}`);
  }
}

function extrairValorDesejado(valorDesejado) {
  return valorDesejado.replace(/\D/g, "");
}

function extrairValorAlcancado(valorAlcancado) {
  return valorAlcancado.replace(/\D/g, "");
}

function atualizarProgresso(metaId, valorAlcancado) {
  const barra = document.querySelector(`[data-id="${metaId}"] #barraProgresso`);
  if (barra) {
    barra.value = valorAlcancado;
  }
}

function adicionarMetas(meta) {
  const metaCard = document.createElement("div");
  metaCard.classList.add("col-md-6", "col-xxl-4");
  metaCard.setAttribute("data-id", meta.id);

  const progressoValue = parseFloat(meta.valorAlcancado.replace(/\D/g, '')) /100 || 0;
  const progressoMax = parseFloat(meta.valorDesejado.replace(/\D/g, '')) /100 || 1;

  const categoriaNome = categorias[meta.categoria] || meta.categoria;
  const prioridadeNome = prioridades[meta.prioridade] || meta.prioridade;

  const hoje = new Date();
  const prazoFinal = new Date(meta.prazo);
  const mesesRestantes = 
    (prazoFinal.getFullYear() - hoje.getFullYear()) * 12 + 
    (prazoFinal.getMonth() - hoje.getMonth());
  let contribuicaoMensal = null;

  if (mesesRestantes > 0 && progressoMax > progressoValue) {
    contribuicaoMensal = ((progressoMax - progressoValue) / mesesRestantes).toFixed(2);
  }

  metaCard.innerHTML = `
  <div class="card">
      <div class="card-body" id="bodyCard">
        <div class="header-meta mb-3">
          <h5 class="card-title">${meta.nomeMeta}</h5>
          <h6 class="card-text">${meta.descricao}</h6>
        </div>
        <div class="card-text"><strong>Categoria:</strong> ${categoriaNome}</div>
        <div class="card-text"><strong>Prioridade:</strong> ${prioridadeNome}</div>
        <div class="card-text"><strong>Previsão: </strong>${new Date(meta.prazo).toLocaleDateString()}</div>
        <div class="">
          <div class="card-text" id="valorProgresso"><strong>Progresso:</strong> R$ ${meta.valorAlcancado} / R$ ${meta.valorDesejado}</div>
          <progress id="barraProgresso" value="${progressoValue}" max="${progressoMax}"></progress>
          <span id="percentualProgresso"></span>
        </div>
        ${contribuicaoMensal !== null ? `<div class="card-text"><strong class="contribuicaoMensal">Contribuição mensal necessária:</strong> R$ ${contribuicaoMensal}</div>` : '<div class="card-text"><strong >Meta já atingida ou <br> sem prazo válido.</strong></div>'}
      </div>
      <div class="card-footer row" id="footerCard">
        <button class="btn btn-sm btn-warning col" onclick="editarMeta(${meta.id})">Editar</button>
        <button class="btn btn-sm btn-success col" onclick="metaConcluida(${meta.id})">Concluir</button>
        <button class="btn btn-sm btn-danger col" onclick="excluirMeta(${meta.id})">Excluir</button>
      </div>
  </div>
`;


metasAdicionadas.appendChild(metaCard);
}

window.onload = carregarMetas;
