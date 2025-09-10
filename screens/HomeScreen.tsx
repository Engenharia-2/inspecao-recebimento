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
  const startNewSession = useAppStore((state) => state.startNewSession);
  const deleteSession = useAppStore((state) => state.deleteSession);

  const isFocused = useIsFocused();

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

  const handleDeleteSession = (sessionId: number) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja deletar esta sessão? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Deletar", 
          onPress: () => deleteSession(sessionId),
          style: "destructive"
        }
      ]
    );
  };

  const renderSessionItem = ({ item }: { item: any }) => (
    <View style={styles.sessionItemContainer}>
      <TouchableOpacity style={styles.sessionItem} onPress={() => handleSessionSelect(item.id)}>
        <Text style={styles.sessionName}>{item.name}</Text>
        <Text style={styles.sessionDate}>Iniciada em: {new Date(item.startTime).toLocaleString('pt-BR')}</Text>
        {item.endTime && <Text style={styles.sessionDate}>Finalizada em: {new Date(item.endTime).toLocaleString('pt-BR')}</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteSession(item.id)}>
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomButton
        title="Iniciar Nova Inspeção"
        onPress={handleNewEntry}
        style={styles.button}
      />
      <Text style={styles.listTitle}>Inspeções Abertas: </Text>
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
    textAlign: 'left',
    color: '#333',
  },
  list: {
    width: '100%',
  },
  sessionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sessionItem: {
    flex: 1,
    padding: 16,
  },
  deleteButton: {
    backgroundColor: Colors.red,
    borderRadius: 20,
    width: 33,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16, // Add margin to space it from the edge
  },
  deleteButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16, // Slightly larger for better visibility
  },
  sessionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textLight,
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