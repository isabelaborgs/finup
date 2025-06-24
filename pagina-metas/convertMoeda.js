function formatarParaMoeda(inputElement, barraProgressoElement = null, percentualElement = null) {
  inputElement.addEventListener('input', function () {
  
    let input = this.value.replace(/[^0-9]/g, '');

    if (input.length === 0) {
      this.value = '';
      if (barraProgressoElement) barraProgressoElement.value = 0;
      if (percentualElement) percentualElement.textContent = '0%'; 
      return;
    }

    let valorFormatado = (parseInt(input) / 100).toFixed(2);
    valorFormatado = valorFormatado.replace('.', ',');

    valorFormatado = valorFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    this.value =  valorFormatado;

    
    if (barraProgressoElement && percentualElement) {
      const valorDesejado = parseFloat(
        valorMetasDesejadoElement.value.replace(/[^0-9]/g, '') || 0
      ) / 100;
      const valorAlcancado = parseFloat(
        valorMetasAlcancadoElement.value.replace(/[^0-9]/g, '') || 0
      ) / 100;

      if (valorDesejado > 0) {
        const progresso = Math.min((valorAlcancado / valorDesejado) * 100, 100);
        barraProgressoElement.value = valorAlcancado;
        barraProgressoElement.max = valorDesejado;
        percentualElement.textContent = `${progresso.toFixed(2)}%`;
      } else {
        barraProgressoElement.value = 0;
        percentualElement.textContent = '0%';
      }
    }

    this.setSelectionRange(this.value.length, this.value.length);
  });
}

const valorMetasDesejadoElement = document.getElementById('valorMetasDesejado');
const valorMetasAlcancadoElement = document.getElementById('valorMetasAlcancado');
const barraProgressoElement = document.getElementById('barraProgresso');
const percentualElement = document.getElementById('percentualProgresso'); 

formatarParaMoeda(valorMetasDesejadoElement, barraProgressoElement, percentualElement);
formatarParaMoeda(valorMetasAlcancadoElement, barraProgressoElement, percentualElement);
