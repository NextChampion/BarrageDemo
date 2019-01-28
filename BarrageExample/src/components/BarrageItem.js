/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import PropTypes from 'prop-types';
import UI from '../UI';

const imageWidth = 20;

export default class BarrageItem extends Component {
    constructor(props) {
        super(props);
        this.position = UI.size.screenWidth;
        this.isFreeState = false; // 是否空闲
        this.width = 0; // 弹幕本身的宽度
    }

    static propTypes = {
        data: PropTypes.object, // 数据
        line: PropTypes.number, // 弹道位置
        heightOfLine: PropTypes.number, // 弹道高度
        type: PropTypes.number, // 弹幕类型
    }

    static defaultProps = {
        data: {},
        line: 0,
        heightOfLine: UI.size.screenHeight / 9 - UI.lineHeight.regular - 1, // 弹道距离父视图上边界的距离
        type: 1,
    }

    shouldComponentUpdate() {
        return false;
    }

    getTop = () => {
        const { line, heightOfLine } = this.props;
        return heightOfLine * line;
    }

    renderTextType = () => {
        const { data } = this.props;
        const { title } = data;
        this.width = UI.fontSize.regular * title.length;
        const top = this.getTop();
        return (
            <View
                style={[styles.view, { top, width: this.width, left: this.position }]}
                removeClippedSubviews={true}
                ref={a => this.view = a}
            >
                <Text>{title}</Text>
            </View>
        )
    }

    renderImageType = () => {
        const { data } = this.props;
        const { title } = data;
        this.width = UI.fontSize.regular * title.length + imageWidth;
        const top = this.getTop();
        return (
            <View
                style={[styles.imageView, { top, width: this.width, left: this.position }]}
                removeClippedSubviews={true}
                ref={a => this.view = a}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={styles.image} />
                    <Text>{title}</Text>
                </View>
            </View>
        )
    }

    render() {
        console.debug('[BarrageItem]')
        const { type } = this.props;
        switch (type) {
            case 1:
                return this.renderTextType();
                break;
            case 2:
                return this.renderImageType();
                break;
            default:
                return this.renderTextType();
                break;
        }
    }
}

const styles = StyleSheet.create({
    view: {
        overflow: 'hidden',
        position: 'absolute',
        // borderWidth: 1,
    },
    text: {
        backgroundColor: 'red',
        fontSize: UI.fontSize.regular,
        lineHeight: UI.lineHeight.regular,
    },
    imageView: {
        overflow: 'hidden',
        position: 'absolute',
        flexDirection: 'row',
        // borderWidth: 1,
    },
    image: {
        width: imageWidth,
        height: imageWidth,
        backgroundColor: 'red',
        borderRadius: 10,
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
