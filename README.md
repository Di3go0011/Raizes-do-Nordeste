# 🌾 Raízes do Nordeste - Sistema Web de Delivery Regional

> **Projeto Multidisciplinar** — Análise e Desenvolvimento de Sistemas (ADS)  
> **Trilha / Ênfase:** Front-End  
> **Unidade Curricular:** Projeto Multidisciplinar

---

## 📌 Sobre o Projeto

O **Raízes do Nordeste** é uma aplicação web desenvolvida para simular a experiência completa de pedido online (*e-commerce/delivery*) de culinária regional nordestina. 

A aplicação permite que o usuário navegue entre diferentes unidades físicas localizadas em Pernambuco (**Recife, Olinda e Jaboatão**), visualize o cardápio exclusivo e filtrado por localidade, gerencie o carrinho de compras dinamicamente, escolha a modalidade de recebimento (Entrega ou Retirada) e simule a finalização com cálculo automático de frete, descontos e acompanhamento de status do pedido.

---

## 🚀 Funcionalidades Principais

* **Seleção Dinâmica de Unidades:** Escolha entre Recife - Boa Viagem, Olinda - Carmo ou Jaboatão - Piedade.
* **Cardápio Filtrado:** Exibição de produtos disponíveis de acordo com a unidade selecionada.
* **Carrinho em Tempo Real:** Adição de itens com recálculo automático de valores e prevenção contra conflitos de itens entre filiais.
* **Checkout Inteligente:**
  * Opção de **Entrega em Domicílio** (taxa fixa de R$ 5,00) ou **Retirada no Local** (Frete Grátis).
  * Aplicação automática de **10% de desconto** para pagamentos via **Pix**.
* **Persistência de Dados Local:** Armazenamento do carrinho e status do pedido ativo utilizando `localStorage` e `sessionStorage` nativos do navegador.
* **Acompanhamento do Pedido:** Geração de código único do pedido e redirecionamento para tela de confirmação/status.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estruturação semântica de páginas e formulários.
* **CSS3 & Bootstrap 5:** Estilização, componentes de interface e *Grid System* para garantia de **Design Responsivo** (adaptável a mobile, tablet e desktop).
* **JavaScript (ES6+):** Manipulação dinâmica do DOM, lógica de negócios do carrinho, cálculo de totais/descontos e persistência de dados.
