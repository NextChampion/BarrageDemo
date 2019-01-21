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
  DeviceEventEmitter,
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
    this.isFreeState = false;
  }

  static propTypes = {
    data: PropTypes.object,
    duration: PropTypes.number,
    line: PropTypes.number,
  }

  static defaultProps = {
    data: {},
    duration: 10,
    line: 0,
  }

  componentDidMount() {
    this.begin();
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }

  getDuration = () => {
    const { duration } = this.props;
    const wholeWidth = UI.size.screenWidth + this.width;
    const speed = wholeWidth / duration;
    const time = duration / speed;
    return time;
  }

  begin() {
    const { data } = this.props;
    const { id } = data;
    const animatTime = this.getDuration();

    this.interval = setInterval(()=>{
      if(this.position < -this.width){
        this.interval && clearInterval(this.interval);
        return;
      }
      const marginRight = UI.size.screenWidth - this.position;
      if(marginRight > this.width + 32) {
        if(!this.isFreeState) {
          this.isFreeState = true;
          DeviceEventEmitter.emit('changeItemState',{id, isFree:true});
        }
      } else {
        if(this.isFreeState) {
          this.isFreeState = false;
          DeviceEventEmitter.emit('changeItemState',{id, isFree:false});
        }
      }
      this.view.setNativeProps({
        style:{
          left: this.position -= 1,
        }
      })
    }, animatTime);
  }

  getTop = () => {
    const { line } = this.props;
    return height * line;
  }

  render() {
    const { data } = this.props;
    const { title } = data;
    this.width = UI.fontSize.regular * title.length;
    const top = this.getTop();
    return (
      <View 
        style={[styles.view,{ top, width: this.width, height: 40}]}
        removeClippedSubviews={true}
        ref={a=> this.view =a} 
        onLayout={(a)=>{
          const handle = findNodeHandle(this.view);
          this.handle = handle;
        }}
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
  },
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
