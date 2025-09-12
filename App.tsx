import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import SelectScreen from './screens/SelectScreen';
import EntryScreen from './screens/EntryScreen';
import AssistanceScreen from './screens/AssistanceScreen';
import QualityScreen from './screens/QualityScreen';
import CameraScreen from './screens/CameraScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDatabaseInitializer, useAppStore } from './store';

type RootStackParamList = {
  Home: undefined;
  Select: undefined;
  Entry: { newImageUri?: string; imageDescription?: string };
  Assistance: { newImageUri?: string; imageDescription?: string };
  Quality: { newImageUri?: string; imageDescription?: string };
  CameraScreen: { description: string, returnScreen: keyof RootStackParamList };
};

const Stack = createStackNavigator<RootStackParamList>();

function AppContent() {
  const { isAppReady, dbError } = useAppStore();

  if (dbError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Erro ao inicializar o app: {dbError}</Text>
      </View>
    );
  }

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
        screenOptions={{ headerShown: false }} // Hide header for all screens
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Select" component={SelectScreen} />
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Assistance" component={AssistanceScreen} />
        <Stack.Screen name="Quality" component={QualityScreen} />
        <Stack.Screen 
          name="CameraScreen" 
          component={CameraScreen} 
          options={{
            presentation: 'modal', 
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  useDatabaseInitializer();

  return (
    <GestureHandlerRootView style={{ flex: 1, marginTop: 40 }}>
      <AppContent />
    </GestureHandlerRootView>
  );
}
