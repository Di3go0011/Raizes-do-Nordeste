document.addEventListener("DOMContentLoaded", function () {
    carregarResumoCheckout();
    configurarFormulario();

    // Evento para recalcular ao alterar a forma de pagamento (Pix)
    const selectPagamento = document.getElementById("pagamento");
    if (selectPagamento) {
        selectPagamento.addEventListener("change", carregarResumoCheckout);
    }

    // Evento para recalcular ao alterar o tipo de recebimento (Entrega/Retirada)
    const selectTipoEntrega = document.getElementById("tipoEntrega");
    if (selectTipoEntrega) {
        selectTipoEntrega.addEventListener("change", function () {
            alternarCamposEndereco();
            carregarResumoCheckout();
        });
    }
});

function lerCarrinho() {
    try {
        const dados = JSON.parse(sessionStorage.getItem("carrinho") || "[]");
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

function alternarCamposEndereco() {
    const tipoEntrega = document.getElementById("tipoEntrega")?.value;
    const camposEndereco = ["rua", "numero", "bairro", "cidade", "complemento"];
    
    camposEndereco.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (tipoEntrega === "retirada") {
                el.removeAttribute("required");
                el.closest(".col-md-8, .col-md-4, .col-md-6, .mb-3")?.classList.add("opacity-50");
            } else {
                if (id !== "complemento") el.setAttribute("required", "true");
                el.closest(".col-md-8, .col-md-4, .col-md-6, .mb-3")?.classList.remove("opacity-50");
            }
        }
    });
}

function carregarResumoCheckout() {
    const carrinho = lerCarrinho();
    const resumoItens = document.getElementById("resumoItens");
    const elSubtotal = document.getElementById("subtotal");
    const elEntrega = document.getElementById("entrega");
    const elTotal = document.getElementById("total");
    const selectPagamento = document.getElementById("pagamento");
    const selectTipoEntrega = document.getElementById("tipoEntrega");
    
    const linhaDescontoPix = document.getElementById("linhaDescontoPix");
    const elDescontoPix = document.getElementById("descontoPix");

    if (!resumoItens) return;

    if (carrinho.length === 0) {
        resumoItens.innerHTML = '<p class="text-muted">Nenhum item no carrinho.</p>';
        if (elSubtotal) elSubtotal.textContent = "0,00";
        if (elEntrega) elEntrega.textContent = "0,00";
        if (elTotal) elTotal.textContent = "0,00";
        if (linhaDescontoPix) linhaDescontoPix.classList.add("d-none");
        return;
    }

    let subtotal = 0;
    resumoItens.innerHTML = "";

    carrinho.forEach(item => {
        const qtd = Number(item.quantidade) || 1;
        const preco = Number(item.preco) || 0;
        const totalItem = preco * qtd;
        subtotal += totalItem;

        resumoItens.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <span class="fw-bold">${item.nome}</span>
                    <small class="text-muted d-block">${qtd}x R$ ${dinheiro(preco)}</small>
                </div>
                <span>R$ ${dinheiro(totalItem)}</span>
            </div>
        `;
    });

    // Calcula taxa de entrega: R$ 5,00 se for Entrega; R$ 0,00 se for Retirada
    const tipoEntrega = selectTipoEntrega ? selectTipoEntrega.value : "entrega";
    const taxaEntrega = (subtotal > 0 && tipoEntrega === "entrega") ? 5.00 : 0;
    
    // Lógica do Desconto Pix (10% sobre o subtotal)
    let descontoPix = 0;
    const formaPagamento = selectPagamento ? selectPagamento.value : "";

    if (formaPagamento === "Pix") {
        descontoPix = subtotal * 0.10;
        if (linhaDescontoPix) linhaDescontoPix.classList.remove("d-none");
        if (elDescontoPix) elDescontoPix.textContent = dinheiro(descontoPix);
    } else {
        if (linhaDescontoPix) linhaDescontoPix.classList.add("d-none");
    }

    const totalGeral = subtotal + taxaEntrega - descontoPix;

    if (elSubtotal) elSubtotal.textContent = dinheiro(subtotal);
    if (elEntrega) elEntrega.textContent = tipoEntrega === "retirada" ? "Grátis (Retirada)" : dinheiro(taxaEntrega);
    if (elTotal) elTotal.textContent = dinheiro(totalGeral);
}

function configurarFormulario() {
    const form = document.getElementById("formCheckout");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const carrinho = lerCarrinho();
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio! Adicione itens antes de finalizar.");
            window.location.href = "../index.html";
            return;
        }

        const tipoEntrega = document.getElementById("tipoEntrega")?.value || "entrega";

        const pedido = {
            id: Math.floor(100000 + Math.random() * 900000),
            data: new Date().toLocaleDateString("pt-BR"),
            tipoEntrega: tipoEntrega === "retirada" ? "Retirada no Local" : "Entrega em Domicílio",
            endereco: tipoEntrega === "retirada" ? "Retirada na Unidade Selecionada" : {
                rua: document.getElementById("rua").value,
                numero: document.getElementById("numero").value,
                bairro: document.getElementById("bairro").value,
                cidade: document.getElementById("cidade").value,
                complemento: document.getElementById("complemento").value
            },
            pagamento: document.getElementById("pagamento").value,
            observacoes: document.getElementById("observacoes").value,
            itens: carrinho
        };

        sessionStorage.setItem("pedidoAtivo", JSON.stringify(pedido));
        sessionStorage.removeItem("carrinho");

        window.location.href = "status.html";
    });
}