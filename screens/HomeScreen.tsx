import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppStore } from '../store';
import { useIsFocused } from '@react-navigation/native';
import { Colors } from '../assets/Colors';

type RootStackParamList = {
  Home: undefined;
  Select: undefined;
  Entry: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const sessions = useAppStore((state) => state.measurementSessions);
  const isLoading = useAppStore((state) => state.isDbLoading);
  const loadAllSessions = useAppStore((state) => state.loadAllSessions);
  const selectSession = useAppStore((state) => state.selectSession);
  const startNewSession = useAppStore((state) => state.startNewSession); // Import startNewSession

  const isFocused = useIsFocused();

  // Load sessions when the component mounts or when it comes into focus
  // This useEffect is crucial for refreshing the list when navigating back to Home
  useEffect(() => {
    if (isFocused) {
      loadAllSessions();
    }
  }, [isFocused, loadAllSessions]);

  const handleNewEntry = async () => {
    const newSessionId = await startNewSession();
    if (newSessionId) {
      navigation.navigate('Select');
    } else {
      Alert.alert("Erro", "Não foi possível iniciar uma nova sessão de inspeção.");
    }
  };

  const handleSessionSelect = async (sessionId: number) => {
    await selectSession(sessionId);
    navigation.navigate('Select');
  };

  const renderSessionItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.sessionItem} onPress={() => handleSessionSelect(item.id)}>
      <Text style={styles.sessionName}>{item.name}</Text>
      <Text style={styles.sessionDate}>Iniciada em: {new Date(item.startTime).toLocaleString('pt-BR')}</Text>
      {item.endTime && <Text style={styles.sessionDate}>Finalizada em: {new Date(item.endTime).toLocaleString('pt-BR')}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CustomButton
        title="Iniciar Nova Inspeção"
        onPress={handleNewEntry}
        style={styles.button}
      />
      <Text style={styles.listTitle}>Inspeções Salvas</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma inspeção encontrada.</Text>}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  button: {
    marginBottom: 16,
    height: '20%',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  list: {
    width: '100%',
  },
  sessionItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sessionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  sessionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#888',
  },
});

export default HomeScreen;