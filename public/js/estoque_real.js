document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('btnAbrirLinha')) {
            const linhaDetalhe = event.target.closest('tr').nextElementSibling;

            if (linhaDetalhe) {
                const isHidden = linhaDetalhe.style.display === 'none';
                linhaDetalhe.style.display = isHidden ? 'table-row' : 'none';
                event.target.textContent = isHidden ? '-' : '+';
            }
        }
    });
});


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
        }
    });
});

//----------SCRIPT PRINCIPAL

    async function fetchEstoqueReal() {
        try {
            const response = await fetch('/estoque-real');
            
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos: ' + response.statusText);
            }

            const produtos = await response.json();

            const tbody = document.querySelector('#tabela-estoque tbody');
            tbody.innerHTML = '';

            if (produtos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8">Nenhum produtos encontrado</td></tr>';
                return;
            }

            produtos.forEach(produtos => {

const row = `
<tr>
    <td>${produtos.CODIGO}</td>
    <td>${produtos.NOME_BASICO}</td>
    <td>50</td>
    <td>${produtos.QUANT_RECENTE}</td>
    <td>${produtos.QUANTIDADE}</td>
    <td>${produtos.QUANTIDADE}</td>
    <td>100%</td>
    <td>OK</td>
</tr>

    `;
tbody.innerHTML += row;
});
            } catch (error) {
                alert('Erro ao buscar usuários: ' + error.message);
            }
    }

    window.onload = fetchEstoqueReal;

//---------------------LIMPAR FILTRO

function limparFiltros() {
    document.getElementById('categoria').value = '';
    document.getElementById('fabricante').value = '';
    document.getElementById('codigo').value = '';
}
function tirarFiltro(){
    document.getElementById('categoria').value = '';
    document.getElementById('fabricante').value = '';
    
}

//---------------------------FILTRO BACK END



//-----------------------FILTRO CATEGORIA




//-----------------------FILTRO FABRICANTE

document.addEventListener('DOMContentLoaded', async () => {
    const filtroFabricante = document.getElementById('fabricante');

    try {
        const response = await fetch('http://localhost:3000/filtro-fabricante');
        if (response.ok) {
            const fabricantes = await response.json();

            fabricantes.forEach(fabricante => {
                const option = document.createElement('option');
                option.value = fabricante.FABRICANTE;
                option.textContent = fabricante.FABRICANTE;
                filtroFabricante.appendChild(option);
            });
        } else {
            console.error('Erro ao carregar fabricantes:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao conectar ao servidor:', error);
    }
});

function atualizarTabela(dados) {
    const tbody = document.querySelector('#tabela-estoque tbody');
    tbody.innerHTML = '';

    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Nenhum produto encontrado</td></tr>';
        return;
    }

    dados.forEach(produto => {
        const row = `
            <tr>
                <td>${produto.CODIGO}</td>
                <td>${produto.NOME_BASICO}</td>
                <td>${produto.DESCRICAO_TECNICA}</td>
                <td>${produto.QUANT}</td>
                <td>${produto.CATEGORIA}</td>
                <td>${produto.FABRICANTE}</td>
            </tr>`;
        tbody.innerHTML += row;
    });
}


function atualizarTabela(dados) {
    const tbody = document.querySelector('#tabela-estoque tbody');
    tbody.innerHTML = '';

    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Nenhum produto encontrado</td></tr>';
        return;
    }

    dados.forEach(produto => {
        const row = `
            <tr>
                <td>${produto.CODIGO}</td>
                <td>${produto.NOME_BASICO}</td>
                <td>${produto.DESCRICAO_TECNICA}</td>
                <td>${produto.QUANT}</td>
                <td>${produto.CATEGORIA}</td>
                <td>${produto.FABRICANTE}</td>
            </tr>`;
        tbody.innerHTML += row;
    });
}


     