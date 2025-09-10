import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import WorkinCheckStep from '../steps/AssistanceSteps/WorkinCheckStep';
import DynamicFieldsStep from '../steps/AssistanceSteps/DynamicFieldsStep';
import CleanCheckStep from '../steps/AssistanceSteps/CleanCheckStep';
import DefectObservationStep from '../steps/AssistanceSteps/DefectObservationStep';
import ImagesCheckUp from '../steps/AssistanceSteps/ImagesCheckUp';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

type AssistanceScreenRouteProp = RouteProp<{ Assistance: { returnStepIndex?: number } }, 'Assistance'>;

const AssistanceScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const route = useRoute<AssistanceScreenRouteProp>();
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
        <WorkinCheckStep />
      </View>
      <View key="2">
        <DynamicFieldsStep />
      </View>
      <View key="3">
        <CleanCheckStep />
      </View>
      <View key="4">
        <DefectObservationStep />
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