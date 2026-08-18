from state import set_status_lote
from services.totaltrac import deletar_espelhamento, iniciar_totaltrac, realizar_espelhamento
from task_manager import set_task_completed, set_task_failed, update_task_progress


def processar_lista_invisivel(task_id, acao, lista_placas):
    total = len(lista_placas)
    msg_inicio = f"Iniciando Lote Manual: {acao.upper()} {total} placa(s)..."
    set_status_lote(False, 'Abrindo o navegador...')
    update_task_progress(task_id, 10, 'Abrindo navegador e conectando ao TotalTrac...', msg_inicio)

    print(f'\n🚀 [Task {task_id}] {msg_inicio}')

    driver = iniciar_totaltrac()
    if not driver:
        err_msg = '❌ Erro ao abrir o navegador ou fazer login no TotalTrac.'
        set_status_lote(True, err_msg)
        set_task_failed(task_id, err_msg)
        return

    sucessos = 0
    falhas = 0

    try:
        update_task_progress(task_id, 20, 'Conectado ao TotalTrac. Iniciando processamento das placas...', 'Login efetuado no TotalTrac.')

        for indice, placa in enumerate(lista_placas, start=1):
            placa_limpa = placa.strip().upper()
            if not placa_limpa:
                continue

            pct = int(20 + ((indice - 1) / total) * 75)
            status_msg = f'Processando placa {indice}/{total} ({placa_limpa})...'
            set_status_lote(False, status_msg)
            update_task_progress(task_id, pct, status_msg, f'Placa {indice}/{total}: {placa_limpa} ({acao})')

            def _log_worker(m):
                print(f"[Task {task_id}] {m}")
                update_task_progress(task_id, pct, status_msg, m)

            try:
                if acao == 'adicionar':
                    realizar_espelhamento(driver, placa_limpa, _log_worker)
                elif acao == 'remover':
                    deletar_espelhamento(driver, placa_limpa, _log_worker)
                sucessos += 1
            except Exception as e:
                falhas += 1
                _log_worker(f"⚠️ Falha na placa {placa_limpa}: {e}")

        msg_fim = f'🎉 Lote de {total} placa(s) processado: {sucessos} sucesso(s), {falhas} falha(s).'
        print(f'\n[Task {task_id}] {msg_fim}')
        set_status_lote(True, msg_fim)
        set_task_completed(
            task_id,
            msg=msg_fim,
            result={
                'total': total,
                'sucessos': sucessos,
                'falhas': falhas,
                'acao': acao,
                'placas': lista_placas
            }
        )
    except Exception as erro:
        err_msg = f'🔥 Erro no lote manual: {erro}'
        print(f'[Task {task_id}] {err_msg}')
        set_status_lote(True, '❌ Erro durante o processamento do lote. Veja o terminal.')
        set_task_failed(task_id, 'Erro durante o processamento do lote.', log_line=str(erro))
    finally:
        driver.quit()
