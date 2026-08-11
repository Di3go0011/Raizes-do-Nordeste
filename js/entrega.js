document.addEventListener("DOMContentLoaded", function () {
    calcularResumo();
    configurarFormulario();
});

function lerCarrinho() {
    try {
        const dados = JSON.parse(localStorage.getItem("carrinho") || "[]");
        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        return [];
    }
}

function dinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Preenche a barra lateral de Resumo com o valor do carrinho
function calcularResumo() {
    const carrinho = lerCarrinho();
    const subtotal = carrinho.reduce((acc, item) => acc + ((Number(item.preco) || 0) * (Number(item.quantidade) || 1)), 0);
    const taxa = subtotal > 0 ? 5 : 0;
    const total = subtotal + taxa;

    const elSubtotal = document.getElementById("subtotal");
    const elTaxa = document.getElementById("taxaEntrega");
    const elTotal = document.getElementById("total");

    if (elSubtotal) elSubtotal.textContent = `R$ ${dinheiro(subtotal)}`;
    if (elTaxa) elTaxa.textContent = `R$ ${dinheiro(taxa)}`;
    if (elTotal) elTotal.textContent = `R$ ${dinheiro(total)}`;
}

// Ao clicar em Confirmar Pedido, salva o pedido e vai para a simulação de status
function configurarFormulario() {
    // Se o botão/formulário estiver dentro de uma tag <form> ou for um botão simples
    const btnConfirmar = document.querySelector("button.btn-warning") || document.querySelector("button[type='submit']");
    
    if (!btnConfirmar) return;

    btnConfirmar.addEventListener("click", function (e) {
        e.preventDefault();

        const carrinho = lerCarrinho();
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            window.location.href = "../index.html";
            return;
        }

        // Salva os dados do pedido em andamento no localStorage
        const pedido = {
            id: Math.floor(100000 + Math.random() * 900000),
            data: new Date().toLocaleDateString("pt-BR"),
            itens: carrinho,
            status: "Pedido Recebido"
        };

        localStorage.setItem("pedidoAtivo", JSON.stringify(pedido));
        
        // Limpa o carrinho após confirmar
        localStorage.removeItem("carrinho");

        // Redireciona para a tela de acompanhamento/status do pedido
        window.location.href = "status.html";
    });
}