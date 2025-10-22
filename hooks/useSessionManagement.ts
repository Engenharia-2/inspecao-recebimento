import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store';
import { useDebounce } from './useDebounce';
import { useIsFocused } from '@react-navigation/native';
import { InspectionSession } from '../report/types';
import { Alert } from 'react-native';

export const useSessionManagement = (navigation: any) => {
  const sessions = useAppStore((state) => state.measurementSessions);
  const isLoading = useAppStore((state) => state.isSessionsLoading);
  const loadAllSessions = useAppStore((state) => state.loadAllSessions);
  const selectSession = useAppStore((state) => state.selectSession);
  const startNewSession = useAppStore((state) => state.startNewSession);
  const deleteSession = useAppStore((state) => state.deleteSession);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [filteredSessions, setFilteredSessions] = useState<InspectionSession[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadAllSessions();
    }
  }, [isFocused, loadAllSessions]); // loadAllSessions is a stable action from Zustand, so it's safe here

  useEffect(() => {
    if (debouncedSearchQuery.trim() === '') {
      setFilteredSessions(sessions);
    } else {
      const filtered = sessions.filter((session) =>
        session.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setFilteredSessions(filtered);
    }
  }, [debouncedSearchQuery, sessions]);

  const handleNewEntry = useCallback(async () => {
    setIsCreating(true);
    try {
      const newSessionId = await startNewSession();
      if (!newSessionId) {
        Alert.alert("Erro", "Não foi possível iniciar uma nova inspeção.");
      }
    } catch (error) {
      console.error("Erro ao criar nova inspeção:", error);
      Alert.alert("Erro de API", "Falha ao criar uma nova inspeção. Verifique sua conexão e tente novamente.");
    } finally {
      setIsCreating(false);
    }
  }, [startNewSession]);

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
          style: "cancel",
          onPress: () => setDeletingId(null),
        },
        {
          text: "Deletar",
          onPress: async () => {
            setDeletingId(sessionId);
            try {
              await deleteSession(sessionId);
            } catch (error) {
              console.error("Falha ao deletar a sessão:", error);
              Alert.alert("Erro", "Não foi possível deletar a sessão.");
            } finally {
              setDeletingId(null);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true, onDismiss: () => setDeletingId(null) }
    );
  }, [deleteSession]);

  return {
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
  };
};