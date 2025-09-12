import React, { useState } from 'react';
import { SafeAreaView, Text, View, ScrollView, StyleSheet } from 'react-native';

import CreateCustomFieldModal from '../../components/CreateCustomFieldModal';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
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
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Plano de Ação</Text>
        <Text style={styles.label}>
          Indique o plano de ação com o título e descreva a intervenção necessária.
        </Text>
      </View>
        <CustomButton
          title="Adicionar Novo Campo de Texto"
          onPress={() => setIsModalVisible(true)}
        />
        <View style={stylesReport.containerCamp}>
        <ScrollView style={styles.scrollContent}>
          <View style={styles.viewPadding}>
            {customFields.map((field) => (
              <View key={field.id} style={styles.inputGroup}>
                <CustomInput
                  label={`${field.title}:`}
                  value={field.value}
                  onChangeText={(text) => updateCustomFieldValue(field.id, text)}
                  placeholder={`Preencha o valor para ${field.title}`}
                />
                <CustomButton
                  title="Remover"
                  onPress={() => removeCustomField(field.id)}
                  style={{ backgroundColor: Colors.red, marginTop: 5, paddingVertical: 8 }}
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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    zIndex: 0,
  },
  titleContainer:{
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.textLight,
  },
  label:{
    fontSize: 16,
  },
  scrollContent: {
    paddingVertical: 25,
    flexGrow: 1,
  },
  viewPadding:{
    paddingHorizontal: 8,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 8,
  },
});


export default React.memo(DynamicFieldsStep);