// Dados das unidades da rede
// Dados das unidades da rede
const UNIDADES = [
    {
        id: "recife",
        nome: "Recife - Boa Viagem",
        endereco: "Av. Conselheiro Aguiar, 1440 • Boa Viagem",
        status: "Aberta",
        nota: 4.8,
        tempo: "20 a 30 min",
        frete: 7.90,
        imagem: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "olinda",
        nome: "Olinda - Carmo",
        endereco: "Praça do Carmo, 100 • Carmo",
        status: "Aberta",
        nota: 4.9,
        tempo: "25 a 35 min",
        frete: 6.50,
        // URL direta para imagem de praia/coqueiros no Unsplash
        imagem: "https://www.maladeaventuras.com/wp-content/uploads/2020/07/igreja-da-se-olinda.jpg"
    },
    {
        id: "jaboatao",
        nome: "Jaboatão - Piedade",
        endereco: "Av. Bernardo Vieira de Melo, 2200 • Piedade",
        status: "Aberta",
        nota: 4.7,
        tempo: "20 a 30 min",
        frete: 8.00,
        imagem: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=600&q=80"
    }
];

// Cardápio filtrado por unidade (IDs permitidos)
const PRODUTOS = [
    { id: 1, nome: "Escondidinho da Casa", preco: 35.90, categoria: "Pratos Principais", unidades: ["recife", "salvador", "fortaleza"] },
    { id: 2, nome: "Combo Família Fortaleza", preco: 72.90, categoria: "Combos", unidades: ["fortaleza"] },
    { id: 3, nome: "Cartola Pernambucana", preco: 18.00, categoria: "Sobremesas", unidades: ["recife"] },
    { id: 4, nome: "Acarajé Especial", preco: 22.00, categoria: "Pratos Principais", unidades: ["salvador"] },
    { id: 5, nome: "Dadinhos de Tapioca", preco: 24.90, categoria: "Acompanhamentos", unidades: ["recife", "salvador", "fortaleza"] },
    { id: 6, nome: "Pudim de Tapioca", preco: 16.00, categoria: "Sobremesas", unidades: ["fortaleza", "recife"] }
];

function selecionarUnidade(idUnidade) {
    const unidade = UNIDADES.find(u => u.id === idUnidade);
    if (!unidade) return;

    // Se trocar de unidade, limpa o carrinho anterior para evitar mistura de itens
    const unidadeAtual = sessionStorage.getItem("unidadeSelecionada");
    if (unidadeAtual && JSON.parse(unidadeAtual).id !== idUnidade) {
        sessionStorage.removeItem("carrinho");
    }

    sessionStorage.setItem("unidadeSelecionada", JSON.stringify(unidade));
    
    // Esconde a seleção e exibe o cardápio regional
    document.getElementById("secaoUnidades").style.display = "none";
    document.getElementById("secaoCardapio").style.display = "block";
    
    renderizarProdutosPorUnidade(idUnidade);
    atualizarResumoUnidade(unidade);
}

function renderizarProdutosPorUnidade(idUnidade) {
    const container = document.getElementById("gridProdutos");
    if (!container) return;

    const produtosFiltrados = PRODUTOS.filter(p => p.unidades.includes(idUnidade));
    
    container.innerHTML = produtosFiltrados.map(prod => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow-sm border-0">
                <div class="card-body">
                    <span class="badge bg-warning text-dark mb-2">${prod.categoria}</span>
                    <h5 class="card-title fw-bold">${prod.nome}</h5>
                    <p class="fs-5 fw-bold text-dark mt-3">R$ ${prod.preco.toFixed(2).replace('.', ',')}</p>
                    <button class="btn btn-warning w-100" onclick="adicionarAoCarrinho('${prod.nome}', ${prod.preco})">
                        Adicionar ao pedido
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function atualizarResumoUnidade(unidade) {
    const elInfo = document.getElementById("infoUnidadeAtual");
    if (elInfo) {
        elInfo.innerHTML = `<strong>Unidade:</strong> ${unidade.nome} (Frete R$ ${unidade.frete.toFixed(2).replace('.', ',')})`;
    }
}