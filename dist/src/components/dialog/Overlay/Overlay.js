import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
class Overlay extends Component {
    constructor() {
        super(...arguments);
        this.opacity = new Animated.Value(0);
    }
    componentDidUpdate(prevProps) {
        const { visible, useNativeDriver, animationDuration: duration } = this.props;
        if (visible !== prevProps.visible) {
            const toValue = visible ? this.props.opacity : 0;
            Animated.timing(this.opacity, {
                toValue,
                duration,
                useNativeDriver: useNativeDriver === undefined ? true : useNativeDriver,
            }).start();
        }
    }
    render() {
        const { onPress, pointerEvents, backgroundColor } = this.props;
        const { opacity } = this;
        return (<Animated.View pointerEvents={pointerEvents} style={[
                StyleSheet.absoluteFill,
                {
                    backgroundColor,
                    opacity,
                },
            ]}>
                <TouchableOpacity onPress={onPress} style={StyleSheet.absoluteFill}/>
            </Animated.View>);
    }
}
Overlay.defaultProps = {
    backgroundColor: '#000',
    opacity: 0.5,
    animationDuration: 2000,
    visible: false,
    useNativeDriver: true,
    onPress: () => { },
};
export default Overlay;
//# sourceMappingURL=Overlay.js.map