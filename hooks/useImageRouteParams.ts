import { useEffect } from 'react';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';

type ImageRouteProp = RouteProp<{ ImageScreen: { newImageUri?: string, returnStepIndex?: number } }, 'ImageScreen'>;

export const useImageRouteParams = (processAndSaveImage: (imageAsset: { uri: string }) => void) => {
  const route = useRoute<ImageRouteProp>();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (route.params?.newImageUri) {
      processAndSaveImage({ uri: route.params.newImageUri });
      navigation.setParams({ newImageUri: undefined });

      if (route.params.returnStepIndex !== undefined) {
        // This assumes the parent screen has a way to set its current page/step
        // For PagerView, you might need to use a ref to setPage
        // For now, we just ensure the image is processed.
      }
    }
  }, [route.params?.newImageUri, processAndSaveImage, navigation, route.params?.returnStepIndex]);
};