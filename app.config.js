
require('dotenv').config();

// Detecta o ambiente (development vs. production)
const isDev = process.env.NODE_ENV === 'development';

// Seleciona a URL da API apropriada
const apiUrl = isDev 
  ? process.env.EXPO_PUBLIC_API_URL_DEVELOPMENT 
  : process.env.EXPO_PUBLIC_API_URL_PRODUCTION;

module.exports = {
  expo: {
    name: "Inspecao-Recebimento",
    slug: "Inspecao-Recebimento",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logoLaranjaLHF.png",
    userInterfaceStyle: "light",
    newArchEnabled: false, // Desabilitado para maior compatibilidade no build inicial
    splash: {
      image: "./assets/images/logoLaranjaLHF.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: "Este aplicativo precisa de acesso à sua câmera para tirar fotos de inspeções.",
        NSPhotoLibraryUsageDescription: "Este aplicativo precisa de acesso à sua biblioteca de fotos para selecionar imagens para inspeções."
      }
    },
    android: {
      "usesCleartextTraffic": true,
      networkSecurityConfig: "@xml/network_security_config",
      adaptiveIcon: {
        foregroundImage: "./assets/images/logoLaranjaLHF.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO",
        "android.permission.INTERNET"
      ],
      package: "com.felipeutengenharia.inspecaorecebimento",
    },
    web: {
      favicon: "./assets/images/logoLaranjaLHF.png"
    },
    extra: {
      eas: {
        projectId: "9bf79cb5-b53d-4a9a-be7e-f0127cab7cbf"
      },
      // Adicionamos a variável de ambiente aqui, agora de forma dinâmica
      API_URL: apiUrl
    },
    plugins: [
      "expo-font",
      "expo-asset"
    ]
  }
};
