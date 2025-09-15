
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const MAX_IMAGE_DIMENSION = 1024; // Max width or height for images
const IMAGE_COMPRESSION_QUALITY = 0.7; // 0 to 1

/**
 * Converts a local image URI to a Base64 string.
 * Resizes and compresses the image before conversion to optimize PDF size.
 */
export const convertImageToBase64 = async (uri: string): Promise<string | null> => {
  // If URI is already a Base64 string, return it directly
  if (uri.startsWith('data:')) {
    return uri;
  }

  try {
    const manipulatedImage = await manipulateAsync(
      uri,
      [{ resize: { width: MAX_IMAGE_DIMENSION } }],
      {
        compress: IMAGE_COMPRESSION_QUALITY,
        format: SaveFormat.JPEG,
        base64: true,
      }
    );

    if (!manipulatedImage.base64) {
      console.error('ImageUtils: Image manipulation failed to return Base64.');
      return null;
    }

    return `data:image/jpeg;base64,${manipulatedImage.base64}`;
  } catch (error) {
    console.error(`ImageUtils: Error converting image to Base64 for URI: ${uri}`, error);
    return null;
  }
};
