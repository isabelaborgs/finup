document.addEventListener("DOMContentLoaded", function () {
    const descriptionInput = document.getElementById("description");
    const valueInput = document.getElementById("value");
    const dateInput = document.getElementById("date");
    const categoryDropdown = document.getElementById("category");
    const submitButton = document.getElementById("submit-transaction");
    const errorMessage = document.getElementById("error-message");

    // Função para verificar se todos os campos estão preenchidos
    function isFormValid() {
        return (
            descriptionInput.value.trim() !== "" &&
            valueInput.value.trim() !== "" &&
            dateInput.value.trim() !== "" &&
            categoryDropdown.value !== "default"
        );
    }

    // Atualiza a exibição da mensagem de erro e a habilitação do botão
    function updateFormStatus() {
        if (isFormValid()) {
            errorMessage.style.display = "none"; // Esconder a mensagem de erro
        } else {
            errorMessage.style.display = "block"; // Mostrar a mensagem de erro
        }
    }

    // Listener para exibir a mensagem de erro quando o botão for clicado estando inválido
    submitButton.addEventListener("click", function (event) {
        if (!isFormValid()) {
            event.preventDefault(); // Evita envio ou ação
            errorMessage.textContent = "Por favor, preencha todos os campos antes de adicionar.";
        }
    });

    // Adicionar evento a cada campo para verificar a validação dinamicamente
    [descriptionInput, valueInput, dateInput, categoryDropdown].forEach((input) => {
        input.addEventListener("input", updateFormStatus);
        input.addEventListener("change", updateFormStatus); // Para o dropdown
    });

    // Inicializar o estado do formulário
    updateFormStatus();
});