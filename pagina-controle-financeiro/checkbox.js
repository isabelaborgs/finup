document.addEventListener("DOMContentLoaded", function() {
    const transactionTables = document.querySelectorAll(".static-table tbody");

    // Função para adicionar a coluna de status com checkbox para cada nova linha
    function addCheckboxToRow(row) {
        // Cria uma nova célula para a coluna de Status
        const statusCell = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("status-checkbox");

        // Adiciona o checkbox à célula
        statusCell.appendChild(checkbox);
        row.insertBefore(statusCell, row.children[3]); // Insere na posição certa

        // Listener para alternar entre marcado e não marcado
        checkbox.addEventListener("change", function() {
            if (checkbox.checked) {
                row.classList.add("resolved");
            } else {
                row.classList.remove("resolved");
            }
        });
    }

    // Inicializa a checkbox para todas as linhas existentes nas tabelas de cada categoria
    transactionTables.forEach(tbody => {
        Array.from(tbody.rows).forEach(row => addCheckboxToRow(row));
    });

    // Observador para detectar e adicionar a checkbox em novas linhas
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.tagName === "TR") {
                    addCheckboxToRow(node);
                }
            });
        });
    });

    // Configura o observador para cada tabela de categoria
    transactionTables.forEach(tbody => {
        observer.observe(tbody, { childList: true });
    });
});

// statusCheckbox.js
document.addEventListener("DOMContentLoaded", function() {
    const tables = document.querySelectorAll(".static-table");

    // Carregar status salvo ao carregar a página
    tables.forEach((table, tableIndex) => {
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach((row, rowIndex) => {
            const checkbox = row.querySelector(".status-checkbox");
            const storageKey = `status-${tableIndex}-${rowIndex}`;

            if (localStorage.getItem(storageKey) === "true") {
                checkbox.checked = true;
            }

            // Salvar status sempre que a checkbox é alterada
            checkbox.addEventListener("change", function() {
                localStorage.setItem(storageKey, checkbox.checked);
            });
        });
    });
});