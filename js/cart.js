(function () {
    "use strict";

    function lerJSON(chave, padrao) {
        try {
            const valor = localStorage.getItem(chave);
            if (!valor) return padrao;
            const dados = JSON.parse(valor);
            return dados ?? padrao;
        } catch (erro) {
            console.warn("Dados inválidos no localStorage:", chave, erro);
            localStorage.removeItem(chave);
            return padrao;
        }
    }

    function salvarCarrinho(carrinho) {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
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

    window.adicionarAoCarrinho = function (nome, preco) {
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
        alert(String(nome) + " foi adicionado ao carrinho!");
    };

    window.atualizarContador = function () {
        const contador = document.getElementById("contadorCarrinho");
        if (!contador) return;
        const quantidade = getCarrinho().reduce((total, item) => total + item.quantidade, 0);
        contador.textContent = quantidade;
        contador.style.display = quantidade > 0 ? "inline-block" : "none";
    };

   window.logout = function () {
    // Limpa a fidelidade se a função existir
    if (typeof window.zerarFidelidadeLogout === "function") {
        window.zerarFidelidadeLogout();
    } else {
        localStorage.removeItem("selosFidelidade");
        sessionStorage.removeItem("selosFidelidade");
    }

    sessionStorage.removeItem("usuarioLogado");
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("carrinho");
    
    window.atualizarContador();
    
    const caminhoHome = window.location.pathname.includes("/html/") ? "../index.html" : "index.html";
    window.location.href = caminhoHome;
};

    function atualizarMenuUsuario() {
        const menu = document.getElementById("menu-usuario");
        if (!menu) return;

        // Tenta ler primeiro do sessionStorage
        let usuario = null;
        try {
            usuario = JSON.parse(sessionStorage.getItem("usuarioLogado") || "null");
        } catch (e) {
            usuario = null;
        }

        // Se NÃO estiver logado no sessionStorage, garante o botão de "Criar Conta / Entrar"
        if (!usuario || !usuario.nome) {
            const caminhoLogin = window.location.pathname.includes("/html/") ? "login.html" : "html/login.html";
            const caminhoCadastro = window.location.pathname.includes("/html/") ? "cadastro.html" : "html/cadastro.html";

            menu.innerHTML = `
                <a href="${caminhoCadastro}" class="btn btn-outline-warning me-2">Criar Conta</a>
                <a href="${caminhoLogin}" class="btn btn-warning">Entrar</a>
            `;
            return;
        }

        // Se estiver logado, exibe o nome do usuário
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
        // Limpeza de segurança: remove do localStorage logins antigos gravados antes da mudança
        localStorage.removeItem("usuarioLogado");

        atualizarContador();
        atualizarMenuUsuario();
    });
})();