import os
from datetime import datetime

import requests

from state import set_status_auto
from services.totaltrac import deletar_espelhamento, iniciar_totaltrac, realizar_espelhamento
from task_manager import set_task_completed, set_task_failed, update_task_progress


VEX_BASE_URL = 'https://gateway.vexsoft.com.br/api/v3'
VEX_VISTORIA_URL = 'https://gateway.vexsoft.com.br/api/vistoria/v3/vistoria'


def montar_headers_vex():
    api_key = os.getenv('VEX_API_KEY')

    if not api_key:
        raise RuntimeError('Configure VEX_API_KEY no arquivo .env.')

    return {
        'X-API-Key': api_key,
        'Content-Type': 'application/json',
    }


def parse_data_vistoria(data_raw):
    data_raw = str(data_raw or '')[:10]

    if '-' in data_raw:
        return datetime.strptime(data_raw, '%Y-%m-%d').date()

    return datetime.strptime(data_raw, '%d/%m/%Y').date()


def marcar_vistoria_exportada(uuid_empresa, vistoria_id, headers):
    url = f'{VEX_BASE_URL}/empresa/{uuid_empresa}/vistorias/{vistoria_id}/exportada'
    requests.post(url, headers=headers, timeout=30)


def buscar_detalhes_vistoria(uuid_empresa, vistoria_id, headers):
    url = f'{VEX_VISTORIA_URL}/{uuid_empresa}/{vistoria_id}'
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()

    dados = response.json()
    return dados[0] if isinstance(dados, list) else dados


def executar_automacao_invisivel(task_id, data_corte_str):
    msg_ini = 'Conectando ao VEX para buscar vistorias...'
    set_status_auto(False, f'📡 {msg_ini}')
    update_task_progress(task_id, 10, msg_ini, f"Buscando vistorias com data de corte: {data_corte_str}")

    uuid_empresa = os.getenv('VEX_UUID')
    if not uuid_empresa:
        err_msg = 'Configure VEX_UUID no arquivo .env.'
        set_status_auto(True, f'❌ {err_msg}')
        set_task_failed(task_id, err_msg)
        return

    headers = montar_headers_vex()
    url_fila = f'{VEX_BASE_URL}/empresa/{uuid_empresa}/vistorias/naoexportadas'

    data_corte_obj = datetime.strptime(data_corte_str, '%d/%m/%Y').date()
    driver_totaltrac = None
    total_processado = 0
    placas_processadas = []

    try:
        while True:
            response_fila = requests.get(url_fila, headers=headers, timeout=30)
            response_fila.raise_for_status()
            fila_pendentes = response_fila.json().get('data', [])

            if not fila_pendentes:
                break

            total_fila = len(fila_pendentes)
            msg_fila = f'Analisando lote de {total_fila} vistoria(s)...'
            set_status_auto(False, f'🔎 {msg_fila}')
            update_task_progress(task_id, 25, msg_fila, f"Lote com {total_fila} pendência(s) obtido do VEX.")

            for idx, item in enumerate(fila_pendentes, start=1):
                vistoria_id = item.get('id')
                vistoria = buscar_detalhes_vistoria(uuid_empresa, vistoria_id, headers)

                placa = vistoria.get('placa')
                tipo = int(vistoria.get('tipo_vistoria', 0))
                cliente = str(vistoria.get('cliente', '')).upper()
                data_vistoria = parse_data_vistoria(vistoria.get('data', vistoria.get('data_inclusao', '')))

                if data_vistoria < data_corte_obj:
                    marcar_vistoria_exportada(uuid_empresa, vistoria_id, headers)
                    continue

                if 'UNICAMPO' in cliente:
                    acao_nome = 'Adicionando' if tipo == 1 else 'Removendo'
                    status_placa = f'🚗 {acao_nome} placa {placa} (UNICAMPO)...'
                    set_status_auto(False, status_placa)
                    update_task_progress(task_id, 30 + min(60, int((idx / total_fila) * 60)), status_placa, f"{acao_nome} placa {placa} no TotalTrac")

                    if driver_totaltrac is None:
                        update_task_progress(task_id, 35, 'Iniciando navegador do TotalTrac...', 'Abrindo sessão do TotalTrac.')
                        driver_totaltrac = iniciar_totaltrac()

                    if driver_totaltrac is None:
                        raise RuntimeError('Não foi possível iniciar o navegador do TotalTrac.')

                    def _log_worker(m):
                        print(f"[Task {task_id}] {m}")
                        update_task_progress(task_id, 50, status_placa, m)

                    if tipo == 1:
                        realizar_espelhamento(driver_totaltrac, placa, _log_worker)
                    elif tipo == 2:
                        deletar_espelhamento(driver_totaltrac, placa, _log_worker)

                    total_processado += 1
                    placas_processadas.append({'placa': placa, 'tipo': acao_nome})

                marcar_vistoria_exportada(uuid_empresa, vistoria_id, headers)

        if total_processado > 0:
            mensagem = f'🎉 Automação concluída! {total_processado} placa(s) da Unicampo sincronizadas.'
        else:
            mensagem = '✅ Nenhuma placa nova da Unicampo encontrada no VEX.'

        print(f'\n[Task {task_id}] {mensagem}')
        set_status_auto(True, mensagem)
        set_task_completed(
            task_id,
            msg=mensagem,
            result={
                'total_processado': total_processado,
                'placas': placas_processadas,
                'data_corte': data_corte_str
            }
        )
    except Exception as erro:
        err_msg = f'Erro durante a automação: {erro}'
        print(f'[Task {task_id}] 🔥 {err_msg}')
        set_status_auto(True, '❌ Erro durante a automação. Veja o terminal.')
        set_task_failed(task_id, 'Erro durante a automação VEX.', log_line=str(erro))
    finally:
        if driver_totaltrac:
            driver_totaltrac.quit()
