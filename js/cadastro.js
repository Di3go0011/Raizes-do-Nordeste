document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formCadastro");
    const mensagem = document.getElementById("mensagem");

    if (!formulario) return;

    formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        const elNome = document.getElementById("nome");
        const elTelefone = document.getElementById("telefone");
        const elEmail = document.getElementById("email");
        const elSenha = document.getElementById("senha");
        const elConfirmarSenha = document.getElementById("confirmarSenha");

        const nome = elNome ? elNome.value.trim() : "";
        const telefone = elTelefone ? elTelefone.value.trim() : "";
        const email = elEmail ? elEmail.value.trim().toLowerCase() : "";
        const senha = elSenha ? elSenha.value : "";
        const confirmarSenha = elConfirmarSenha ? elConfirmarSenha.value : "";

        // Validação básica
        if (!nome || !telefone || !email || !senha || !confirmarSenha) {
            exibirMensagem("Preencha todos os campos!", "warning");
            return;
        }

        // Validação de confirmação de senha
        if (senha !== confirmarSenha) {
            exibirMensagem("As senhas não coincidem!", "danger");
            return;
        }

        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
            if (!Array.isArray(usuarios)) usuarios = [];
        } catch (erro) {
            usuarios = [];
        }

        // Verifica duplicidade de e-mail
        const jaExiste = usuarios.some(u => String(u.email || "").trim().toLowerCase() === email);
        if (jaExiste) {
            exibirMensagem("Este e-mail já está cadastrado.", "danger");
            return;
        }

        // Salva novo usuário
        usuarios.push({
            nome: nome,
            telefone: telefone,
            email: email,
            senha: senha
        });

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        exibirMensagem("Conta criada com sucesso! Redirecionando para o login...", "success");

        // Redireciona para a página de login
        setTimeout(function () {
            window.location.href = "login.html";
        }, 1200);
    });

    function exibirMensagem(texto, tipo) {
        if (mensagem) {
            mensagem.innerHTML = `<div class="alert alert-${tipo}">${texto}</div>`;
        } else {
            alert(texto);
        }
    }
});