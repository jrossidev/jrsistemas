import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS

from services.crlv_pr import CNPJ_PADRAO, executar_crlv_invisivel
from services.lote import processar_lista_invisivel
from services.vex import executar_automacao_invisivel
from state import status_robo_auto, status_robo_crlv, status_robo_lote
from task_manager import (
    enqueue_task,
    get_latest_task,
    get_task,
    list_tasks,
    start_workers,
)

load_dotenv()

app = Flask(__name__)
CORS(app)

# Inicia as filas e workers em background
start_workers()


def senha_valida(senha_recebida):
    return senha_recebida == os.getenv('API_PASSWORD')


# ── Serve o frontend ──────────────────────────────────────────
@app.route('/')
def index():
    pasta_raiz = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    return send_from_directory(pasta_raiz, 'index.html')


@app.route('/src/<path:filename>')
def static_src(filename):
    pasta_src = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src'))
    return send_from_directory(pasta_src, filename)
# ─────────────────────────────────────────────────────────────


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'online',
        'mensagem': 'JR Sistemas API online com Task Queue ativo.'
    })


# ── Rotas de Criação de Tarefas na Fila ───────────────────────

@app.route('/iniciar-robo', methods=['POST'])
def iniciar_robo():
    dados = request.get_json(silent=True) or {}

    if not senha_valida(dados.get('senha', '')):
        return jsonify({'status': 'erro', 'mensagem': '❌ Acesso Negado! Senha incorreta.'}), 401

    data_corte = dados.get('data', '').strip()
    if not data_corte:
        return jsonify({'status': 'erro', 'mensagem': 'Data de corte não informada.'}), 400

    task_id = enqueue_task(
        task_type='vex_sync',
        target_func=executar_automacao_invisivel,
        args=(data_corte,),
        params={'data_corte': data_corte}
    )

    return jsonify({
        'status': 'sucesso',
        'task_id': task_id,
        'mensagem': 'Tarefa de sincronização VEX adicionada à fila.'
    })


@app.route('/processar-lista', methods=['POST'])
def processar_lista():
    dados = request.get_json(silent=True) or {}

    if not senha_valida(dados.get('senha', '')):
        return jsonify({'status': 'erro', 'mensagem': '❌ Acesso Negado! Senha incorreta.'}), 401

    acao = dados.get('acao', '').strip().lower()
    texto_placas = dados.get('placas', '')
    lista_placas = [placa.strip().upper() for placa in texto_placas.split('\n') if placa.strip()]

    if acao not in {'adicionar', 'remover'} or not lista_placas:
        return jsonify({'status': 'erro', 'mensagem': 'Ação inválida ou lista de placas vazia.'}), 400

    task_id = enqueue_task(
        task_type='lote_manual',
        target_func=processar_lista_invisivel,
        args=(acao, lista_placas),
        params={'acao': acao, 'total_placas': len(lista_placas), 'placas': lista_placas}
    )

    return jsonify({
        'status': 'sucesso',
        'task_id': task_id,
        'mensagem': f'Lote de {len(lista_placas)} placa(s) adicionado à fila.'
    })


@app.route('/config-crlv', methods=['GET'])
def config_crlv():
    return jsonify({'cnpj_padrao': CNPJ_PADRAO})


@app.route('/gerar-crlv', methods=['POST'])
def gerar_crlv():
    dados = request.get_json(silent=True) or {}

    if not senha_valida(dados.get('senha', '')):
        return jsonify({'status': 'erro', 'mensagem': '❌ Acesso Negado! Senha incorreta.'}), 401

    renavam = (dados.get('renavam') or '').strip()
    placa = (dados.get('placa') or '').strip().upper()
    cnpj = (dados.get('cnpj') or '').strip() or CNPJ_PADRAO

    if not renavam or not placa:
        return jsonify({'status': 'erro', 'mensagem': 'Informe Renavam e Placa.'}), 400

    task_id = enqueue_task(
        task_type='crlv_detran',
        target_func=executar_crlv_invisivel,
        args=(renavam, placa, cnpj),
        params={'renavam': renavam, 'placa': placa, 'cnpj': cnpj}
    )

    return jsonify({
        'status': 'sucesso',
        'task_id': task_id,
        'mensagem': f'Emissão do CRLV-e da placa {placa} adicionada à fila.'
    })


# ── REST API: Gerenciamento e Consulta de Tarefas ─────────────

@app.route('/api/tasks', methods=['GET'])
def api_list_tasks():
    task_type = request.args.get('type')
    limit = min(int(request.args.get('limit', 20)), 100)
    tasks = list_tasks(task_type=task_type, limit=limit)
    return jsonify({'status': 'sucesso', 'tasks': tasks})


@app.route('/api/tasks/<task_id>', methods=['GET'])
def api_get_task(task_id):
    task = get_task(task_id)
    if not task:
        return jsonify({'status': 'erro', 'mensagem': 'Tarefa não encontrada.'}), 404
    return jsonify({'status': 'sucesso', 'task': task})


@app.route('/api/tasks/<task_id>/download', methods=['GET'])
def api_download_task_artifact(task_id):
    task = get_task(task_id)
    if not task:
        return jsonify({'status': 'erro', 'mensagem': 'Tarefa não encontrada.'}), 404

    caminho = task.get('artifact_path')
    if not caminho or not os.path.isfile(caminho):
        return jsonify({'status': 'erro', 'mensagem': 'Nenhum arquivo disponível para download nesta tarefa.'}), 404

    placa = task.get('params', {}).get('placa', 'CRLV')
    nome_download = f"CRLV-e_{placa}.pdf"
    return send_file(caminho, mimetype='application/pdf', as_attachment=True, download_name=nome_download)


# ── Rotas Legadas (Compatibilidade Retroativa Total) ──────────

@app.route('/status-lote', methods=['GET'])
def status_lote():
    latest = get_latest_task('lote_manual')
    if latest:
        return jsonify({
            'concluido': latest['status'] in ('COMPLETED', 'FAILED'),
            'mensagem': latest['progress_msg'] or '',
            'task_id': latest['id'],
            'status': latest['status'],
            'progress_pct': latest['progress_pct']
        })
    return jsonify(status_robo_lote)


@app.route('/status-auto', methods=['GET'])
def status_auto():
    latest = get_latest_task('vex_sync')
    if latest:
        return jsonify({
            'concluido': latest['status'] in ('COMPLETED', 'FAILED'),
            'mensagem': latest['progress_msg'] or '',
            'task_id': latest['id'],
            'status': latest['status'],
            'progress_pct': latest['progress_pct']
        })
    return jsonify(status_robo_auto)


@app.route('/status-crlv', methods=['GET'])
def status_crlv():
    latest = get_latest_task('crlv_detran')
    if latest:
        return jsonify({
            'concluido': latest['status'] in ('COMPLETED', 'FAILED'),
            'mensagem': latest['progress_msg'] or '',
            'arquivo': latest.get('artifact_path') or '',
            'task_id': latest['id'],
            'status': latest['status'],
            'progress_pct': latest['progress_pct']
        })
    return jsonify(status_robo_crlv)


@app.route('/baixar-crlv-pdf', methods=['GET'])
def baixar_crlv_pdf():
    latest = get_latest_task('crlv_detran')
    caminho_pdf = None
    if latest and latest.get('artifact_path') and os.path.isfile(latest['artifact_path']):
        caminho_pdf = latest['artifact_path']
    elif status_robo_crlv.get('arquivo') and os.path.isfile(status_robo_crlv['arquivo']):
        caminho_pdf = status_robo_crlv['arquivo']

    if not caminho_pdf:
        return jsonify({'status': 'erro', 'mensagem': 'Nenhum CRLV-e pronto para download.'}), 404

    return send_file(caminho_pdf, mimetype='application/pdf', as_attachment=True, download_name='CRLV-e.pdf')


if __name__ == '__main__':
    print('🚀 Servidor JR Sistemas ON na porta 5000...')
    app.run(host='0.0.0.0', port=5000)
