document.addEventListener("DOMContentLoaded", function () {
    const filmeInput = document.getElementById("filme-input");
    const dataInput = document.getElementById("data-filme");
    const generoInput = document.getElementById("genero-filme");
    const imagemInput = document.getElementById("arquivo");

    const adicionarBtn = document.getElementById("add-filme");
    const toggleThemeBtn = document.getElementById("toggle-theme");
    const listaFilmes = document.getElementById("lista-filmes");
    const filter = document.querySelectorAll(".filter");

    let filmes = JSON.parse(localStorage.getItem("filmes")) || [];
    let theme = localStorage.getItem("theme") || "dark";

    if (theme === "light") {
        document.body.classList.add("light-mode");
    }

    toggleThemeBtn.addEventListener("click", function () {
        document.body.classList.toggle("light-mode");
        theme = document.body.classList.contains("light-mode") ? "light" : "dark";
        localStorage.setItem("theme", theme);
    });

    function saveFilmes() {
        localStorage.setItem("filmes", JSON.stringify(filmes));
    }

    function renderFilmes(currentFilter = "all") {
        listaFilmes.innerHTML = "";

        filmes.forEach(function (filme, index) {
            if (currentFilter === "pending" && filme.completed) return;
            if (currentFilter === "completed" && !filme.completed) return;

            const li = document.createElement("li");

            const statusClass = filme.completed ? "completed" : "";

            li.innerHTML = `
                <div class="filme-item ${statusClass}">
                    <img class="filme-img" src="${filme.imagem || 'img/default.jpg'}" alt="Imagem do filme">
                    <div class="filme-info">
                        <strong>${filme.text || 'Sem título'}</strong><br>
                        <span>${filme.genero || 'sem gênero'} - ${filme.data || 'sem data'}</span>
                    </div>
                    <div class="filme-actions">
                        <button class="watched"><img class="btnFilmes" src="${filme.completed ? 'img/done_yellow.svg' : 'img/done.svg'}"></button>
                        <button class="edit"><img class="btnFilmes" src="img/edit_note.svg"></button>
                        <button class="delete"><img class="btnFilmes" src="img/close.svg"></button>
                    </div>
                </div>
            `;

            // Marcar como assistido
            li.querySelector(".watched").addEventListener("click", function () {
                filme.completed = !filme.completed;
                saveFilmes();
                renderFilmes(currentFilter);
            });

            // Editar
            li.querySelector(".edit").addEventListener("click", function () {
                const novoNome = prompt("Novo nome do filme:", filme.text);
                const novoGenero = prompt("Novo gênero:", filme.genero);
                const novaData = prompt("Nova data (aaaa-mm-dd):", filme.data);

                if (novoNome) filme.text = novoNome;
                if (novoGenero) filme.genero = novoGenero;
                if (novaData) filme.data = novaData;

                saveFilmes();
                renderFilmes(currentFilter);
            });

            // Deletar
            li.querySelector(".delete").addEventListener("click", function () {
                filmes.splice(index, 1);
                saveFilmes();
                renderFilmes(currentFilter);
            });

            listaFilmes.appendChild(li);
        });
    }

    adicionarBtn.addEventListener("click", function () {
        const text = filmeInput.value.trim();
        const genero = generoInput.value.trim();
        const data = dataInput.value;
        const file = imagemInput.files[0];

        if (!text) return;

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                filmes.push({
                    text: text,
                    genero: genero,
                    data: data,
                    imagem: e.target.result,
                    completed: false
                });
                saveFilmes();
                renderFilmes();
            };
            reader.readAsDataURL(file);
        } else {
            filmes.push({
                text: text,
                genero: genero,
                data: data,
                imagem: "",
                completed: false
            });
            saveFilmes();
            renderFilmes();
        }

        // Limpar inputs
        filmeInput.value = "";
        generoInput.value = "";
        dataInput.value = "";
        imagemInput.value = "";
    });

    filter.forEach(function (button) {
        button.addEventListener("click", function () {
            filter.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            renderFilmes(button.dataset.filter);
        });
    });

    renderFilmes();
});
