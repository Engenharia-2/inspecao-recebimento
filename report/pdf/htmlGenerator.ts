import { ReportData, AttachedImage, CustomField } from '../types';

const generateCheckbox = (label: string, checked: boolean | undefined) => {
    return `
        <div class="checkbox-container">
            <span class="checkbox ${checked ? 'checked' : ''}"></span>
            <span class="checkbox-label">${label}</span>
        </div>
    `;
};

const generateField = (label: string, value: string | undefined | null) => {
    return `<p><strong>${label}:</strong> ${value || 'Não informado'}</p>`;
};

const generateImageSection = (title: string, images: AttachedImage[]) => {
    if (!images || images.length === 0) return '';
    let imageHtml = `<div class="image-group-section"><h3 class="image-header">${title}</h3>`;
    images.forEach(img => {
        imageHtml += `
            <div class="image-block">
                <img src="${img.uri}"  class="report-image"/>
            </div>
        `;
    });
    imageHtml += `</div>`; // Close the image-group-section div
    return imageHtml;
}

export const createPdfContent = (data: {
    reportData: ReportData;
    entryImages: AttachedImage[];
    assistanceImages: AttachedImage[];
    qualityImages: AttachedImage[];
    customFields: CustomField[];
}): string => {

  const { reportData, entryImages, qualityImages, customFields } = data;

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: sans-serif;
                margin: 0; /* Remove default body margin */
                color: #333;
            }
            .header, .footer {
                position: fixed;
                left: 0;
                right: 0;
                background-color: #0f398c; 
                color: white;
                text-align: center;
                width: 100%;
                z-index: 1000; 
            }
            .header {
                top: 0;
                height: 2cm;
                font-size: 16pt;
                font-weight: bold;
                display: flex; 
                align-items: center;
                justify-content: center; 
                padding-left: 20px;
                padding-right: 20px; 
            }
            .main-content {
                padding: 0 20px; /* Horizontal padding for content */
            }
            .section { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 3cm; margin-top: 3cm; page-break-inside: avoid; break-inside: avoid; page-break-after: always;}
            .section-title { font-size: 20px; font-weight: bold; color: #005a9c; margin-top: 0; margin-bottom: 15px; border-bottom: 2px solid #005a9c; padding-bottom: 5px; }
            .section-space-images{page-break-inside: avoid; break-inside: avoid; page-break-after: always; margin-top: 3cm;}
            p { margin: 0 0 10px; line-height: 1.4; }
            strong { color: #555; }
            .checkbox-container { display: flex; align-items: center; margin-bottom: 8px; }
            .checkbox { width: 16px; height: 16px; border: 1px solid #999; margin-right: 10px; text-align: center; line-height: 16px; }
            .checkbox.checked::after { content: '✔'; color: #005a9c; }
            .image-section { margin-top: 1cm;}
            .image-header { font-size: 18px; font-weight: bold; color: #333; margin-top: 20px; margin-bottom: 10px; }
            .image-block { text-align: center; margin-bottom: 20px; }
            .report-image { width: 400px; height: 400px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 5px; }
            .image-description { font-size: 14px; color: #666; font-style: italic; }
            .image-group-section { border: 1px solid #eee; padding: 10px; margin-bottom: 15px; border-radius: 5px; }
            .header-title {
                flex-grow: 1; /* Allow title to take remaining space */
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <span class="header-title">Relatório de Inspeção de Recebimento</span>
        </div>
        <div class="main-content">
            <!-- Seção de Entrada -->
            <div class="section">
                <h2 class="section-title">1. Dados de Entrada</h2>
                ${generateField('Ordem de Produção (OP)', reportData.op)}
                ${generateField('Data de Abertura', reportData.openDate)}
                ${generateField('Número de Série', reportData.serialNumber)}
                ${generateField('Modelo', reportData.model)}
                ${generateField('Tipo de Ordem', reportData.orderType)}
                ${generateField('Nota Fiscal', reportData.invoice)}
                ${generateField('Funcionário da Entrada', reportData.entryTechnician)}
                <h4>Itens de Retorno:</h4>
                ${generateCheckbox('Cabo de força', reportData.returnItems?.includes('Cabo de força'))}
                ${generateCheckbox('Manual', reportData.returnItems?.includes('Manual'))}
                ${generateCheckbox('Bolsa de Cabos', reportData.returnItems?.includes('Bolsa de Cabos'))}
                ${generateCheckbox('Cabo de medição', reportData.returnItems?.includes('Cabo de medição'))}
            </div>
            <div class="section-space-images image-section">
                <h2 class="section-title">Imagens da entrada</h2>
                ${generateImageSection('Imagens da Entrada', entryImages)}
            </div>

            <!-- Seção de Assistência -->
            <div class="section">
                <h2 class="section-title">2. Assistência Técnica</h2>
                ${generateField('Técnico Responsável', reportData.assistanceTechnician)}
                <h4>Limpeza e Checagem Interna:</h4>
                ${generateCheckbox('Limpeza do equipamento', reportData.cleanCheck_equipmentCleaning)}
                ${generateCheckbox('Parafusos', reportData.cleanCheck_screws)}
                ${generateCheckbox('Cola quente', reportData.cleanCheck_hotGlue)}
                ${generateCheckbox('Limpar os cabos de medição', reportData.cleanCheck_measurementCables)}
                <h4>Registro de Defeitos:</h4>
                ${generateField('Peça com defeito', reportData.defect_part)}
                ${generateField('Causa', reportData.defect_cause)}
                ${generateField('Solução', reportData.defect_solution)}
                ${generateField('Observações do Defeito', reportData.defect_observations)}
                <h4>Verificação de Funcionamento:</h4>
                ${generateCheckbox('Ligar equipamento', reportData.workingCheck_powerOn)}
                ${generateCheckbox('Testar botões e LEDs', reportData.workingCheck_buttonsLeds)}
                ${generateCheckbox('Realizar testes predefinidos', reportData.workingCheck_predefinedTests)}
                ${generateCheckbox('Verificar tela', reportData.workingCheck_screen)}
                ${generateCheckbox('Verificar maleta e membranas', reportData.workingCheck_caseMembranes)}
            </div>
            <div class="image-section section-space-images">
                <h2 class="section-title">Imagens da Assistência</h2>
                ${generateImageSection('Imagens da Assistência', qualityImages)}
            </div>

            <!-- Seção de Qualidade -->
            <div class="section">
                <h2 class="section-title">3. Verificação Final da Qualidade</h2>
                ${generateField('Técnico Responsável', reportData.qualityTechnician)}
                <h4>Finalização:</h4>
                ${generateCheckbox('Maleta', reportData.finalCheck_case)}
                ${generateCheckbox('Membrana', reportData.finalCheck_membrane)}
                ${generateCheckbox('Botões', reportData.finalCheck_buttons)}
                ${generateCheckbox('Tela', reportData.finalCheck_screen)}
                ${generateCheckbox('Teste', reportData.finalCheck_test)}
                ${generateCheckbox('Salvar Relatórios', reportData.finalCheck_saveReports)}
                ${generateCheckbox('Print da calibração', reportData.finalCheck_calibrationPrint)}
                ${generateCheckbox('Fazer backup do equipamento', reportData.finalCheck_backup)}
                <h4>Observações Finais:</h4>
                <p>${reportData.qualityObservations || 'Nenhuma observação.'}</p>
            </div>
            <div class="image-section section-space-images">
                <h2 class="section-title">5. Imagens da Finalização</h2>
                ${generateImageSection('Imagens da Qualidade', qualityImages)}
            </div>

            <!-- Seção de Plano de Ação -->
            ${customFields && customFields.length > 0 ? `
            <div class="section">
                <h2 class="section-title">4. Plano de Ação</h2>
                ${customFields.map(field => generateField(field.title, field.value)).join('')}
            </div>
            ` : ''}
        </div>
    </body>
    </html>
  `;
 
  return htmlContent;
};
