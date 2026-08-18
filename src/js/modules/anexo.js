// ===== Bloco 1 do módulo anexo =====
const logoBase64 = "data:image/png;base64,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";
    
    /* ---------- Funções e lógica ---------- */
    function $(id){ return document.getElementById(id); }

    // ====== NOVA FUNÇÃO DE ALERTA ======
    function showAlert(message, type = 'error') {
        const container = $('alertContainer');
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert show ${type}`;
        alertDiv.textContent = message;
        container.innerHTML = '';
        container.appendChild(alertDiv);
        setTimeout(() => {
            if(alertDiv.parentNode) alertDiv.remove();
        }, 5000);
    }
    
    function resetForm(){
      if(!confirm('Limpar todos os campos?')) return;
      document.getElementById('contratoForm').reset();
      $('duracao_dias').value = 30;
      $('km_incluido').value = '4.000';
      $('valor_km_excedente').value = '1,19';
      $('valor_caucao').value = '0,00';
      $('percent_perda_total').value = 50;
      $('vida_pneu_km').value = 40000;
      $('limite_dm').value = '100.000,00';
      $('limite_dc').value = '100.000,00';
      const hoje = new Date(); $('inicio_contrato').value = hoje.toLocaleDateString('pt-BR');
      calcularDataFinal();
      toggleCaucao(); 
    }
    
    /* máscaras e buscas */
    function mascaraCEP(event){
      const input = event.target;
      let v = input.value.replace(/\D/g,'');
      v = v.replace(/^(\d{5})(\d)/, '$1-$2');
      input.value = v;
    }
    async function buscaCepCliente(event){
      const cep = event.target.value.replace(/\D/g,'');
      if(cep.length !== 8) return;
      const url = `https://viacep.com.br/ws/${cep}/json/`;
      try{
        const resp = await fetch(url);
        const data = await resp.json();
        if(data.erro){ 
            showAlert('CEP não encontrado', 'error'); 
            return; 
        }
        $('endereco_cliente').value = data.logradouro || '';
        $('bairro_cliente').value = data.bairro || '';
        $('cidade_uf_cliente').value = `${data.localidade || ''} / ${data.uf || ''}`;
      }catch(e){
        console.error(e);
        showAlert('Erro ao buscar CEP', 'error');
      }
    }
    
    function mascaraData(e){
      const input = e.target;
      let v = input.value.replace(/\D/g,'');
      if(v.length>2) v = `${v.substring(0,2)}/${v.substring(2)}`;
      if(v.length>5) v = `${v.substring(0,5)}/${v.substring(5,9)}`;
      input.value = v;
    }
    function mascaraValor(e){
      const input = e.target;
      let v = input.value.replace(/\D/g,'');
      if(v===''){ input.value=''; return; }
      v = parseFloat(v)/100;
      input.value = v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    function mascaraCPF(e){
      const input = e.target;
      let v = input.value.replace(/\D/g,'').substring(0,11);
      v = v.replace(/(\d{3})(\d)/,'$1.$2');
      v = v.replace(/(\d{3})\.(\d{3})(\d)/,'$1.$2.$3');
      v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/,'$1.$2.$3-$4');
      input.value = v;
    }
    function mascaraCpfCnpj(e){
      const input = e.target;
      let v = input.value.replace(/\D/g,'');
      if(v.length <= 11) {
        v = v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2');
      } else {
        v = v.substring(0,14).replace(/^(\d{2})(\d)/,'$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/,'$1.$2.$3').replace(/\.(\d{3})(\d)/,'.$1/$2').replace(/(\d{4})(\d)/,'$1-$2');
      }
      input.value = v;
    }
    
    /* data final */
    function calcularDataFinal(){
      const dataInicioStr = $('inicio_contrato').value;
      const duracao = parseInt($('duracao_dias').value,10);
      if(!dataInicioStr || isNaN(duracao) || dataInicioStr.length<10) return;
      const partes = dataInicioStr.split('/');
      if(partes.length !== 3) return;
      const d = parseInt(partes[0],10), m = parseInt(partes[1],10)-1, y = parseInt(partes[2],10);
      const dt = new Date(y,m,d);
      if(isNaN(dt.getTime())) return;
      dt.setDate( dt.getDate() + duracao );
      const dia = String(dt.getDate()).padStart(2,'0');
      const mes = String(dt.getMonth()+1).padStart(2,'0');
      const ano = dt.getFullYear();
      $('fim_contrato').value = `${dia}/${mes}/${ano}`;
    }
    
    /* caução switch (UI e controle) */
    const switchEl = $('exigir_caucao_switch');
    let caucaoOn = true;
    function setSwitch(on){
      caucaoOn = !!on;
      if(caucaoOn){
        switchEl.classList.add('on');
        switchEl.setAttribute('aria-checked','true');
        $('valor_caucao').parentElement.style.display = '';
        $('valor_caucao').disabled = false;
      } else {
        switchEl.classList.remove('on');
        switchEl.setAttribute('aria-checked','false');
        $('valor_caucao').parentElement.style.display = 'none';
        $('valor_caucao').disabled = true;
      }
    }
    switchEl.addEventListener('click', ()=> setSwitch(!caucaoOn));
    switchEl.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSwitch(!caucaoOn); } });
    
    // init default
    window.addEventListener('load', ()=>{
      // CARREGA A LOGO NA TELA
      document.getElementById('headerLogo').src = logoBase64;
    
      const hoje = new Date();
      $('inicio_contrato').value = hoje.toLocaleDateString('pt-BR');
      calcularDataFinal();
    
      // listeners
      $('cep_cliente').addEventListener('input', mascaraCEP);
      $('cep_cliente').addEventListener('blur', buscaCepCliente);
      $('inicio_contrato').addEventListener('input', mascaraData);
      $('fim_contrato').addEventListener('input', mascaraData);
      $('valor_mensal').addEventListener('input', mascaraValor);
      $('valor_caucao').addEventListener('input', mascaraValor);
      $('cpf_condutor').addEventListener('input', mascaraCPF);
      $('cnpj_cliente').addEventListener('input', mascaraCpfCnpj);
      $('inicio_contrato').addEventListener('input', calcularDataFinal);
      $('duracao_dias').addEventListener('input', calcularDataFinal);
    
      // money format for limits
      $('limite_dm').addEventListener('input', mascaraValor);
      $('limite_dc').addEventListener('input', mascaraValor);
    
      // default switch visible
      setSwitch(true);
    });
    
    /* ---------- PDF generation ---------- */
    function gerarPDF(){
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p','mm','a4');
    
      const data = {
        razao_social_cliente: $('razao_social_cliente').value.trim(),
        cnpj_cliente: $('cnpj_cliente').value.trim(),
        ie_cliente: $('ie_cliente').value.trim(),
        endereco_cliente: $('endereco_cliente').value.trim(),
        bairro_cliente: $('bairro_cliente').value.trim(),
        cidade_uf_cliente: $('cidade_uf_cliente').value.trim(),
        cep_cliente: $('cep_cliente').value.trim(),
        telefone_cliente: $('telefone_cliente').value.trim(),
        email_cliente: $('email_cliente').value.trim(),
        nome_condutor: $('nome_condutor').value.trim(),
        cpf_condutor: $('cpf_condutor').value.trim(),
        rg_condutor: $('rg_condutor').value.trim(),
        modelo_veiculo: $('modelo_veiculo').value.trim(),
        ano_veiculo: $('ano_veiculo').value.trim(),
        placa_veiculo: $('placa_veiculo').value.trim(),
        chassi_veiculo: $('chassi_veiculo').value.trim(),
        renavam_veiculo: $('renavam_veiculo').value.trim(),
        inicio_contrato: $('inicio_contrato').value.trim(),
        fim_contrato: $('fim_contrato').value.trim(),
        valor_mensal: $('valor_mensal').value.trim() || '0,00',
        km_incluido: $('km_incluido').value.trim() || '',
        valor_km_excedente: $('valor_km_excedente').value.trim() || '0,00',
        exigir_caucao: caucaoOn,
        valor_caucao: $('valor_caucao').value.trim() || '0,00',
        duracao_dias: $('duracao_dias').value.trim() || '0',
        percent_perda_total: $('percent_perda_total').value.trim() || '50',
        vida_pneu_km: $('vida_pneu_km').value.trim() || '40000',
        limite_dm: $('limite_dm').value.trim() || '100.000,00',
        limite_dc: $('limite_dc').value.trim() || '100.000,00'
      };
    
      if(!data.razao_social_cliente || !data.nome_condutor || !data.placa_veiculo){
        // Removido o alert nativo e colocado o nosso estilo bonitinho!
        showAlert('Preencha Nome/Razão, Nome do Condutor e Placa antes de gerar.', 'error');
        return;
      }
    
      // layout settings
      const margin = 18;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - margin*2;
      let y = 22;
      const lineHeight = 6;
      const pageBreakThreshold = pageHeight - margin - 40;
    
      doc.setFont('helvetica','normal');
      doc.setFontSize(10);
    
      const drawTableRow = (label, value) => {
        if(y > pageBreakThreshold - 10){
          doc.addPage(); y = margin;
        }
        const rowHeight = 8;
        doc.setDrawColor(230,230,230);
        doc.rect(margin, y, contentWidth, rowHeight);
        doc.setFont('helvetica','bold'); doc.setFontSize(10);
        doc.text(label, margin+3, y+5);
        doc.setFont('helvetica','normal');
        const valLines = doc.splitTextToSize(value||'', contentWidth - 50);
        doc.text(valLines, margin+48, y+5);
        y += rowHeight + (valLines.length>1 ? (valLines.length-1)*lineHeight : 0);
      };
    
      function writeFlowingText(text, options={}){
        const { style='normal', size=10, align='left', spacing=lineHeight*1.2, indent=0 } = options;
        doc.setFont('helvetica', style);
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(text, contentWidth - indent);
        lines.forEach(line=>{
          if(y > pageBreakThreshold){
            doc.addPage(); y = margin;
          }
          doc.text(line, margin+indent, y);
          y += lineHeight;
        });
        y += spacing - lineHeight;
      }
    
      // Insere a logo no PDF também
      if(logoBase64 && logoBase64.startsWith('data:image')){
        try{ doc.addImage(logoBase64,'PNG',margin,10,42,12); }catch(e){/*ignore*/ }
      }
    
      y = 42;
      doc.setFont('helvetica','bold'); doc.setFontSize(12);
      doc.text('INSTRUMENTO CONTRATUAL DE LOCAÇÃO DE VEÍCULO', pageWidth/2, y, { align:'center' });
      y += 12;
      writeFlowingText('Pelo presente INSTRUMENTO CONTRATUAL, um lado, como LOCADORA:');
      writeFlowingText('BENALI RENT A CAR LTDA, pessoa jurídica de direito privado, inscrita no CNPJ/MF sob n. 15.373.411/0001-08, com sede em Maringá-PR, representada nos termos deste contrato.');
      y += 4;
      writeFlowingText('E na condição de LOCATÁRIA:');
    
      drawTableRow('Nome', data.razao_social_cliente);
      drawTableRow('CPF/CNPJ', data.cnpj_cliente);
      drawTableRow('RG/Insc. Est.', data.ie_cliente);
      drawTableRow('Endereço/nº', data.endereco_cliente);
      drawTableRow('Bairro', data.bairro_cliente);
      drawTableRow('Cidade / UF', `${data.cidade_uf_cliente} CEP ${data.cep_cliente}`);
      drawTableRow('Telefones', data.telefone_cliente);
      drawTableRow('EMAIL', data.email_cliente);
      y += 6;
    
      writeFlowingText('Tendo como CONDUTOR, que deverá estar devidamente habilitado:');
      drawTableRow('Nome', data.nome_condutor);
      drawTableRow('CPF', data.cpf_condutor);
      drawTableRow('RG', data.rg_condutor);
      y += 6;
    
      writeFlowingText('Resolvem, por este instrumento e na melhor forma de direito, pactuar o presente CONTRATO DE LOCAÇÃO DE VEÍCULOS, mediante as cláusulas e condições abaixo:');
      y += 6;
    
      const duracaoTexto = `${data.duracao_dias} dia${parseInt(data.duracao_dias,10)>1?'s':''}`;
      const clauses = [];
    
      clauses.push({ text: '1. DO OBJETO DO CONTRATO', style:'bold' });
      clauses.push({ text: '1.1. Por este instrumento a LOCADORA oferece para a LOCATÁRIA, em locação o seguinte veículo, de sua propriedade:' });
      clauses.push({ text: '1.2. O LOCATÁRIO recebe o veículo em perfeitas condições de uso, conforme devidamente identificadas no TERMO DE VISTORIA – CHECK- LIST feito conforme (ANEXO 01), que também será documento integrante e inseparável deste.' });
    
      clauses.push({ text: '2. DO PRAZO DE LOCAÇÃO', style:'bold' });
      clauses.push({ text: `2.1. A modalidade de locação será correspondente à ${duracaoTexto}.` });
      clauses.push({ text: `2.2. Terá Início em: ${data.inicio_contrato} e término em: ${data.fim_contrato}.` });
      clauses.push({ text: '2.3. Após o prazo pactuado, sendo interesse da LOCATÁRIA e a livre critério da LOCADORA, poderá haver a prorrogação do presente, por prazo indeterminado.' });
      clauses.push({ text: '2.4. Poderá haver rescisão antecipada, desde que comunicada a LOCADORA, por escrito, com antecedência mínima de 1(um) dias, devendo suportar a LOCATÁRIA todos os valores que estejam em aberto.' });
      clauses.push({ text: '2.5. Não sendo de interesse da LOCADORA, esta poderá promover a rescisão do presente, sem a cobrança de qualquer multa da LOCATÁRIA, a não ser exigir o pagamento dos valores em aberto.' });
    
      clauses.push({ text: '3. DO PREÇO E CONDIÇÕES', style:'bold' });
      clauses.push({ text: `3.1. O preço acordado da locação mensal será de R$ ${data.valor_mensal} com ${data.km_incluido} KM e R$ ${data.valor_km_excedente} por km excedente.` });
    
      if(data.exigir_caucao){
        clauses.push({ text: `3.2. A LOCADORA exigirá caução no valor de R$ ${data.valor_caucao} mediante cartão de crédito, ficando a LOCATÁRIA responsável por manter saldo suficiente.` });
        clauses.push({ text: '3.3. O pagamento do valor total das diárias faturadas será formalizado no ato da entrega do veículo.' });
      } else {
        clauses.push({ text: '3.2. O pagamento do valor total das diárias faturadas será formalizado no ato da entrega do veículo.' });
      }
    
      clauses.push({ text: '4. DO TERMO DE ENTREGA E DEVOLUÇÃO DO VEÍCULO', style:'bold' });
      clauses.push({ text: '4.1. Para a entrega do veículo ou veículos para a LOCATÁRIA será feita a VISTORIA DO VEÍCULO (TERMO DE VISTORIA - CHECK-LIST), onde as PARTES poderão indicar preposto para fazê-lo, devendo a LOCATÁRIA informar, via-e-mail (locação@benalirentacar.com.br), com aviso de recebimento, ou qualquer outro meio escrito, quem será a pessoa responsável para acompanhar a vistoria e retirar o veiculo, independente de mandado ou poderes específicos para tanto, tendo ciência a LOCATÁRIA que responde pelas declarações e atos da pessoa indicada, não podendo alegar desconhecimento ou boa-fé.' });
      clauses.push({ text: '4.2. Com a aposição da assinatura do condutor, a LOCATÁRIA declara que recebe o(s) veículo(s) em perfeito estado de conservação, uso, segurança e aparência, conforme constatado, com todos os equipamentos disponibilizados pelo fabricante, inclusive no que tange a documentação necessária.' });
      clauses.push({ text: '4.2.1. A LOCADORA poderá, a seu exclusivo critério, entregar o veículo com ou sem determinados acessórios, equipamentos ou itens originalmente fornecidos pelo fabricante, sem que isso constitua descumprimento contratual. Prevalecerá, para todos os efeitos, o estado descrito no TERMO DE VISTORIA – CHECK-LIST realizado no momento da entrega.' });
      clauses.push({ text: '4.3. No ato de assinatura do TERMO DE VISTORIA, o condutor deverá disponibilizar cópia de sua carteira de habilitação para a LOCADORA e, estando em conformidade, será entregue o veiculo a pessoa indicada.' });
      clauses.push({ text: '4.4. A formalização do TERMO DE VISTORIA será considerada para todos os efeitos legais, como sendo também o momento de entrega do veiculo para a LOCATÁRIA, salvo se de outro modo for disposto em contrário.' });
      clauses.push({ text: '4.5. Poderá a LOCADORA exigir da LOCATÁRIA ou do condutor/preposto do veículo a apresentação de documentos complementares, se assim entender necessário, para a retirada ou a devolução do veículo.' });
      clauses.push({ text: '4.6. A LOCATÁRIA, no prazo avençado, se obriga a devolver o(s) veículo(s) locados(s), nas dependências da LOCADORA, no estado em que se encontre(m) e de acordo com o descrito(s) e vistoriado(s) no documento denominado “TERMO DE VISTORIA DO VEÍCULO”, salvo, unicamente, o desgaste natural resultante do seu uso regular, de acordo com as recomendações do fabricante e em consonância com a utilização declarada, bem como toda e qualquer documentação que lhe fora entregue no ato de assinatura do TERMO DE VISTORIA, sob pena de aplicação de penalidades.' });
      clauses.push({ text: '4.7. A retenção do veiculo por parte da LOCATÁRIA ou de seu condutor, de forma indevida e após devidamente comunicada para fazê-lo construirá de pleno direito em retenção dolosa, acarretando ações de busca e apreensão cumulada com perdas e danos.' });
    
      clauses.push({ text: '5. DAS OBRIGAÇÕES DA LOCADORA', style:'bold' });
      clauses.push({ text: '5.1. Deverá a LOCADORA disponibilizar à LOCATÁRIA ou seu condutor, o(s) veículo(s) locado nas dependências da mesma (LOCADORA), ou em local diverso devidamente acordado pelas partes.' });
      clauses.push({ text: '5.2. A LOCADORA obriga-se a prestar, através de seu departamento de manutenção, em horário comercial, assistência técnica – mecânica ao veículo locado, mantendo o veículo em perfeitas condições de uso, inclusive troca de pneus por desgaste natural.' });
      clauses.push({ text: '5.3. Arcar com o pagamento dos impostos federais, estaduais licenciamentos e manutenções preventivas.' });
      clauses.push({ text: '5.4. Substituir o veículo que se torne indisponível por motivo de sinistro, incêndio, roubo, bem como por falhas mecânicas, elétricas ou irregularidade de documentação, no prazo máximo de 72horas, contados a partir do primeiro dia útil da comunicação formal efetuada pela LOCATÁRIA, (excluídos sábado, domingo e feriados), onde o veículo reserva será pertencente aos Grupos A e B (veículos populares com motorização1.0).'});
      clauses.push({ text: '5.5. Manter o(s) veículo(s) segurado(s) com proteção contra danos materiais (DM) provocados em veículos ou bens de terceiros e proteção contra danos pessoais (DP).'});
    
      clauses.push({ text: '6. DAS OBRIGAÇÕES DA LOCATÁRIA E PREPOSTOS', style:'bold' });
      clauses.push({ text: '6.1. Utilizar o veículo somente para atividades licitas e de acordo com as especificações do fabricante para sua utilização.' });
      clauses.push({ text: '6.2. Devolver, no termo final do contrato, ou qualquer outra data avençada, o veículo no endereço da LOCADORA ou em qualquer outro local devidamente combinado, juntamente com toda a documentação recebida, em perfeito estado de uso e conservação, tal como recebeu no momento de assinatura do TERMO DE VISTORIA, ressalvados os desgastes naturais, onde:'});
      clauses.push({ text: '6.2.1. Se após a entrega do veículo for constatado problemas mecânicos ocasionados no período, a LOCADORA irá cobrar da LOCATÁRIA os valores referentes a manutenção ou reparo devidos.', indent:5 });
      clauses.push({ text: '6.2.2. Estando o carro adesivado ou com qualquer tipo de mancha na lataria, todos os custos necessários para a efetiva remoção serão devidamente cobrados da LOCATÁRIA.', indent:5 });
      clauses.push({ text: '6.2.3. Todos os ressarcimentos acima discriminados serão efetivados mediante emissão de boleto bancário, com instrução de protesto.', indent:5 });
      clauses.push({ text: '6.3. Entregar os veículos somente a motorista(s) devidamente habilitado(s) e autorizado(s) que deverá (ão) seguir expressamente as disposições do Código Nacional de Trânsito, Código Penal e qualquer outras aplicáveis a espécie, sob pena de rescisão automática do presente, com a cobrança de 20% sobre o valor pactuado, excluídas as despesas que decorram de tal falta.' });
      clauses.push({ text: '6.4. Utilizar, sempre que estacionar o carro e, qualquer que seja o tempo previsto, um dispositivo antifurto, devendo evitar estacionar em locais ermos ou perigosos.' });
      clauses.push({ text: '6.5. A LOCATÁRIA e/ou Preposto devem abster-se terminantemente de conduzir/utilizar o veículo para fins diversos da destinação específica, conforme previsto no Certificado de Registro e/ou especificações do fabricante, e muito menos ainda:' });
      clauses.push({ text: '6.5.1. Transportar materiais ilícitos, químico ou inflamáveis;', indent:5 });
      clauses.push({ text: '6.5.2. Transporte de passageiro ou carga mediante pagamento;', indent:5 });
      clauses.push({ text: '6.5.4. Utilizar o veículo para transporte de: entulhos, tijolos, areia, pedras, e quaisquer objetos que o danifique;', indent:5 });
      clauses.push({ text: '6.5.3. Utilizar o veículo para rebocar, guinchar ou empurrar outro veículo ou qualquer espécie de objeto ou equipamento, salvo sob autorização formal da LOCADORA;', indent:5 });
      clauses.push({ text: '6.5.5. Cometimento de ilícitos penais;', indent:5 });
      clauses.push({ text: '6.5.6. Em atividades desportivas, “rachas”, ou competições de qualquer espécie;', indent:5 });
      clauses.push({ text: '6.5.7. Sob efeito de álcool, entorpecentes, narcóticos ou medicamentos que possam afetar a capacidade de condução do veículo.', indent:5 });
      clauses.push({ text: '6.6. A LOCATÁRIA responderá civil e criminalmente por troca, falta e substituição indevida de acessórios, componentes ou peças integrantes dos veículos efetuadas indevidamente e/ou sem anuência expressa da LOCADORA.' });
      clauses.push({ text: '6.7. Tem conhecimento a LOCATÁRIA que a LOCADORA mantém os pneus e baterias dos veículos totalmente identificados e os mesmos serão exigidos no momento de trocas/substituições, sob pena de pagamento do valor do mesmo.' });
      clauses.push({ text: '6.8. Arcar com despesas de combustíveis, consertos de pneus.' });
      clauses.push({ text: '6.9. Fazer a manutenção periódica preventiva do(s) veículo(s) locado(s), conforme manual do fabricante, tais como: verificação do nível de óleo, nível de água dos reservatórios, calibragem dos pneus,verificação da quilometragem e/ou data da troca de óleo, entre outros.' });
      clauses.push({ text: '6.10. Assumir a responsabilidade objetiva por quaisquer multas que incidam sobre o(s) veículo(s) objeto(s) do contrato e que venham a ser aplicadas no prazo de vigência da locação.' });
      clauses.push({ text: '6.11. Pagar todas as multas e penalidades decorrentes de infrações às leis e regulamentos de trânsito independente de qualquer discussão quanto à procedência ou improcedência, justiça ou injustiça das penalidades, estendendo-se tal responsabilidade mesmo depois de findo o contrato e desde que se refira ao período de utilização do veículo pela LOCATÁRIA (ressalvadas as hipóteses de penalização por irregularidade na documentação do(s) veículo(s), onde a LOCADORA responderá pela multa).' });
      clauses.push({ text: '6.12. Poderá a LOCATÁRIA interpor recurso no tocante a multa aplicada, mas sendo indeferida, a mesma deverá indenizar e repassar a LOCADORA o valor correspondente a mesma, tão logo lhe seja exigido.' });
      clauses.push({ text: '6.13. Tem ciência e concorda a LOCATÁRIA que se for paga até o prazo de validade há desconto de 20% (vinte por cento), porém será cobrada uma taxa de administração pela LOCADORA à LOCATÁRIA de 20% (vinte por cento), sobre a mesma.' });
      clauses.push({ text: '6.14. Em razão de qualquer multa aplicada, a informação sobre o CONDUTOR é de inteira e exclusiva responsabilidade da LOCATÁRIA, bem como a entrega dos documentos necessários e, não o fazendo, poderá a LOCADORA cobrar daquela todos e quaisquer prejuízos decorrentes da omissão.' });
      clauses.push({ text: '6.15. A LOCATÁRIA, no momento da indicação à LOCADORA do condutor do veículo, deverá entregar cópia autenticada da carteira de habilitação, bem como procuração específica, com firma reconhecida, onde o CONDUTOR outorgará à LOCADORA poderes específicos para que esta proceda à identificação dele perante os órgãos de trânsito competentes.' });
      clauses.push({ text: '6.16. A LOCADORA obriga-se a comunicar o condutor e a LOCATÁRIA por e-mail a ocorrência da notificação de infração.' });
      clauses.push({ text: '6.17. Tem ciência a LOCATÁRIA, que a não apresentação de CONDUTOR, no prazo legal, acarreta a cobrança de multa em duplicação e será devidamente cobrada de si toda e qualquer omissão no tocante a tal penalidade, devendo ressarcir a LOCADORA de toda e qualquer multa duplicada em virtude da não apresentação de condutor.' });
      clauses.push({ text: '6.18. Fazer manutenção somente em oficinas credenciadas quando exigido.' });
      clauses.push({ text: '6.19. Caso a LOCATÁRIA não devolva o veiculo em perfeito estado de uso e conservação, tal como o tenha recebido, apresentando o veiculo qualquer tipo de avaria a LOCADORA se reserva no direito de:' });
      clauses.push({ text: '6.19.1. Promover reparos após análise de orçamentos e cobrar a LOCATÁRIA;', indent:5 });
      clauses.push({ text: '6.19.2. Promover medidas judiciais ou administrativas cabíveis;', indent:5 });
      clauses.push({ text: '6.20. Ocorrendo sinistro/colisão, furto ou roubo do veículo locado, em qualquer circunstância, a LOCATÁRIA pagará à LOCADORA, também, as diárias e despesas de locação até a data do registro da ocorrência junto à autoridade policial competente.' });
      clauses.push({ text: '6.21. Fica devidamente acordado e esclarecido entre as PARTES que a LOCATÁRIA responderá pelos danos causados a terceiros, quando o valor destes danos for superior aos cobertos pela proteção “DM” e “DC” mencionados nesta clausula, seja por força de ordem judicial e/ou extrajudicial.' });
      clauses.push({ text: '6.22. Responde a LOCATÁRIA diretamente pelos acidentes em que o(s) veículo(s) por si locado(s) se envolver (em), independentemente da culpa ou de quem estiver conduzindo-o, tanto no âmbito cível, criminal ou trabalhista.' });
      clauses.push({ text: `6.23. Fica pactuado que a perda total do veículo se dará quando os valores para recuperação forem iguais ou superiores a ${data.percent_perda_total}% do valor do veículo (Tabela FIPE).` });
      clauses.push({ text: `6.24. Fica estabelecido que a vida útil do pneu é de ${Number(data.vida_pneu_km).toLocaleString('pt-BR')} km; trocas antes deste limite serão cobradas à LOCATÁRIA.` });
    
      clauses.push({ text: '7. FURTO, ROUBO OU INCÊNDIO, SINISTRO', style:'bold' });
      clauses.push({ text: '7.1. A LOCATÁRIA deverá providenciar, em caso de furto, roubo, incêndio ou sinistro do veículo, no prazo máximo de 24horas, a contar do evento, ou de que dele tenha conhecimento, o registro da ocorrência perante repartição policial competente, extraindo a respectiva certidão, que deverá ser entregue à LOCADORA para acionamento do seguro.' });
      clauses.push({ text: '7.2. Requerer, em caso de acidente de trânsito, a realização de Perícia – Danos ou Perícia – Crime (em caso de existir vítima), ao DETRAN ou autoridade policial competente e inexistindo condições para a realização de perícia, tem ciência que torna-se obrigatória a solicitação da presença de autoridade policial no local, para anotações e emissão de Boletim de Ocorrência e assim deverá fazê-lo.' });
      clauses.push({ text: '7.3. No caso da inexistência de autoridade policial local, a LOCATÁRIA ficará obrigada a fazer o registro da ocorrência na repartição policial mais próxima, obtendo respectiva certidão, para imediata entrega à LOCADORA.' });
      clauses.push({ text: '7.4. Anotar, sempre que existentes, nomes, dados pessoais e endereços completos de testemunhas presenciais de acidentes envolvendo o veículo locado.' });
      clauses.push({ text: '7.5. Não fazer qualquer tipo de acordo, negociação ou promessa com terceiros envolvidos em acidentes, devendo eximir a LOCADORA de qualquer responsabilidade neste sentido.' });
    
      clauses.push({ text: '8. DAS PENALIDADES', style:'bold' });
      clauses.push({ text: '8.1. Caso a LOCATÁRIA não informe condutor; não apresente a documentação ou não pague a multa devida, no prazo e modo acordado, tem ciência que deverá suportar multa de 2,00% (dois por cento) sobre o valor faturado relativo ao mês da infração contratual.' });
      clauses.push({ text: '8.2. Se a LOCATÁRIA proceder com negligência na guarda e/ou utilização do carro, especialmente deixando abandonado ou estacionado com portas destravadas ou vidros abaixados, chave na ignição, etc; transitar com o veículo fora do território nacional; ou se proceder com culpa grave ou dolo, nos casos de acidentes de transito ou quaisquer outros eventos que possam involve o veículo locado, suportará integralmente com o pagamento referente ao dano.' });
      clauses.push({ text: '8.3. Se a LOCATÁRIA não proceder a lavratura do boletim de ocorrência, bem como, não informar a autoridade policial sobre ocorrido, impossibilidade assim o recebimento do seguro contratado, deverá suportar todas e quaisquer despesas decorrentes, de forma ampla e integral, inclusive no que diz respeito a eventuais indenizações, seja em relação a LOCADORA ou terceiros envolvidos no acidente, fato que desde já tem ciência e concorda.' });
      clauses.push({ text: '8.4. Em caso de furto, roubo, incêndio ou perda total do veículo a LOCATÁRIA pagará a LOCADORA uma multa de 20% (vinte por cento) do valor comercial do mesmo de acordo com a Tabela FIPE.' });
      clauses.push({ text: '8.5. Em caso de sinistro, a LOCATÁRIA pagará a LOCADORA o valor de até 10% (dez por cento) do valor comercial do veículo de acordo com a Tabela FIPE.' });
    
      clauses.push({ text: '9. DO SEGURO DO VEÍCULO', style:'bold' });
      clauses.push({ text: '9.1. Tem conhecimento a LOCATÁRIA que o veículo locado possui apenas seguro em relação a terceiros, com os seguintes limites:' });
      clauses.push({ text: `9.1.1. Danos materiais (DM) até R$ ${data.limite_dm}.`, indent:5 });
      clauses.push({ text: `9.1.2. Danos corporais (DC) até R$ ${data.limite_dc}.`, indent:5 });
      clauses.push({ text: '9.2. Em virtude dos limites estabelecidos, será de única e integral responsabilidade da LOCATÁRIA o pagamento de todo e qualquer valor que exceda a cada um, devendo, portando formalizar seguro próprio.' });
    
      clauses.push({ text: '10. DISPOSIÇÕES GERAIS', style:'bold' });
      clauses.push({ text: '10.1. O veículo locado pode trafegar somente em território nacional, ressalvada a hipótese de autorização expressa da LOCADORA para a transposição das fronteiras nacionais.' });
      clauses.push({ text: '10.2. A LOCADORA, através de seus prepostos, poderá exercer a fiscalização e acompanhamento, que consistirá no direito de vistoriar o(s) veículo(s) quando do recebimento e durante o período de permanência dos mesmos na posse da LOCATÁRIA e, a seu critério, solicitar as substituições e os reparos que forem julgados necessários.' });
      clauses.push({ text: '10.3. A LOCADORA poderá acompanhar e fiscalizar a forma de utilização do(s) veículo(s) locado(s), orientando a LOCATÁRIA no sentido de atender às especificações recomendadas pelas montadoras.' });
      clauses.push({ text: '10.4. A LOCATÁRIA arcará com todos os danos causados ao(s) veículo(s), quando utilizados em condições anormais, isto é, fora das especificações recomendadas pelas montadoras.' });
      clauses.push({ text: '10.5. A LOCATÁRIA torna-se civil e criminalmente responsável pelas declarações prestadas no ato da assinatura do presente contrato.' });
      clauses.push({ text: '10.6. Este contrato é pessoal e intransferível, tornando a LOCATÁRIA, enquanto vigente, depositária do veiculo locado, sendo vedada a sublocação ou empréstimo, a qualquer título, sem prévia e expressa autorização da LOCADORA.' });
      clauses.push({ text: '10.7. A LOCATÁRIA reconhece expressamente que a LOCADORA torna-se credora de dívida líquida, certa e exigível dos valores devidos a título de locação e demais valores que integram o presente contrato, tais como multas de transito, penalidades, valores de ressarcimento, etc.' });
      clauses.push({ text: '10.8. As PARTES convencionam que a LOCADORA poderá oferecer como caução os créditos originados do presente contrato, independentemente de qualquer notificação à LOCATÁRIA, onde por este instrumento, já exara sua ciência e concordância.' });
      clauses.push({ text: '10.9. Eventuais tolerâncias da LOCADORA para com a LOCATÁRIA no cumprimento das obrigações ajustadas neste Instrumento constituem mera liberalidade, não importando em hipótese alguma em novação, permanecendo íntegras as cláusulas e condições aqui contratadas.' });
    
      clauses.push({ text: '11. DA RESCISÃO', style:'bold' });
      clauses.push({ text: '11.1. Em caso de rescisão por inadimplemento da LOCATÁRIA, será devida multa de 20% (vinte por cento)à titulo da multa penal, que será apurado por simples cálculo aritmético, sobre o valor que se encontra em aberto.' });
      clauses.push({ text: '11.2. A rescisão deste contrato não isenta a LOCATÁRIA dos valores que estiverem pendentes, tais como, alugueis, consertos, multas, manutenção, equipamentos e peças faltantes, devendo fazer a quitação de todos de forma ampla e imediata.' });
    
      clauses.push({ text: '12. DO FORO', style:'bold' });
      clauses.push({ text: 'As partes elegem o FORO da Comarca de Maringá-PR por mais privilegiado que seja outro, para dirimir quaisquer dúvidas, omissões ou discussões sobre o presente, com renúncia a qualquer outro, por mais privilegiado que seja.' });
      clauses.push({ text: 'Por estarem assim, justas e contratadas, assinam as PARTES o presente Contrato em 02 (duas) vias de igual teor e forma, na presença das testemunhas devidamente identificadas, dando tudo por bom, firme e valioso.' });
    
      // escrever todas
      clauses.forEach(clause=>{
        if(y > pageBreakThreshold && clause.style === 'bold'){ doc.addPage(); y = margin; }
        writeFlowingText(clause.text, { style: clause.style || 'normal', indent: clause.indent || 0 });
        if(clause.text.includes('seguinte veículo')){
          y += 4;
          drawTableRow('VEÍCULO / COR', data.modelo_veiculo);
          drawTableRow('ANO / MODELO', data.ano_veiculo);
          drawTableRow('PLACA', data.placa_veiculo);
          drawTableRow('CHASSI', data.chassi_veiculo);
          drawTableRow('RENAVAN', data.renavam_veiculo);
          y += 6;
        }
      });
    
      // data e assinaturas
      if(y > pageBreakThreshold - 30){ doc.addPage(); y = margin; }
      y += 10;
    
      // Lógica de Data baseada no INÍCIO DO CONTRATO
      let dataExtenso;
      if(data.inicio_contrato && data.inicio_contrato.length === 10) {
          const partes = data.inicio_contrato.split('/');
          const dia = partes[0];
          const mesNum = parseInt(partes[1], 10) - 1;
          const ano = partes[2];
          const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
          // Garante que o mês existe, senão usa hoje
          if(meses[mesNum]) {
              dataExtenso = `${dia} de ${meses[mesNum]} de ${ano}`;
          } else {
              const h = new Date();
              dataExtenso = h.toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });
          }
      } else {
          const h = new Date();
          dataExtenso = h.toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' });
      }
    
      writeFlowingText(`Maringá-PR, ${dataExtenso}.`, { align:'left' });
    
      let footerY = doc.internal.pageSize.getHeight() - 60;
      if(y > footerY - 30) footerY = y + 30;
      const signatureX1 = margin;
      const signatureX2 = pageWidth/2 + 10;
    
      doc.text('______________________________________', signatureX1, footerY);
      doc.text(data.razao_social_cliente, signatureX1, footerY + 6);
      doc.text('LOCATÁRIA', signatureX1, footerY + 12);
    
      doc.text('______________________________________', signatureX2, footerY);
      doc.text(data.nome_condutor, signatureX2, footerY + 6);
      doc.text('CONDUTOR', signatureX2, footerY + 12);
    
      footerY += 28; // Adiciona espaço após a primeira linha de assinaturas
      
      // --- Bloco da LOCADORA ---
      
      // 1. Assinatura (em itálico para diferenciar)
      doc.setFont('helvetica', 'italic');
      doc.text('Benali Rent A Car LTDA.', signatureX1, footerY);
      doc.setFont('helvetica', 'normal');
    
      // 2. CNPJ
      doc.text('15.373.411/0001-08', signatureX1, footerY + 6);
      
      // 3. Linha
      doc.text('______________________________________', signatureX1, footerY + 10); // Posição da linha
      
      // 4. Nome em maiúsculas (identificação)
      doc.text('LOCADORA', signatureX1, footerY + 22);
      // --- Fim do bloco ---
    
      const safeName = data.razao_social_cliente ? data.razao_social_cliente.replace(/[^\w\s-]/g,'').substring(0,22).trim() : 'Contrato';
    
      doc.save(`Contrato_${safeName}_${data.placa_veiculo || ''}.pdf`);
      
      // ALERTA DE SUCESSO NO PAINEL NOVO
      showAlert('PDF gerado com sucesso!', 'success');
    }
