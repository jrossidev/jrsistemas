const API_BASE_URL = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || 'http://localhost:5000';

const inputData = document.getElementById('data_corte');
const btnIniciar = document.getElementById('btnIniciar');
const btnLoteAdd = document.getElementById('btnLoteAdd');
const btnLoteRem = document.getElementById('btnLoteRem');

// Máscara de data DD/MM/AAAA
if (inputData) {
    inputData.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
        if (v.length > 5) v = v.substring(0, 5) + '/' + v.substring(5, 9);
        e.target.value = v;
    });
}

window.addEventListener('DOMContentLoaded', () => {
    if (inputData) {
        const hoje = new Date();
        inputData.value = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
});

function setStatus(msg, type, elId = 'status_msg') {
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

// ── ROBÔ AUTOMÁTICO VEX ──────────────────────────────────────────

function chamarRobo() {
    const dataCorte = inputData ? inputData.value.trim() : '';
    const senhaMaster = (document.getElementById('senha_master') || {}).value || '';

    if (dataCorte.length !== 10) {
        setStatus('⚠️ Digite uma data de corte válida (DD/MM/AAAA).', 'error', 'status_msg');
        return;
    }

    btnIniciar.disabled = true;
    btnIniciar.innerHTML = '⏳ TRABALHANDO...';
    setStatus('📡 Conectando ao VEX...', 'info', 'status_msg');

    const progressBox = document.getElementById('progress_auto');
    const progressFill = document.getElementById('progress_auto_fill');
    const progressPct = document.getElementById('progress_auto_pct');
    const progressMsg = document.getElementById('progress_auto_msg');

    if (progressBox) progressBox.style.display = 'block';
    if (progressFill) progressFill.style.width = '10%';
    if (progressPct) progressPct.innerText = '10%';
    if (progressMsg) progressMsg.innerText = 'Conectando ao VEX...';

    fetch(`${API_BASE_URL}/iniciar-robo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
            data: dataCorte,
            senha: senhaMaster
        })
    })
    .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.mensagem || 'Erro na requisição');
        return data;
    })
    .then(data => {
        const taskId = data.task_id;
        setStatus('⏳ Integração em andamento...', 'info', 'status_msg');
        sondarTarefaAuto(taskId);
    })
    .catch(error => {
        setStatus(error.message, 'error', 'status_msg');
        btnIniciar.disabled = false;
        btnIniciar.innerHTML = '▶ INICIAR INTEGRAÇÃO';
        if (progressBox) progressBox.style.display = 'none';
    });
}

function sondarTarefaAuto(taskId) {
    fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status !== 'sucesso' || !data.task) throw new Error('Falha ao obter status');
        const task = data.task;

        const progressFill = document.getElementById('progress_auto_fill');
        const progressPct = document.getElementById('progress_auto_pct');
        const progressMsg = document.getElementById('progress_auto_msg');

        const pct = task.progress_pct || 0;
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (progressPct) progressPct.innerText = `${pct}%`;
        if (progressMsg) progressMsg.innerText = task.progress_msg || 'Executando...';

        if (task.status === 'COMPLETED') {
            setStatus(`✅ ${task.progress_msg || 'Sincronização concluída!'}`, 'success', 'status_msg');
            btnIniciar.disabled = false;
            btnIniciar.innerHTML = '▶ INICIAR INTEGRAÇÃO';
        } else if (task.status === 'FAILED') {
            setStatus(`❌ ${task.progress_msg || 'Erro na execução da tarefa.'}`, 'error', 'status_msg');
            btnIniciar.disabled = false;
            btnIniciar.innerHTML = '▶ INICIAR INTEGRAÇÃO';
        } else {
            setTimeout(() => sondarTarefaAuto(taskId), 2000);
        }
    })
    .catch(() => {
        setTimeout(() => sondarTarefaAuto(taskId), 2500);
    });
}

// ── LOTE MANUAL ──────────────────────────────────────────────────

function enviarLote(acao) {
    const txtPlacas = (document.getElementById('listaPlacas') || {}).value || '';
    const senhaMaster = (document.getElementById('senha_master') || {}).value || '';

    if (!txtPlacas.trim()) {
        setStatus('⚠️ A lista está vazia! Cole algumas placas primeiro.', 'error', 'statusLote');
        return;
    }

    if (btnLoteAdd) btnLoteAdd.disabled = true;
    if (btnLoteRem) btnLoteRem.disabled = true;
    setStatus('⏳ Iniciando processamento em lote...', 'info', 'statusLote');

    const progressBox = document.getElementById('progress_lote');
    const progressFill = document.getElementById('progress_lote_fill');
    const progressPct = document.getElementById('progress_lote_pct');
    const progressMsg = document.getElementById('progress_lote_msg');

    if (progressBox) progressBox.style.display = 'block';
    if (progressFill) progressFill.style.width = '10%';
    if (progressPct) progressPct.innerText = '10%';
    if (progressMsg) progressMsg.innerText = 'Processando no TotalTrac...';

    fetch(`${API_BASE_URL}/processar-lista`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
            acao: acao,
            placas: txtPlacas,
            senha: senhaMaster
        })
    })
    .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.mensagem || 'Erro na requisição');
        return data;
    })
    .then(data => {
        const taskId = data.task_id;
        document.getElementById('listaPlacas').value = '';
        setStatus('⏳ Lote em execução...', 'info', 'statusLote');
        sondarTarefaLote(taskId);
    })
    .catch(error => {
        setStatus(error.message, 'error', 'statusLote');
        if (btnLoteAdd) btnLoteAdd.disabled = false;
        if (btnLoteRem) btnLoteRem.disabled = false;
        if (progressBox) progressBox.style.display = 'none';
    });
}

function sondarTarefaLote(taskId) {
    fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status !== 'sucesso' || !data.task) throw new Error('Falha ao obter status');
        const task = data.task;

        const progressFill = document.getElementById('progress_lote_fill');
        const progressPct = document.getElementById('progress_lote_pct');
        const progressMsg = document.getElementById('progress_lote_msg');

        const pct = task.progress_pct || 0;
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (progressPct) progressPct.innerText = `${pct}%`;
        if (progressMsg) progressMsg.innerText = task.progress_msg || 'Processando...';

        if (task.status === 'COMPLETED') {
            setStatus(`✅ ${task.progress_msg || 'Lote processado com sucesso!'}`, 'success', 'statusLote');
            if (btnLoteAdd) btnLoteAdd.disabled = false;
            if (btnLoteRem) btnLoteRem.disabled = false;
        } else if (task.status === 'FAILED') {
            setStatus(`❌ ${task.progress_msg || 'Erro durante o lote.'}`, 'error', 'statusLote');
            if (btnLoteAdd) btnLoteAdd.disabled = false;
            if (btnLoteRem) btnLoteRem.disabled = false;
        } else {
            setTimeout(() => sondarTarefaLote(taskId), 2000);
        }
    })
    .catch(() => {
        setTimeout(() => sondarTarefaLote(taskId), 2500);
    });
}
