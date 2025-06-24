document.addEventListener("DOMContentLoaded", () => {
    loadTransactions();
    loadLimits();
});

function loadTransactions() {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    
    storedTransactions.forEach(transaction => {
        addTransactionToTable(transaction);
    });
}

function saveTransaction(description, value, date, category) {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Cria um ID único para cada transação
    const transaction = {
        id: Date.now().toString(),
        description,
        value,
        date,
        category
    };

    storedTransactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(storedTransactions));
    addTransactionToTable(transaction); // Adiciona a transação diretamente à tabela
}

function addTransactionToTable(transaction) {
    const categorySection = document.querySelector(`[data-category="${transaction.category}"]`);
    if (categorySection) {
        const tableBody = categorySection.querySelector(".static-table tbody");
        if (tableBody) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${transaction.description}</td>
                <td>${transaction.value}</td>
                <td>${transaction.date}</td>
                <td><button onclick="removeTransaction('${transaction.id}')">Remover</button></td>
            `;
            tableBody.appendChild(row);
        }
    }
}

function removeTransaction(id) {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const updatedTransactions = storedTransactions.filter(transaction => transaction.id !== id);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    document.location.reload(); // Atualiza a tabela após remover
}

// Salva e carrega o limite de gastos

function saveLimit(category, limitValue, limitPeriod) {
    const limits = JSON.parse(localStorage.getItem("limits")) || {};
    limits[category] = { limitValue, limitPeriod };
    localStorage.setItem("limits", JSON.stringify(limits));
}

function loadLimits() {
    const limits = JSON.parse(localStorage.getItem("limits")) || {};

    document.querySelectorAll(".category").forEach(categoryDiv => {
        const category = categoryDiv.getAttribute("data-category");
        if (limits[category]) {
            const { limitValue, limitPeriod } = limits[category];
            const limitInput = categoryDiv.querySelector(".limit-value");
            const periodSelect = categoryDiv.querySelector(".limit-period");
            if (limitInput && periodSelect) {
                limitInput.value = limitValue;
                periodSelect.value = limitPeriod;
            }
        }
    });
}

// Ao alterar o limite, salva no armazenamento local
document.querySelectorAll(".category").forEach(categoryDiv => {
    const limitInput = categoryDiv.querySelector(".limit-value");
    const periodSelect = categoryDiv.querySelector(".limit-period");
    const category = categoryDiv.getAttribute("data-category");

    if (limitInput && periodSelect) {
        limitInput.addEventListener("input", () => saveLimit(category, limitInput.value, periodSelect.value));
        periodSelect.addEventListener("change", () => saveLimit(category, limitInput.value, periodSelect.value));
    }
});

// Event listener para o botão de "Adicionar" no formulário
document.getElementById("submit-transaction").addEventListener("click", () => {
    const description = document.getElementById("description").value;
    const value = document.getElementById("value").value;
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;

    // Salva a transação e atualiza a tabela
    if (description && value && date && category) {
        saveTransaction(description, value, date, category);
        
        // Limpa o formulário
        document.getElementById("description").value = "";
        document.getElementById("value").value = "";
        document.getElementById("date").value = "";
        document.getElementById("category").value = "";
    }
});