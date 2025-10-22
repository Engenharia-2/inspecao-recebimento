import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, ActivityIndicator, View } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';
import CustomButton from '../../components/CustomButton';
import { useAppStore } from '../../store';
import { sendEntryCompleteEmail } from '../../routes/apiService';
import { useNavigation } from '@react-navigation/native';

const FinalStep = () => {
  const [isLoading, setIsLoading] = useState(false);
  const updateReportField = useAppStore((state) => state.updateReportField);
  const entryTechnician = useAppStore((state) => state.entryTechnician);
  const recipientEmail = useAppStore((state) => state.recipientEmail);
  const currentSessionId = useAppStore((state) => state.currentSessionId);
  const isEntryComplete = useAppStore((state) => state.isEntryComplete);
  const navigation = useNavigation();

  const handleSendEmail = async () => {
    if (!isEntryComplete) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios da etapa de entrada antes de enviar o e-mail.');
      return;
    }
    if (!currentSessionId) {
      Alert.alert('Erro', 'Nenhuma sessão ativa encontrada.');
      return;
    }
    if (!recipientEmail) {
      Alert.alert('Erro', 'Por favor, digite o e-mail do cliente.');
      return;
    }

    setIsLoading(true);
    const response = await sendEntryCompleteEmail(currentSessionId, recipientEmail);
    setIsLoading(false);

    if (response.success) {
      Alert.alert('Sucesso', response.message);
      navigation.navigate('Select'); // Navega de volta para a tela de seleção após o envio
    } else {
      Alert.alert('Erro', response.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomTitle title='Finalização'/>
      <CustomInput 
        label="Funcionário"
        value={entryTechnician || ''} 
        onChangeText={(text) => updateReportField('entryTechnician', text)} 
        placeholder="Digite o nome do funcionário"
      />
      <CustomInput 
        label="Email do Cliente"
        value={recipientEmail || ''} 
        onChangeText={(text) => updateReportField('recipientEmail', text)} 
        placeholder="Digite o email do cliente"
        keyboardType="email-address"
      />
      <View style={[styles.buttonContainer, { opacity: isLoading ? 0.5 : 1 }]}>
        <CustomButton
          title="Enviar E-mail de Conclusão"
          onPress={handleSendEmail}
          disabled={!isEntryComplete || !currentSessionId || !recipientEmail || isLoading}
        />
        <CustomButton
          title="Fechar formulário"
          onPress={() => navigation.navigate('Select')}
          disabled={isLoading} 
        />
      </View>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  buttonContainer: {
    gap: 16,
  },
});

export default FinalStep;
