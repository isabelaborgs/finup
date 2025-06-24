document.addEventListener("DOMContentLoaded", function() {
    const submitTransactionButton = document.getElementById("submit-transaction");
    const categoryDropdown = document.getElementById("category");

    // Resetar o formulário para garantir campos em branco
    function resetForm() {
        document.getElementById("description").value = "";
        document.getElementById("value").value = "";
        document.getElementById("date").value = "";
        categoryDropdown.selectedIndex = 0;
    }

    // Lidar com o envio de receita/despesa
    submitTransactionButton.addEventListener("click", function() {
        const description = document.getElementById("description").value;
        const value = document.getElementById("value").value;
        const date = document.getElementById("date").value;
        const selectedCategory = categoryDropdown.value;

        // Localizar a categoria selecionada para inserir os dados
        const categoryDiv = document.querySelector(`.category[data-category="${selectedCategory}"]`);
        const staticTableBody = categoryDiv.querySelector(".static-table tbody");

        // Inserir nova linha na tabela estática da categoria
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${description}</td>
            <td>${value}</td>
            <td>${date}</td>
            <td><button class="btn remove-entry">Remover</button></td>
        `;
        staticTableBody.appendChild(newRow);
        resetForm();
    });

    // Lógica para remover entradas na tabela estática de uma categoria
    document.querySelectorAll(".static-table tbody").forEach(tbody => {
        tbody.addEventListener("click", function(event) {
            if (event.target.classList.contains("remove-entry")) {
                const row = event.target.closest("tr");
                row.remove();
            }
        });
    });
});

