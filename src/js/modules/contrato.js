// ===== Bloco 1 do módulo contrato =====
// ==================== CACHE DE ELEMENTOS ====================
    const $ = id => document.getElementById(id);
    const elements = {
        form: $('contratoForm'),
        modeloVeiculo: $('modelo_veiculo'),
        placaVeiculo: $('placa_veiculo'),
        nomeCondutor: $('nome_condutor'),
        cpfCondutor: $('cpf_condutor'),
        rgCondutor: $('rg_condutor'),
        cepCondutor: $('cep_condutor'),
        enderecoCondutor: $('endereco_condutor'),
        bairroCondutor: $('bairro_condutor'),
        cidadeCondutor: $('cidade_condutor'),
        telefoneCondutor: $('telefone_condutor'),
        emailCondutor: $('email_condutor'),
        anoVeiculo: $('ano_veiculo'),
        chassiVeiculo: $('chassi_veiculo'),
        renaVeiculo: $('renavam_veiculo'),
        inicioContrato: $('inicio_contrato'),
        fimContrato: $('fim_contrato'),
        valorMensal: $('valor_mensal'),
        multaPages: () => document.querySelector('input[name="multaPages"]:checked'),
        multaPagesGroup: $('multaPagesGroup'),
        checkMultaBranco: $('checkMultaBranco'),
        checkTermoExtenso: $('checkTermoExtenso'),
        termoInfoCard: $('termoInfoCard'),
        btnConfig: $('btnConfig'),
        btnGerarPDF: $('btnGerarPDF'),
        alertContainer: $('alertContainer')
    };

    const logoBase64 = "data:image/png;base64,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";

    // ==================== UTILIDADES ====================
    const showAlert = (message, type = 'error') => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert show ${type}`;
        alertDiv.textContent = message;
        elements.alertContainer.innerHTML = '';
        elements.alertContainer.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    };

    const showFieldError = (fieldId, message) => {
        const input = $(fieldId);
        const errorEl = $(`err-${fieldId}`);
        if (input) {
            input.classList.add('error');
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.classList.add('show');
            }
        }
    };

    const clearFieldError = (fieldId) => {
        const input = $(fieldId);
        const errorEl = $(`err-${fieldId}`);
        if (input) {
            input.classList.remove('error');
            if (errorEl) {
                errorEl.classList.remove('show');
                errorEl.textContent = '';
            }
        }
    };

    // ==================== MÁSCARAS GENÉRICAS ====================
    const masks = {
        valor: (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v === '') { e.target.value = ''; return; }
            v = (v / 100).toFixed(2) + '';
            v = v.replace(".", ",");
            v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
            e.target.value = v;
        },

        data: (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
            if (v.length > 5) v = v.substring(0, 5) + '/' + v.substring(5, 9);
            e.target.value = v;
        },

        cpf: (e) => {
            let v = e.target.value.replace(/\D/g, '').substring(0, 11);
            v = v.replace(/(\d{3})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
            v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
            e.target.value = v;
        },

        cep: (e) => {
            const v = e.target.value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2');
            e.target.value = v;
        },

        telefone: (e) => {
            let v = e.target.value.replace(/\D/g, "");
            v = v.substring(0, 11); 
            v = v.replace(/^(\d{2})(\d)/g, "($1) $2"); 
            v = v.replace(/(\d)(\d{4})$/, "$1-$2");    
            e.target.value = v;
        }
    };

    // ==================== BUSCA DE CEP ====================
    const buscaCep = async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.ok) throw new Error('Erro na requisição');
            
            const data = await response.json();
            if (data.erro) {
                showAlert('CEP não encontrado', 'error');
                return;
            }

            elements.enderecoCondutor.value = data.logradouro || '';
            elements.bairroCondutor.value = data.bairro || '';
            elements.cidadeCondutor.value = `${data.localidade || ''} / ${data.uf || ''}`;
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            showAlert('Erro ao buscar CEP. Verifique sua conexão.', 'error');
        }
    };

    const setHoje = () => {
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();
        elements.inicioContrato.value = `${dia}/${mes}/${ano}`;
    };

    // ==================== VALIDAÇÃO ====================
    const validateForm = () => {
        let isValid = true;

        ['modelo_veiculo', 'placa_veiculo', 'nome_condutor'].forEach(field => clearFieldError(field));

        if (!elements.placaVeiculo.value.trim()) {
            showFieldError('placa_veiculo', 'Placa é obrigatória');
            isValid = false;
        }

        if (!elements.nomeCondutor.value.trim()) {
            showFieldError('nome_condutor', 'Nome do condutor é obrigatório');
            isValid = false;
        }

        if (!elements.modeloVeiculo.value.trim()) {
            showFieldError('modelo_veiculo', 'Modelo do veículo é obrigatório');
            isValid = false;
        }

        return isValid;
    };

    // ==================== INICIALIZAÇÃO ====================
    window.addEventListener('load', () => {
        document.getElementById('headerLogo').src = logoBase64;
        setHoje();

        // Adicionar listeners com event delegation
        elements.valorMensal.addEventListener('input', masks.valor);
        elements.inicioContrato.addEventListener('input', masks.data);
        elements.fimContrato.addEventListener('input', masks.data);
        elements.cpfCondutor.addEventListener('input', masks.cpf);
        elements.cepCondutor.addEventListener('input', masks.cep);
        elements.telefoneCondutor.addEventListener('input', masks.telefone);
        elements.cepCondutor.addEventListener('blur', buscaCep);

        [elements.placaVeiculo, elements.nomeCondutor, elements.modeloVeiculo].forEach(el => {
            el.addEventListener('input', (e) => clearFieldError(e.target.id));
        });

        // Liga/desliga o grupo de páginas de multa conforme o switch
        const toggleMultaPagesGroup = () => {
            const ativo = elements.checkMultaBranco.checked;
            elements.multaPagesGroup.style.opacity = ativo ? '1' : '0.4';
            elements.multaPagesGroup.querySelectorAll('input[name="multaPages"]').forEach(input => {
                input.disabled = !ativo;
            });
        };
        elements.checkMultaBranco.addEventListener('change', toggleMultaPagesGroup);
        toggleMultaPagesGroup();

        // Engrenagem: mostra/esconde o card "Termo de Informações"
        // (o termo continua ligado por padrão, 2 vias, mesmo escondido)
        elements.btnConfig.addEventListener('click', () => {
            const abrir = elements.termoInfoCard.hidden;
            elements.termoInfoCard.hidden = !abrir;
            elements.btnConfig.classList.toggle('active', abrir);
        });
    });

    // ==================== GERAÇÃO DO PDF ====================
    async function gerarPDF() {
        if (!validateForm()) {
            showAlert('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        try {
            elements.btnGerarPDF.disabled = true;

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');

            const lineHeight = 6; 

            const data = {
                nome_condutor: elements.nomeCondutor.value,
                cpf_condutor: elements.cpfCondutor.value,
                rg_condutor: elements.rgCondutor.value,
                cep_condutor: elements.cepCondutor.value,
                endereco_condutor: elements.enderecoCondutor.value,
                bairro_condutor: elements.bairroCondutor.value,
                cidade_condutor: elements.cidadeCondutor.value,
                telefone_condutor: elements.telefoneCondutor.value,
                email_condutor: elements.emailCondutor.value,
                modelo_veiculo: elements.modeloVeiculo.value,
                ano_veiculo: elements.anoVeiculo.value,
                placa_veiculo: elements.placaVeiculo.value,
                chassi_veiculo: elements.chassiVeiculo.value,
                renavam_veiculo: elements.renaVeiculo.value,
                inicio_contrato: elements.inicioContrato.value,
                fim_contrato: elements.fimContrato.value,
                valor_contrato: elements.valorMensal.value || '0,00',
            };

            const margin = 20;
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const contentWidth = pageWidth - margin * 2;
            let y = 20;

            // --- Lógica para Data por Extenso ---
            let dataExtenso;
            if (data.inicio_contrato && data.inicio_contrato.length === 10) {
                const partes = data.inicio_contrato.split('/');
                const dia = partes[0];
                const mesIndex = parseInt(partes[1]) - 1;
                const ano = partes[2];
                const meses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
                
                if (meses[mesIndex]) {
                    dataExtenso = `${dia} DE ${meses[mesIndex]} DE ${ano}`;
                } else {
                     const h = new Date();
                     dataExtenso = h.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
                }
            } else {
                const h = new Date();
                dataExtenso = h.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
            }
            // ------------------------------------

            const drawTableRow = (label, value) => {
                if (y > pageHeight - margin - 10) {
                    doc.addPage();
                    y = margin;
                }
                const rowHeight = 7;
                doc.setDrawColor(220, 220, 220);
                doc.rect(margin, y, contentWidth, rowHeight);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.text(label, margin + 2, y + 5);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                doc.text(String(value || ""), margin + 45, y + 5);
                y += rowHeight;
            };

            // ===== PÁGINA 1: ANEXO UNICAMPO =====
            if (logoBase64 && logoBase64.startsWith("data:image")) {
                doc.addImage(logoBase64, 'PNG', margin, 15, 50, 12);
            }

            y = 45;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text(`CONTRATO DE LOCAÇÃO DE VEÍCULO – PLACA ${data.placa_veiculo}`, pageWidth / 2, y, { align: 'center' });
            
            y += lineHeight * 2; 

            doc.setFont("helvetica", "normal");
            const textoBenali = `BENALI RENT A CAR LTDA, pessoa jurídica de direito privado, devidamente inscrita junto ao CNPJ/MF sob n. 15.373.411/0001-08, isenta de Inscrição Estadual, com endereço a Av. Dr Alexandre Rasgulaeff 5442 Jardim Paraizo CEP 87.083-000, na cidade de Maringá, Estado do Paraná, neste ato por seus representantes legais devidamente constituídos, ao final assinado.`;
            
            const linesBenali = doc.splitTextToSize(textoBenali, contentWidth);
            doc.text(linesBenali, margin, y);
            y += linesBenali.length * 5 + 5; 

            // Bloco Locatária
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text('LOCATÁRIA:', margin, y);
            y += 5;
            drawTableRow('Razão Social', 'Cooperativa de Trabalho dos Profissionais de Agronomia Ltda. Unicampo.');
            drawTableRow('CNPJ nº', '72.042.799/0001-90');
            drawTableRow('Insc. Estadual', 'Isenta');
            drawTableRow('Endereço', 'Av. Carneiro Leão, 65.');
            drawTableRow('Bairro', 'Zona 01');
            drawTableRow('CEP', '87014-010');
            drawTableRow('Cidade/UF', 'Maringá – PR');
            drawTableRow('Telefones', '4009-3829');
            drawTableRow('EMAIL', 'frota@unicampo.coop.br');
            y += 10;

            doc.setFont("helvetica", "normal");
            const textoVinculo = `Tendo em vista que em data anterior as PARTES formalizam CONTRATO DE LOCAÇAO DE VEÍCULOS PARA PESSOA JURIDICA, mediante clausulas e condições naquele pactuadas, RESOLVEM, por este instrumento, discriminar quais VEICULOS e CONDUTORES, estarão vinculados ao contrato principal, ao qual se comprometem em cumprir em todos os seus termos e condições:`;
            const linesVinculo = doc.splitTextToSize(textoVinculo, contentWidth);
            doc.text(linesVinculo, margin, y);
            y += linesVinculo.length * 5 + 5;

            // 1. DO VEÍCULO LOCADO
            doc.setFont("helvetica", "bold");
            doc.text('1. DO VEICULO LOCADO', margin, y);
            y += 5;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text('1.1. A LOCADORA disponibilizará, para a LOCATÁRIA, o seguinte veículo:', margin, y);
            y += 5;
            drawTableRow('VEÍCULO / COR', data.modelo_veiculo);
            drawTableRow('ANO / MODELO', data.ano_veiculo);
            drawTableRow('PLACA', data.placa_veiculo);
            drawTableRow('CHASSI', data.chassi_veiculo);
            drawTableRow('RENAVAN', data.renavam_veiculo);
            y += 8;

            // 1.2 CONDUTOR
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text('1.2. Terá como CONDUTOR, que deverá estar devidamente habilitado:', margin, y);
            y += 5;
            drawTableRow('Nome', data.nome_condutor);
            drawTableRow('CPF', data.cpf_condutor);
            drawTableRow('RG', data.rg_condutor);
            drawTableRow('Endereço/n.o', data.endereco_condutor);
            drawTableRow('BAIRRO', data.bairro_condutor);
            drawTableRow('Cidade / UF', `${data.cidade_condutor} CEP ${data.cep_condutor}`);
            drawTableRow('Telefones', data.telefone_condutor);
            drawTableRow('EMAIL’S', data.email_condutor);

            // Quebra de página se necessário
            if (y > pageHeight - 60) {
                doc.addPage();
                y = margin + 10;
            } else {
                y += 15;
            }

            // 2. DO PRAZO DE LOCAÇÃO
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text('2. DO PRAZO DE LOCAÇÃO', margin, y);
            y += 7;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`2.1. Terá início em: ${data.inicio_contrato} termino pactuado em: ${data.fim_contrato}`, margin, y);
            y += 7;
            const textoProrrog = `2.2. Poderá a locação de referido veículo ser prorrogada, mediante formalização de um e-mail, conforme regras estabelecidas no contrato original.`;
            doc.text(doc.splitTextToSize(textoProrrog, contentWidth), margin, y);
            y += 15;

            // 3. DO PREÇO E CONDIÇÕES
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text('3. DO PREÇO E CONDIÇOES', margin, y);
            y += 7;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.text(`3.1. O preço de locação mensal para referido veículo será de: R$ ${data.valor_contrato}`, margin, y);
            y += 7;
            doc.text(`3.2. Os valores serão devidamente reajustáveis conforme disciplinado no contrato principal.`, margin, y);
            y += 15;

            // 4. PARTE INTEGRANTE E INSEPARAVEL DO CONTRATO PRINCIPAL
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text('4. PARTE INTEGRANTE E INSEPARAVEL DO CONTRATO PRINCIPAL', margin, y);
            y += 7;
            doc.setFont("helvetica", "normal");
            const textoParteInt = `4.1. Este anexo é PARTE integrante e inseparável do contrato principal de locação de veículos para pessoa jurídica acima identificado, onde estão disciplinadas as demais condições da locação.`;
            doc.text(doc.splitTextToSize(textoParteInt, contentWidth), margin, y);
            y += 15;

            // 5. DAS DECLARAÇÕES
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text('5. DAS DECLARAÇOES', margin, y);
            y += 7;
            doc.setFont("helvetica", "normal");
            const textoDeclaracoes = `5.1. O LOCATÁRIO/CONDUTOR recebe o veículo em perfeitas condições de uso, conforme devidamente identificadas por seu preposto/condutor no TERMO DE VISTORIA – CHECK-LIST (ANEXO 01), que também é documento integrante e inseparável do contrato de locação identificado.`;
            doc.text(doc.splitTextToSize(textoDeclaracoes, contentWidth), margin, y);
            y += 20;

            // ENCERRAMENTO E ASSINATURAS
            const textoFinal = `Por estarem assim, justas e acordadas, assinam as PARTES o presente ANEXO em 02 (duas) vias de igual teor e forma, na presença das testemunhas devidamente identificadas, dando tudo por bom, firme e valioso.`;
            doc.text(doc.splitTextToSize(textoFinal, contentWidth), margin, y);
            y += 15;

            // Usando a data formatada baseada no início do contrato
            doc.text(`Maringá-PR, ${dataExtenso}`, margin, y);

            if (y > pageHeight - 60) {
                doc.addPage();
                y = 40;
            } else {
                y += 30;
            }

            const x1 = margin;
            const x2 = pageWidth / 2 + 10;

            y += 25;
            doc.setFontSize(10);
            doc.text('______________________________________', x1, y);
            doc.text('BENALI RENT A CAR LTDA.', x1, y + 5);
            doc.setFontSize(9);
            doc.text('LOCADORA', x1, y + 10);

            doc.setFontSize(10);
            doc.text('______________________________________', x2, y);
            doc.text(data.nome_condutor, x2, y + 5);
            doc.setFontSize(9);
            doc.text('CONDUTOR', x2, y + 10);

            // ===== FORMULÁRIOS DE MULTA (EM BRANCO) =====
if (elements.checkMultaBranco.checked) {
    const totalPagesMulta = Number(elements.multaPages()?.value || 3);
    const formsPerPage = 3;    // 3 autorizações por página = 6 no total
    const pageTopMargin = 8;
    const pageBottomMargin = 8;
    const usableHeight = pageHeight - pageTopMargin - pageBottomMargin;
    const formHeight = usableHeight / formsPerPage;

    for (let p = 0; p < totalPagesMulta; p++) {
        doc.addPage();

        for (let i = 0; i < formsPerPage; i++) {
            const startY = pageTopMargin + (i * formHeight);

            if (logoBase64 && logoBase64.startsWith("data:image")) {
                doc.addImage(logoBase64, 'PNG', margin, startY, 34, 9);
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9); // Título um pouco mais destacado
            doc.text("Autorização de Indicação de Condutor/Infrator", pageWidth / 2, startY + 11, { align: 'center' });

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8); // Aumentado de 6.9 para 8 para ficar igual à Foto 2

            const textWidth = contentWidth;
            const espacoLinha = 1.6; // Controla o espaço ENTRE as linhas de um mesmo parágrafo
            const alturaAproximadaLinha = 4.5; // Em milímetros, base para o cálculo de quebra
            let currentY = startY + 23;

            // --- PARÁGRAFO 1 ---
            const linha1 = "Eu, ______________________________________________________________________________________, portador do RG nº _________________________________, CPF nº _________________________________, carteira Nacional de Habilitação nº _________________________________, validade ________/________/________.";
            const linha1Split = doc.splitTextToSize(linha1, textWidth);
            doc.text(linha1Split, margin, currentY, { lineHeightFactor: espacoLinha });
            
            // Avança o Y baseado na quantidade de linhas geradas
            currentY += (linha1Split.length * alturaAproximadaLinha) + 5;

            // --- PARÁGRAFO 2 ---
            const textoLegal = `Desde já autorizo a _______________________________________________________________________ para fim específico de atender a Resolução nº 404 do CONTRAN, ficando a locadora autorizada a assinar, em meu nome, o campo correspondente à assinatura do condutor infrator, no formulário de identificação do auto de infração nº. ______________________________ do veículo ______________________________ infração mencionado acima.`;
            const textoLegalSplit = doc.splitTextToSize(textoLegal, textWidth);
            doc.text(textoLegalSplit, margin, currentY, { lineHeightFactor: espacoLinha });
            
            // Avança o Y
            currentY += (textoLegalSplit.length * alturaAproximadaLinha) + 5;

            // --- FECHAMENTO E ASSINATURA ---
            doc.text("Para que surta os efeitos, dato e assino.", margin, currentY);
            
            currentY += 8; // Espaçamento maior antes da assinatura
            
            // Coloca a data na esquerda e a assinatura na direita, na MESMA LINHA
            doc.text("Maringá ______/______/______.", margin, currentY);
            doc.text("Assinatura (igual da CNH) ________________________________________________", margin + 48, currentY);

            // Divisória tracejada
            if (i < formsPerPage - 1) {
                const dividerY = startY + formHeight - 3;
                doc.setDrawColor(200);
                doc.setLineDash([2, 2], 0);
                doc.line(margin, dividerY, pageWidth - margin, dividerY);
                doc.setLineDash([]);
            }
        }
    }
}

            // ===== TERMO DE INFORMAÇÕES (EXTENSO 6 PÁGINAS) =====
            if (elements.checkTermoExtenso.checked) {
                // Pega a quantidade selecionada (1 ou 2)
                const copies = document.querySelector('input[name="termCopies"]:checked').value;

                // Loop para gerar as cópias (1 ou 2 vezes)
                for(let copy = 0; copy < copies; copy++) {
                    
                    const startPage = doc.internal.getNumberOfPages() + 1; // Página onde o termo começa

                    // Função para desenhar Cabeçalho e Rodapé em cada página
                    const drawPageFrame = (pageIndex, totalPages) => {
                        // --- Cabeçalho ---
                        let hY = margin;
                        if (logoBase64 && logoBase64.startsWith("data:image")) {
                            doc.addImage(logoBase64, 'PNG', margin, hY, 50, 12);
                            hY += 20;
                        }
                        doc.setFont("helvetica", "bold");
                        doc.setFontSize(11);
                        doc.setTextColor(100); 
                        doc.text("INFORMAÇÕES, CONDIÇÕES E OBRIGAÇÕES", pageWidth / 2, hY, { align: 'center' });
                        hY += 5;
                        doc.text("A SEREM RESPEITADAS NA LOCAÇÃO DE VEICULOS", pageWidth / 2, hY, { align: 'center' });
                        doc.setTextColor(0); 

                        // --- Rodapé ---
                        const footerY = pageHeight - 20;
                        const boxHeight = 12;
                        
                        doc.setDrawColor(100);
                        doc.rect(margin, footerY - 5, contentWidth, boxHeight);
                        
                        doc.setFontSize(8);
                        doc.setTextColor(100);
                        doc.text("Visto:", margin + 2, footerY);
                        
                        doc.setTextColor(0);
                        const signLabel = "CONDUTOR________________________";
                        const signWidth = doc.getTextWidth(signLabel);
                        doc.text(signLabel, pageWidth - margin - signWidth - 2, footerY + 4);

                        doc.setFontSize(8);
                        doc.setTextColor(100);
                        const pageNumText = `Página ${pageIndex} de ${totalPages}`;
                        doc.text(pageNumText, pageWidth - margin - doc.getTextWidth(pageNumText), pageHeight - 5);

                        return hY + 15; // Retorna Y inicial para o conteúdo
                    };

                    // Definição Manual do Conteúdo por Página (Para garantir fidelidade)
                    const pagesData = [
                        // --- PÁGINA 1 ---
                        [
                            { type: 'text', val: "Para melhor informar a CONDUTOR do veiculo locado, de propriedade da LOCADORA, esta com intuito de resguardar futuros direitos e bem ainda, proporcionar maior clareza na locação que se inicia a mesma apresenta referidas informações, condições e obrigações:", bold: false },
                            { type: 'title', val: "1. CONSTITUEM OBRIGAÇÕES DA LOCATÁRIA/PREPOSTO/CONDUTOR" },
                            { type: 'item', id: "1.1.", val: "Utilizar o veículo somente para atividades licita e de acordo com as especificações do fabricante para sua utilização." },
                            { type: 'item', id: "1.2.", val: "Devolver, no termo final do contrato, ou qualquer outra data avençada, o veículo no endereço da LOCADORA ou em qualquer outro local devidamente combinado, juntamente com toda a documentação recebida, em perfeito estado de uso e conservação, tal como recebeu no momento de assinatura do TERMO DE VISTORIA, ressalvados os desgastes naturais." },
                            { type: 'item', id: "1.3.", val: "Entregar os veículos somente a motorista(s) devidamente habilitado(s) e autorizado(s) que deverá (ão) seguir expressamente as disposições do Código Nacional de Trânsito, Código Penal e quaisquer outras, aplicáveis a espécie, sob pena de rescisão automática do presente, com a cobrança de 20% sobre o valor pactuado, excluídas as despesas que decorram de tal falta." },
                            { type: 'item', id: "1.4.", val: "Utilizar, sempre que estacionar o carro qualquer que seja o tempo previsto de permanência, o dispositivo antifurto, evitando o estacionamento em locais ermos ou perigosos." },
                            { type: 'item', id: "1.5.", val: "A LOCATÁRIA/PREPOSTO/CONDUTOR devem se abster terminantemente de conduzir/utilizar o veículo não podendo, sob qualquer pretexto, ser utilizado para fins diversos da destinação específica, conforme previsto no Certificado de Registro e/ou especificações do fabricante, tais como:" },
                            { type: 'sub', id: "1.5.1.", val: "Transportar materiais ilícitos, químicos ou inflamáveis;" },
                            { type: 'sub', id: "1.5.2.", val: "Transporte de passageiro ou carga mediante pagamento;" },
                            { type: 'sub', id: "1.5.3.", val: "Utilizar o veículo para rebocar, guinchar ou empurrar outro veículo ou qualquer espécie de objeto ou equipamento, salvo sob autorização formal da LOCADORA;" },
                            { type: 'sub', id: "1.5.4.", val: "Utilizar o veículo para transporte de: entulhos, tijolos, areia, pedras, e quaisquer objetos que o danifique;" },
                            { type: 'sub', id: "1.5.5.", val: "Cometimento de ilícitos penais;" },
                            { type: 'sub', id: "1.5.6.", val: "Em atividades desportivas, “rachas”, ou competições de qualquer espécie;" },
                            { type: 'sub', id: "1.5.7.", val: "Sob efeito de álcool, entorpecentes, narcóticos ou medicamentos que possam afetar a capacidade de condução do veículo." },
                            { type: 'item', id: "1.6.", val: "A LOCATÁRIA/PREPOSTO/CONDUTOR responderá civil e criminalmente por troca, falta e substituição indevida de acessórios, componentes ou peças integrantes dos veículos efetuadas indevidamente e/ou sem anuência expressa da LOCADORA." }
                        ],
                        // --- PÁGINA 2 ---
                        [
                            { type: 'item', id: "1.7.", val: "Tem conhecimento a LOCATÁRIA/PREPOSTO/CONDUTOR que a LOCADORA mantém os pneus e baterias dos veículos identificados e os mesmos serão exigidos momento de trocas/substituições, sob pena de pagamento do valor do mesmo." },
                            { type: 'item', id: "1.8.", val: "Arcar com despesas de combustíveis, consertos de pneus e câmaras." },
                            { type: 'item', id: "1.9.", val: "Fazer a manutenção periódica preventiva do(s) veículo(s) locado(s), conforme manual do fabricante, tais como: verificação do nível de óleo, nível de água dos reservatórios, calibragem dos pneus, trocas de óleo, entre outros." },
                            { type: 'item', id: "1.10.", val: "Conservar os veículos em bom estado e não utilizar o(s) veículo(s) para rebocar ou empurrar outro bem como qualquer espécie de objeto ou equipamento." },
                            { type: 'item', id: "1.11.", val: "Assumir a responsabilidade objetiva por quaisquer multas que incidam sobre o(s) veículo(s) objeto(s) do contrato, que venham a ser aplicadas no prazo de vigência da locação." },
                            { type: 'item', id: "1.12.", val: "Pagar todas as multas e penalidades decorrentes de infrações às leis e regulamentos de trânsito independente de qualquer discussão quanto à procedência ou improcedência, justiça ou injustiça das penalidades, estendendo-se tal responsabilidade mesmo depois de findo o contrato e desde que se refira ao período de utilização do veículo pela LOCATÁRIA/PREPOSTO/CONDUTOR." },
                            { type: 'item', id: "1.13.", val: "Tem ciência e concorda a LOCATÁRIA/PREPOSTO/CONDUTOR que se for paga até o prazo de validade há desconto de 20% (vinte por cento), porém será cobrada uma taxa de administração pela LOCADORA à LOCATÁRIA/PREPOSTO/CONDUTOR de 20% (vinte por cento), sobre a mesma." },
                            { type: 'item', id: "1.14.", val: "Em razão de qualquer multa aplicada, a informação sobre o CONDUTOR é de inteira e exclusiva responsabilidade da LOCATÁRIA/PREPOSTO/CONDUTOR, bem como a entrega dos documentos necessários e, não o fazendo, poderá a LOCADORA cobrar daquela todos e quaisquer prejuízos decorrentes da omissão." },
                            { type: 'item', id: "1.15.", val: "A LOCATÁRIA/PREPOSTO/CONDUTOR, no momento da indicação à LOCADORA do condutor do veículo, deverá entregar cópia autenticada da carteira de habilitação, bem como procuração específica, com firma reconhecida, onde o condutor outorga à LOCADORA poderes específicos para que esta proceda à identificação dele perante os órgãos de trânsito competentes." },
                            { type: 'item', id: "1.16.", val: "Independentemente da apresentação de defesa ou recurso por parte da LOCATÁRIA/PREPOSTO/CONDUTOR, esta se obriga a disponibilizar à LOCADORA, no prazo de 72horas, a contar do conhecimento da notificação de multa, o valor correspondente à infração comunicada, valor esse que será devolvido ao LOCATÁRIO em caso de procedência da defesa ou recurso." }
                        ],
                        // --- PÁGINA 3 ---
                        [
                            { type: 'item', id: "1.17.", val: "A LOCADORA obriga-se a comunicar o condutor e a LOCATÁRIA/PREPOSTO/CONDUTOR por e-mail a ocorrência da notificação de infração." },
                            { type: 'title', val: "2. DAS OBRIGAÇOES DA LOCATÁRIA/PREPOSTO/CONDUTOR EM CASO DE FURTO, ROUBO OU INCÊNDIO, SINISTRO" },
                            { type: 'item', id: "2.1.", val: "A LOCATÁRIA/PREPOSTO/CONDUTOR deverá providenciar, em caso de furto, roubo, incêndio ou sinistro do veículo, no prazo máximo de 24horas, a contar do evento, ou de que dele tenha conhecimento, o registro da ocorrência perante repartição policial competente, extraindo a respectiva certidão, que deverá ser entregue à LOCADORA para acionamento do seguro." },
                            { type: 'item', id: "2.2.", val: "Requerer, em caso de acidente de trânsito, a realização de Perícia – Danos ou Perícia – Crime (em caso de existir vítima), ao DETRAN ou autoridade policial competente e inexistindo condições para a realização de perícia, tem ciência que torna-se obrigatória a solicitação da presença de autoridade policial no local, para anotações e emissão de Boletim de Ocorrência e assim deverá fazê-lo." },
                            { type: 'item', id: "2.3.", val: "No caso da inexistência de autoridade policial local, a LOCATÁRIA/PREPOSTO/CONDUTOR ficará obrigada a fazer o registro da ocorrência na repartição policial mais próxima, obtendo respectiva certidão, para imediata entrega à LOCADORA." },
                            { type: 'item', id: "2.4.", val: "Anotar, sempre que existentes, nomes, dados pessoais e endereços completos de testemunhas presenciais de acidentes envolvendo o veículo locado." },
                            { type: 'item', id: "2.5.", val: "Não fazer qualquer tipo de acordo, negociação ou promessa com terceiros envolvidos em acidentes, devendo eximir a LOCADORA de qualquer responsabilidade neste sentido." },
                            { type: 'item', id: "2.6.", val: "Reembolsar todo o processo de sinistro (quando validado), no prazo máximo de 72horas, a contar do efetivo comunicado de sua validação, via email." },
                            { type: 'title', val: "3. DAS PENALIDADES" },
                            { type: 'item', id: "3.1.", val: "Em caso da ocorrência de qualquer sinistro, deverá a LOCATÁRIA/PREPOSTO/CONDUTOR pagar o valor de R$ 2.000,00 (dois mil reais) a titulo de compensação, sem prejuízo das demais penalidades aplicáveis. Sendo a culpa da colisão do terceiro e se este cobrir integralmente o valor dos danos, a LOCATÁRIA/PREPOSTO/CONDUTOR ficará isenta do pagamento do valor estabelecido." },
                            { type: 'item', id: "3.2.", val: "Caso a LOCATÁRIA/PREPOSTO/CONDUTOR descumpra a obrigação de informar o condutor do veiculo, apresentar a documentação, ou pagar a multa devida, no prazo e modo acordado, tem ciência que suportará multa de 2,00% (dois por cento) do valor faturado relativo ao mês da infração contratual." }
                        ],
                        // --- PÁGINA 4 ---
                        [
                            { type: 'item', id: "3.3.", val: "Se a LOCATÁRIA/PREPOSTO/CONDUTOR proceder com notória negligência na guarda e/ou utilização do carro, especialmente deixá-lo abandonado ou estacionado com portas destravadas ou vidros abaixados, chave na ignição, etc, transitar com o veículo fora do território nacional ou se proceder com culpa grave ou dolo, nos casos de acidentes de transito ou quaisquer outros eventos que possam envolver o veículo locado, suportará integralmente com o pagamento referente ao dano." },
                            { type: 'item', id: "3.4.", val: "Caso a LOCATÁRIA/PREPOSTO/CONDUTOR não devolva o veiculo em perfeitas condições de uso, tal como recebeu, e apresentando qualquer tipo de avaria a LOCADORA se reserva no direito de efetuar a realização de três orçamentos, podendo adotar qualquer uma das condutas abaixo, sem prejuízo da aplicação da penalidade:" },
                            { type: 'sub', id: "3.4.1.", val: "Promover os reparos necessários de acordo com o menor orçamento obtido, ou" },
                            { type: 'sub', id: "3.4.2.", val: "Promover as medidas judiciais ou administrativas cabíveis para seu integral ressarcimento." },
                            { type: 'item', id: "3.5.", val: "Se a LOCATÁRIA/PREPOSTO/CONDUTOR não proceder a lavratura do boletim de ocorrência, bem como, não informar a autoridade policial sobre ocorrido, impossibilidade assim o recebimento do seguro contratado, deverá suportar todas e quaisquer despesas decorrentes, de forma ampla e integral, inclusive no que diz respeito a eventuais indenizações, seja em relation a LOCADORA ou terceiros envolvidos no acidade, fato que desde já tem ciência e concorda." },
                            { type: 'item', id: "3.6.", val: "Em caso de furto, roubo, incêndio ou perda total do veículo locado a LOCATÁRIA/PREPOSTO/CONDUTOR pagará a LOCADORA o valor de 20% (vinte por cento) do valor comercial do veículo de acordo com a Tabela FIPE." },
                            { type: 'item', id: "3.7.", val: "Em caso de sinistro, a LOCATÁRIA/PREPOSTO/CONDUTOR pagará a LOCADORA o valor de 10% (dez por cento) do valor comercial do veículo de acordo com a Tabela FIPE." },
                            { type: 'item', id: "3.8.", val: "Fica estabelecido que a vida útil do pneu é de 40.000km e, em caso de troca do mesmo com quilometragem inferior a este limite, a LOCATÁRIA/PREPOSTO/CONDUTOR pagará à LOCADORA o valor dos custos do mesmo." },
                            { type: 'title', val: "4. DO SEGURO DO VEICULO" },
                            { type: 'item', id: "4.1.", val: "Tem conhecimento a LOCATÁRIA/PREPOSTO/CONDUTOR que o veículo locado possui apenas seguro em relação a terceiros, com os seguintes limites:" },
                            { type: 'sub', id: "4.1.1.", val: "Danos materiais (DM) provocados em veículos ou bens de terceiros até a importância de R$ 150.000,00 (cento e cinquenta mil reais)." },
                            { type: 'sub', id: "4.1.2.", val: "Danos corporais (DC) causados a terceiros até a importância de R$ 150.000,00 (cento e cinquenta mil reais)." },
                            { type: 'item', id: "4.2.", val: "Em virtude dos limites estabelecidos, será de única e integral responsabilidade da LOCATÁRIA/PREPOSTO/CONDUTOR o pagamento de todo e qualquer valor que exceda a cada um." }
                        ],
                        // --- PÁGINA 5 ---
                        [
                            { type: 'item', id: "4.3.", val: "Ocorrendo sinistro/colisão, furto ou roubo do veículo locado, em qualquer circunstância, a LOCATÁRIA/PREPOSTO/CONDUTOR pagará à LOCADORA, também, as diárias e despesas de locação até a data do registro da ocorrência junto à autoridade policial competente." },
                            { type: 'item', id: "4.4.", val: "Fica devidamente acordado e esclarecido entre as PARTES que a LOCATÁRIA/PREPOSTO/CONDUTOR responderá pelos danos causados a terceiros, quando o valor destes danos for superior aos cobertos pela proteção “DM” e “DC” mencionados nesta clausula, seja por força de ordem judicial e/ou extrajudicial." },
                            { type: 'item', id: "4.5.", val: "Responde a LOCATÁRIA/PREPOSTO/CONDUTOR diretamente pelos acidentes em que o(s) veículo(s) por si locado(s) se envolver (em), independentemente da culpa ou de quem estiver conduzindo-o, tanto no âmbito cível, criminal ou trabalhista." },
                            { type: 'item', id: "4.6.", val: "Fica pactuado que a perda total do veículo se dará e assim será considerada também quando os valores apresentados para recuperação do veiculo, for igual ou superior a 50% (cinquenta por cento) do valor do mesmo, de acordo com a tabela FIPE." },
                            { type: 'item', id: "4.7.", val: "Caso a LOCADORA, por sua conveniência, resolva reparar o dano do veículo, esta se reserva no direito de exigir o pagamento do reparo da LOCATÁRIA/PREPOSTO/CONDUTOR, que será comprovado via nota fiscal e feito pelo menor de três orçamentos." },
                            { type: 'item', id: "4.8.", val: "A LOCATÁRIA/PREPOSTO/CONDUTOR fica obrigada a suportar integralmente o dano em caso de furto, caso seja comprovada a existência de negligência na guarda do veículo e, em caso de sinistro, seja comprovada a existência de imprudência, negligência e imperícia na condução e manuseio do veículo." },
                            { type: 'item', id: "4.9.", val: "Se comprovado o dolo, seja da LOCATÁRIA/PREPOSTO/CONDUTOR, seu proposto ou condutor, o ressarcimento do dano será feito em qualquer hipótese." },
                            { type: 'title', val: "5. DISPOSIÇÕES GERAIS" },
                            { type: 'item', id: "5.1.", val: "O veículo locado pode trafegar somente em território nacional, ressalvada a hipótese de autorização expressa da LOCADORA para a transposição das fronteiras nacionais." },
                            { type: 'item', id: "5.2.", val: "A LOCADORA, através de seus prepostos, poderá exercer a fiscalização e acompanhamento, que consistirá no direito de vistoriar o(s) veículo(s) quando do recebimento e durante o período de permanência dos mesmos na posse da LOCATÁRIA/PREPOSTO/CONDUTOR e, a seu critério, solicitar as substituições e os reparos que forem julgados necessários." },
                            { type: 'item', id: "5.3.", val: "A LOCADORA poderá acompanhar e fiscalizar a forma de utilização do(s) veículo(s) locado(s), orientando a LOCATÁRIA/PREPOSTO/CONDUTOR no sentido de atender às especificações recomendadas pelas montadoras." }
                        ],
                        // --- PÁGINA 6 ---
                        [
                            { type: 'item', id: "5.4.", val: "A LOCATÁRIA/PREPOSTO/CONDUTOR arcará com todos os danos causados ao(s) veículo(s), quando utilizados em condições anormais, isto é, fora das especificações recomendadas pelas montadoras." },
                            { type: 'item', id: "5.5.", val: "A LOCATÁRIA/PREPOSTO/CONDUTOR torna-se civil e criminalmente responsável pelas declarações prestadas no ato da assinatura do presente contrato." },
                            { type: 'item', id: "5.6.", val: "Este contrato é pessoal e intransferível, tornando a LOCATÁRIA/PREPOSTO/CONDUTOR, enquanto vigente, depositária do veiculo locado, sendo vedada a sublocação ou empréstimo, a qualquer título, sem prévia e expressa autorização da LOCADORA." },
                            { type: 'item', id: "5.7.", val: "A LOCATÁRIA/PREPOSTO/CONDUTOR reconhece expressamente que a LOCADORA torna-se credora de dívida líquida, certa e exigível dos valores devidos a título de locação e demais valores que integram o presente contrato, tais como multas de transito, penalidades, valores de ressarcimento, etc." },
                            { type: 'item', id: "5.8.", val: "As PARTES convencionam que a LOCADORA poderá oferecer como caução os créditos originados do presente contrato, independentemente de qualquer notificação à LOCATÁRIA/PREPOSTO/CONDUTOR, onde por este instrumento, já exara sua ciência e concordância." },
                            { type: 'item', id: "5.9.", val: "Eventuais tolerâncias da LOCADORA para com a LOCATÁRIA/PREPOSTO/CONDUTOR no cumprimento das obrigações ajustadas neste Instrumento constituem mera liberalidade, não importando em hipótese alguma em novação, permanecendo íntegras as cláusulas e condições aqui contratadas." },
                            { type: 'bold_text', val: "Por este instrumento, o CONDUTOR declara que recebeu o presente e leu todas as cláusulas obrigacionais que estão disciplinadas no presente instrumento, não podendo alegar desconhecimento de suas clausulas, condições e obrigações." },
                            { type: 'date', val: `Maringá-PR, ${dataExtenso}` },
                            { type: 'signature' }
                        ]
                    ];

                    // Loop para gerar cada página exatamente como definido
                    pagesData.forEach((pageContent, index) => {
                        doc.addPage();
                        let yPos = drawPageFrame(index + 1, 6); // Desenha frame e pega Y inicial
                        doc.setFontSize(10); // Redefine o tamanho após o rodapé (que usa 8pt)

                        pageContent.forEach(element => {
                            if (element.type === 'title') {
                                doc.setFont("helvetica", "bold");
                                yPos += 5;
                                doc.text(element.val, margin, yPos);
                                yPos += 5;
                            } else if (element.type === 'item') {
                                doc.setFont("helvetica", "normal");
                                const indent = margin + 10;
                                const width = contentWidth - 10;
                                const lines = doc.splitTextToSize(element.val, width);
                                doc.text(element.id, margin, yPos); 
                                doc.text(lines, indent, yPos);   
                                yPos += lines.length * 4 + 2;
                            } else if (element.type === 'sub') {
                                doc.setFont("helvetica", "normal");
                                const indent = margin + 20;
                                const width = contentWidth - 20;
                                const lines = doc.splitTextToSize(element.val, width);
                                doc.text(element.id, margin + 5, yPos); 
                                doc.text(lines, indent, yPos);   
                                yPos += lines.length * 4 + 2;
                            } else if (element.type === 'text') {
                                doc.setFont("helvetica", "normal");
                                const lines = doc.splitTextToSize(element.val, contentWidth);
                                doc.text(lines, margin, yPos);
                                yPos += lines.length * 4 + 5;
                            } else if (element.type === 'bold_text') {
                                doc.setFont("helvetica", "bold");
                                yPos += 5;
                                const lines = doc.splitTextToSize(element.val, contentWidth);
                                doc.text(lines, margin, yPos);
                                yPos += lines.length * 4 + 5;
                            } else if (element.type === 'date') {
                                doc.setFont("helvetica", "normal");
                                yPos += 10;
                                doc.text(element.val, margin, yPos);
                                yPos += 10;
                            } else if (element.type === 'signature') {
                                // Bloco de Assinatura Centralizado
                                yPos += 20;
                                const lineLength = 80;
                                const centerX = pageWidth / 2;
                                const lineStart = centerX - (lineLength / 2);
                                const lineEnd = centerX + (lineLength / 2);

                                doc.setDrawColor(0);
                                doc.line(lineStart, yPos, lineEnd, yPos); // Linha
                                
                                doc.setFont("helvetica", "bold");
                                doc.text(data.nome_condutor, centerX, yPos + 5, { align: 'center' }); // Nome centralizado
                                
                                doc.setFontSize(9);
                                doc.setFont("helvetica", "normal");
                                doc.text('CONDUTOR', centerX, yPos + 10, { align: 'center' }); // Cargo centralizado
                            }
                        });
                    });
                }
            }

            doc.save(`Contrato_Unicampo_${data.placa_veiculo}.pdf`);
            showAlert('PDF gerado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            showAlert(`Erro ao gerar PDF: ${error.message}`, 'error');
        } finally {
            elements.btnGerarPDF.disabled = false;
        }
    }
