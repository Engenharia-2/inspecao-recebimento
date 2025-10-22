import { useEffect } from 'react';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import React from 'react';

type ScreenRouteProp = RouteProp<{ Screen: { returnStepIndex?: number } }, 'Screen'>;

export const useStepIndex = (pagerRef: React.RefObject<PagerView>) => {
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (route.params?.returnStepIndex !== undefined) {
      pagerRef.current?.setPage(route.params.returnStepIndex);
      // Clear the param to prevent re-triggering on subsequent renders
      navigation.setParams({ returnStepIndex: undefined });
    }
  }, [route.params?.returnStepIndex, navigation, pagerRef]);
};