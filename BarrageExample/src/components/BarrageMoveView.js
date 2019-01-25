/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, DeviceEventEmitter } from 'react-native';
import PropTypes from 'prop-types';
import BarrageItem from './BarrageItem';
import UI from '../UI';

export default class BarrageMoveView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    }
    this.barrages = [];
  }

  static propTypes = {
    newMessages: PropTypes.array,
    numberOfLines: PropTypes.number,
    speed: PropTypes.number,
    animatedType: PropTypes.number,
  }

  static defaultProps = {
    newMessages: [],
    numberOfLines: 2,
    speed: 1,
    animatedType: 1,
  }

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener('onStateToFree1', this.changeItemStateToFree);
    this.subscription1 = DeviceEventEmitter.addListener('onStateToOutsideScreen1', this.removeItemFromList);
    this.startMove();
  };

  componentWillReceiveProps(props) {
    const { newMessages } = props;
    this.addBarrageMessage(newMessages);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {
    this.subscription.remove();
    this.subscription1.remove();
    this.interval && clearInterval(this.interval);
  }

  startMove = () => {
    const { animatedType } = this.props;
    switch (animatedType) {
      case 1: // 平移
        this.move();
        break;
      case 2: // 可以设置其他移动效果
        this.move();
        break;
      default:
        this.move();
        break;
    }
  }

  // 平移
  move = () => {
    const { speed } = this.props;
    this.interval = setInterval(() => {
      for (let index = 0; index < this.barrages.length; index++) {
        const b = this.barrages[index];
        b.left -= speed;
        if (b.left < UI.size.screenWidth - b.ref.width - UI.fontSize.regular * 2) {
          if (!b.isFree) {
            DeviceEventEmitter.emit('onStateToFree1', { id: b.id, isFree: true });
          }
        }
        if (b.left < - b.ref.width) {
          DeviceEventEmitter.emit('onStateToOutsideScreen1', { id: b.id });
          continue;
        }
        const newLeft = b.left;
        b.ref.view.setNativeProps({
          style: {
            left: newLeft,
          }
        })
      }
    }, 30);
  }

  // 添加数据
  addBarrageMessage = (messageList) => {
    for (let index = 0; index < messageList.length; index += 1) {
      const message = messageList[index];
      const indexOfNewBarrrage = this.getLineIndexOfNewBarrrage();
      if (indexOfNewBarrrage < 0) {
        continue;
      }
      this.barrages.push({ ...message, indexOfLine: indexOfNewBarrrage, isFree: false, left: UI.size.screenWidth });
      this.setState({ list: this.barrages });
    }
  }

  // 修改是否空闲的状态值
  changeItemStateToFree = (a) => {
    this.barrages = this.barrages.map(item => {
      if (item.id === a.id) {
        return { ...item, isFree: a.isFree };
      }
      return item;
    });
    this.setState({
      list: this.barrages,
    })
  }

  // 删除已经移动到屏幕外的数据
  removeItemFromList = (a) => {
    this.barrages = this.barrages.filter(item => {
      return item.id !== a.id;
    });
    this.setState({
      list: this.barrages,
    })
  }

  // 获取新弹幕的轨道值 如果为-1 说明当前没有空闲轨道，丢弃当前弹幕
  getLineIndexOfNewBarrrage = () => {
    const { numberOfLines } = this.props;
    if (this.barrages.length === 0) {
      return 0;
    }
    for (let i = 0; i < numberOfLines; i += 1) {
      indexOfLine = this.getIndexOfFreeLines(i);
      if (indexOfLine >= 0) {
        return indexOfLine;
      }
    }
    return -1;
  }

  // 获取空闲弹道的index 如果为-1 则没有空闲弹道
  getIndexOfFreeLines = (i) => {
    let lastItemOfLine;
    this.barrages.forEach(item => {
      const { indexOfLine } = item;
      if (indexOfLine === i) {
        lastItemOfLine = item;
      }
    });
    if (!lastItemOfLine) { return i };
    if (lastItemOfLine.isFree) { return i };
    return -1;
  }

  render() {
    console.debug('[BarrageView]')
    const { list } = this.state;
    const views = list.map((b, index) => {
      return (
        <BarrageItem
          ref={a => {
            if (a) { this.barrages[index].ref = a }
          }}
          line={b.indexOfLine}
          key={b.id}
          data={b}
          speed={2}
          type={2}
          heightOfLine={25}
        />
      )
    });
    return (
      <View style={styles.container}>
        {views}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // borderWidth: 1,
  },
  barrageLine: {
    overflow: 'hidden',
  },
});
