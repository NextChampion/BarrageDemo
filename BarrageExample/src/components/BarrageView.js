/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, DeviceEventEmitter } from 'react-native';
import PropTypes from 'prop-types';
import BarrageMovableItem from './BarrageMovableItem';

export default class BarrageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    }
  }

  static propTypes = {
    newMessages: PropTypes.array,
    numberOfLines: PropTypes.number,
  }

  static defaultProps = {
    newMessages: [],
    numberOfLines: 2,
  }

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener('onStateToFree', this.changeItemStateToFree);
    this.subscription1 = DeviceEventEmitter.addListener('onStateToOutsideScreen', this.removeItemFromList);
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
  }

  // 将新来的消息添加到数据源里 新来的消息有可能被丢弃
  addBarrageMessage = (messageList) => {
    for (let index = 0; index < messageList.length; index += 1) {
      const message = messageList[index];
      const indexOfNewBarrrage = this.getLineIndexOfNewBarrrage();
      if (indexOfNewBarrrage < 0) {
        continue;
      }
      const { list } = this.state;
      list.push({ ...message, indexOfLine: indexOfNewBarrrage, isFree: false });
      this.setState({ list });
    }
  }

  // 修改某一个item后面为空闲，可以在后天添加下一个弹幕
  changeItemStateToFree = (a) => {
    const { list } = this.state;
    const newList = list.map(item => {
      if (item.id === a.id) {
        return { ...item, isFree: a.isFree };
      }
      return item;
    });
    this.setState({
      list: newList,
    })
  }

  // 删除已经移动到屏幕外的item
  removeItemFromList = (a) => {
    const { list } = this.state;
    const newList = list.filter(item => {
      return item.id !== a.id;
    });
    this.setState({
      list: newList,
    })
  }

  // 获取新来的弹幕消息将要放入第几行， -1 则为丢弃
  getLineIndexOfNewBarrrage = () => {
    const { numberOfLines } = this.props;
    const { list } = this.state;
    if (list.length === 0) {
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

  // 获取当前第几行处于空闲状态， 如果为-1 则没有空闲行
  getIndexOfFreeLines = (i) => {
    let lastItemOfLine;
    const { list } = this.state;
    list.forEach(item => {
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
    const views = list.map((b) => {
      return <BarrageMovableItem line={b.indexOfLine} key={b.id} data={b} duration={10} heightOfLine={25} />
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
