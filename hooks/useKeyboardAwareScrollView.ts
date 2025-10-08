
import { useEffect, useRef } from 'react';
import { Keyboard, ScrollView, TextInput } from 'react-native';

export const useKeyboardAwareScrollView = () => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        const currentlyFocusedInput = TextInput.State.currentlyFocusedInput();
        if (currentlyFocusedInput) {
          currentlyFocusedInput.measure((pageY) => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollTo({ y: pageY, animated: true });
            }
          });
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return scrollViewRef;
};
