import React, { FC } from 'react';
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './style';
import { Colors } from '../../assets/Colors';
import { AttachedImage } from '../../report/types'; // Use AttachedImage from report/types
import { MaterialIcons } from '@expo/vector-icons';

type ImageAttachmentProps = { 
  attachedImages: AttachedImage[];
  onPickImage: () => void; // No description parameter
  onTakePicture: () => void; // No description parameter
  onDeleteImage: (image: AttachedImage) => void;
};

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

  const renderImageItem = ({ item }: { item: AttachedImage }) => (
    <View >
      <TouchableOpacity onPress={() => handleRemoveImage(item)} style={styles.removeImageButton}>
        <Text style={[styles.buttonText, styles.buttonTextRemove]}>X</Text>
      </TouchableOpacity>
      <Image key={item.uri} source={{ uri: item.uri }} style={styles.selectedImage} />
    </View>
  );

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
            renderItem={renderImageItem}            keyExtractor={(item) => item.id?.toString() || item.uri}
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