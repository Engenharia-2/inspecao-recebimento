import { ReportData, AttachedImage, CustomField } from '../types';

// --- Funções Geradoras de HTML ---

const generateCheckbox = (label: string, checked: boolean | undefined) => {
  const checkmarkSvg = `<img src="data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28' fill='none'%3e%3cpath d='M5 13L9 17L19 7' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e" style="width: 18px; height: 18px;" />`;
  return `
    <div class="checkbox-container ${checked ? 'checked' : ''}">
      <span class="checkbox-symbol">${checked ? checkmarkSvg : ''}</span>
      <span class="checkbox-label">${label}</span>
    </div>
  `;
};

const generateField = (label: string, value: string | undefined | null) => {
  return `
    <div class="field">
      <strong>${label}:</strong>
      <span>${value || 'Não informado'}</span>
    </div>
  `;
};

const generateChecklistSection = (checklistData: { [key: string]: boolean } | undefined) => {
  if (!checklistData || Object.keys(checklistData).length === 0)
    return '<p>Nenhuma verificação realizada.</p>';
  return `
    <div class="checklist-vertical">
      ${Object.entries(checklistData)
        .map(([label, checked]) => generateCheckbox(label, checked))
        .join('')}
    </div>
  `;
};

const generateCustomFieldsSection = (title: string, fields: CustomField[]) => {
  if (!fields || fields.length === 0) return '';
  return `
    <h4>${title}:</h4>
    ${fields.map(field => generateField(field.title, field.value)).join('')}
  `;
};

const generateImageSection = (title: string, images: AttachedImage[]) => {
  if (!images || images.length === 0) return '';
  let imageHtml = `
    <div class="image-group-section">
      <h3 class="section-title">${title}</h3>
      <div class="image-grid">
  `;
  images.forEach(img => {
    imageHtml += `
      <div class="image-block">
        <img src="${img.uri}" class="report-image"/>
      </div>
    `;
  });
  imageHtml += `</div></div>`;
  return imageHtml;
};

// --- Conteúdo Principal do PDF ---

export const createPdfContent = (data: {
  logoBase64: string | null;
  reportData: ReportData;
  entryImages: AttachedImage[];
  assistanceImages: AttachedImage[];
  qualityImages: AttachedImage[];
  entryFields: CustomField[];
  defectFields: CustomField[];
  planFields: CustomField[];
  qualityFields: CustomField[];
}): string => {

  const { logoBase64, reportData, entryImages, assistanceImages, qualityImages, entryFields, defectFields, planFields, qualityFields } = data;

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background-color: #f7f9fc;
          color: #333;
          padding: 1.5cm;
        }

        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: #0f398c;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14pt;
          padding: 8px 0;
          box-shadow: 0 2px 5px rgba(0,0,0,0.15);
        }

        .logo {
          width: 40px;
          height: 40px;
          margin-right: 15px;
        }

        .main-content {

        }

        .section {
          background-color: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          padding-top: 0.3cm;
          padding: 0.5cm;
          margin-bottom: 25px;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
          page-break-inside: avoid;
        }

        .section-title {
          color: #0f398c;
          border-left: 5px solid #0f398c;
          padding-left: 10px;
          font-size: 18pt;
          margin-bottom: 15px;
        }

        h4 {
          color: #333;
          margin-top: 20px;
          margin-bottom: 8px;
          font-size: 13pt;
        }

        p, span {
          font-size: 11pt;
          line-height: 1.5;
        }

        .field {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #eee;
          padding: 6px 0;
        }

        .field strong {
          color: #0f398c;
          min-width: 40%;
        }

        /* Checklist vertical */
        .checklist-vertical {
          display: flex;
          flex-direction: column;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          background: #f1f4fa;
          border-radius: 8px;
          padding: 6px 10px;
          margin: 4px 0;
          font-size: 11pt;
        }

        .checkbox-container.checked {
          background-color: #0f398c;
          color: #fff;
        }
        
        .checkbox-symbol {
          margin-top: 8px;
          margin-right: 8px;
          font-weight: bold;
        }

        /* Imagens */
        .image-group-section {
          padding-top: 1.5cm;
          margin-top: 25px;
          page-break-inside: avoid;
        }

        .image-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .image-block {
          text-align: center;
        }

        .report-image {
          width: 300px;
          height: 300px;
          border-radius: 8px;
          object-fit: cover;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 10pt;
          color: #fff;
          background-color: #0f398c;
          border-top: 1px solid #ccc;
          padding: 5px 0;
        }
        .section-space {
          padding-top: 2cm;
        }
      </style>
    </head>
    <body>
      <div class="header">
        ${logoBase64 ? `<img src="${logoBase64}" class="logo" />` : ''}
        Relatório de Inspeção de Recebimento
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
          ${generateField('Data Estimada de Entrega', reportData.estimatedDeliveryDate)}
          ${generateField('Funcionário da Entrada', reportData.entryTechnician)}

          <h4>Itens de Retorno:</h4>
          ${generateChecklistSection({
            'Cabo de força': reportData.returnItems?.includes('Cabo de força'),
            'Manual': reportData.returnItems?.includes('Manual'),
            'Bolsa de Cabos': reportData.returnItems?.includes('Bolsa de Cabos'),
            'Cabo de medição': reportData.returnItems?.includes('Cabo de medição'),
          })}
          ${generateCustomFieldsSection('Observações de Entrada', entryFields)}
        </div>

        ${generateImageSection('Imagens da Entrada', entryImages)}

        <!-- Seção de Assistência -->
        <div class="section-space">
        <div class="section">
          <h2 class="section-title section-title-assistance">2. Assistência Técnica</h2>
          <h4>Limpeza e Checagem Interna:</h4>
          ${generateChecklistSection(reportData.cleanCheck)}
          ${generateField('Resultado Teste 1', reportData.cleanCheck_test1)}
          ${generateField('Resultado Teste 2', reportData.cleanCheck_test2)}
          ${generateField('Resultado Teste 3', reportData.cleanCheck_test3)}
          ${generateField('Resultado Teste 4', reportData.cleanCheck_test4)}

          <h4>Verificação de Funcionamento:</h4>
          ${generateChecklistSection(reportData.workingCheck)}
          ${generateCustomFieldsSection('Observação de Defeitos', defectFields)}
          ${generateCustomFieldsSection('Plano de Ação', planFields)}
        </div>
        </div>

        ${generateImageSection('Imagens da Assistência', assistanceImages)}

        <!-- Seção de Qualidade -->
        <div class="section">
          <h2 class="section-title">3. Verificação Final da Qualidade</h2>
          ${generateField('Técnico Responsável', reportData.qualityTechnician)}

          <h4>Finalização:</h4>
          ${generateChecklistSection(reportData.finalCheck)}
          ${generateCustomFieldsSection('Observações Finais', qualityFields)}
        </div>

        ${generateImageSection('Imagens da Qualidade', qualityImages)}
      </div>

      <div class="footer">

        Copyright ©2024. Todos direitos reservados à LHF Sistemas de Teste e Medição
      </div>
    </body>
    </html>
  `;

  return htmlContent;
};
