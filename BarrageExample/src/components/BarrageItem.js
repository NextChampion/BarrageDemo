/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Easing,
  StyleSheet,
  Text,
  View,
  Animated,
  findNodeHandle,
} from 'react-native';
import PropTypes from 'prop-types';
import { UIManager } from 'NativeModules';
import UI from '../UI';

const height = 40;

export default class BarrageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: new Animated.Value(0),
    };
    this.position = UI.size.screenWidth;
    this.handle = null;
  }

  static propTypes = {
    text: PropTypes.string,
    duration: PropTypes.number,
    line: PropTypes.number,
  }

  static defaultProps = {
    text: '',
    duration: 10,
    line: 0,
  }

  componentDidMount() {
    this.begin();
  }

  componentWillUnmount() {
    console.log('[item] componentWillUnmount');
    
    clearInterval(this.interval);
  }

  begin() {
    console.log(' begin');
    this.interval = setInterval(()=>{
      this.view.setNativeProps({
        style:{
          left: this.position -= 1,
        }
      })
    }, 10);
    return;
    




    const { duration } = this.props;
    Animated.timing(this.state.left, {
      toValue: 1,
      duration: duration * 1000,
      easing: Easing.linear
    }).start();
  }

  getTop = (min,max) => {
    const { line } = this.props;
    return height * line;
    var Range = max - min;
    var Rand = Math.random();
    return (min + Math.round(Rand * Range));
  }

  render() {
    const { text} = this.props;
    const width = UI.fontSize.regular * text.length;
    const top = this.getTop(1,10);
    console.log('top', top);
    return (
      <View 
        style={{overflow: 'hidden'}}
        removeClippedSubviews={true}
        ref={a=> this.view =a} 
        onLayout={(a)=>{
          const handle = findNodeHandle(this.view);
          this.handle = handle;
        }}
        >
        <Text>{text}</Text>
      </View>
    )
    
    return (
      <Animated.View
        ref={a=>this.view =a}
        removeClippedSubviews={true}
        style={{
          // top,
          left: this.state.left.interpolate({
            inputRange: [0, 1],
            outputRange: [UI.size.screenWidth, -UI.size.screenWidth]
          }),
        }}
        onLayout={(a)=>{
          const handle = findNodeHandle(this.view);
          this.handle = handle;
        }}
        >
        <View>
          <Text style={[{width}, styles.text]}>
            {text}
          </Text>
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    backgroundColor: 'red',
    fontSize: UI.fontSize.regular,
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
