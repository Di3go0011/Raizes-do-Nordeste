document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formLogin");
    const mensagem = document.getElementById("mensagem");

    if (!formulario) return;

    formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const senha = document.getElementById("senha").value;

        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
            if (!Array.isArray(usuarios)) usuarios = [];
        } catch (erro) {
            usuarios = [];
        }

        const usuario = usuarios.find(function (u) {
            return String(u.email || "").trim().toLowerCase() === email && String(u.senha || "") === senha;
        });

        if (!usuario) {
            if (mensagem) {
                mensagem.innerHTML = '<div class="alert alert-danger">Email ou senha inválidos.</div>';
            } else {
                alert("Email ou senha inválidos.");
            }
            return;
        }

        // Salva a sessão ativa
        sessionStorage.setItem("usuarioLogado", JSON.stringify({
            nome: usuario.nome,
            email: usuario.email
        }));

        if (mensagem) {
            mensagem.innerHTML = '<div class="alert alert-success">Login realizado com sucesso! Redirecionando...</div>';
        }

        setTimeout(function () {
            window.location.href = "../index.html";
        }, 500);
    });
});