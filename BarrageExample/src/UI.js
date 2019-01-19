import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const size = {
  screenWidth: width,
  screenHeight: height,
}

const fontSize = {
  regular: 16,
}

export default {
  size,
  fontSize,
};
