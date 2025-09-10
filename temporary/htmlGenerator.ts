import { LocationData, TemperatureRecord, ReportData } from '../types';
import { getLogoBase64 } from './assets';

/**
 * Gera o conteúdo HTML para o relatório PDF.
 * @param {object} params - Parâmetros para o relatório.
 * @param {string} params.clientName - Nome do cliente.
 * @param {string} params.operatorName - Nome do operador.
 * @param {ReportData} params.reportData - Dados do relatório.
 * @param {TemperatureRecord[]} params.temperatureData - Dados de temperatura coletados.
 * @param {{ base64: string, description: string }[]} params.attachedImages - Array de imagens anexadas (Base64 e descrição).
 * @param {string} [params.userImageWidth='auto'] - Largura desejada para a imagem do usuário (e.g., '100px', '50%', 'auto').
 * @param {string} [params.userImageHeight='auto'] - Altura desejada para a imagem do usuário (e.g., '100px', '50%', 'auto').
 * @param {LocationData | null} [params.locationData=null] - Dados de localização (opcional).
 * @param {string | null} [params.customHeaderLogoBase64=null] - Logo personalizada em Base64 para o cabeçalho.
 * @param {string} [params.reportColor='#0f398c'] - Cor do cabeçalho e rodapé do PDF (HEX).
 * @param {string} [params.reportTitle=null] - Título do relatório.
 */
export const createPdfContent = (params: { 
  clientName: string;
  operatorName: string;
  temperatureData: TemperatureRecord[];
  attachedImages: { base64: string, description: string }[];
  userImageWidth: string;
  userImageHeight: string;
  locationData: LocationData | null;
  customHeaderLogoBase64: string | null;
  reportColor: string;
  reportTitle: string;
  reportData: ReportData;
}): string => {
  const { clientName, operatorName, temperatureData, attachedImages, locationData, customHeaderLogoBase64, reportColor, reportTitle, reportData, userImageHeight, userImageWidth } = params; 
  const defaultLogoSrc = getLogoBase64();

  const finalLogoToUse = customHeaderLogoBase64 || defaultLogoSrc;

  const userImageStyle = `
    max-width: 100%;
    display: block;
    margin: 20px auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 400px;
    height: 400px;
    object-fit: cover;
  `;

  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css">
        <style>
            body {
                font-family: sans-serif;
            }
            // section {break-inside: avoid; page-break-inside: avoid;}
            // div{ page-break-before: always;}
            // page-break { page-break-after: always; page-break-inside: avoid; page-break-before: always; }
            p { margin-bottom: 5px; }
            hr { border: none; border-top: 1px solid #eee; margin: 20px 0; }
            h2 { color: #fff; border-radius: 5px; padding: 5px; background-color: ${reportColor}; margin-top: 20px; margin-bottom: 10px; orphans: 3; widows: 3;}
            h3 { color: #555; margin-top: 0.5cm; margin-bottom: 5px; font-size: 16px;}
            table { width:100%; border-collapse: collapse; text-align: center; margin-bottom: 20px;}
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f2f2f2; }
            .image-title{
                break-inside: avoid; page-break-inside: avoid;                                                                                                                                                
            }
            .image-section{
                break-inside: avoid;
            }
            .glue{
                break-inside: avoid; 
            }
            .report-image {
                ${userImageStyle};
                widht: 400px;
                height: 400px;
                object-fit: cover;
            }
            .location-link {
                color: #007bff;
                text-decoration: none;
            }
            .location-link:hover {
                text-decoration: underline;
            }
            @page {
                margin-top: 3cm;
                margin-left: 0cm;
                margin-right: 0cm;
                margin-bottom: 1cm;

                @top-left {
                    content: "";
                    background-image: url(${finalLogoToUse});
                    background-color: ${reportColor}; 
                    padding: 1.2cm;
                    padding-top: 0.4cm;
                    width: 1.0cm;
                    height: 0.9cm;
                    vertical-align: middle;
                    background-size: 2cm;
                    background-repeat: no-repeat;
                    background-position: center;
                    margin-bottom: 0.5cm;
                }
                @top-center {
                    content: "${reportTitle}";
                    font-weight: bold;
                    font-size: 1cm;
                    color: #fff;
                    text-align: center;
                    white-space: nowrap;
                    background-color: ${reportColor}; 
                    padding: 0.2cm 0;
                    width: 14.75cm;
                    margin-bottom: 0.5cm;

                }
                @top-right {
                    content: "";
                    background-color: ${reportColor};
                    width: 3.39cm;
                    margin-bottom: 0.5cm;

                }
                @bottom-left {
                    content: "";
                    background-color: ${reportColor};
                    height: 1cm;
                }
                @bottom-center {
                    height: 1cm;
                    content: "Copyright ©2024. Todos direitos reservados à \\A LHF Sistemas de Teste e Medição";
                    font-size: 8pt;
                    color: #fff;
                    background-color: ${reportColor}; /* ALTERADO */
                    text-align: center;
                    width: 70%;
                }
                @bottom-right {
                    content: " " counter(page) "/" counter(pages);
                    background-color: ${reportColor}; /* ALTERADO */
                    width: 3.19cm;
                    height: 1cm;
                    color: #fff;
                    text-align: center;
                    font-size: 10pt;
                }
            }

        </style>
    </head>
    <body>
        <p><strong>Data do Relatório:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Hora do Relatório:</strong> ${new Date().toLocaleTimeString()}</p>
        <p><strong>Cliente:</strong> ${clientName || 'Não Informado'}</p>
        <p><strong>Operador:</strong> ${operatorName || 'Não Informado'}</p>
        <hr/>
        <h2>Dados da Edificação:</h2>
        <p><strong>Tipo de edificação:</strong> ${reportData.buildingType || 'Não Informado'}</p>
        <p><strong>Nível de proteção requerido:</strong> ${reportData.protectionLevel || 'Não Informado'}</p>
        <p><strong>Tipo de SPDA:</strong> ${reportData.spdaType || 'Não Informado'}</p>
        <p><strong>Materiais predominantes:</strong> ${reportData.predominantMaterials || 'Não Informado'}</p>
        <p><strong>Área construída (m²):</strong> ${reportData.builtArea || 'Não Informado'}</p>
        <p><strong>Altura da estrutura (m):</strong> ${reportData.structureHeight || 'Não Informado'}</p>
        <p><strong>Tipo de aterramento:</strong> ${reportData.groundingType || 'Não Informado'}</p>
        <p><strong>Certificado de calibração:</strong> ${reportData.calibrationCertificate || 'Não Informado'}</p>
        <hr/>
        
        ${reportData.customFields && reportData.customFields.length > 0 ? `
          <h2>Observações:</h2>
          ${reportData.customFields.map(field => `
            <p><strong>${field.title}:</strong> ${field.value || 'Não Informado'}</p>
          `).join('')}
          <hr/>
        ` : ''}

        <h3>Tipo de inspeção:</h3>
        <p>${reportData.inspectionType || 'Não Informado'}</p>
        <hr/>
        <div class="glue">
          <h3>Resultados de verificações:</h3>
          <ul>
            ${(reportData.verificationResults && reportData.verificationResults.length > 0)
              ? reportData.verificationResults.map(item => `<li>${item}</li>`).join('')
              : '<li>Não Informado</li>'}
          </ul>
          <hr/>
        </div>
        <div class="glue">
          <h3>Documentação análisada:</h3>
          <ul>
            ${(reportData.analyzedDocumentation && reportData.analyzedDocumentation.length > 0)
              ? reportData.analyzedDocumentation.map(item => `<li>${item}</li>`).join('')
              : '<li>Não Informado</li>'}
          </ul>
          <hr/>
        </div>
        <div class="glue">
          <h3>Não conformidades e recomendações:</h3>
          <p>${reportData.nonConformities || 'Não Informado'}</p>
          <hr/>
        </div>
        <div class="glue">
          <h3>Conclusão:</h3>
          <p>${reportData.conclusion || 'Não Informado'}</p>
          <hr/>
        </div>
        <div class="glue">
          <h3>Responsavel técnico:</h3>
          <p>${reportData.technicalManager || 'Não Informado'}</p>
          <hr/>
        </div>
        <div class="glue">
          <h3>Representante da empresa:</h3>
          <p>${reportData.companyRepresentative || 'Não Informado'}</p>
          <hr/>
        </div>
  `;

  if (attachedImages.length > 0) {
    htmlContent += `<h2 class="image-title">Imagens Anexadas:</h2>`;
    attachedImages.forEach((img, index) => {
      htmlContent += `
        <section class="image-section">
          <h3>Imagem ${index + 1}: ${img.description || 'Sem Descrição'}</h3>
          <img src="${img.base64}" class="report-image" alt="${img.description || 'Imagem do Relatório'}" />
        </section>
      `;
    });
  }

  htmlContent += `
        <h2>Dados de Temperatura Coletados:</h2>
  `;

  if (temperatureData.length > 0) {
    htmlContent += `
      <table>
        <thead>
          <tr>
            <th>Horário</th>
            <th>Temperatura</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
    `;
    temperatureData.forEach(record => {
      htmlContent += `
        <tr>
          <td>${record.timestamp}</td>
          <td>${record.temperature}</td>
          <td>${record.description || 'N/A'}</td>
        </tr>
      `;
    });
    htmlContent += `
        </tbody>
      </table>
    `;
  } else {
    htmlContent += `
      <p>Nenhum dado de temperatura foi coletado para este relatório.</p>
    `;
  }

  if (locationData) {
    const googleMapsLink = `http://maps.google.com/maps?q=${locationData.latitude},${locationData.longitude}`;


    htmlContent += `
      <hr/>
      <div class="glue">
        <h2>Localização:</h2>
        ${locationData.address ? `<p><strong>Endereço:</strong> ${locationData.address}</p>` : ''}
        <p><strong>Ver no Google Maps:</strong> <a href="${googleMapsLink}" class="location-link" target="_blank">${googleMapsLink}</a></p>
      </div>
    `;
  }

  htmlContent += `
    <hr/>
    <p class="footer">Gerado pelo App LHF</p>
    </body>
    </html>
  `;

  return htmlContent;
};