/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, DeviceEventEmitter } from 'react-native';
import PropTypes from 'prop-types';
import BarrageItem from './BarrageItem';

export default class BarrageView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    }
  }

  static propTypes = {
    onMessage: PropTypes.array,
    numberOfLines: PropTypes.number,
  }

  static defaultProps = {
    list: [],
    numberOfLines: 2,
  }

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener('onStateToFree', this.changeItemStateToFree);
    this.subscription1 = DeviceEventEmitter.addListener('onStateToOutsideScreen', this.removeItemFromList);
  };

  componentWillReceiveProps(props) {
    const { onMessage } = this.props;
    this.addBarrageMessage(onMessage);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {
    this.subscription.remove();
    this.subscription1.remove();
  }

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

  removeItemFromList = (a) => {
    const { list } = this.state;
    const newList = list.filter(item => {
      return item.id !== a.id;
    });
    this.setState({
      list: newList,
    })
  }

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
      return <BarrageItem line={b.indexOfLine} key={b.id} data={b} duration={10} heightOfLine={25} />
    });
    return (
      <View
        pointerEvents='none'
        removeClippedSubviews={true}
        style={styles.container}
      >
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
