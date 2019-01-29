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
        this.barrages = []; // 数据源
        this.setRefs = this.setRefs.bind(this);
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
        this.subscription1 = DeviceEventEmitter.addListener('onStateToOutsideScreen1', this.removeItemFromList);
        this.startMove();
    };

    componentWillReceiveProps(props) {
        const { newMessages } = props;
        this.addBarrageMessage(newMessages);
    }

    componentWillUnmount() {
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
            for (let index = 0; index < this.barrages.length; index += 1) {
                const barrragesOfLine = this.barrages[index];
                for (let i = 0; i < barrragesOfLine.length; i += 1) {
                    const b = barrragesOfLine[i];
                    b.position.left -= speed;
                    const newLeft = b.position.left;
                    if (newLeft < UI.size.screenWidth - b.ref.width - UI.fontSize.regular * 2) {
                        if (!b.isFree) {
                            b.isFree = true;
                        }
                    }
                    if (newLeft < - b.ref.width) {
                        DeviceEventEmitter.emit('onStateToOutsideScreen1', b);
                        continue;
                    }
                    b.ref.view.setNativeProps({
                        style: {
                            left: newLeft,
                        }
                    })
                }
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
            const barrage = { 
                ...message, 
                indexOfLine: indexOfNewBarrrage, 
                isFree: false, 
                position: { left: UI.size.screenWidth },
            };
            if (!this.barrages[indexOfNewBarrrage]) {
                this.barrages[indexOfNewBarrrage] = [];
            }
            this.barrages[indexOfNewBarrrage].push(barrage);
            this.setState({ list: this.barrages });
        }
    }

    // 删除已经移动到屏幕外的数据
    removeItemFromList = (a) => {
        const { indexOfLine } = a;
        this.barrages[indexOfLine] = this.barrages[indexOfLine].filter(item => {
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
        if (this.barrages[0].length === 0) {
            return 0;
        }
        for (let i = 0; i < numberOfLines; i += 1) {
            const barragesOfLine = this.barrages[i];
            if (!barragesOfLine || !barragesOfLine.length) {
                return i;
            }
            const lastItemOfLine = barragesOfLine[barragesOfLine.length - 1]
            if (!lastItemOfLine) {
                return i;
            }
            if (lastItemOfLine.isFree) {
                return i;
            }
        }
        return -1;
    }

    setRefs(a,index,innerIndex) {
        if (a) { this.barrages[index][innerIndex].ref = a }
    }

    getBarrageItems = () => {
        const { list } = this.state;
        const views = [];
        for (let index = 0; index < list.length; index += 1) {
            const barrragesOfLine = list[index];
            barrragesOfLine.forEach((b, innerIndex) => {
                const barrageItem = (
                    <BarrageItem
                        ref={(a) => this.setRefs(a, index,innerIndex)}
                        line={b.indexOfLine}
                        key={b.id}
                        data={b}
                        speed={2}
                        type={2}
                        heightOfLine={25}
                    />
                )
                views.push(barrageItem);
            })
        }
        return views;
    }

    render() {
        console.debug('[BarrageView]')
        const barrageItems = this.getBarrageItems();
        return (
            <View style={styles.container}>
                {barrageItems}
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
