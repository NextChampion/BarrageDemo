
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
import PropTypes from 'prop-types';
import UI from '../UI';

export default class BarrageInputView extends Component {
    constructor(props) {
        super(props);
        this.textInput = '';
    }

    static propTypes = {
        onButtonPress: PropTypes.func,
    };

    static defaultProps = {
        onButtonPress: null,
    };

    render() {
        const { onButtonPress } = this.props;
        return (
            <View style={styles.textInputContainer}>
                <TextInput placeholder={'请输入弹幕内容'} style={styles.textInput} onChangeText={(text) => {
                    this.textInput = text.trim();
                }} />
                <TouchableOpacity
                    onPress={() => {
                        if (!this.textInput) {
                            Alert.alert('请输入内容');
                            return;
                        }
                        if (onButtonPress) {
                            onButtonPress(this.textInput);
                        }
                    }}
                    style={styles.button}
                >
                    <Text>发送</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 34,
        backgroundColor: '#F5FCFF',
    },
    barrageView: {
        height: UI.size.screenHeight / 9,
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red',
        paddingLeft: 24,
    },
    textInput: {
        backgroundColor: 'gray',
        height: 40,
        width: 200,
    },
    button: {
        paddingHorizontal: 12,
    }
});
