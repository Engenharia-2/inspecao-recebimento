import { StateCreator } from 'zustand';
import { AppStore } from '../index';

// Defina o tipo para a foto, se necessário, para maior clareza
type Photo = { uri: string };

export interface UiState {
  isCameraModalVisible: boolean;
  onPictureTakenCallback: ((photo: Photo) => void) | null;
}

export interface UiActions {
  openCameraModal: (callback: (photo: Photo) => void) => void;
  closeCameraModal: () => void;
  _handlePictureTaken: (photo: Photo) => void; // Ação interna para executar o callback
}

export type UiSlice = UiState & UiActions;

export const createUiSlice: StateCreator<
  AppStore,
  [],
  [],
  UiSlice
> = (set, get) => ({
  isCameraModalVisible: false,
  onPictureTakenCallback: null,

  openCameraModal: (callback) => {
    set({ isCameraModalVisible: true, onPictureTakenCallback: callback });
  },

  closeCameraModal: () => {
    set({ isCameraModalVisible: false, onPictureTakenCallback: null });
  },

  // Ação intermediária para garantir que o callback seja executado corretamente
  _handlePictureTaken: (photo) => {
    const callback = get().onPictureTakenCallback;
    if (callback) {
      callback(photo);
    }
    // Fechar o modal é tratado separadamente ou aqui, se preferir
    // get().closeCameraModal(); 
  },
});
