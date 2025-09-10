import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, View, ScrollView } from 'react-native';

import CreateCustomFieldModal from '../../components/CreateCustomFieldModal';
import CustomButton from '../../components/CustomButton';
import { stylesUI } from '../../styles/stylesUI';
import { Colors } from '../../assets/Colors';
import { stylesReport } from '../../styles/stylesReport';
import { useAppStore } from '../../store';

const DynamicFieldsStep: React.FC = () => {
  const customFields = useAppStore((state) => state.customFields);
  const addCustomField = useAppStore((state) => state.addCustomField);
  const updateCustomFieldValue = useAppStore((state) => state.updateCustomFieldValue);
  const removeCustomField = useAppStore((state) => state.removeCustomField);
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <SafeAreaView style={stylesUI.screenContainer}>
        <Text style={stylesUI.headerText}>Plano de Ação</Text>
        <Text style={stylesUI.labelText}>
          Indique o plano de ação com o título e descreva a intervenção necessária.
        </Text>
        <CustomButton
          title="Adicionar Novo Campo de Texto"
          onPress={() => setIsModalVisible(true)}
          style={stylesUI.button}
          textStyle={stylesUI.buttonText}
        />
        <View style={stylesReport.containerCamp}>
        <ScrollView style={stylesUI.scrollContent}>
          <View style={stylesUI.viewPadding}>
            {customFields.map((field) => (
              <View key={field.id} style={stylesUI.inputGroup}>
                <Text style={stylesUI.labelText}>{field.title}:</Text>
                <TextInput
                  style={stylesUI.input}
                  value={field.value}
                  onChangeText={(text) => updateCustomFieldValue(field.id, text)}
                  placeholder={`Preencha o valor para ${field.title}`}
                />
                <CustomButton
                  title="Remover"
                  onPress={() => removeCustomField(field.id)}
                  style={{ backgroundColor: Colors.red, marginTop: 5, paddingVertical: 8 }}
                  textStyle={[stylesUI.buttonText, stylesUI.buttonTextRemove]}
                />
              </View>
            ))}
            </View>
        </ScrollView>
        </View>
        <CreateCustomFieldModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onConfirm={(title) => {
            addCustomField(title);
            setIsModalVisible(false);
          }}
        />
    </SafeAreaView>
  );
};

export default React.memo(DynamicFieldsStep);