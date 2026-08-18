# JR Sistemas

Sistema de gestão operacional e automações corporativas para frotas e locação de veículos.

---

## 🚀 Funcionalidades

- **📄 Gestão Contratual & Propostas**: Geração dinâmica de propostas comerciais, contratos de locação e termos aditivos em PDF.
- **🛞 Manutenção & Calculadora de Pneus**: Cálculo automático de desgaste, vida útil e ressarcimento proporcional por quilometragem.
- **📑 Emissão Automática de CRLV-e**: Integração automatizada com o Detran-PR para emissão e download direto de CRLV-e pessoa jurídica.
- **🤖 Automação Logística (TotalTrac & VEX)**: Robô de sincronização inteligente de vistorias e processamento de placas em lote via Selenium RPA.
- **⚡ Fila de Execução (Task Queue)**: Gerenciamento assíncrono com SQLite WAL e workers dedicados para controle de concorrência e estabilidade.

---

## 🛠️ Tecnologias

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 moderno com tema responsivo.
- **Backend**: Python 3, Flask, SQLite3, Selenium WebDriver.
- **Deploy**: Hospedagem estática (Netlify) + Túnel seguro / Servidor local (Ngrok / LAN).

---

## 📁 Estrutura do Projeto

```txt
jrsistemas/
├── index.html                  # Interface principal (SPA com navegação dinâmica)
├── src/
│   ├── css/                    # Estilização global e modular
│   ├── js/                     # Lógica da aplicação e roteamento
│   └── modules/                # Módulos (Proposta, Contrato, Anexo, Robô, CRLV, Pneus)
└── backend/
    ├── app.py                  # API REST Flask
    ├── task_manager.py         # Gerenciador de fila e workers
    ├── requirements.txt        # Dependências Python
    └── services/               # Serviços de automação (TotalTrac, VEX, CRLV)
```

---

## ⚙️ Instalação e Execução

### 1. Pré-requisitos
- Python 3.10 ou superior
- Google Chrome instalado

### 2. Configurando o Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

---

## 🔒 Segurança e Privacidade
- Arquivos de configuração sensíveis (`.env`), certificados digitais (`.pfx`) e bancos de dados locais são estritamente isolados e não versionados.
