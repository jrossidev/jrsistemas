// A API_BASE_URL não pode mais ser sempre "window.location.origin":
// isso só funciona quando o Flask está servindo o próprio frontend
// (local ou acessando o ngrok diretamente). Quando o site é acessado
// via jrsistemas.netlify.app (hospedagem estática, separada do
// backend), window.location.origin vira "https://jrsistemas.netlify.app",
// que não tem nenhuma das rotas da API -- por isso as outras máquinas
// não conseguiam gerar/baixar nada.
//
// AQUI: troque a URL abaixo pela URL atual do seu ngrok (ou pelo IP
// fixo do servidor, se tiver). Toda vez que o ngrok reiniciar com uma
// URL nova, é só atualizar essa linha e publicar de novo no Netlify.
const BACKEND_URL_FIXO = "https://nonreflected-kip-bagwigged.ngrok-free.dev";

function resolverApiBaseUrl() {
    const origem = window.location.origin;

    // Se a página está sendo servida pelo próprio Flask/ngrok, a origem
    // já é o backend -- continua usando ela normalmente (não precisa
    // editar nada nesse caso, nem quando o ngrok mudar de URL).
    const servidoPeloProprioBackend =
        origem.startsWith("http://localhost") ||
        origem.startsWith("http://127.0.0.1") ||
        origem.startsWith("http://192.168.") ||
        origem.includes(".ngrok-free.app") ||
        origem.includes(".ngrok.io") ||
        origem.includes(".ngrok.app");

    if (servidoPeloProprioBackend) {
        return origem;
    }

    // Qualquer outra origem (ex: jrsistemas.netlify.app) precisa da URL
    // fixa configurada acima, já que ela mesma não tem a API.
    return BACKEND_URL_FIXO;
}

window.APP_CONFIG = {
    API_BASE_URL: resolverApiBaseUrl()
};