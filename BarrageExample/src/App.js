/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import BarrageMoveView from './components/BarrageMoveView';
import BarrageInputView from './components/BarrageInputView';
import UI from './UI';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
        this.id = 0;
        this.data = [
            '哈喽～～～，大家好',
            '今天天气不错',
            '要好好学习天天向上啊',
            '我是一只来自北方的狼',
            '程序员牛逼',
            '阅读是人类进步的阶梯',
            '从哪里摔倒就从哪里爬起来',
            '吼吼',
            '常用链接',
            '6666',
            '走你',
            'iPhone真香',
            '这波操作我给666',
            '要开心啊',
            '机智如我',
        ]
    }

    componentDidMount() {
        this.addBarrageWithInterval();
    }

    componentWillUnmount() {
        this.interval && clearInterval(this.interval);
        this.interval1 && clearInterval(this.interval1);
    }

    addBarrageWithInterval = () => {
        this.interval = setInterval(() => {
            this.id = this.id + 1;
            // if (this.id > 500) {
            //   clearInterval(this.interval);
            //   this.interval1 = setInterval(() => {
            //     this.id = this.id + 1;
            //     const text = this.getText();
            //     const newData = [{ title: text, id: this.id }];
            //     this.setState({ data: newData });
            //   }, 3000);
            // }
            const text = this.getText();
            const newData = [{ title: text, id: this.id }];
            this.setState({ data: newData });
        }, 100);
    }

    onButtonPress = (text) => {
        this.id = this.id + 1;
        const newData = [{ title: text, id: this.id }];
        this.setState({ data: newData });
    }

    getText = () => {
        const number = this.getRundomNumber(this.data.length - 1);
        return this.data[number];
    }

    getRundomNumber = (max) => {
        return Math.floor(Math.random() * (max + 1));
    }

    render() {
        console.debug('APP');
        return (
            <View style={styles.container}>
                <View style={styles.barrageView}>
                    <BarrageMoveView newMessages={this.state.data} numberOfLines={10} speed={1} />
                </View>
                <BarrageInputView onButtonPress={this.onButtonPress} />
                <View style={{ flex: 1 }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: UI.IS_IPHONE_X ? 34 : 24,
        backgroundColor: '#F5FCFF',
        paddingBottom: UI.IS_IPHONE_X ? 44 : 0,
    },
    barrageView: {
        flex: 1,
        // height: UI.size.screenHeight / 2,
        // borderWidth: 1,
    },
});
