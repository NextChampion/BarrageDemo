/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import BarrageView from './components/BarrageView';
import BarrageInputView from './components/BarrageInputView';
import UI from './UI';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.id = 0;
  }
  

  onButtonPress = (text)=> {
    const { data } = this.state;
    this.id = this.id + 1;
    data.push({title: text, id: this.id});
    this.setState({data});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.barrageView}>
          <BarrageView  list={this.state.data}/>
        </View>
        <BarrageInputView onButtonPress={this.onButtonPress}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 34,
    backgroundColor: '#F5FCFF',
    paddingBottom: 44,
  },
  barrageView: {
    height: UI.size.screenHeight / 9,
  },
});
