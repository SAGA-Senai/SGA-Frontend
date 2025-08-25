   
//FILTRO TA INTERNO PQ NÃO ACHEI O edicao.js ACHEI MELHOR POR AQUI
//SE FUNCIOANAR DEIXO AI E DEPOIS NOIS ARRUMO


document.getElementById('filtrarBtn').addEventListener('click', function () {
    const caixote = document.getElementById('caixote');
    
    // Alterna a classe 'active' para mostrar ou esconder o formulário de filtro
    caixote.classList.toggle('active');
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
//   muda o botao
function activateButton(clickedButton) {
const buttons = document.querySelectorAll('.botoes'); 
buttons.forEach(button => button.classList.remove('clicked')); 
clickedButton.classList.add('clicked');}


//---------------------LIMPAR FILTRO

function limparFiltros() {
    document.getElementById('ordenacao').value = '';
    document.getElementById('fabricante').value = '';
    document.getElementById('codigo').value = '';
}
function tirarFiltro(){
    document.getElementById('ordenacao').value = '';
    document.getElementById('fabricante').value = '';
    
}