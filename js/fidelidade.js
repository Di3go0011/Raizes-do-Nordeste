// Helper para obter o usuário de qualquer storage
function getUsuarioLogado() {
    try {
        const sessao = sessionStorage.getItem("usuarioLogado");
        if (sessao) return JSON.parse(sessao);
        const local = localStorage.getItem("usuarioLogado");
        if (local) return JSON.parse(local);
    } catch (e) {
        return null;
    }
    return null;
}

function atualizarVisualFidelidade() {
    const usuarioLogado = getUsuarioLogado();

    // Se não estiver logado, garante que a chave do storage seja limpa
    if (!usuarioLogado) {
        localStorage.removeItem("selosFidelidade");
        sessionStorage.removeItem("selosFidelidade");
    }

    // Recupera a quantidade de selos apenas se estiver logado
    const selos = usuarioLogado
        ? parseInt(localStorage.getItem("selosFidelidade")) || 0
        : 0;

    // Atualiza o contador do topo
    const badgeTopo = document.getElementById("badgeSelosTopo");
    if (badgeTopo) {
        badgeTopo.innerText = `${selos} / 5 Selos`;
    }

    // Atualiza os 5 selos visuais
    for (let i = 1; i <= 5; i++) {
        const elSelo = document.getElementById(`selo-${i}`);
        if (!elSelo) continue;

        const icone = elSelo.querySelector("i");
        if (!icone) continue;

        if (i <= selos) {
            elSelo.classList.add("selo-ativo");
            icone.className = i === 5 
                ? "fa-solid fa-gift fa-2x text-warning" 
                : "fa-solid fa-ticket fa-2x text-warning";
        } else {
            elSelo.classList.remove("selo-ativo");
            icone.className = i === 5 
                ? "fa-solid fa-gift fa-2x text-muted" 
                : "fa-solid fa-ticket fa-2x text-muted";
        }
    }

    // Alerta/Mensagem de 5 selos
    const alerta = document.getElementById("alertaDescontoModal");
    if (alerta) {
        if (selos >= 5 && usuarioLogado) {
            alerta.classList.remove("d-none");
        } else {
            alerta.classList.add("d-none");
        }
    }
}

function adicionarSeloCompra() {
    const usuarioLogado = getUsuarioLogado();

    if (!usuarioLogado) {
        alert("Você precisa estar logado para ganhar selos.");
        return 0;
    }

    let selos = parseInt(localStorage.getItem("selosFidelidade")) || 0;

    if (selos >= 5) {
        selos = 1;
    } else {
        selos++;
    }

    localStorage.setItem("selosFidelidade", selos);
    atualizarVisualFidelidade();
    return selos;
}

window.zerarFidelidadeLogout = function () {
    localStorage.removeItem("selosFidelidade");
    sessionStorage.removeItem("selosFidelidade");
    localStorage.removeItem("usuarioLogado");
    sessionStorage.removeItem("usuarioLogado");
    
    atualizarVisualFidelidade();
};