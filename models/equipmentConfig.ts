
export const CURRENT_FORM = 'CURRENT_FORM';

const miliohmimetroChecks = [
  { label: 'Ligar equipamento', helpText: 'Ligar o equipamento e verificar se o botão (Power) está em boas condições' },
  { label: 'Testes carregamento de baterias', helpText: 'Conectar o cabo de alimentação (220V) e verificar se as baterias estão carregando. Será mostrado no simbolo da bateria se está carregando.' },
  { label: 'Teste de medição', helpText: 'Realizar teste em todos as escala. Os valores obtido não podem ter uma grande variação. ( Variação máxima de 0,4) ' },
  { label: 'Testar botão de iniciar da tampa', helpText: 'Testar se o botão físico de inciar teste está funcionado.' },
  { label: 'Testar o mike', helpText: 'Testar se o mike está funcionado, nesse teste deve ser utilizado o sensor de temperatura e o botão externo.' },
  { label: 'Testar o USB', helpText: 'Testar a emissão de relatório do equipamento.' },
];

const megohmetroChecks = [
  { label: 'Ligar Equipamento', helpText: 'Ligar o equipamento e verificar se o botão (Power) está em boas condições' },
  { label: 'Testar carregamento das baterias', helpText: 'Conectar o cabo de alimentação (220V) e verificar se as baterias estão carregando. Será mostrado uma tela de carregamento. Após o teste, desconectar o cabo e reinicie o equipamento.' },
  { label: 'Testar trimpot', helpText: 'Na tela de teste, ajustar o valor de tensão no valor máximo, verificar se o trimpot está subindo o valor ao girar no sentido horário e diminuindo ao girar no sentido anti-horário.' },
  { label: 'Testar botão de iniciar', helpText: 'Com o valor de tensão ajustado, prossiga para a próxima tela e inicie o teste com o botão físico. Verificar a condição do botão, trocar caso seja necessário. Esse teste deve ser feito sem os cabos de medição.' },
  { label: 'Teste em andamento', helpText: 'Ao iniciar o teste, após alguns segundos os valores de resistência mostrados devem ser: 5TΩ  (Sem as garras) para megôhmetro de 5kV e 1TΩ (Sem as garras) para equipamentos de 1kV. Caso não esteja atingindo esses valores, verificar com a eletrônica.' },
  { label: 'Testar botão parar', helpText: 'Com o teste em andamento, finalizar o teste com o botão parar.' },
  { label: 'Salvar teste', helpText: 'Terminado o teste, passa para a próxima tela. Clicar em gráfico e salvar o teste realizado.' },
  { label: 'Testar USB', helpText: 'Conecte o mega ao computador com o cabo USB. Utilizando o programa do mega, faça a conexão com o equipamento, busque os dados. Após feito a busca, deve aparecer o último teste salvo, juntamente com teste feito pelo cliente. Caso o equipamento for de locação, apagar todos os teste, caso for de cliente, salvar os testes na pasta do equipamento do servidor.' },
];

const equipmentChecklists: { [key: string]: { label: string; helpText: string; }[] | string } = {
  'Miliohmimetro bancada': miliohmimetroChecks,
  'Miliohmimetro (sem bateria)': miliohmimetroChecks,
  'Miliohmimetro': miliohmimetroChecks,
  'Megohmetro 1kv': megohmetroChecks,
  'Megohmetro 5kv': megohmetroChecks,
  'Surge Test 4kv M1': CURRENT_FORM,
  'Surge Test 4kv (antigo)': CURRENT_FORM,
  'Surge Test 4kv bancada': CURRENT_FORM,
  'Surge teste 15kv': CURRENT_FORM,
  'Surge teste 15kv MT': CURRENT_FORM,
};

export const getChecklistForModel = (model: string | null): { label: string; helpText: string; }[] | string => {
  if (!model) return [];
  return equipmentChecklists[model] || [];
};

// --- Clean Check Step Config ---

const standardCleanChecks = [
  { label: 'Limpeza do equipamento', helpText: 'Retirar a mecânica da maleta e fazer a limpeza de ambos.' },
  { label: 'Parafusos', helpText: 'Checar se há algum parafuso solto e fazer o aperto se necessário.' },
  { label: 'Cola quente', helpText: 'Verificar se está faltando alguma cola quente.' },
  { label: 'Limpar os cabos de medição', helpText: 'Verificar se os cabos de medição estão em boas condições. Com uma estopa e álcool, fazer a limpeza dos cabos e garras.' },
];

const miliohmimetroCleanChecks = [
  ...standardCleanChecks,
  { label: 'Checar tampas do BMS', helpText: 'Checar se as tampas do BMS estão fixas corretamente.' },
];

const megohmetroCleanChecks = [
  { label: 'Limpeza do equipamento', helpText: 'Retirar a mecânica da maleta e fazer a limpeza de ambos.' },
  { label: 'Parafusos', helpText: 'Checar se há algum parafuso solto e fazer o aperto se necessário.' },
  { label: 'Cola quente', helpText: 'Verificar se está faltando alguma cola quente.' },
  { label: 'Limpar os cabos de medição', helpText: 'Verificar se os cabos de medição estão em boas condições. Com uma estopa e álcool, fazer a limpeza dos cabos e garras.' },
  { label: 'Teste 1 - 1 min - 250V', helpText: 'Salvar todos os teste na memória do equipamento e não excluir.' },
  { label: 'Teste 2 - 1 min - 500V', helpText: 'Salvar todos os teste na memória do equipamento e não excluir.' },
  { label: 'Teste 3 - 1 min - 750V', helpText: 'Salvar todos os teste na memória do equipamento e não excluir.' },
  { label: 'Teste 4 - 10 min - 1000V', helpText: 'Salvar todos os teste na memória do equipamento e não excluir.' },
];

const cleanChecklists: { [key: string]: { label: string; helpText: string; }[] } = {
  // Miliohmimetro
  'Miliohmimetro bancada': miliohmimetroCleanChecks,
  'Miliohmimetro (sem bateria)': miliohmimetroCleanChecks,
  'Miliohmimetro': miliohmimetroCleanChecks,
  // Megohmetro
  'Megohmetro 1kv': megohmetroCleanChecks,
  'Megohmetro 5kv': megohmetroCleanChecks,
  // Surge (padrão)
  'Surge Test 4kv M1': standardCleanChecks,
  'Surge Test 4kv (antigo)': standardCleanChecks,
  'Surge Test 4kv bancada': standardCleanChecks,
  'Surge teste 15kv': standardCleanChecks,
  'Surge teste 15kv MT': standardCleanChecks,
};

export const getCleanChecklistForModel = (model: string | null): { label: string; helpText: string; }[] => {
  if (!model) return standardCleanChecks; // Retorna padrão se não houver modelo
  return cleanChecklists[model] || standardCleanChecks; // Retorna padrão se o modelo não estiver no mapa
};

// --- Final Check Step Config ---

const miliohmimetroFinalChecks = [
  { label: 'Maleta', helpText: 'Verifique se a maleta está em bom estado.' },
  { label: 'Membrana', helpText: 'Verifique se a membrana está em bom estado.' },
  { label: 'Botões', helpText: 'Verifique se todos os botões estão funcionando corretamente.' },
  { label: 'Tela', helpText: 'Verifique se a tela está funcionando corretamente, sem manchas ou pixels mortos.' },
  { label: 'Teste', helpText: 'Realize um teste final e verifique se os resultados estão corretos.' },
  { label: 'Conectar com o PC', helpText: 'Conecte o equipamento ao PC e verifique se a comunicação com o programa do mili está funcionando.' },
  { label: 'Exportar os testes', helpText: 'Exporte os testes para o PC e verifique se os arquivos foram criados corretamente.' },
  { label: 'Tirar foto', helpText: 'Tirar foto do equipamento e salvar no nomus.' },
  { label: 'Tirar print da calibração', helpText: 'Tire um print da tela de calibração para o relatório.' },
];

const megohmetroFinalChecks = [
  { label: 'Maleta', helpText: 'Verifique se a maleta está em bom estado.' },
  { label: 'Membrana', helpText: 'Verifique se a membrana está em bom estado.' },
  { label: 'Botões', helpText: 'Verifique se todos os botões estão funcionando corretamente.' },
  { label: 'Tela', helpText: 'Verifique se a tela está funcionando corretamente, sem manchas ou pixels mortos.' },
  { label: 'Teste', helpText: 'Realizar um teste em tensão máxima por 5 min.' },
  { label: 'Conectar com o PC', helpText: 'Verificar conexão com programa do Megôhmetro' },
  { label: 'Exportar os testes', helpText: 'Exportar todos os teste para a pasta do equipamento.' },
  { label: 'Tirar foto', helpText: 'Tirar foto do equipamento e salvar no nomus.' },
  { label: 'Verificar testes salvos', helpText: 'Verificar testes salvos da Assistência e Qualidade.' },
  { label: 'Trimpot', helpText: 'Verifique condição da Trimpot' },
];

const finalChecklists: { [key: string]: { label: string; helpText: string; }[] | string } = {
  // Miliohmimetro
  'Miliohmimetro bancada': miliohmimetroFinalChecks,
  'Miliohmimetro (sem bateria)': miliohmimetroFinalChecks,
  'Miliohmimetro': miliohmimetroFinalChecks,
  // Megohmetro
  'Megohmetro 1kv': megohmetroFinalChecks,
  'Megohmetro 5kv': megohmetroFinalChecks,
  // Surge (formulário atual)
  'Surge Test 4kv M1': CURRENT_FORM,
  'Surge Test 4kv (antigo)': CURRENT_FORM,
  'Surge Test 4kv bancada': CURRENT_FORM,
  'Surge teste 15kv': CURRENT_FORM,
  'Surge teste 15kv MT': CURRENT_FORM,
};

export const getFinalChecklistForModel = (model: string | null): { label: string; helpText: string; }[] | string => {
  if (!model) return CURRENT_FORM;
  return finalChecklists[model] || CURRENT_FORM;
};
