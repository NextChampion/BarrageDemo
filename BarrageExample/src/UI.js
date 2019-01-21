import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const size = {
  screenWidth: width,
  screenHeight: height,
}

const fontSize = {
  regular: 16,
  lineHeight: 20,
}

const lineHeight = {
  regular: 20,
}

export default {
  size,
  fontSize,
  lineHeight,
};
