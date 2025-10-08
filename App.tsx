import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import SelectScreen from './screens/SelectScreen';
import EntryScreen from './screens/EntryScreen';
import AssistanceScreen from './screens/AssistanceScreen';
import QualityScreen from './screens/QualityScreen';
import CameraModal from './components/CameraModal'; // Importa o novo modal
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppStore, useAppInitializer } from './store';

type RootStackParamList = {
  Home: undefined;
  Select: { sessionId: number };
  Entry: { newImageUri?: string; imageDescription?: string };
  Assistance: { newImageUri?: string; imageDescription?: string };
  Quality: { newImageUri?: string; imageDescription?: string };
  // CameraScreen foi removida
};

const Stack = createStackNavigator<RootStackParamList>();

function AppContent() {
  const { isAppReady } = useAppStore();

  if (!isAppReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Select" component={SelectScreen} />
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Assistance" component={AssistanceScreen} />
        <Stack.Screen name="Quality" component={QualityScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  useAppInitializer();
  const { isCameraModalVisible, closeCameraModal, _handlePictureTaken } = useAppStore();

  return (
    <GestureHandlerRootView style={{ flex: 1, }}>
      <AppContent />
      <CameraModal
        isVisible={isCameraModalVisible}
        onClose={closeCameraModal}
        onPictureTaken={_handlePictureTaken}
      />
    </GestureHandlerRootView>
  );
}
