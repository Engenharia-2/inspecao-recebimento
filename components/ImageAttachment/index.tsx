import React, { FC } from 'react';
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './style';
import { Colors } from '../../assets/Colors';
import { AttachedImage } from '../../report/types'; // Use AttachedImage from report/types
import { MaterialIcons, Feather } from '@expo/vector-icons';

const ImageAttachment: FC<ImageAttachmentProps> = ({ attachedImages, onPickImage, onTakePicture, onDeleteImage }) => {

  const handleAction = (action: () => void) => {
    action(); // Just call the action
  };

  const handleRemoveImage = (image: AttachedImage) => {
    Alert.alert(
      "Remover Imagem",
      "Tem certeza que deseja remover esta imagem?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", onPress: () => onDeleteImage(image), style: "destructive" },
      ]
    );
  };

  const renderImageItem = ({ item }: { item: AttachedImage }) => {
    const isDeleting = item.status === 'deleting';

    const getStatusComponent = () => {
      if (item.status === 'uploading') {
        return (
          <View style={styles.imageStatusContainer}>
            <Feather name="loader" size={20} color="white" />
          </View>
        );
      }
      if (item.status === 'uploaded') {
        return (
          <View style={[styles.imageStatusContainer, { backgroundColor: 'rgba(0, 128, 0, 0.7)' }]}>
            <Feather name="check-circle" size={20} color="white" />
          </View>
        );
      }
      if (item.status === 'error') {
        return (
          <View style={[styles.imageStatusContainer, { backgroundColor: 'rgba(255, 0, 0, 0.7)' }]}>
            <Feather name="x-circle" size={20} color="white" />
          </View>
        );
      }
      return null;
    };

    return (
      <View key={item.id?.toString() || item.uri} style={isDeleting ? { opacity: 0.5 } : {}}>
        <TouchableOpacity 
          onPress={() => handleRemoveImage(item)} 
          style={styles.removeImageButton}
          disabled={isDeleting}
        >
          <Text style={[styles.buttonText, styles.buttonTextRemove]}>X</Text>
        </TouchableOpacity>
        <Image source={{ uri: item.uri }} style={styles.selectedImage} />
        {getStatusComponent()}
      </View>
    );
  };

  return (
    <>
      <View style={styles.imgButtonsContainer}>
        <TouchableOpacity onPress={() => handleAction(onPickImage)} style={[styles.button, styles.buttonImg]}>
          <Text style={styles.buttonText}>Imagem</Text>
          <MaterialIcons name="photo-library" size={40} color={Colors.textLight} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAction(onTakePicture)} style={[styles.button, styles.buttonImg]}>
          <Text style={styles.buttonText}>Foto</Text>
          <MaterialIcons name="camera-alt" size={40} color={Colors.textLight}/>
        </TouchableOpacity>
      </View>
      {attachedImages.length > 0 ? (
        <View style={styles.imagePreviewContainer}>
          <Text style={styles.labelText}>Imagens Anexadas:</Text>
          <FlatList
            data={attachedImages}
            renderItem={renderImageItem}            keyExtractor={(item) => `${item.id}-${item.uri}`}
            horizontal={false} // Changed to vertical scroll
            numColumns={1} // Changed to single column layout
            showsVerticalScrollIndicator={true} // Changed to vertical scroll indicator
            contentContainerStyle={styles.flatListContent}
            extraData={attachedImages}
          />
        </View>
      ) : null}
    </>
  );
};

export default ImageAttachment;