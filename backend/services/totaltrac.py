import os
import time

from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


TOTALTRAC_LOGIN_URL = 'https://totaltracmanager.com.br/login'
TOTALTRAC_ESPELHAMENTO_URL = 'https://totaltracmanager.com.br/espelhamento_placa'
TOTALTRAC_USUARIO_ESPELHAMENTO = 'UNICAMPO'
DEFAULT_WAIT_SECONDS = 15


def iniciar_totaltrac():
    print('🤖 Abrindo o navegador Google Chrome...')

    login = os.getenv('TOTALTRAC_LOGIN')
    senha = os.getenv('TOTALTRAC_SENHA')

    if not login or not senha:
        print('❌ Configure TOTALTRAC_LOGIN e TOTALTRAC_SENHA no arquivo .env.')
        return None

    options = webdriver.ChromeOptions()
    options.add_argument('--start-maximized')

    driver = webdriver.Chrome(options=options)
    driver.get(TOTALTRAC_LOGIN_URL)
    wait = WebDriverWait(driver, DEFAULT_WAIT_SECONDS)

    try:
        campo_usuario = wait.until(
            EC.presence_of_element_located((By.XPATH, "//input[not(@type='hidden') and not(@type='password')]"))
        )
        campo_senha = driver.find_element(By.XPATH, "//input[@type='password']")

        campo_usuario.send_keys(login)
        time.sleep(0.5)
        campo_senha.send_keys(senha)
        time.sleep(0.5)
        campo_senha.send_keys(Keys.RETURN)

        print('⏳ Aguardando login no sistema...')
        wait.until(EC.url_contains('mapa'))
        time.sleep(3)
        return driver
    except Exception as erro:
        print(f'🔥 Erro no login do TotalTrac: {erro}')
        driver.quit()
        return None


def abrir_tela_espelhamento(driver, wait):
    if 'espelhamento' in driver.current_url.lower():
        return

    try:
        xpath_logistica = "//span[contains(text(), 'Logistica') or contains(text(), 'Logística')]"
        menu_logistica = wait.until(EC.presence_of_element_located((By.XPATH, xpath_logistica)))
        driver.execute_script('arguments[0].click();', menu_logistica)
        time.sleep(1.5)

        xpath_espelhamento = "//span[contains(text(), 'Espelhamento de Placa')]"
        menu_espelhamento = wait.until(EC.presence_of_element_located((By.XPATH, xpath_espelhamento)))
        driver.execute_script('arguments[0].click();', menu_espelhamento)
    except Exception:
        driver.get(TOTALTRAC_ESPELHAMENTO_URL)

    time.sleep(2)


def selecionar_placa_no_dropdown(driver, wait, placa, log_func):
    """
    Estrutura real do HTML (confirmada via DevTools):
      div.dropdown-container         → clica para abrir
        div.dropdown-heading         → cabeçalho com "Select..."
        div.dropdown-content
          div.panel-content
            div.select-panel[role=listbox]
              div.search > input     → campo de busca (sem placeholder)
              ul.options
                li > label.select-item[role=option]   → "Selecionar Todos"
                li > label.select-item[role=option]   → cada placa
                  div.item-renderer
                    input[type=checkbox]
                    span               → texto da placa
    """

    # 1. Clica no div.dropdown-heading para abrir (confirmado via console JS)
    dropdown_heading = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//label[contains(text(),'Placas')]/following-sibling::div//div[contains(@class,'dropdown-heading')]")
    ))
    driver.execute_script('arguments[0].click();', dropdown_heading)
    time.sleep(1.5)

    # 2. Acha o input dentro de div.search e digita a placa
    campo_busca = wait.until(EC.presence_of_element_located(
        (By.XPATH, "//div[contains(@class,'dropdown-content')]//div[contains(@class,'search')]//input")
    ))
    campo_busca.click()
    campo_busca.clear()
    campo_busca.send_keys(placa.upper())
    time.sleep(2)
    log_func(f'   ➔ Placa {placa} digitada no campo de busca.')

    # 3. Procura o label.select-item cujo span tenha EXATAMENTE o texto da placa
    #    O primeiro label é sempre "Selecionar Todos" — queremos apenas o da placa
    xpath_placa = (
        f"//div[contains(@class,'dropdown-content')]"
        f"//ul[contains(@class,'options')]"
        f"//label[contains(@class,'select-item')]"
        f"//span[normalize-space(text())='{placa.upper()}']"
        f"/ancestor::label"
    )

    try:
        label_placa = wait.until(EC.element_to_be_clickable((By.XPATH, xpath_placa)))
        driver.execute_script('arguments[0].click();', label_placa)
        log_func(f'   ➔ Placa {placa} selecionada com sucesso.')
    except Exception as e:
        # Plano B: dentro do ul.options, pega todos os li visíveis,
        # pula o primeiro (Selecionar Todos) e clica no segundo
        log_func(f'   ⚠️ XPath direto falhou ({e}), tentando plano B...')
        itens = driver.find_elements(
            By.XPATH,
            "//div[contains(@class,'dropdown-content')]//ul[contains(@class,'options')]//li"
        )
        visiveis = [li for li in itens if li.is_displayed()]
        # índice 0 = "Selecionar Todos", índice 1 em diante = placas filtradas
        if len(visiveis) >= 2:
            driver.execute_script('arguments[0].click();', visiveis[1])
            log_func(f'   ➔ Placa {placa} selecionada via plano B (li índice 1).')
        elif len(visiveis) == 1:
            driver.execute_script('arguments[0].click();', visiveis[0])
            log_func(f'   ➔ Placa selecionada (único item visível).')
        else:
            log_func(f'   ❌ Placa {placa} não encontrada no dropdown!')
            return

    time.sleep(1)

    # 4. Fecha o dropdown clicando no título do modal
    titulo_modal = driver.find_element(By.XPATH, "//*[contains(text(),'Criar Novo Espelhamento')]")
    driver.execute_script('arguments[0].click();', titulo_modal)
    time.sleep(1)


def realizar_espelhamento(driver, placa, log_func):
    wait = WebDriverWait(driver, DEFAULT_WAIT_SECONDS)
    actions = ActionChains(driver)

    try:
        log_func(f'   ➔ Incluindo placa {placa}...')
        abrir_tela_espelhamento(driver, wait)

        # Abre o modal de novo espelhamento
        botao_novo = wait.until(EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(), 'Novo Espelhamento')]")
        ))
        driver.execute_script('arguments[0].click();', botao_novo)
        wait.until(EC.visibility_of_element_located(
            (By.XPATH, "//*[contains(text(), 'Criar Novo Espelhamento')]")
        ))
        time.sleep(1)

        # Preenche o campo Usuário com UNICAMPO
        label_usuario = driver.find_element(By.XPATH, "//label[contains(text(), 'Usuário')]")
        actions.move_to_element(label_usuario).move_by_offset(0, 35).click().perform()
        time.sleep(1)
        actions.send_keys(TOTALTRAC_USUARIO_ESPELHAMENTO).perform()
        time.sleep(2)
        actions.send_keys(Keys.ENTER).perform()
        time.sleep(1)

        # Seleciona a placa no dropdown
        selecionar_placa_no_dropdown(driver, wait, placa, log_func)

        # Confirma
        botao_confirmar = wait.until(EC.presence_of_element_located(
            (By.XPATH, "//*[contains(text(), 'CONFIRMAR') or contains(text(), 'Confirmar')]")
        ))
        driver.execute_script('arguments[0].click();', botao_confirmar)
        time.sleep(4)
        log_func(f'   ✅ INCLUSÃO: Placa {placa} cadastrada com sucesso!')

    except Exception as erro:
        log_func(f'   🔥 Erro na inclusão {placa}: {erro}')


def deletar_espelhamento(driver, placa, log_func):
    wait = WebDriverWait(driver, DEFAULT_WAIT_SECONDS)

    try:
        log_func(f'   ➔ Removendo placa {placa}...')
        abrir_tela_espelhamento(driver, wait)

        filtro_placa = wait.until(EC.presence_of_element_located(
            (By.XPATH, "//input[@aria-label='Placa Filter Input']")
        ))
        filtro_placa.send_keys(Keys.CONTROL + 'a')
        filtro_placa.send_keys(Keys.BACKSPACE)
        time.sleep(0.5)
        filtro_placa.send_keys(placa)
        time.sleep(2.5)

        lixeira = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[@title='Deletar']")
        ))
        try:
            lixeira.click()
        except Exception:
            driver.execute_script('arguments[0].click();', lixeira)

        time.sleep(1.5)

        botao_confirmar = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[text()='Confirmar']")
        ))
        try:
            botao_confirmar.click()
        except Exception:
            driver.execute_script('arguments[0].click();', botao_confirmar)

        time.sleep(3)
        log_func(f'   🗑️ EXCLUSÃO: Placa {placa} removida com sucesso!')

    except Exception as erro:
        log_func(f'   ⚠️ ERRO ao remover a placa {placa}: {erro}')
