import React, { useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import WorkinCheckStep from '../steps/AssistanceSteps/WorkinCheckStep';
import DynamicFieldsStep from '../steps/AssistanceSteps/DynamicFieldsStep';
import CleanCheckStep from '../steps/AssistanceSteps/CleanCheckStep';
import DefectObservationStep from '../steps/AssistanceSteps/DefectObservationStep';
import ImagesCheckUp from '../steps/AssistanceSteps/ImagesCheckUp';
import { useStepIndex } from '../hooks/useStepIndex';

const AssistanceScreen = () => {
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
        <CleanCheckStep />
      </View>
      <View key="2">
        <WorkinCheckStep />
      </View>
      <View key="3">
        <DefectObservationStep />
      </View>
      <View key="4">
        <DynamicFieldsStep />
      </View>
      <View key="5">
        <ImagesCheckUp currentStepIndex={currentPage} />
      </View>
    </PagerView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});

export default AssistanceScreen;