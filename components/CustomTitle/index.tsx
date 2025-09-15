import React, { FC } from 'react';
import { View, Text } from 'react-native';
import { styles } from './style';

interface CustomTitleProps {
  title: string;
}

const CustomTitle: FC<CustomTitleProps> = ({ title }) => {
  return (
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
  );
};

export default CustomTitle;