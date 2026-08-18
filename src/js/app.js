const MODULE_PATHS = {
    proposta: './src/modules/proposta.html',
    contrato: './src/modules/contrato.html',
    anexo: './src/modules/anexo.html',
    robo: './src/modules/robo.html',
    crlv: './src/modules/crlv.html',
    pneus: './src/modules/pneus.html',
};

function setGreeting() {
    const greetingElement = document.getElementById('greeting');
    if (!greetingElement) return;

    const hour = new Date().getHours();
    let greeting = 'Olá';

    if (hour >= 5 && hour < 12) greeting = 'Bom dia';
    else if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
    else greeting = 'Boa noite';

    greetingElement.innerText = `${greeting}!`;
}

function setActiveButton(activeButton) {
    document.querySelectorAll('nav button').forEach((button) => {
        button.classList.remove('active');
    });

    activeButton.classList.add('active');
}

function showWelcomeScreen() {
    const welcome = document.getElementById('welcomeScreen');
    const frame = document.getElementById('appFrame');
    const loader = document.getElementById('loader');

    if (loader) loader.style.display = 'none';
    if (frame) {
        frame.style.display = 'none';
        frame.classList.remove('loaded');
        frame.removeAttribute('src');
    }
    if (welcome) welcome.style.display = 'flex';
}

function carregarApp(button, appId) {
    const modulePath = MODULE_PATHS[appId];
    const welcome = document.getElementById('welcomeScreen');
    const frame = document.getElementById('appFrame');
    const loader = document.getElementById('loader');

    if (!modulePath || !frame || !welcome || !loader) {
        console.error('Módulo não encontrado:', appId);
        showWelcomeScreen();
        return;
    }

    setActiveButton(button);
    closeMobileMenu();

    welcome.style.display = 'none';
    frame.style.display = 'block';
    frame.classList.remove('loaded');
    loader.style.display = 'flex';

    setTimeout(() => {
        frame.src = modulePath;
    }, 250);
}

function closeMobileMenu() {
    document.body.classList.remove('menu-open');
    const toggle = document.getElementById('menuToggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

function setupMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const backdrop = document.getElementById('sidebarBackdrop');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('menu-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    if (backdrop) backdrop.addEventListener('click', closeMobileMenu);

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMobileMenu();
    });
}

function setupNavigation() {
    document.querySelectorAll('nav button[data-app]').forEach((button) => {
        button.addEventListener('click', () => carregarApp(button, button.dataset.app));
    });

    document.querySelectorAll('[data-quick-app]').forEach((button) => {
        button.addEventListener('click', () => {
            const menuButton = document.querySelector(`nav button[data-app="${button.dataset.quickApp}"]`);
            if (menuButton) menuButton.click();
        });
    });

    const frame = document.getElementById('appFrame');
    const loader = document.getElementById('loader');

    if (frame && loader) {
        frame.addEventListener('load', () => {
            loader.style.display = 'none';
            frame.classList.add('loaded');
        });
    }
}

setGreeting();
setupNavigation();
setupMobileMenu();
