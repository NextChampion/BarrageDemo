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
    this.items = [];
    this.removedItems = [];
  }

  static propTypes = {
    list: PropTypes.array,
    numberOfLines: PropTypes.number,
  }

  static defaultProps = {
    list: [],
    numberOfLines: 2,
  }

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener('changeItemState', this.changeItemState);
  };

  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  changeItemState = (a) => {
    this.items = this.items.map(item => {
      if (item.id === a.id) {
        return {...item, isFree: a.isFree};
      }
      return item;
    })
  }
  
  getIndexOfLine =  (b,index) => {
    const { numberOfLines } = this.props;
    if (this.items.length === 0) {
      return 0
    }
    const item = this.items[index];
    if (item && item.line >= 0) {
      return item.line;
    }
    let indexOfLine;
    for (let i = 0; i < numberOfLines; i+= 1) {
      indexOfLine = this.getIndexOfFreeLines(i);
      if (typeof indexOfLine === 'number' && indexOfLine >= 0) {
        return indexOfLine;
      }
    }
    return numberOfLines;
  }

  getIndexOfFreeLines(i) {
    let lastItemOfLine;
    this.items.forEach(item => {
      const { line } = item;
      if (line === i) {
        lastItemOfLine = item;
      }
    });
    if(!lastItemOfLine) { return i };
    if(lastItemOfLine.isFree) { return i };
    return null;
  }

  getAvaliableList = (list) => {
    let newList = [];
    list.forEach(item => {
      let isInRemovedItems = false;
      this.removedItems.forEach(b => {
        if (item.id === b.id) {
          isInRemovedItems = true;
        }
      });
      if (!isInRemovedItems) {
        newList.push(item);
      }
    })
    return newList;
  }

  addItemToRemoevdItems = (b) => {
    let isInRemovedItems = false;
    this.removedItems.forEach(item => {
      if (item.id === b.id) {
        isInRemovedItems = true;
      }
    });
    if (!isInRemovedItems) {
      this.removedItems.push(b);
    }
  }

  render() {
    console.debug('[BarrageView]')
    const { list, numberOfLines } = this.props;
    const avaliableList = this.getAvaliableList(list);
    const views = avaliableList.map((b,index) => {
      const line = this.getIndexOfLine(b,index);
      if(line === numberOfLines) { 
        this.addItemToRemoevdItems(b);
        return null; 
      };
      if (!this.items[index]) {
        this.items.push({id: b.id, isFree: false, line});
      }
      return <BarrageItem line={line} key={b.id} data={b} duration={10}/>
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
