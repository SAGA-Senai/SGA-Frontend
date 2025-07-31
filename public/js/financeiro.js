// Alternar exibição do formulário de recebimento
/* TUDO CERTO */
function toggleForm() {
  const formContainer = document.getElementById("formContainer");
  if (formContainer.style.display === "block") {
    formContainer.style.display = "none";
  } else {
    formContainer.style.display = "block";
  }
}
// O código abaixo está buscando um item com id inexistente
// document.getElementById("formContainer").addEventListener("click", (event) => {
//   const formContent = document.getElementById("formContent");
//   if (!formContent.contains(event.target)) {
//     document.getElementById("formContainer").style.display = "none";
//   }
// });

function toggleSection(sectionId) {
  var section = document.getElementById(sectionId);
  if (section.style.display === "none" || section.style.display === "") {
    section.style.display = "block";
  } else {
    section.style.display = "none";
  }
}

//---Inserir dados no BD
document
  .getElementById("formContainer")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const data = document.getElementById("receiving_date").value;
    const quantidade = document.getElementById("quantity_received").value;
    const codigo = document.getElementById("product_code").value;
    const validade = document.getElementById("product_validade").value;
    const lote = document.getElementById("numb_lote").value;
    const fornecedor = document.getElementById("product_font").value;


    const formContainer = document.getElementById("formContainer");

    const response = await fetch("http://127.0.0.1:8000/financeiro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        
        Data: data,
        Quantidade: quantidade,
        Codigo: codigo,
        Validade: validade,
        Lote: lote,
        Fornecedor: fornecedor,
      }),
    });

    if (response.ok) {
      alert("Recebimento adicionado com sucesso!");
      document.getElementById("productForm").reset(); // Limpa o formulário
      formContainer.style.display = "none";

    } else {
      alert("Erro ao adicionar recebimento!");
    }
  });



//--------------------------------------------------------------Aparecer os recebimentos na tela
// arrays que serão preenchidas com os dados recebidos
let recebimentos = [];
let fabricantes = [];
let categorias = [];

// Busca os dados do backend
async function fetchData() {
  try {
    const response = await fetch('http://127.0.0.1:8000/recebimento');

    if (!response.ok) {
      throw new Error('Erro ao buscar produtos: ' + response.statusText);
    };

    const response_data = await response.json(); // retorna como um dicionário pelo pydantic
    const dados = response_data.dados; // extraindo as informações

    recebimentos = dados; // salva os recebimentos

    dados.forEach(recebimento => {
      if (!fabricantes.includes(recebimento.FABRICANTE)) { // salva os fabricantes
        fabricantes.push(recebimento.FABRICANTE);
      };
      if (!categorias.includes(recebimento.CATEGORIA)) { // salva as categorias
        categorias.push(recebimento.CATEGORIA);
      };
    });
    fabricantes.sort();
    preencherSelect();

    montarTabela();
    
  } catch (error) {
    alert('Erro ao buscar recebimentos: ' + error.message);
  };
};

function preencherSelect() {
  fabricantes.forEach(fabricante => {
    const option = document.createElement("option");
    option.value = fabricante;
    option.textContent = fabricante;
    fabricanteSelect.appendChild(option)
  });
};

// arrumar datas do banco de dados para o formato correto
function parseDataBr(dataStr) {
  const [dia, mes, ano] = dataStr.split("/");
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

// objeto para ajustar o filtro
const tabelaOpts = {
  categoria: '',
  fabricante: '',
  datas: [],
  sort: '' // 'az' ou 'za'
}

async function montarTabela() {
  const tabelaRecebimentos = document.querySelector('.table-container');
  if (!tabelaRecebimentos) {
    throw new Error('Elemento com a classe "table-container" não encontrado no DOM.');
  }

  tabelaRecebimentos.innerHTML = ''; // Limpa o conteúdo anterior

  if (recebimentos.length === 0) {
    tabelaRecebimentos.innerHTML = '<div class="nenhum-recebimento">Nenhum recebimento encontrado</div>';
    return;
  };

  let tabelaData = recebimentos.slice() // cria uma nova array sem alterar a original

  // organiza a array se o sort estiver sendo usado
  if (tabelaOpts.sort === 'az') {
    tabelaData.sort((a, b) => a.NOME_BASICO.localeCompare(b.NOME_BASICO));
  } else if (tabelaOpts.sort === 'za') {
    tabelaData.sort((a, b) => b.NOME_BASICO.localeCompare(a.NOME_BASICO)); // inverte a array
  };

  tabelaData.forEach(recebimento => {
    // filtra os itens caso necessário
    if (tabelaOpts.categoria && tabelaOpts.categoria != recebimento.CATEGORIA) {
      return // faz a função pular para o próximo item, igual um continue
    }
    if (tabelaOpts.fabricante && tabelaOpts.fabricante != recebimento.FABRICANTE) {
      return
    }
    if (
      tabelaOpts.datas.length > 0 &&
      (tabelaOpts.datas[0] > parseDataBr(recebimento.DATA_RECEB) ||
      tabelaOpts.datas[1] < parseDataBr(recebimento.DATA_RECEB))
    ) {
      return
    }

    // Cria uma linha principal
    const mainRow = document.createElement('div');
    mainRow.classList.add('row', 'main-row');
    mainRow.innerHTML = `
      <div class="cell"><strong>Data</strong><span>${recebimento.DATA_RECEB}</span></div>
      <div class="cell"><strong>Código</strong><span>${recebimento.CODIGO}</span></div>
      <div class="cell"><strong>Item</strong><span>${recebimento.NOME_BASICO}</span></div>
      <div class="cell"><strong>Fornecedor</strong><span>${recebimento.FORNECEDOR}</span></div>
      <div class="cell"><strong>Preço Aquisição</strong><span>${recebimento.PRECO_DE_AQUISICAO} R$</span></div>
      <div class="cell"><strong>Quantidade</strong><span>${recebimento.QUANT}</span></div>
    `;

    // Cria a linha de detalhes
    const detailsRow = document.createElement('div');
    detailsRow.classList.add('row', 'details-row');
    detailsRow.style.display = 'none'; // Esconde inicialmente
    detailsRow.innerHTML = `
      <div class="details-left">
        <div class="image-placeholder">
          <img src="${recebimento.IMAGEM}" alt="Ícone de imagem">
        </div>
      </div>
      <div class="details-right">
        <div class="detail-item"><strong>Fragilidade:</strong><span>${recebimento.FRAGILIDADE}</span></div>
        <div class="detail-item"><strong>Fabricante:</strong><span>${recebimento.FABRICANTE}</span></div>
        <div class="detail-item"><strong>Lote:</strong><span>${recebimento.LOTE}</span></div>
        <div class="detail-item"><strong>Validade:</strong><span>${recebimento.VALIDADE}</span></div>
        <div class="detail-item"><strong>Preço Venda:</strong><span>${recebimento.PRECO_DE_VENDA} RS</span></div>
      </div>
    `;

    // Adiciona um evento de clique à linha principal
    mainRow.addEventListener('click', () => {
      detailsRow.style.display = detailsRow.style.display === 'none' ? 'flex' : 'none';
    });

    // Adiciona as linhas à tabela
    tabelaRecebimentos.appendChild(mainRow);
    tabelaRecebimentos.appendChild(detailsRow);
  });
};

// Chama a função ao carregar a página
window.onload = fetchData;

document.addEventListener("DOMContentLoaded", () => {
  const filtrarButton = document.querySelector("#filtrar");
  const caixote = document.querySelector("#caixote");

  //mostrar ou esconder o caixote
  filtrarButton.addEventListener("click", (event) => {
      caixote.classList.toggle("active");
      event.stopPropagation(); // impede que o click no filtro feche o dropdown
  });

  // Fecha o caixote se clicar fora dele
  document.addEventListener("click", (event) => {
      if (!caixote.contains(event.target) && !filtrarButton.contains(event.target)) {
          caixote.classList.remove("active");
      };
  });
});

// ---------------------------funções do filtro
const categoriaSelect = document.getElementById("categoria");
const fabricanteSelect = document.getElementById("fabricante");

const dataIni = document.getElementById("dedata");
const dataFinal = document.getElementById("atedata");

// Selects
categoriaSelect.addEventListener("change", () => {
  if (categoriaSelect.selectedIndex !== 0) {
    tabelaOpts.categoria = categoriaSelect.value;

  } else {
    tabelaOpts.categoria = ''; // reseta o valor
  };
  montarTabela();
});

fabricanteSelect.addEventListener("change", () => {
  if (fabricanteSelect.selectedIndex !== 0){
    tabelaOpts.fabricante = fabricanteSelect.value;
  } else { // se selecionar a primeira opção
    tabelaOpts.fabricante = ''; // reseta o valor
  };
  montarTabela();
});

// Datas
dataIni.addEventListener("change", () => {
  if (dataIni.value && dataFinal.value) {
    tabelaOpts.datas = [dataIni.value, dataFinal.value];
  } else {
    tabelaOpts.datas = [];
  };
  montarTabela();
});

dataFinal.addEventListener("change", () => {
  if (dataIni.value && dataFinal.value) {
    tabelaOpts.datas = [dataIni.value, dataFinal.value];
  } else {
    tabelaOpts.datas = [];
  };
  montarTabela();
});

// organizar alfabéticamente
const sortButton = document.getElementById('sortAz');
const sortButtonRev = document.getElementById('sortZa');

sortButton.addEventListener('click', () => {
  if (tabelaOpts.sort !== 'az') {
    sortButton.style.borderColor = '#FFCC00'
    sortButtonRev.style.borderColor = ''
    tabelaOpts.sort = 'az';
  } else {
    sortButton.style.borderColor = ''
    tabelaOpts.sort = '';
  };
  montarTabela();
});

sortButtonRev.addEventListener('click', () => {
  if (tabelaOpts.sort !== 'za') {
    sortButtonRev.style.borderColor = '#FFCC00'
    sortButton.style.borderColor = ''
    tabelaOpts.sort = 'za';
  } else {
    sortButtonRev.style.borderColor = ''
    tabelaOpts.sort = '';
  };
  montarTabela();
});

// Limpa o filtro completamente
document.getElementById('textinho').addEventListener('click', () => {
  tabelaOpts.categoria = '';
  tabelaOpts.fabricante = '';
  tabelaOpts.datas = [];
  tabelaOpts.sort = '';
  montarTabela();
  sortButton.style.borderColor = ''
  sortButtonRev.style.borderColor = ''
});