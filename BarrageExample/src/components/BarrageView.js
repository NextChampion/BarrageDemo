/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
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

  getLine =  () => {
    const [line1, line2] = this.items;
    console.log('lnes2', line1, line2);
    
    if(line1.length === 0){
      return 0;
    }
    const lastIndexOfline1 = line1.length - 1;
    const lastItem = line1[lastIndexOfline1];
    console.log('lastitem', lastItem);
    UIManager.measure(lastItem.handle, (x, y, width, height, pageX, pageY) => {
      console.log('pageX',pageX);
      return 1;
    });
    
    console.log('2222222');
    return 0;
    
  }

  render() {
    const { list } = this.props;
    const views = list.map((b) => {
      const line = this.getLine();
      console.log('line', line);
      return <BarrageItem ref={a => this.items[line].push(a)} line={line} key={b.id} text={b.title}/>
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
