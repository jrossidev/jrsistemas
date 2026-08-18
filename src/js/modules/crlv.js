const API_BASE_URL = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || 'http://localhost:5000';

const btnCrlv = document.getElementById('btnCrlv');
const inputCrlvCnpj = document.getElementById('crlv_cnpj');
const inputCrlvPlaca = document.getElementById('crlv_placa');
const inputCrlvRenavam = document.getElementById('crlv_renavam');

function setStatus(msg, type, elId = 'status_crlv') {
    const el = document.getElementById(elId);
    if (!el) return;
    if (!msg) {
        el.style.display = 'none';
        el.className = 'status-card';
        el.innerHTML = '';
        return;
    }
    el.className = 'status-card ' + type;
    el.innerHTML = msg;
    el.style.display = 'block';
}

// Pré-preenchimento do CNPJ padrão e carregamento do histórico
window.addEventListener('DOMContentLoaded', () => {
    fetch(`${API_BASE_URL}/config-crlv`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
    })
    .then(response => response.json())
    .then(data => {
        if (data.cnpj_padrao && inputCrlvCnpj && !inputCrlvCnpj.value) {
            inputCrlvCnpj.value = data.cnpj_padrao;
        }
    })
    .catch(() => console.log('Não foi possível carregar o CNPJ padrão.'));

    carregarHistoricoCrlv();
});

// ── FLUXO DE EMISSÃO CRLV-e ──────────────────────────────────────

function gerarCrlv() {
    const renavam = (inputCrlvRenavam ? inputCrlvRenavam.value : '').trim();
    const placa = (inputCrlvPlaca ? inputCrlvPlaca.value : '').trim().toUpperCase();
    const cnpj = (inputCrlvCnpj ? inputCrlvCnpj.value : '').trim();
    const senhaMaster = ((document.getElementById('senha_master') || {}).value || '').trim();

    if (!renavam || !placa) {
        setStatus('⚠️ Informe o Renavam e a Placa do veículo.', 'error');
        return;
    }

    btnCrlv.disabled = true;
    btnCrlv.innerHTML = '⏳ GERANDO...';
    setStatus('📡 Conectando ao robô Detran-PR...', 'info');

    const progressBox = document.getElementById('progress_crlv');
    const progressFill = document.getElementById('progress_crlv_fill');
    const progressPct = document.getElementById('progress_crlv_pct');
    const progressMsg = document.getElementById('progress_crlv_msg');

    if (progressBox) progressBox.style.display = 'block';
    if (progressFill) progressFill.style.width = '10%';
    if (progressPct) progressPct.innerText = '10%';
    if (progressMsg) progressMsg.innerText = 'Iniciando emissão no Detran-PR...';

    fetch(`${API_BASE_URL}/gerar-crlv`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
            renavam: renavam,
            placa: placa,
            cnpj: cnpj,
            senha: senhaMaster,
        }),
    })
    .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.mensagem || 'Erro na requisição');
        return data;
    })
    .then((data) => {
        const taskId = data.task_id;
        setStatus('⏳ Emissão em andamento no Detran-PR...', 'info');
        sondarTarefaCrlv(taskId, placa);
    })
    .catch((error) => {
        setStatus(error.message, 'error');
        btnCrlv.disabled = false;
        btnCrlv.innerHTML = '📄 BAIXAR CRLV-e';
        if (progressBox) progressBox.style.display = 'none';
    });
}

function sondarTarefaCrlv(taskId, placa) {
    fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.status !== 'sucesso' || !data.task) throw new Error('Falha ao obter status');
        const task = data.task;

        const progressFill = document.getElementById('progress_crlv_fill');
        const progressPct = document.getElementById('progress_crlv_pct');
        const progressMsg = document.getElementById('progress_crlv_msg');

        const pct = task.progress_pct || 0;
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (progressPct) progressPct.innerText = `${pct}%`;
        if (progressMsg) progressMsg.innerText = task.progress_msg || 'Processando no Detran...';

        if (task.status === 'COMPLETED') {
            setStatus(`✅ ${task.progress_msg || 'CRLV-e gerado com sucesso!'}`, 'success');
            btnCrlv.disabled = false;
            btnCrlv.innerHTML = '📄 BAIXAR CRLV-e';

            // Dispara o download automático do PDF
            baixarPdfTarefa(taskId, placa);
            carregarHistoricoCrlv();
        } else if (task.status === 'FAILED') {
            setStatus(`❌ ${task.progress_msg || 'Erro ao emitir CRLV-e.'}`, 'error');
            btnCrlv.disabled = false;
            btnCrlv.innerHTML = '📄 BAIXAR CRLV-e';
            carregarHistoricoCrlv();
        } else {
            setTimeout(() => sondarTarefaCrlv(taskId, placa), 2000);
        }
    })
    .catch(() => {
        setTimeout(() => sondarTarefaCrlv(taskId, placa), 2500);
    });
}

function baixarPdfTarefa(taskId, placa = 'CRLV') {
    setStatus('📥 Baixando arquivo PDF...', 'info');

    fetch(`${API_BASE_URL}/api/tasks/${taskId}/download`, {
        method: 'GET',
        headers: { 'ngrok-skip-browser-warning': 'true' },
    })
    .then(async (response) => {
        if (!response.ok) {
            let msg = 'Não foi possível baixar o PDF.';
            try {
                const data = await response.json();
                msg = data.mensagem || msg;
            } catch (e) { }
            throw new Error(msg);
        }
        return response.blob();
    })
    .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CRLV-e_${placa.toUpperCase()}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setStatus(`✅ CRLV-e (${placa.toUpperCase()}) baixado com sucesso!`, 'success');
    })
    .catch((error) => {
        setStatus(`❌ Erro no download: ${error.message}`, 'error');
    });
}

// ── HISTÓRICO DE CRLVS JÁ EMITIDOS ──────────────────────────────

function carregarHistoricoCrlv() {
    const listEl = document.getElementById('history_crlv_list');
    if (!listEl) return;

    fetch(`${API_BASE_URL}/api/tasks?type=crlv_detran&limit=10`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.status !== 'sucesso' || !data.tasks) return;
        
        // Filtra para exibir apenas tarefas reais de CRLV
        const tasks = data.tasks.filter(t => {
            const p = t.params || {};
            const placa = (p.placa || '').toUpperCase().trim();
            return placa && !placa.includes('TESTE') && !placa.includes('ABC1234');
        });

        if (!tasks.length) {
            listEl.innerHTML = '<div style="text-align:center; padding:15px; color:#9ca3af; font-size:12px;">Nenhum CRLV emitido recentemente.</div>';
            return;
        }

        listEl.innerHTML = tasks.map((t) => {
            const placa = (t.params && t.params.placa) ? t.params.placa.toUpperCase() : 'VEÍCULO';
            const renavam = (t.params && t.params.renavam) ? t.params.renavam : '';

            let badgeClass = 'badge-pending';
            let badgeText = 'Pendente';
            let downloadBtn = '';

            if (t.status === 'RUNNING') {
                badgeClass = 'badge-running';
                badgeText = 'Emitindo';
            } else if (t.status === 'COMPLETED') {
                badgeClass = 'badge-completed';
                badgeText = 'Pronto';
                if (t.artifact_path) {
                    downloadBtn = `<button type="button" class="btn-download-mini" onclick="baixarPdfTarefa('${t.id}', '${placa}')">📥 Baixar PDF</button>`;
                }
            } else if (t.status === 'FAILED') {
                badgeClass = 'badge-failed';
                badgeText = 'Falhou';
            }

            const hora = t.created_at ? new Date(t.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
            const dataStr = t.created_at ? new Date(t.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '';

            return `
                <div class="history-item">
                    <div class="history-meta">
                        <span class="history-title-text">🚗 Placa: ${placa}</span>
                        <span class="history-sub-text">${dataStr} às ${hora} • Renavam: ${renavam || 'N/A'}</span>
                    </div>
                    <div class="history-action">
                        ${downloadBtn}
                        <span class="badge ${badgeClass}">${badgeText}</span>
                    </div>
                </div>
            `;
        }).join('');
    })
    .catch(() => {
        listEl.innerHTML = '<div style="text-align:center; padding:10px; color:#9ca3af; font-size:12px;">Histórico offline.</div>';
    });
}
