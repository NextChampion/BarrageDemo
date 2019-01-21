/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, DeviceEventEmitter } from 'react-native';
import PropTypes from 'prop-types';
import { UIManager } from 'NativeModules';

import BarrageItem from './BarrageItem';

export default class BarrageView extends Component {
  constructor(props) {
    super(props);
    this.items = [[], []];
  }

  static propTypes = {
    list: PropTypes.array,
  }

  static defaultProps = {
    list: [],
  }

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener('changeItemState', this.changeItemState);
  };

  changeItemState = (a) => {
    console.log('changeItemState',a);
    console.log('changeItemState',a);
    const [line1, line2] = this.items;

  }

  getLine =  () => {
    const [line1, line2] = this.items;
    console.log('lnes2', line1, line2);
    
    if(line1.length === 0){
      return 0;
    }
    const lastIndexOfline1 = line1.length - 1;
    const lastItem = line1[lastIndexOfline1];
    console.log('lastitem', lastItem);
    // UIManager.measure(lastItem.handle, (x, y, width, height, pageX, pageY) => {
    //   console.log('pageX',pageX);
    //   return 1;
    // });
    
    console.log('2222222');
    return 0;
    
  }

  render() {
    const { list } = this.props;
    const views = list.map((b) => {
      const line = this.getLine();
      this.items[line].push({id: b.id, isFree: false});
      return <BarrageItem line={line} key={b.id} data={b}/>
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
    borderWidth: 1,
  },
  barrageLine: {
    overflow: 'hidden',
  },
});
