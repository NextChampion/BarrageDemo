/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import UI from '../UI';

export default class BarrageItem extends Component {
  constructor(props) {
    super(props);
    this.position = UI.size.screenWidth;
    this.isFreeState = false; // 是否空闲
  }

  static propTypes = {
    data: PropTypes.object,
    line: PropTypes.number,
    heightOfLine: PropTypes.number,
  }

  static defaultProps = {
    data: {},
    line: 0,
    heightOfLine: UI.size.screenHeight / 9 - UI.lineHeight.regular - 1, // 弹道距离父视图上边界的距离
  }

  shouldComponentUpdate() {
    return false;
  }

  getTop = () => {
    const { line, heightOfLine } = this.props;
    return heightOfLine * line;
  }

  render() {
    console.debug('[BarrageItem]')
    const { data } = this.props;
    const { title } = data;
    this.width = UI.fontSize.regular * title.length;
    const top = this.getTop();
    return (
      <View
        style={[styles.view, { top, width: this.width, left: this.position }]}
        removeClippedSubviews={true}
        ref={a => this.view = a}
      >
        <Text>{title}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    overflow: 'hidden',
    position: 'absolute',
    // borderWidth: 1,
  },
  text: {
    backgroundColor: 'red',
    fontSize: UI.fontSize.regular,
    lineHeight: UI.lineHeight.regular,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
