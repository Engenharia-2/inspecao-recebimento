import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomSearch from '../components/CustomSearch';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../assets/Colors';
import { InspectionSession } from '../report/types';
import { useSessionManagement } from '../hooks/useSessionManagement';

const logo = require('../assets/images/banner-logo-laranja.png');

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
const SessionItem = React.memo(({ item, onSelect, onDelete, isDeleting, isOpen }: { item: InspectionSession, onSelect: (id: number) => void, onDelete: (id: number) => void, isDeleting: boolean, isOpen: boolean }) => {
  return (
    <View style={[styles.sessionItemContainer, (isDeleting || isOpen) && { opacity: 0.5 }]}>
      <TouchableOpacity style={styles.sessionItem} onPress={() => onSelect(item.id)} disabled={isDeleting || isOpen}>
        <Text style={styles.sessionName}>{item.name || 'Inspeção sem OP'}</Text>
        <Text style={styles.sessionDate}>Iniciada em: {new Date(item.startTime).toLocaleString('pt-BR')}</Text>
        {item.endTime && <Text style={styles.sessionDate}>Finalizada em: {new Date(item.endTime).toLocaleString('pt-BR')}</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)} disabled={isDeleting}>
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );
});

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const {
    sessions,
    isLoading,
    searchQuery,
    setSearchQuery,
    filteredSessions,
    isCreating,
    deletingId,
    handleNewEntry,
    handleSessionSelect,
    handleDeleteSession,
  } = useSessionManagement(navigation);

  const renderSessionItem = React.useCallback(({ item }: { item: InspectionSession }) => (
    <SessionItem 
      item={item} 
      onSelect={handleSessionSelect} 
      onDelete={handleDeleteSession} 
      isDeleting={item.id === deletingId} 
      isOpen={item.status === 'aberta'}
    />
  ), [handleSessionSelect, handleDeleteSession, deletingId]);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <CustomButton
        title={isCreating ? "Criando..." : "Iniciar Nova Inspeção"}
        onPress={handleNewEntry}
        style={styles.button}
        disabled={isCreating}
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
    width: '100%',
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