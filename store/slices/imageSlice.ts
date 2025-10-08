import { StateCreator } from 'zustand';
import { AppStore } from '../index';
import { AttachedImage } from '../../report/types';
import { uploadImage, deleteImage, API_BASE_URL } from '../../routes/apiService';
import { ReportState } from './reportStateSlice';

// --- Função Auxiliar para URLs de Imagem ---
export const buildImageURL = (imagePath: string) => {
  if (!imagePath || imagePath.startsWith('http') || imagePath.startsWith('file')) {
    return imagePath; // Retorna se já for uma URL completa ou local
  }
  // Substitui barras invertidas por barras normais e monta a URL
  return `${API_BASE_URL}/${imagePath.replace(/\\/g, '/')}`;
};

export interface ImageSlice {
  addAttachedImage: (image: Omit<AttachedImage, 'id' | 'sessionId'>) => void;
  removeAttachedImage: (imageToRemove: AttachedImage) => void;
}

export const createImageSlice: StateCreator<
  AppStore,
  [],
  [],
  ImageSlice
> = (set, get) => ({
  addAttachedImage: (image) => {
    const { currentSessionId } = get();
    if (!currentSessionId) return;

    const tempId = Date.now();
    const imageWithStatus: AttachedImage = { ...image, id: tempId, sessionId: currentSessionId, status: 'uploading' };

    const stageKey = `${image.stage}Images` as keyof ReportState;
    set(state => ({ [stageKey]: [...(state[stageKey] as AttachedImage[]), imageWithStatus] }));

    (async () => {
      try {
        const savedImage = await uploadImage(currentSessionId, imageWithStatus);
        // Atualiza a imagem na UI, mapeando o 'path' do servidor para 'uri'
        set(state => {
          const updatedImages = (state[stageKey] as AttachedImage[]).map(img => 
            img.id === tempId ? { ...savedImage, uri: buildImageURL(savedImage.path), status: 'uploaded' } : img
          );
          return { [stageKey]: updatedImages };
        });
      } catch (error) {
        console.error("Falha no upload da imagem:", error);
        set(state => {
          const updatedImages = (state[stageKey] as AttachedImage[]).map(img => 
            img.id === tempId ? { ...imageWithStatus, status: 'error' } : img
          );
          return { [stageKey]: updatedImages };
        });
      }
    })();
  },

  removeAttachedImage: async (imageToRemove) => {
    const { id, stage } = imageToRemove;
    if (!id) return;

    const stageKey = `${stage}Images` as keyof ReportState;

    // Mark the image as 'deleting' for visual feedback
    set(state => ({
      [stageKey]: (state[stageKey] as AttachedImage[]).map(img =>
        img.id === id ? { ...img, status: 'deleting' } : img
      )
    }));

    try {
      // Only call API for images that are already on the server (have a numeric ID)
      if (typeof id === 'number') {
        await deleteImage(id);
      }

      // On success, permanently remove the image from the state
      set(state => ({
        [stageKey]: (state[stageKey] as AttachedImage[]).filter(img => img.id !== id)
      }));

      get()._saveData();

    } catch (error) {
      console.error("Falha ao deletar imagem no servidor:", error);
      // On failure, revert the status to 'uploaded' to make it visible again
      set(state => ({
        [stageKey]: (state[stageKey] as AttachedImage[]).map(img =>
          img.id === id ? { ...img, status: 'uploaded' } : img
        )
      }));
    }
  },
});
