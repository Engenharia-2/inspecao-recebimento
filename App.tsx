import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import SelectScreen from './screens/SelectScreen';
import EntryScreen from './screens/EntryScreen';
import AssistanceScreen from './screens/AssistanceScreen';
import QualityScreen from './screens/QualityScreen';
import CameraScreen from './screens/CameraScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDatabaseInitializer } from './store';

type RootStackParamList = {
  Home: undefined;
  Select: undefined;
  Entry: { newImageUri?: string; imageDescription?: string };
  Assistance: { newImageUri?: string; imageDescription?: string };
  Quality: { newImageUri?: string; imageDescription?: string };
  CameraScreen: { description: string, returnScreen: keyof RootStackParamList };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  // Initialize the database when the app starts
  useDatabaseInitializer();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
          <Stack.Screen name="Select" component={SelectScreen} options={{ title: 'Nova Entrada' }} />
          <Stack.Screen name="Entry" component={EntryScreen} options={{ title: 'Entrada' }} />
          <Stack.Screen name="Assistance" component={AssistanceScreen} options={{ title: 'Assistência' }} />
          <Stack.Screen name="Quality" component={QualityScreen} options={{ title: 'Qualidade' }} />
          <Stack.Screen 
            name="CameraScreen" 
            component={CameraScreen} 
            options={{
              headerShown: false,
              presentation: 'modal', // Present as a modal
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}