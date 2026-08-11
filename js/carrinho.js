(function () {
    "use strict";

    // --- LER E SALVAR SESSÃO E CARRINHO ---
    function getUsuario() {
        try {
            const usuario = sessionStorage.getItem("usuarioLogado");
            return usuario ? JSON.parse(usuario) : null;
        } catch (e) {
            return null;
        }
    }

    function lerJSON(chave, padrao) {
        try {
            const valor = sessionStorage.getItem(chave);
            if (!valor) return padrao;
            return JSON.parse(valor) ?? padrao;
        } catch (erro) {
            return padrao;
        }
    }

    function salvarCarrinho(carrinho) {
        sessionStorage.setItem("carrinho", JSON.stringify(carrinho));
    }

    function getCarrinho() {
        const dados = lerJSON("carrinho", []);
        if (!Array.isArray(dados)) return [];
        return dados.map(item => ({
            nome: String(item.nome || "Produto"),
            preco: Number(item.preco) || 0,
            quantidade: Math.max(1, Number(item.quantidade) || 1)
        }));
    }

    function dinheiro(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // --- CONTADOR DO CARRINHO ---
    window.atualizarContador = function () {
        const contador = document.getElementById("contadorCarrinho");
        if (!contador) return;

        const carrinho = getCarrinho();
        const quantidadeTotal = carrinho.reduce((total, item) => total + item.quantidade, 0);

        contador.textContent = quantidadeTotal;
        contador.style.display = quantidadeTotal > 0 ? "inline-block" : "none";
    };

    // --- PROTEÇÃO DE NAVEGAÇÃO / ROTAS ---
    function verificarAutenticacao() {
        const usuario = getUsuario();
        const paginaAtual = window.location.pathname.toLowerCase();

        const paginasProtegidas = ["carrinho.html", "checkout.html", "status.html"];
        const precisaDeLogin = paginasProtegidas.some(p => paginaAtual.endsWith(p));

        if (precisaDeLogin && (!usuario || !usuario.nome)) {
            const caminhoLogin = paginaAtual.includes("/html/") ? "login.html" : "html/login.html";
            window.location.href = caminhoLogin;
            return false;
        }
        return true;
    }

    // --- MANIPULAÇÃO DO CARRINHO ---
    window.adicionarAoCarrinho = function (nome, preco) {
        const usuario = getUsuario();
        
        if (!usuario || !usuario.nome) {
            alert("Você precisa estar logado para adicionar produtos ao carrinho!");
            const caminhoLogin = window.location.pathname.includes("/html/") ? "login.html" : "html/login.html";
            window.location.href = caminhoLogin;
            return;
        }

        const carrinho = getCarrinho();
        const valor = Number(preco);
        if (!nome || !Number.isFinite(valor)) {
            alert("Não foi possível adicionar este produto.");
            return;
        }

        const item = carrinho.find(p => p.nome === String(nome));
        if (item) {
            item.quantidade += 1;
        } else {
            carrinho.push({ nome: String(nome), preco: valor, quantidade: 1 });
        }

        salvarCarrinho(carrinho);
        atualizarContador();
        renderizarCarrinho();
        alert(String(nome) + " foi adicionado ao carrinho!");
    };

    window.alterarQuantidade = function (nome, delta) {
        let carrinho = getCarrinho();
        const item = carrinho.find(p => p.nome === nome);
        
        if (item) {
            item.quantidade += delta;
            if (item.quantidade <= 0) {
                carrinho = carrinho.filter(p => p.nome !== nome);
            }
            salvarCarrinho(carrinho);
            atualizarContador();
            renderizarCarrinho();
        }
    };

    window.removerItem = function (nome) {
        let carrinho = getCarrinho();
        carrinho = carrinho.filter(p => p.nome !== nome);
        salvarCarrinho(carrinho);
        atualizarContador();
        renderizarCarrinho();
    };

    window.limparCarrinho = function () {
        const carrinho = getCarrinho();
        if (carrinho.length === 0) {
            alert("O carrinho já está vazio.");
            return;
        }

        if (confirm("Tem certeza que deseja esvaziar o carrinho?")) {
            sessionStorage.removeItem("carrinho");
            atualizarContador();
            renderizarCarrinho();
        }
    };

    // --- RENDERIZAR TELA DO CARRINHO ---
    function renderizarCarrinho() {
        const containerItens = document.getElementById("listaCarrinho") || document.getElementById("itensCarrinho");
        const elSubtotal = document.getElementById("subtotal");
        const elEntrega = document.getElementById("taxaEntrega") || document.getElementById("entrega");
        const elTotal = document.getElementById("total");
        const btnFinalizar = document.getElementById("btnFinalizar");

        if (!containerItens) return;

        const carrinho = getCarrinho();

        if (carrinho.length === 0) {
            containerItens.innerHTML = `
                <div class="text-center py-5 bg-white rounded shadow-sm">
                    <p class="text-muted fs-5 mb-3">Seu carrinho está vazio.</p>
                    <a href="../index.html" class="btn btn-warning">Ver Cardápio</a>
                </div>`;
            if (elSubtotal) elSubtotal.textContent = "0,00";
            if (elEntrega) elEntrega.textContent = "0,00";
            if (elTotal) elTotal.textContent = "0,00";
            if (btnFinalizar) btnFinalizar.classList.add("disabled");
            return;
        }

        if (btnFinalizar) btnFinalizar.classList.remove("disabled");

        let subtotal = 0;
        containerItens.innerHTML = "";

        carrinho.forEach(item => {
            const totalItem = item.preco * item.quantidade;
            subtotal += totalItem;

            containerItens.innerHTML += `
                <div class="card mb-3 shadow-sm">
                    <div class="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <h5 class="mb-1 fw-bold">${escapeHtml(item.nome)}</h5>
                            <span class="text-muted">R$ ${dinheiro(item.preco)} cada</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-secondary" type="button" onclick="alterarQuantidade('${escapeHtml(item.nome)}', -1)">-</button>
                            <span class="fw-bold px-2">${item.quantidade}</span>
                            <button class="btn btn-sm btn-outline-secondary" type="button" onclick="alterarQuantidade('${escapeHtml(item.nome)}', 1)">+</button>
                        </div>
                        <div class="text-end">
                            <strong class="d-block fs-5">R$ ${dinheiro(totalItem)}</strong>
                            <button class="btn btn-sm btn-link text-danger p-0" type="button" onclick="removerItem('${escapeHtml(item.nome)}')">Remover</button>
                        </div>
                    </div>
                </div>`;
        });

        const taxaEntrega = subtotal > 0 ? 5.00 : 0;
        const totalGeral = subtotal + taxaEntrega;

        if (elSubtotal) elSubtotal.textContent = dinheiro(subtotal);
        if (elEntrega) elEntrega.textContent = dinheiro(taxaEntrega);
        if (elTotal) elTotal.textContent = dinheiro(totalGeral);
    }

    window.logout = function () {
    // Limpa a fidelidade se a função existir
    if (typeof window.zerarFidelidadeLogout === "function") {
        window.zerarFidelidadeLogout();
    } else {
        localStorage.removeItem("selosFidelidade");
        sessionStorage.removeItem("selosFidelidade");
    }

    sessionStorage.clear();
    localStorage.removeItem("carrinho");
    localStorage.removeItem("usuarioLogado");
    
    window.atualizarContador();
    
    const caminhoHome = window.location.pathname.includes("/html/") ? "../index.html" : "index.html";
    window.location.href = caminhoHome;
};
    function atualizarMenuUsuario() {
    const menu = document.getElementById("menu-usuario");
    if (!menu) return;

    const usuario = getUsuario();

    if (!usuario || !usuario.nome) {
        // Detecta se a página atual já está dentro do diretório /html/
        const emHtml = window.location.pathname.toLowerCase().includes("/html/");
        
        const caminhoLogin = emHtml ? "login.html" : "html/login.html";
        const caminhoCadastro = emHtml ? "cadastro.html" : "html/cadastro.html";

        menu.innerHTML = `
            <a href="${caminhoCadastro}" class="btn btn-outline-warning me-2">Criar Conta</a>
            <a href="${caminhoLogin}" class="btn btn-warning">Entrar</a>
        `;
        return;
    }

    const primeiroNome = String(usuario.nome).trim().split(/\s+/)[0];
    menu.innerHTML = `
        <button type="button" class="btn btn-warning" onclick="logout()">
            Olá, ${escapeHtml(primeiroNome)} · Sair
        </button>`;
}

    function escapeHtml(texto) {
        const div = document.createElement("div");
        div.textContent = texto;
        return div.innerHTML;
    }

    document.addEventListener("DOMContentLoaded", function () {
        if (verificarAutenticacao()) {
            atualizarContador();
            atualizarMenuUsuario();
            renderizarCarrinho();
        }
    });

// PROGRAMA DE FIDELIDADE (SELOS)

// Atualiza a exibição dos selos no Modal e no Badge do Card inicial
function atualizarVisualFidelidade() {
    let selos = parseInt(localStorage.getItem("selosFidelidade")) || 0;
    
    // Atualiza o contador do card no topo
    const badgeTopo = document.getElementById("badgeSelosTopo");
    if (badgeTopo) badgeTopo.innerText = `${selos} / 5 Selos`;

    // Atualiza os ícones dentro do modal
    for (let i = 1; i <= 5; i++) {
        const elSelo = document.getElementById(`selo-${i}`);
        if (elSelo) {
            const icone = elSelo.querySelector("i");
            if (i <= selos) {
                elSelo.classList.add("selo-ativo");
                icone.className = i === 5 ? "fa-solid fa-gift fa-2x text-warning" : "fa-solid fa-ticket fa-2x text-warning";
            } else {
                elSelo.classList.remove("selo-ativo");
                icone.className = i === 5 ? "fa-solid fa-gift fa-2x text-muted" : "fa-solid fa-ticket fa-2x text-muted";
            }
        }
    }

    // Alerta de 5 selos atingidos
    const alerta = document.getElementById("alertaDescontoModal");
    if (alerta) {
        if (selos >= 5) alerta.classList.remove("d-none");
        else alerta.classList.add("d-none");
    }
}

// Soma +1 selo no fechamento da compra
function adicionarSeloCompra() {
    let selos = parseInt(localStorage.getItem("selosFidelidade")) || 0;
    
    if (selos >= 5) {
        selos = 1; // Reinicia a rodada se já usou o prêmio
    } else {
        selos += 1;
    }

    localStorage.setItem("selosFidelidade", selos);
    atualizarVisualFidelidade();
    return selos;
}

// Evento ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    atualizarVisualFidelidade();

    // Captura a confirmação do pedido
    const formCheckout = document.getElementById("formCheckout");
    if (formCheckout) {
        formCheckout.addEventListener("submit", (e) => {
            e.preventDefault();

            // Adiciona o selo e pega a nova quantidade
            const novosSelos = adicionarSeloCompra();

            // Mensagem de sucesso informando o selo ganho
            if (novosSelos === 5) {
                alert("🎉 Pedido Confirmado!\n\nVocê ganhou +1 selo e completou 5 selos! Ganhou 15% de desconto para o próximo pedido!");
            } else {
                alert(`✅ Pedido Confirmado!\n\nVocê ganhou +1 selo no seu Cartão Fidelidade! (Total: ${novosSelos}/5)`);
            }
        });
    }
});

})();