import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import FinalCheckStep from '../steps/QualitySteps/FinalCheckStep';
import FinalImagesCheck from '../steps/QualitySteps/FinalImagesCheck';
import FinalObservationStep from '../steps/QualitySteps/FinalObservationStep'; // Import new step
import { useStepIndex } from '../hooks/useStepIndex';

const QualityScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  useStepIndex(pagerRef);

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
