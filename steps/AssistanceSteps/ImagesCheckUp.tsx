import React from 'react';
import { StyleSheet, View } from 'react-native';
import ImageAttachment from '../../components/ImageAttachment';
import { useImageManager } from '../../hooks/useImageManager';
import { useAppStore } from '../../store';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import CustomTitle from '../../components/CustomTitle';
import { useImageRouteParams } from '../../hooks/useImageRouteParams';

type ImagesCheckUpProps = {
  currentStepIndex: number;
};

const ImagesCheckUp: React.FC<ImagesCheckUpProps> = ({ currentStepIndex }) => {
  const updateReportField = useAppStore((state) => state.updateReportField);
  const assistanceTechnician = useAppStore((state) => state.assistanceTechnician);
  const assistanceImages = useAppStore((state) => state.assistanceImages);

  const { pickImage, takePicture, deleteImage, processAndSaveImage } = useImageManager('assistance');
  const navigation = useNavigation<any>();

  useImageRouteParams(processAndSaveImage);

  return (
    <View style={styles.container}>
        <View>
            <CustomTitle title='Verificação de Imagens'/>
            <CustomInput
                label="Técnico que realizou os testes:"
                placeholder="Nome do Técnico"
                value={assistanceTechnician || ''}
                onChangeText={(text) => updateReportField('assistanceTechnician', text)}
            />
            <ImageAttachment
                attachedImages={assistanceImages}
                onPickImage={pickImage}
                onTakePicture={() => takePicture(4)}
                onDeleteImage={deleteImage}
            />
        </View>
        <View style={styles.buttonContainer}>
            <CustomButton
                title="Fechar formulário"
                onPress={() => navigation.navigate('Select')}
            />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between', // Push button to bottom
  },
  buttonContainer: {
    paddingBottom: 20, // Add some padding at the bottom
  },
});

export default ImagesCheckUp;
