import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomSearch from '../components/CustomSearch';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppStore } from '../store';
import { useIsFocused } from '@react-navigation/native';
import { Colors } from '../assets/Colors';
import { InspectionSession } from '../report/types';
import { createRelatorio } from '../routes/apiService';

const logo = require('../assets/images/banner-logo-lhf-laranja.jpg');

type RootStackParamList = {
  Home: undefined;
  Select: { sessionId: number };
  Entry: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

// Memoized SessionItem component
const SessionItem = React.memo(({ item, onSelect, onDelete }: { item: InspectionSession, onSelect: (id: number) => void, onDelete: (id: number) => void }) => {
  return (
    <View style={styles.sessionItemContainer}>
      <TouchableOpacity style={styles.sessionItem} onPress={() => onSelect(item.id)}>
        <Text style={styles.sessionName}>{item.name || 'Inspeção sem OP'}</Text>
        <Text style={styles.sessionDate}>Iniciada em: {new Date(item.startTime).toLocaleString('pt-BR')}</Text>
        {item.endTime && <Text style={styles.sessionDate}>Finalizada em: {new Date(item.endTime).toLocaleString('pt-BR')}</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );
});

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const sessions = useAppStore((state) => state.measurementSessions);
  const isLoading = useAppStore((state) => state.isSessionsLoading);
  const loadAllSessions = useAppStore((state) => state.loadAllSessions);
  const selectSession = useAppStore((state) => state.selectSession);
  const startNewSession = useAppStore((state) => state.startNewSession);
  const deleteSession = useAppStore((state) => state.deleteSession);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSessions, setFilteredSessions] = useState<InspectionSession[]>([]);

      const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadAllSessions();
    }
  }, [isFocused]); // Removido loadAllSessions das dependências para evitar loops

  useEffect(() => {
    // console.log("HomeScreen: measurementSessions updated:", sessions);
    if (searchQuery.trim() === '') {
      setFilteredSessions(sessions);
    } else {
      const filtered = sessions.filter((session) =>
        session.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSessions(filtered);
    }
  }, [searchQuery, sessions]);

  const handleNewEntry = async () => {
    try {
      const novoRelatorio = await createRelatorio({
        name: 'Nova Inspeção',
        startTime: new Date(),
      });
      if (novoRelatorio && novoRelatorio.id) {
        navigation.navigate('Select', { sessionId: novoRelatorio.id });
      } else {
        Alert.alert("Erro", "Não foi possível obter o ID do novo relatório.");
      }
    } catch (error) {
      console.error("Erro ao criar novo relatório:", error);
      Alert.alert("Erro de API", "Falha ao criar uma nova inspeção. Verifique sua conexão e tente novamente.");
    }
  };

  const handleSessionSelect = useCallback(async (sessionId: number) => {
    await selectSession(sessionId);
    navigation.navigate('Select', { sessionId });
  }, [selectSession, navigation]);

  const handleDeleteSession = useCallback((sessionId: number) => {
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
  }, [deleteSession]);

  const renderSessionItem = useCallback(({ item }: { item: InspectionSession }) => (
    <SessionItem item={item} onSelect={handleSessionSelect} onDelete={handleDeleteSession} />
  ), [handleSessionSelect, handleDeleteSession]);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <CustomButton
        title="Iniciar Nova Inspeção"
        onPress={handleNewEntry}
        style={styles.button}
      />
      <CustomSearch
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Pesquisar por OP..."
      />
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <FlatList
          data={filteredSessions}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma inspeção encontrada.</Text>}
          style={styles.list}
          windowSize={10}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
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
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
    width: '80%',
    height: '20%',
  },
  button: {
    marginBottom: 16,
    height: '8%',
    width: '100%',
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