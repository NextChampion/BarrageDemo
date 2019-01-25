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
  DeviceEventEmitter,
} from 'react-native';
import PropTypes from 'prop-types';
import UI from '../UI';

const interval = 30;  // 动画执行的频率，数值越小刷新越快 单位：ms

export default class BarrageMovableItem extends Component {
  constructor(props) {
    super(props);
    this.position = UI.size.screenWidth;
    this.isFreeState = false; // 是否空闲
  }

  static propTypes = {
    data: PropTypes.object,
    speed: PropTypes.number,
    line: PropTypes.number,
    heightOfLine: PropTypes.number,
    animatedType: PropTypes.number,
    type: PropTypes.number,
  }

  static defaultProps = {
    data: {},
    speed: 1,
    line: 0,
    heightOfLine: UI.size.screenHeight / 9 - UI.lineHeight.regular - 1, // 弹道距离父视图上边界的距离
    animatedType: 1,
    type: 1,
  }

  componentDidMount() {
    this.startMove();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  startMove = () => {
    const { animatedType } = this.props;
    switch (animatedType) {
      case 1:
        this.move()
        break;

      default:
        this.move();
        break;
    }
  }

  // 控制移动的速度
  getSpeedOfMillisecond = () => {
    const { speed } = this.props;
    return speed;
  }

  // 移动
  move() {
    const { data } = this.props;
    const { id } = data;
    const speed = this.getSpeedOfMillisecond();
    this.interval = setInterval(() => {
      if (this.position < -this.width) {
        DeviceEventEmitter.emit('onStateToOutsideScreen', { id });
        this.interval && clearInterval(this.interval);
        return;
      }
      const marginRight = UI.size.screenWidth - this.position;
      if (marginRight > this.width + (2 * UI.fontSize.regular)) {
        if (!this.isFreeState) {
          this.isFreeState = true;
          DeviceEventEmitter.emit('onStateToFree', { id, isFree: true });
        }
      } else {
        if (this.isFreeState) {
          this.isFreeState = false;
          DeviceEventEmitter.emit('onStateToFree', { id, isFree: false });
        }
      }
      this.view.setNativeProps({
        style: {
          left: this.position -= speed,
        }
      })
    }, interval);
  }

  // 计算当前弹幕距离顶部的高度
  getTop = () => {
    const { line, heightOfLine } = this.props;
    return heightOfLine * line;
  }

  renderTextContent = () => {
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

  render() {
    console.debug('[BarrageItem]')
    const { type } = this.props;
    switch (type) {
      case 1:
        return this.renderTextContent();
        break;
      default:
        return this.renderTextContent();
        break;
    }

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
