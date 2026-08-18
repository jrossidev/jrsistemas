import os
import time
import tempfile
import shutil

try:
    from pywinauto import Desktop
    _PYWINAUTO_OK = True
except Exception:
    _PYWINAUTO_OK = False

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    TimeoutException,
    ElementClickInterceptedException,
    UnexpectedAlertPresentException,
)

from state import set_status_crlv
from task_manager import save_task_artifact, set_task_completed, set_task_failed, update_task_progress

URL_SERVICO = (
    "https://www.detran.pr.gov.br/servicos/Veiculo/Documentacao/"
    "Emitir-Certificado-de-Registro-e-Licenciamento-de-Veiculo-em-meio-"
    "eletronico-CRLV-e-para-pessoa-juridica-ybrzQV34"
)

# CPF do titular do e-CPF usado para login (mesmo de todos os prints).
CPF_LOGIN = os.getenv("CRLV_CPF_LOGIN", "905.289.999-15")

# CNPJ pré-preenchido por padrão. O usuário pode sobrescrever na tela.
CNPJ_PADRAO = os.getenv("CRLV_CNPJ_PADRAO", "15.373.411/0001-08")


class CRLVBotError(Exception):
    """Erro genérico do robô, com mensagem amigável pro usuário final."""


class CRLVBot:
    def __init__(self, download_dir, headless=True, chromedriver_path=None, timeout=40):
        self.download_dir = os.path.abspath(download_dir)
        os.makedirs(self.download_dir, exist_ok=True)
        self.timeout = timeout
        self.headless = headless
        self.driver = self._iniciar_driver(headless, chromedriver_path)

    def _iniciar_driver(self, headless, chromedriver_path):
        options = webdriver.ChromeOptions()

        if headless:
            options.add_argument("--headless=new")

        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--lang=pt-BR")

        prefs = {
            "download.default_directory": self.download_dir,
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "plugins.always_open_pdf_externally": True,
            "profile.default_content_settings.popups": 0,
        }
        options.add_experimental_option("prefs", prefs)
        options.add_argument("--safebrowsing-disable-download-protection")

        service = Service(chromedriver_path) if chromedriver_path else Service()
        driver = webdriver.Chrome(service=service, options=options)
        driver.set_page_load_timeout(self.timeout)

        try:
            # IMPORTANTE: Page.setDownloadBehavior só vale pra aba/target em
            # que foi chamado no momento -- como o fluxo abre uma ABA NOVA
            # (o link "Emitir" leva pra agendamento.detran.pr.gov.br), essa
            # configuração não era herdada lá, e o Chrome usava o
            # comportamento padrão de download (às vezes: pasta padrão do
            # usuário, ou até pop-up de "Salvar como"). Isso fazia o PDF
            # baixar de verdade na máquina, só que numa pasta diferente da
            # que o robô fica monitorando -- por isso dava timeout mesmo
            # com o arquivo já salvo no disco.
            # Browser.setDownloadBehavior vale pro navegador inteiro
            # (todas as abas/targets), então resolve isso na raiz.
            driver.execute_cdp_cmd(
                "Browser.setDownloadBehavior",
                {"behavior": "allow", "downloadPath": self.download_dir, "eventsEnabled": True},
            )
        except Exception:
            pass

        return driver

    def fechar(self):
        try:
            self.driver.quit()
        except Exception:
            pass

    def _wait(self):
        return WebDriverWait(self.driver, self.timeout)

    def _wait_curto(self, segundos):
        return WebDriverWait(self.driver, segundos)

    def _esconder_widgets_flutuantes(self):
        """
        Sites .gov.br costumam ter o widget VLibras (o ícone azul de
        mãozinha, acessibilidade em Libras) fixo na tela com z-index alto.
        Ele não precisa estar visível pra ninguém clicar em cima -- o
        próprio container dele (ou uma div irmã invisível usada pro popup)
        às vezes cobre uma área bem maior que o ícone e intercepta cliques
        em botões vizinhos (erro clássico do Selenium: "element click
        intercepted: Other element would receive the click").

        Aqui simplesmente removemos pointer-events desses widgets
        conhecidos via JS, sem afetar o resto da página.
        """
        try:
            self.driver.execute_script(
                """
                var seletores = [
                    '[vw]', '.vw-plugin-wrapper', '#vlibras', '[id*="vlibras" i]',
                    '[class*="vlibras" i]', '[class*="accessibility-widget" i]'
                ];
                seletores.forEach(function(sel) {
                    document.querySelectorAll(sel).forEach(function(el) {
                        el.style.pointerEvents = 'none';
                    });
                });
                """
            )
        except Exception:
            pass

    def _aceitar_cookies(self):
        """Fecha o banner 'Aviso de Cookies' se ele aparecer (some sites do
        Detran usam um banner fixo que fica por cima do botão EMITIR)."""
        self._esconder_widgets_flutuantes()
        try:
            el = self._wait_curto(6).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(normalize-space(.), \"Aceitar tudo\")]"))
            )
            el.click()
        except (TimeoutException, ElementClickInterceptedException):
            pass

    def _salvar_debug(self, etapa):
        """Salva screenshot + HTML da página no momento da falha, pra dar pra
        analisar depois (F12 manual não é mais necessário)."""
        try:
            pasta = os.path.join(self.download_dir, "debug")
            os.makedirs(pasta, exist_ok=True)
            nome = etapa.replace(" ", "_").replace("/", "-")[:60]
            self.driver.save_screenshot(os.path.join(pasta, f"{nome}.png"))
            with open(os.path.join(pasta, f"{nome}.html"), "w", encoding="utf-8") as f:
                f.write(self.driver.page_source)
        except Exception:
            pass

    def _trocar_para_aba_nova(self, handles_antes, timeout=5):
        """Se o clique abriu uma NOVA ABA/JANELA (target=_blank), muda o foco
        do driver para ela. Sem isso, os próximos comandos continuariam
        mirando a aba antiga e pareceria que 'trava' depois do clique."""
        fim = time.time() + timeout
        while time.time() < fim:
            handles_agora = self.driver.window_handles
            novas = [h for h in handles_agora if h not in handles_antes]
            if novas:
                self.driver.switch_to.window(novas[0])
                try:
                    self.driver.execute_cdp_cmd(
                        "Browser.setDownloadBehavior",
                        {"behavior": "allow", "downloadPath": self.download_dir, "eventsEnabled": True},
                    )
                except Exception:
                    pass
                return True
            time.sleep(0.3)
        return False

    def _resolver_login_certificado(self, log_func=print, timeout=25):
        """
        O alerta nativo ('Por favor, verifique se o certificado digital
        esta conectado') e a caixa 'Selecione um certificado' podem
        aparecer em qualquer ordem, ou quase ao mesmo tempo -- depende da
        velocidade da máquina/rede naquele momento. Tratar isso como dois
        passos sequenciais fixos (fecha alerta -> só depois olha certificado)
        perde o timing quando a ordem inverte.

        Aqui ficamos num loop único, checando as duas coisas a cada
        iteração, até nenhuma delas aparecer mais (ou até dar timeout).
        """
        fim = time.time() + timeout
        alerta_fechado = False
        cert_resolvido = False

        while time.time() < fim:
            # 1) Tem um alert() nativo aberto agora? Fecha.
            try:
                WebDriverWait(self.driver, 1).until(EC.alert_is_present())
                alerta = self.driver.switch_to.alert
                texto = alerta.text
                alerta.accept()
                log_func(f"Alerta nativo fechado: {texto!r}")
                alerta_fechado = True
                continue  # depois de fechar o alert, reavalia tudo de novo
            except TimeoutException:
                pass
            except Exception as e:
                log_func(f"Erro ao tentar fechar alerta nativo: {e}")

            # 2) Tem a caixa 'Selecione um certificado' aberta agora? Resolve.
            if not self.headless and _PYWINAUTO_OK:
                resolvido_agora = self._confirmar_dialogo_certificado(
                    headless=self.headless, log_func=log_func, timeout=2
                )
                if resolvido_agora:
                    cert_resolvido = True
                    continue

            # 3) Nenhuma das duas apareceu nessa rodada -- confere se o
            # login já terminou (saiu da tela de auth-cs/centralautenticacao).
            try:
                url_atual = self.driver.current_url
            except Exception:
                url_atual = ""
            if "centralautenticacao" not in url_atual and "auth-cs" not in url_atual:
                log_func("Login completou -- saiu da tela de autenticação.")
                return True

            time.sleep(0.3)

        log_func(
            f"Timeout de {timeout}s resolvendo login por certificado "
            f"(alerta_fechado={alerta_fechado}, cert_resolvido={cert_resolvido})."
        )
        return False

    def _confirmar_dialogo_certificado(self, headless, log_func=print, timeout=15):
        """
        A caixa nativa 'Selecione um certificado' NAO e uma janela separada
        do Windows -- ela e desenhada DENTRO da propria janela do Chrome
        (confirmado via pywinauto: aparece como Dialog filho dentro da
        arvore UIA da janela 'Chrome_WidgetWin_1'). Por isso buscas por
        janela top-level (Desktop().window(title=...)) nunca encontravam
        nada, e por isso o pyautogui.press('enter') tambem nao funcionava
        (o foco do SO ficava no terminal, nao nessa caixa).

        Aqui entramos em cada janela do Chrome aberta, procuramos o texto
        'Selecione um certificado' pra confirmar que o dialogo esta ali, e
        clicamos direto no botao OK encontrado na arvore -- sem depender
        de foco global nenhum.

        So funciona com uma janela REAL na tela (headless=False).
        """
        if headless:
            log_func(
                "Rodando headless: não é possível confirmar a caixa de "
                "certificado automaticamente (sem sessão gráfica). Se o "
                "robô travar aqui, rode com CRLV_HEADLESS=false pra testar."
            )
            return False

        if not _PYWINAUTO_OK:
            log_func(
                "pywinauto não está instalado -- rode 'pip install pywinauto' "
                "para confirmar a caixa de certificado automaticamente."
            )
            return False

        try:
            from pywinauto.keyboard import send_keys
        except Exception:
            send_keys = None

        fim = time.time() + timeout
        ultimo_erro = None
        while time.time() < fim:
            try:
                for w in Desktop(backend="uia").windows():
                    try:
                        if w.class_name() != "Chrome_WidgetWin_1":
                            continue
                        tem_dialogo_cert = w.descendants(
                            title="Selecione um certificado", control_type="Text"
                        )
                        if not tem_dialogo_cert:
                            continue

                        # A caixa já vem com o (único) certificado pré-selecionado
                        # na lista. TAB, TAB move o foco: lista -> "Informações do
                        # certificado" -> botão OK. ENTER então ativa o OK.
                        # Isso reproduz exatamente o fluxo manual que funciona,
                        # sem depender de invocar o botão via árvore UIA (que às
                        # vezes não "conta" pro Chrome como um clique de verdade
                        # nesse diálogo desenhado internamente).
                        if send_keys is not None:
                            try:
                                w.set_focus()
                                time.sleep(0.3)
                                send_keys("{TAB}{TAB}{ENTER}", pause=0.15)
                                log_func("Enviei TAB, TAB, ENTER pra caixa de certificado.")
                                time.sleep(0.5)
                                # Confere se a caixa realmente fechou
                                ainda_aberta = w.descendants(
                                    title="Selecione um certificado", control_type="Text"
                                )
                                if not ainda_aberta:
                                    return True
                                log_func(
                                    "TAB/TAB/ENTER não fechou a caixa ainda, "
                                    "tentando clique direto no OK como reforço..."
                                )
                            except Exception as e:
                                ultimo_erro = e

                        # Fallback: clique direto no botão OK via UIA/mouse real
                        ok_btns = w.descendants(title="OK", control_type="Button")
                        if not ok_btns:
                            continue
                        botao = ok_btns[0]
                        try:
                            w.set_focus()
                        except Exception:
                            pass
                        try:
                            botao.click()  # invoke via UIA (não move mouse real)
                        except Exception:
                            botao.click_input()  # fallback: clique de mouse real
                        log_func("Cliquei no OK da caixa de certificado.")
                        return True
                    except Exception as e:
                        ultimo_erro = e
                        continue
            except Exception as e:
                ultimo_erro = e
            time.sleep(0.5)

        log_func(
            "A caixa de certificado não apareceu (ou já tinha fechado) "
            f"dentro do tempo esperado. Último erro interno: {ultimo_erro!r}"
        )
        return False

    def _fechar_alert_nativo(self, log_func=print, timeout=8):
        """
        Fecha um alert() nativo do navegador (window.alert), como o aviso
        'Por favor, verifique se o certificado digital esta conectado.'
        Isso e DIFERENTE da caixa 'Selecione um certificado': o alert() e
        controlado pelo proprio Selenium via switch_to.alert -- nao precisa
        de pywinauto/pyautogui aqui, e funciona ate em modo headless.

        Enquanto um alert nativo estiver aberto, QUALQUER outro comando do
        Selenium (find_element, etc) falha com 'unexpected alert open' --
        por isso e importante chamar isso logo apos passos que podem abrir
        um alert, antes de tentar clicar em outra coisa.
        """
        try:
            WebDriverWait(self.driver, timeout).until(EC.alert_is_present())
            alerta = self.driver.switch_to.alert
            texto = alerta.text
            alerta.accept()
            log_func(f"Alerta nativo fechado: {texto!r}")
            return True
        except TimeoutException:
            return False  # nenhum alert apareceu, segue o fluxo normal
        except Exception as e:
            log_func(f"Erro ao tentar fechar alerta nativo: {e}")
            return False

    def _aguardar_login_completo(self, log_func=print, timeout=20):
        """
        Depois de confirmar o certificado + fechar o alerta, o site ainda
        precisa terminar o handshake e redirecionar pra fora do domínio de
        login (auth-cs.identidadedigital...). Se seguirmos os próximos
        passos sem confirmar isso, o robô pode ficar clicando/preenchendo
        campos numa tela de login "fantasma" (login que na verdade falhou
        ou ainda não completou), e só vai dar erro bem mais na frente, com
        uma mensagem que não tem nada a ver com a causa real.
        """
        fim = time.time() + timeout
        while time.time() < fim:
            try:
                url_atual = self.driver.current_url
            except Exception:
                url_atual = ""
            if "centralautenticacao" not in url_atual and "auth-cs" not in url_atual:
                return True
            time.sleep(0.5)
        log_func(
            f"Ainda na tela de login depois de {timeout}s "
            f"(url atual: {url_atual})."
        )
        return False

    def _clicar_emitir(self):
        """
        O botão 'Emitir' da página informativa NÃO é um botão comum: é um
        link <a> que leva pra outro domínio (agendamento.detran.pr.gov.br).
        Buscar por texto "emitir" pega qualquer link do menu lateral que
        contenha essa palavra (ex: 'Emitir guia de IPVA'), então usamos o
        href como critério, que é único pra esse serviço específico.
        """
        xpath = (
            "//a[contains(@href, 'agendamento.detran.pr.gov.br') "
            "and contains(@href, 'servico=')]"
        )
        el = self._wait().until(EC.element_to_be_clickable((By.XPATH, xpath)))
        handles_antes = self.driver.window_handles
        try:
            el.click()
        except ElementClickInterceptedException:
            self.driver.execute_script("arguments[0].click();", el)
        self._trocar_para_aba_nova(handles_antes)
        # A página de agendamento é uma SPA (Angular/JSF) que demora alguns
        # segundos pra montar o formulário depois do carregamento inicial.
        time.sleep(3)

    def _clicar_por_texto(self, texto, tag="*", pode_abrir_aba=False):
        self._esconder_widgets_flutuantes()
        # Case-insensitive: vários botões do Detran-PR usam CSS
        # text-transform: uppercase (aparece "EMITIR" na tela), mas o texto
        # real no DOM é "Emitir" (case normal). Usamos translate() no XPath
        # pra comparar sempre em minúsculas dos dois lados.
        letras_maiusc = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÂÊÔÃÕÇ"
        letras_minusc = "abcdefghijklmnopqrstuvwxyzáéíóúâêôãõç"
        texto_lower = texto.lower()

        if tag == "*":
            # IMPORTANTE: //*[contains(...)] acha, em ordem de documento,
            # o PRIMEIRO elemento cujo texto normalizado contém a palavra —
            # isso costuma ser um <div>/<form> PAI que também engloba esse
            # texto, não o <button> em si. O Selenium clica no centro desse
            # elemento pai, que muitas vezes não corresponde ao botão real,
            # então o clique "não faz nada" (o form nunca é enviado).
            # Por isso priorizamos tags realmente clicáveis primeiro.
            xpaths_tentativa = [
                (
                    f'//button[contains(translate(normalize-space(.), '
                    f'"{letras_maiusc}", "{letras_minusc}"), "{texto_lower}")]'
                ),
                (
                    f'//input[@type="submit" or @type="button"]'
                    f'[contains(translate(translate(@value,"{letras_maiusc}","{letras_minusc}"),'
                    f'"{letras_maiusc}","{letras_minusc}"), "{texto_lower}")]'
                ),
                (
                    f'//a[contains(translate(normalize-space(.), '
                    f'"{letras_maiusc}", "{letras_minusc}"), "{texto_lower}")]'
                ),
                (
                    f'//*[contains(translate(normalize-space(.), '
                    f'"{letras_maiusc}", "{letras_minusc}"), "{texto_lower}")]'
                ),
            ]
        else:
            xpaths_tentativa = [
                f'//{tag}[contains(translate(normalize-space(.), '
                f'"{letras_maiusc}", "{letras_minusc}"), "{texto_lower}")]'
            ]

        el = None
        for xp in xpaths_tentativa:
            try:
                el = self._wait_curto(6).until(EC.element_to_be_clickable((By.XPATH, xp)))
                xpath = xp
                break
            except TimeoutException:
                continue
        if el is None:
            el = self._wait().until(EC.element_to_be_clickable((By.XPATH, xpaths_tentativa[-1])))
            xpath = xpaths_tentativa[-1]

        # Alguns botões (ex: CONTINUAR) ficam com atributo disabled/
        # aria-disabled até o Angular terminar de validar o formulário.
        # element_to_be_clickable não detecta isso, então esperamos aqui
        # também, com um pequeno retry.
        fim = time.time() + 5
        while time.time() < fim:
            disabled = el.get_attribute("disabled") or el.get_attribute("aria-disabled")
            classe = (el.get_attribute("class") or "").lower()
            if not disabled and disabled != "true" and "disabled" not in classe:
                break
            time.sleep(0.3)

        handles_antes = self.driver.window_handles
        try:
            el.click()
        except ElementClickInterceptedException:
            self.driver.execute_script("arguments[0].click();", el)

        # Confirma que o clique realmente saiu da tela atual (mudou URL,
        # abriu aba nova, ou o botão sumiu do DOM). Se nada mudou depois
        # de um clique normal, tenta de novo via JS puro e, se for um
        # <button type="submit">, força também o requestSubmit() do form
        # pai (equivalente a um clique real no botão de submit).
        if pode_abrir_aba:
            self._trocar_para_aba_nova(handles_antes)
        else:
            try:
                self._wait_curto(2).until(EC.staleness_of(el))
            except TimeoutException:
                try:
                    self.driver.execute_script("arguments[0].click();", el)
                    tipo = (el.get_attribute("type") or "").lower()
                    if tipo == "submit":
                        self.driver.execute_script(
                            "var f = arguments[0].form; "
                            "if (f && f.requestSubmit) { f.requestSubmit(arguments[0]); } "
                            "else if (f) { f.submit(); }",
                            el,
                        )
                except Exception:
                    pass
        return el

    def _preencher_por_label(self, label_texto, valor):
        letras_maiusc = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÂÊÔÃÕÇ"
        letras_minusc = "abcdefghijklmnopqrstuvwxyzáéíóúâêôãõç"
        label_lower = label_texto.lower()

        xpath_opcoes = [
            # 1) placeholder exato
            f"//input[@placeholder=\"{label_texto}\"]",
            # 2) placeholder contendo o texto (ignorando maiúsc/minúsc)
            (
                f'//input[contains(translate(@placeholder, "{letras_maiusc}", '
                f'"{letras_minusc}"), "{label_lower}")]'
            ),
            # 3) id/name contendo o texto
            (
                f'//input[contains(translate(@id, "{letras_maiusc}", "{letras_minusc}"), '
                f'"{label_lower}") or contains(translate(@name, "{letras_maiusc}", '
                f'"{letras_minusc}"), "{label_lower}")]'
            ),
            # 4) input logo após um <label>/<span>/<div> com esse texto
            (
                f'//*[contains(translate(normalize-space(.), "{letras_maiusc}", '
                f'"{letras_minusc}"), "{label_lower}") and (self::label or self::span '
                f'or self::div)][1]/following::input[1]'
            ),
            # 5) aria-label
            (
                f'//input[contains(translate(@aria-label, "{letras_maiusc}", '
                f'"{letras_minusc}"), "{label_lower}")]'
            ),
        ]
        for xp in xpath_opcoes:
            try:
                campo = self._wait_curto(6).until(EC.presence_of_element_located((By.XPATH, xp)))
                self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", campo)
                self._esconder_widgets_flutuantes()
                try:
                    campo.click()
                except ElementClickInterceptedException:
                    self.driver.execute_script("arguments[0].click();", campo)
                campo.clear()
                campo.send_keys(valor)
                # dispara eventos de input/change, já que apps Angular/React
                # às vezes só reagem a eventos JS, não a send_keys puro
                self.driver.execute_script(
                    "arguments[0].dispatchEvent(new Event('input', {bubbles:true}));"
                    "arguments[0].dispatchEvent(new Event('change', {bubbles:true}));",
                    campo,
                )
                # Muitos formulários Angular só validam (e liberam o botão
                # CONTINUAR) quando o campo perde o foco. send_keys sozinho
                # não gera 'blur', então forçamos isso aqui + um TAB real
                # pra simular o comportamento normal do usuário.
                campo.send_keys("\t")
                self.driver.execute_script("arguments[0].dispatchEvent(new Event('blur', {bubbles:true}));", campo)
                time.sleep(0.3)
                return campo
            except TimeoutException:
                continue

        self._salvar_debug(f"campo_nao_encontrado_{label_texto}")
        raise CRLVBotError(
            f"Não encontrei o campo '{label_texto}' na página. "
            f"Screenshot e HTML salvos na pasta debug pra eu ajustar o seletor."
        )

    def _preencher_cnpj(self, cnpj):
        # Reaproveita as mesmas estratégias robustas de busca; só evita
        # sobrescrever se o campo já vier pré-preenchido pelo próprio site.
        letras_maiusc = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÂÊÔÃÕÇ"
        letras_minusc = "abcdefghijklmnopqrstuvwxyzáéíóúâêôãõç"
        # O campo tem máscara (__.___.___/____-__): se mandarmos o CNPJ já
        # formatado com pontos/barra, a máscara conflita com os separadores
        # que ela mesma tenta inserir e o campo fica vazio. Mandamos só os
        # dígitos, do jeito que um usuário real digitaria.
        cnpj_digitos = "".join(ch for ch in cnpj if ch.isdigit())
        xpath_opcoes = [
            "//input[@placeholder='CNPJ']",
            (
                f'//input[contains(translate(@placeholder, "{letras_maiusc}", '
                f'"{letras_minusc}"), "cnpj")]'
            ),
            (
                f'//input[contains(translate(@id, "{letras_maiusc}", "{letras_minusc}"), "cnpj") '
                f'or contains(translate(@name, "{letras_maiusc}", "{letras_minusc}"), "cnpj")]'
            ),
        ]
        for xp in xpath_opcoes:
            try:
                campo = self._wait_curto(6).until(EC.presence_of_element_located((By.XPATH, xp)))
                valor_atual = (campo.get_attribute("value") or "").strip()
                # Considera "vazio" também o texto da máscara sem nenhum
                # dígito digitado (ex: "__.___.___/____-__").
                if not any(ch.isdigit() for ch in valor_atual):
                    self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", campo)
                    self._esconder_widgets_flutuantes()
                    try:
                        campo.click()
                    except ElementClickInterceptedException:
                        self.driver.execute_script("arguments[0].click();", campo)
                    campo.clear()
                    campo.send_keys(cnpj_digitos)
                    self.driver.execute_script(
                        "arguments[0].dispatchEvent(new Event('input', {bubbles:true}));"
                        "arguments[0].dispatchEvent(new Event('change', {bubbles:true}));",
                        campo,
                    )
                    campo.send_keys("\t")
                    self.driver.execute_script("arguments[0].dispatchEvent(new Event('blur', {bubbles:true}));", campo)
                    time.sleep(0.3)
                return
            except TimeoutException:
                continue
        self._salvar_debug("campo_cnpj_nao_encontrado")
        raise CRLVBotError("Não encontrei o campo 'CNPJ' na página.")

    def _selecionar_estado_cidade(self, estado, cidade):
        try:
            select_estado = Select(
                self._wait().until(
                    EC.presence_of_element_located((By.XPATH, "//label[contains(.,'Estado')]/following::select[1]"))
                )
            )
            if select_estado.first_selected_option.text.strip() != estado:
                select_estado.select_by_visible_text(estado)

            select_cidade = Select(
                self._wait().until(
                    EC.presence_of_element_located((By.XPATH, "//label[contains(.,'Cidade')]/following::select[1]"))
                )
            )
            if select_cidade.first_selected_option.text.strip() != cidade:
                select_cidade.select_by_visible_text(cidade)

            self._clicar_por_texto("CONTINUAR")
        except TimeoutException:
            pass  # tela pode não aparecer se já estiver salva

    def _aguardar_download(self, arquivos_antes=None, timeout=90):
        """
        Espera o PDF aparecer E terminar de ser escrito no disco.

        `arquivos_antes` deve ser o snapshot da pasta tirado ANTES do clique
        que dispara o download (veja o comentário no baixar_crlv sobre a
        corrida de tempo com downloads instantâneos). Se não vier, cai pro
        comportamento antigo (snapshot tirado agora) só por segurança.
        """
        fim = time.time() + timeout
        antes = arquivos_antes if arquivos_antes is not None else set(os.listdir(self.download_dir))
        candidato = None

        while time.time() < fim:
            agora = set(os.listdir(self.download_dir))
            novos = [
                f for f in (agora - antes)
                if f.lower().endswith(".pdf") and not f.endswith(".crdownload")
            ]
            if novos:
                candidato = os.path.join(self.download_dir, novos[0])
                break
            time.sleep(1)

        if not candidato:
            raise CRLVBotError("O PDF do CRLV-e não foi baixado a tempo.")

        # Espera o tamanho parar de mudar (arquivo realmente terminou de
        # ser escrito), com um teto de segurança de 20s extras.
        fim_estab = time.time() + 20
        tamanho_anterior = -1
        estavel_desde = None
        while time.time() < fim_estab:
            try:
                tamanho_atual = os.path.getsize(candidato)
            except OSError:
                tamanho_atual = -1

            if tamanho_atual > 0 and tamanho_atual == tamanho_anterior:
                if estavel_desde is None:
                    estavel_desde = time.time()
                elif time.time() - estavel_desde >= 1.0:
                    break
            else:
                estavel_desde = None

            tamanho_anterior = tamanho_atual
            time.sleep(0.5)

        # Confere se é mesmo um PDF válido (assinatura "%PDF" no início).
        try:
            with open(candidato, "rb") as f:
                cabecalho = f.read(5)
        except OSError:
            cabecalho = b""

        if not cabecalho.startswith(b"%PDF"):
            self._salvar_debug("pdf_corrompido")
            raise CRLVBotError(
                "O arquivo baixado não é um PDF válido (download incompleto "
                "ou interrompido). Tente gerar novamente."
            )

        return candidato

    def _localizar_botao_gerar_documento(self):
        """
        Localiza o botão final 'Gerar Documento CRLV-e' tentando cada tipo
        de elemento realmente clicável em ordem de prioridade (button, a,
        input, [role=button], [onclick]) -- de propósito SEM cair pro
        fallback //*[contains(...)] que o _clicar_por_texto genérico usa
        como último recurso.

        Esse wildcard é o suspeito nº 1 pra um clique que "roda sem erro
        mas não faz nada": ele pega o PRIMEIRO elemento (em ordem de
        documento) cujo texto contém "Gerar Documento CRLV-e" -- e como
        texto de filho conta pro pai também (via normalize-space), isso
        costuma achar primeiro um <div>/<section> que ENVOLVE o botão de
        verdade, não o botão em si. O Selenium clica nesse pai -- não
        lança exceção nenhuma (o elemento existe, está visível), só que
        ele não tem handler nenhum associado, então literalmente não
        acontece nada na página.
        """
        letras_maiusc = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÂÊÔÃÕÇ"
        letras_minusc = "abcdefghijklmnopqrstuvwxyzáéíóúâêôãõç"
        texto_lower = "gerar documento crlv-e"

        xpaths_em_ordem = [
            f'//button[contains(translate(normalize-space(.), "{letras_maiusc}", "{letras_minusc}"), "{texto_lower}")]',
            f'//a[contains(translate(normalize-space(.), "{letras_maiusc}", "{letras_minusc}"), "{texto_lower}")]',
            (
                f'//input[@type="submit" or @type="button"]'
                f'[contains(translate(@value, "{letras_maiusc}", "{letras_minusc}"), "{texto_lower}")]'
            ),
            f'//*[@role="button"][contains(translate(normalize-space(.), "{letras_maiusc}", "{letras_minusc}"), "{texto_lower}")]',
            f'//*[@onclick][contains(translate(normalize-space(.), "{letras_maiusc}", "{letras_minusc}"), "{texto_lower}")]',
        ]
        for xp in xpaths_em_ordem:
            try:
                return self._wait_curto(6).until(EC.visibility_of_element_located((By.XPATH, xp)))
            except TimeoutException:
                continue
        return None

    def _verificar_e_liberar_sobreposicao(self, el, log_func=print):
        """
        Confere se existe algum outro elemento visualmente POR CIMA do
        centro do botão -- um overlay/tooltip/banner novo que o
        _esconder_widgets_flutuantes ainda não conhece (ele só cobre os
        seletores conhecidos do VLibras). Se tiver, loga o que é e
        remove o pointer-events dele na hora, sem precisar saber o
        seletor de antemão. Isso ajuda tanto a resolver quanto a
        DIAGNOSTICAR -- se acontecer nessa execução, o log vai dizer
        exatamente o que estava cobrindo o botão.
        """
        try:
            info = self.driver.execute_script(
                """
                var el = arguments[0];
                var r = el.getBoundingClientRect();
                var x = r.left + r.width / 2;
                var y = r.top + r.height / 2;
                var topo = document.elementFromPoint(x, y);
                if (!topo || topo === el || el.contains(topo)) { return null; }
                topo.style.pointerEvents = 'none';
                return topo.outerHTML.slice(0, 200);
                """,
                el,
            )
            if info:
                log_func(f"Havia um elemento por cima do botão (removi): {info}")
        except Exception:
            pass

    def _clicar_gerar_documento(self, log_func=print, arquivos_antes=None, tentativas=4, espera_por_tentativa=4):
        """
        Clique dedicado pro botão final 'Gerar Documento CRLV-e' -- o
        passo mais crítico do fluxo (é o que dispara o download), e o
        que passou a falhar de forma SILENCIOSA: o clique "roda" sem
        lançar exceção, mas nada acontece na tela, e o robô só descobre
        isso ~90s depois, no timeout do _aguardar_download.

        Diferente do _clicar_por_texto genérico usado no resto do fluxo,
        aqui a gente:
        1) Nunca usa o fallback //*[contains(...)] (ver motivo em
           _localizar_botao_gerar_documento).
        2) Confere e libera qualquer elemento sobreposto ao botão antes
           de cada clique, logando o que encontrou.
        3) Depois de cada tentativa, espera alguns segundos e confere se
           apareceu arquivo novo -- se sim, retorna na hora. Se não,
           tenta de novo com uma estratégia de clique mais "forte"
           (nativo -> JS puro -> sequência completa de eventos de
           mouse), já que alguns componentes só reagem de verdade a um
           desses.
        4) Salva screenshot + HTML a cada tentativa (sucesso ou não),
           pra ter evidência real do que estava na tela nesse passo
           específico, se precisar analisar depois.

        Se depois de todas as tentativas ainda não apareceu arquivo, NÃO
        lança erro aqui -- só loga e devolve. Quem decide se é erro de
        verdade é o _aguardar_download logo em seguida (mesma mensagem
        de sempre pro usuário final), então o comportamento no pior caso
        fica igual ao de antes, só que com mais chances de ter
        funcionado no meio do caminho.
        """
        antes = arquivos_antes if arquivos_antes is not None else set(os.listdir(self.download_dir))

        def _tem_arquivo_novo():
            agora = set(os.listdir(self.download_dir))
            return bool([f for f in (agora - antes) if not f.endswith(".crdownload")])

        for tentativa in range(1, tentativas + 1):
            self._esconder_widgets_flutuantes()
            el = self._localizar_botao_gerar_documento()

            if el is None:
                log_func(f"Tentativa {tentativa}/{tentativas}: ainda não achei o botão, tentando de novo...")
                self._salvar_debug(f"botao_gerar_nao_encontrado_tentativa_{tentativa}")
                time.sleep(1.5)
                continue

            try:
                self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
                time.sleep(0.2)
                self._esconder_widgets_flutuantes()
                self._verificar_e_liberar_sobreposicao(el, log_func=log_func)

                # Espera sair de eventual estado disabled (igual ao CONTINUAR).
                fim = time.time() + 5
                while time.time() < fim:
                    disabled = el.get_attribute("disabled") or el.get_attribute("aria-disabled")
                    classe = (el.get_attribute("class") or "").lower()
                    if not disabled and disabled != "true" and "disabled" not in classe:
                        break
                    time.sleep(0.3)

                log_func(f"Tentativa {tentativa}/{tentativas} de clicar em 'Gerar Documento CRLV-e'...")

                if tentativa == 1:
                    # 1ª tentativa: clique "normal" do Selenium, o mais
                    # parecido com um clique real de usuário.
                    try:
                        el.click()
                    except ElementClickInterceptedException:
                        self.driver.execute_script("arguments[0].click();", el)
                elif tentativa == 2:
                    # 2ª: força via JS puro (contorna overlay que
                    # intercepta sem lançar erro nenhum).
                    self.driver.execute_script("arguments[0].click();", el)
                else:
                    # 3ª+: dispara a sequência completa de eventos de
                    # mouse -- alguns componentes só tratam de verdade
                    # esse trio (mousedown/mouseup/click), não só um
                    # evento 'click' sintético isolado.
                    self.driver.execute_script(
                        """
                        var el = arguments[0];
                        ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(function(tipo) {
                            el.dispatchEvent(new MouseEvent(tipo, {bubbles: true, cancelable: true, view: window}));
                        });
                        """,
                        el,
                    )
            except Exception as e:
                log_func(f"Tentativa {tentativa} deu erro ao clicar: {e}")

            self._salvar_debug(f"apos_clicar_gerar_documento_tentativa_{tentativa}")

            fim_espera = time.time() + espera_por_tentativa
            while time.time() < fim_espera:
                if _tem_arquivo_novo():
                    log_func("O clique funcionou -- o download já começou.")
                    return
                time.sleep(0.5)

        log_func(
            f"Cliquei {tentativas}x em 'Gerar Documento CRLV-e' e nenhum "
            "arquivo novo apareceu ainda -- seguindo pra espera final "
            "(pode só estar demorando a gerar do lado do Detran)."
        )

    def baixar_crlv(self, cpf, renavam, placa, cnpj, log_func=print, task_id=None):
        d = self.driver

        def _step(pct, msg):
            log_func(msg)
            if task_id:
                update_task_progress(task_id, pct, msg, msg)

        try:
            _step(10, "1) Abrindo página do serviço...")
            d.get(URL_SERVICO)
            self._aceitar_cookies()
            self._clicar_emitir()

            _step(20, "2) Informando CPF...")
            self._preencher_por_label("Por favor, informe seu CPF", cpf)
            self._clicar_por_texto("CONTINUAR")

            _step(30, "3) Clicando em Registrar login...")
            self._clicar_por_texto("Registrar login")

            _step(40, "4) Selecionando login por Certificado Digital - eCPF...")
            try:
                self._clicar_por_texto("Certificado Digital")
            except UnexpectedAlertPresentException:
                # o alerta pode disparar antes mesmo do clique terminar
                pass

            _step(55, "5) Resolvendo alerta + caixa de certificado (ordem pode variar)...")
            login_ok = self._resolver_login_certificado(log_func=log_func, timeout=25)

            if not login_ok:
                log_func("Login não completou -- tentando de novo (1x)...")
                try:
                    self._clicar_por_texto("Certificado Digital")
                except UnexpectedAlertPresentException:
                    pass
                login_ok = self._resolver_login_certificado(log_func=log_func, timeout=25)

            if not login_ok:
                raise CRLVBotError(
                    "O login por certificado não completou depois de 2 "
                    "tentativas (a página continuou na tela de login). "
                    "Isso não é problema de seletor -- o certificado "
                    "provavelmente não está sendo enviado/aceito de fato "
                    "nessa execução automatizada. Screenshot e HTML salvos "
                    f"em {os.path.join(self.download_dir, 'debug')}."
                )

            _step(65, "6) Conferindo Estado/Cidade (PR / Maringá)...")
            self._selecionar_estado_cidade("PR", "Maringá")

            _step(75, "7) Indo para 'Informe veículo de pessoa jurídica'...")
            try:
                self._clicar_por_texto("Informe algum veículo de propriedade de Pessoa Jurídica")
            except TimeoutException:
                pass  # site pode pular direto pra tela de Renavam/Placa/CNPJ

            _step(85, "8) Preenchendo Renavam, Placa e CNPJ...")
            self._preencher_por_label("Renavam", renavam)
            self._preencher_por_label("Placa", placa)
            self._preencher_cnpj(cnpj)
            self._clicar_por_texto("CONTINUAR")

            _step(92, "9) Gerando documento CRLV-e...")
            # IMPORTANTE: captura o estado da pasta ANTES de clicar. Quando o
            # CRLV já está pronto no Detran, o download é quase instantâneo.
            arquivos_antes = set(os.listdir(self.download_dir))
            self._clicar_gerar_documento(log_func=log_func, arquivos_antes=arquivos_antes)

            _step(96, "10) Aguardando download do PDF...")
            caminho_pdf = self._aguardar_download(arquivos_antes=arquivos_antes)
            log_func(f"PDF baixado temporariamente em: {caminho_pdf}")
            return caminho_pdf

        except CRLVBotError:
            self._salvar_debug("erro_crlvboterror")
            raise
        except TimeoutException as e:
            self._salvar_debug("erro_timeout")
            raise CRLVBotError(
                "Um dos passos demorou demais ou o elemento não foi encontrado. "
                "O site pode ter mudado, ou o Renavam/Placa/CNPJ informados estão "
                f"incorretos. Screenshot e HTML da tela salvos em "
                f"{os.path.join(self.download_dir, 'debug')} para análise. "
                f"Detalhe técnico: {e}"
            )
        except Exception as e:
            self._salvar_debug("erro_geral")
            raise CRLVBotError(f"Erro inesperado no robô: {e}")


def executar_crlv_invisivel(task_id_ou_renavam, renavam_ou_placa=None, placa_ou_cnpj=None, cnpj_opcional=None):
    """
    Função chamada pelo Task Queue ou diretamente.
    Suporta ambas as assinaturas:
    - executar_crlv_invisivel(task_id, renavam, placa, cnpj)
    - executar_crlv_invisivel(renavam, placa, cnpj) [legado]
    """
    if cnpj_opcional is not None or (renavam_ou_placa and placa_ou_cnpj and len(task_id_ou_renavam) <= 20 and '_' in task_id_ou_renavam):
        task_id = task_id_ou_renavam
        renavam = renavam_ou_placa
        placa = placa_ou_cnpj
        cnpj = cnpj_opcional
    else:
        task_id = None
        renavam = task_id_ou_renavam
        placa = renavam_ou_placa
        cnpj = placa_ou_cnpj

    cnpj_final = (cnpj or CNPJ_PADRAO).strip() or CNPJ_PADRAO
    pasta_download = tempfile.mkdtemp(prefix="crlv_")
    headless = os.getenv("CRLV_HEADLESS", "true").lower() != "false"

    bot = None
    try:
        msg_ini = "🤖 Abrindo o navegador e acessando o Detran-PR..."
        set_status_crlv(False, msg_ini)
        if task_id:
            update_task_progress(task_id, 5, msg_ini, f"Iniciando emissão para placa {placa}, Renavam {renavam}")

        bot = CRLVBot(download_dir=pasta_download, headless=headless)

        def log(msg):
            set_status_crlv(False, f"⏳ {msg}")
            print(f"[CRLV {task_id or placa}] {msg}")

        caminho_pdf_temp = bot.baixar_crlv(
            cpf=CPF_LOGIN,
            renavam=renavam,
            placa=placa,
            cnpj=cnpj_final,
            log_func=log,
            task_id=task_id,
        )

        # Salva permanentemente no storage para permitir re-download seguro
        caminho_permanente = caminho_pdf_temp
        if task_id:
            salvo = save_task_artifact(task_id, caminho_pdf_temp, filename_suffix=f"{placa.upper()}.pdf")
            if salvo:
                caminho_permanente = salvo

        msg_sucesso = f"✅ CRLV-e da placa {placa.upper()} gerado com sucesso!"
        set_status_crlv(True, msg_sucesso, arquivo=caminho_permanente)
        if task_id:
            set_task_completed(
                task_id,
                msg=msg_sucesso,
                result={
                    'renavam': renavam,
                    'placa': placa.upper(),
                    'cnpj': cnpj_final,
                    'arquivo': caminho_permanente
                },
                artifact_path=caminho_permanente
            )

    except CRLVBotError as e:
        msg_err = f"❌ {e}"
        set_status_crlv(True, msg_err)
        if task_id:
            set_task_failed(task_id, str(e))
    except Exception as e:
        msg_err = f"❌ Erro inesperado no robô: {e}"
        set_status_crlv(True, msg_err)
        if task_id:
            set_task_failed(task_id, 'Erro inesperado no robô Detran.', log_line=str(e))
    finally:
        if bot:
            bot.fechar()
            shutil.rmtree(pasta_download, ignore_errors=True)