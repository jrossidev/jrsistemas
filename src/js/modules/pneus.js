function calcularPneu() {
    const kmi = parseFloat(document.getElementById('pneu_kmi').value);
    const kma = parseFloat(document.getElementById('pneu_kma').value);
    const valor = parseFloat(document.getElementById('pneu_valor').value);
    const status = document.getElementById('status_pneu');

    if (isNaN(kmi) || isNaN(kma) || isNaN(valor)) {
        status.className = 'status-card error';
        status.innerText = 'Por favor, preencha todos os campos com valores válidos.';
        return;
    }

    const VIDA_UTIL_KM = 35000;
    const kmLimite = kmi + VIDA_UTIL_KM;
    const kmRestante = kmLimite - kma;
    const valorPorKm = valor / VIDA_UTIL_KM;
    const resultado = valorPorKm * kmRestante;

    const resultadoFormatado = resultado.toFixed(2).replace('.', ',');

    status.className = 'status-card ' + (resultado >= 0 ? 'success' : 'error');
    status.innerHTML = resultado >= 0
        ? `Valor a ser cobrado:<br><span class="result-value">R$ ${resultadoFormatado}</span>`
        : `KM rodado excede a vida útil estimada do pneu.<br>Valor calculado: R$ ${resultadoFormatado}`;
}
