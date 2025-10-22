// utils/pdf/imageUtils.ts
import * as FileSystem from 'expo-file-system';

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const MAX_IMAGE_DIMENSION = 600; // Max width or height for images
const IMAGE_COMPRESSION_QUALITY = 0.7; // 0 to 1, 1 being no compression

/**
 * Converte uma URI de imagem local (do ImagePicker ou Camera) para Base64.
 * Redimensiona e comprime a imagem antes da conversão para otimizar o tamanho do PDF.
 * @param {string} uri - A URI do arquivo de imagem local.
 * @returns {Promise<{ base64: string } | null>} A string Base64 da imagem, ou null em caso de erro.
 */
export const convertImageToBase64 = async (uri: string, ): Promise<{ base64: string,  } | null> => {
  if (!uri) {
    return null;
  }
  try {
    const fileExtension = uri.split('.').pop()?.toLowerCase();
    let saveFormat = SaveFormat.JPEG; // Default
    let mimeType = 'image/jpeg';

    if (fileExtension === 'png') {
      saveFormat = SaveFormat.PNG;
      mimeType = 'image/png';
    } else if (fileExtension === 'gif') {
      // ImageManipulator does not support GIF directly for output format
      // We will still try to process it as JPEG/PNG if possible, or handle separately
      // For simplicity, we'll let it default to JPEG and hope for the best or handle error
    }

    // Manipulate (resize and compress) the image
    const manipulatedImage = await manipulateAsync(
      uri,
      [
        { resize: { width: MAX_IMAGE_DIMENSION } } // Resize to fit within max dimension
      ],
      {
        compress: IMAGE_COMPRESSION_QUALITY,
        format: saveFormat,
        base64: true, // Request Base64 directly from manipulator
      }
    );

    if (!manipulatedImage.base64) {
      return null;
    }

    return {
      base64: `data:${mimeType};base64,${manipulatedImage.base64}`,
    };
  } catch (error) {
    return null;
  }
};

/**
 * Limpa arquivos temporários de imagem do cache do FileSystem.
 * @param {string[]} uris - Um array de URIs de arquivos para limpar.
 */
export const cleanImagePickerCache = async (uris: string[]) => {
  try {
    await Promise.all(uris.map(async (uri) => {
      if (uri.startsWith('file://')) {
        const path = uri.replace('file://', '');
        const fileInfo = await FileSystem.getInfoAsync(path);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(path, { idempotent: true });
        }
      }
    }));
  } catch (error) {
    console.error('ImageUtils: Erro ao limpar o cache do ImagePicker:', error);
  }
};

import { Asset } from 'expo-asset';

export const convertLogoToBase64 = async (): Promise<string | null> => {
  try {
    const asset = Asset.fromModule(require('../../assets/images/logoLHF3.png'));
    await asset.downloadAsync();
    const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const mimeType = asset.type === 'png' ? 'image/png' : 'image/jpeg';
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error converting logo to base64:', error);
    return null;
  }
};