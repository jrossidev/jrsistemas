status_robo_lote = {'concluido': True, 'mensagem': ''}
status_robo_auto = {'concluido': True, 'mensagem': ''}
status_robo_crlv = {'concluido': True, 'mensagem': '', 'arquivo': ''}


def set_status_lote(concluido, mensagem):
    status_robo_lote.clear()
    status_robo_lote.update({'concluido': concluido, 'mensagem': mensagem})


def set_status_auto(concluido, mensagem):
    status_robo_auto.clear()
    status_robo_auto.update({'concluido': concluido, 'mensagem': mensagem})


def set_status_crlv(concluido, mensagem, arquivo=''):
    status_robo_crlv.clear()
    status_robo_crlv.update({'concluido': concluido, 'mensagem': mensagem, 'arquivo': arquivo})
