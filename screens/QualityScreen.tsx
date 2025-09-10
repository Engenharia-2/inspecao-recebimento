import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import FinalCheckStep from '../steps/QualitySteps/FinalCheckStep';
import FinalImagesCheck from '../steps/QualitySteps/FinalImagesCheck';
import FinalObservationStep from '../steps/QualitySteps/FinalObservationStep'; // Import new step
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

type QualityScreenRouteProp = RouteProp<{ Quality: { returnStepIndex?: number } }, 'Quality'>;

const QualityScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const route = useRoute<QualityScreenRouteProp>();
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
        <FinalCheckStep />
      </View>
      <View key="2">
        <FinalImagesCheck currentStepIndex={currentPage} />
      </View>
      <View key="3">
        <FinalObservationStep />
      </View>
    </PagerView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

export default QualityScreen;
