import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import IdentificationStep from '../steps/EntrySteps/IdentificationStep';
import ModelStep from '../steps/EntrySteps/ModelStep';
import InspectionStep from '../steps/EntrySteps/InspectionStep';
import ImageAttachmentStep from '../steps/EntrySteps/ImageAttachmentStep';
import ObservationsStep from '../steps/EntrySteps/ObservationsStep';
import FinalStep from '../steps/EntrySteps/FinalStep'; // Importar o novo step
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

type EntryScreenRouteProp = RouteProp<{ Entry: { returnStepIndex?: number } }, 'Entry'>;

const EntryScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const route = useRoute<EntryScreenRouteProp>();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (route.params?.returnStepIndex !== undefined) {
      pagerRef.current?.setPage(route.params.returnStepIndex);
      setCurrentPage(route.params.returnStepIndex);
      // Clear the param to prevent re-triggering on subsequent renders
      navigation.setParams({ returnStepIndex: undefined });
    }
  }, [route.params?.returnStepIndex, navigation]);

  return (
    <PagerView
      style={styles.pagerView}
      initialPage={0}
      ref={pagerRef}
      onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
    >
      <View key="1">
        <IdentificationStep />
      </View>
      <View key="2">
        <ModelStep />
      </View>
      <View key="3">
        <InspectionStep />
      </View>
      <View key="4">
        <ObservationsStep />
      </View>
      <View key="5">
        <ImageAttachmentStep currentStepIndex={currentPage} />
      </View>
      <View key="6">
        <FinalStep />
      </View>

    </PagerView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

export default EntryScreen;
